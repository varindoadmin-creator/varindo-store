// One-time (and re-run-on-catalogue-change) job that embeds every active
// Lamitak product image with Voyage AI and stores the vector in Supabase
// (product_embeddings table — see scripts/supabase-pgvector-setup.sql).
//
// Usage:
//   node --env-file=.env.local scripts/embed-product-images.mjs
//
// Env vars required: VOYAGE_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Optional: PRODUCTS_API_URL (defaults to the live site's product API)
//
// Safe to re-run: products already present in product_embeddings are
// skipped, so this only embeds new/missing products on subsequent runs.

const VOYAGE_API_URL = 'https://api.voyageai.com/v1/multimodalembeddings';
const VOYAGE_MODEL = 'voyage-multimodal-3.5';
const EMBEDDING_DIMENSION = 1024;
const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 500;
const URL_CHECK_CONCURRENCY = 15;

const PRODUCTS_API_URL = process.env.PRODUCTS_API_URL || 'https://varindo.co.id/api/products';
const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!VOYAGE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required env vars: VOYAGE_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function chunk(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

function dedupeByCode(products) {
  const seen = new Set();
  const deduped = [];
  for (const p of products) {
    if (seen.has(p.code)) continue;
    seen.add(p.code);
    deduped.push(p);
  }
  return deduped;
}

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function fetchProducts() {
  const res = await fetch(PRODUCTS_API_URL);
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  const data = await res.json();
  return (data.products || []).filter((p) => p.code && p.imageUrl);
}

async function fetchExistingCodes() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/product_embeddings?select=product_code`, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch existing embedded codes: ${res.status}`);
  const rows = await res.json();
  return new Set(rows.map((r) => r.product_code));
}

async function urlIsReachable(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

// A product's default imageUrl is just the first guess from a naming
// convention and isn't guaranteed to exist — fall back through the other
// candidates (also returned by the products API) until one resolves.
async function resolveWorkingImageUrl(product) {
  const candidates = [product.imageUrl, ...(product.imageUrlCandidates || [])].filter(Boolean);
  const tried = new Set();
  for (const url of candidates) {
    if (tried.has(url)) continue;
    tried.add(url);
    if (await urlIsReachable(url)) return url;
  }
  return null;
}

async function embedBatch(products) {
  const res = await fetch(VOYAGE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      inputs: products.map((p) => ({ content: [{ type: 'image_url', image_url: p.imageUrl }] })),
      model: VOYAGE_MODEL,
      output_dimension: EMBEDDING_DIMENSION,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Voyage embedding error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const embeddings = data.data?.map((d) => d.embedding) || data.embeddings;
  if (!embeddings || embeddings.length !== products.length) {
    throw new Error('Voyage response did not return one embedding per input');
  }
  return embeddings;
}

async function upsertEmbeddings(rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/product_embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(rows),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase upsert error (${res.status}): ${err}`);
  }
}

async function main() {
  const allProducts = await fetchProducts();
  const deduped = dedupeByCode(allProducts);
  const existingCodes = await fetchExistingCodes();
  const remaining = deduped.filter((p) => !existingCodes.has(p.code));

  console.log(
    `${allProducts.length} products found, ${deduped.length} unique codes ` +
    `(${allProducts.length - deduped.length} duplicates skipped), ` +
    `${existingCodes.size} already embedded, ${remaining.length} to embed now.`
  );

  if (remaining.length === 0) {
    console.log('Nothing to do.');
    return;
  }

  console.log('Checking image URLs...');
  const resolved = await mapWithConcurrency(remaining, URL_CHECK_CONCURRENCY, async (p) => {
    const workingUrl = await resolveWorkingImageUrl(p);
    return workingUrl ? { ...p, imageUrl: workingUrl } : null;
  });

  const embeddable = resolved.filter(Boolean);
  const unreachable = remaining.filter((_, i) => !resolved[i]);
  if (unreachable.length > 0) {
    console.log(`Skipping ${unreachable.length} product(s) with no working image URL:`);
    for (const p of unreachable) console.log(`  - ${p.code}`);
  }

  const batches = chunk(embeddable, BATCH_SIZE);
  let done = 0;
  let failed = 0;

  for (const batch of batches) {
    try {
      const embeddings = await embedBatch(batch);
      const rows = batch.map((p, i) => ({
        product_code: p.code,
        embedding: embeddings[i],
        updated_at: new Date().toISOString(),
      }));
      await upsertEmbeddings(rows);
      done += batch.length;
    } catch (err) {
      failed += batch.length;
      console.error(`Batch starting at "${batch[0]?.code}" failed:`, err.message);
    }

    console.log(`Progress: ${done + failed}/${embeddable.length} (${failed} failed)`);
    await sleep(BATCH_DELAY_MS);
  }

  console.log(`Done. Embedded ${done}, ${failed} failed, ${unreachable.length} skipped (no working image).`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
