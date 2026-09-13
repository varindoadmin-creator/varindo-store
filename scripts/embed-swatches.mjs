// Builds the Surface Match visual search index: one Voyage multimodal
// embedding per swatch in gs://varindo-product-images/swatches/, read by
// src/lib/swatchIndex.ts.
//
// Usage:
//   npm run embed:swatches [-- <out-file>]
// then publish what it wrote (the command is printed at the end):
//   gcloud storage cp <out-file> gs://varindo-product-images/embeddings/voyage-multimodal-3.5.json \
//     --content-type=application/json --cache-control=no-cache
//
// Env: VOYAGE_API_KEY.
//
// Incremental: it starts from the published index, re-embeds only swatches
// whose Cloud Storage generation changed, and drops swatches that are gone.
// Rerun it whenever swatches are added, replaced or removed.

import { writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const MODEL = 'voyage-multimodal-3.5';
const DIMENSION = 1024;
const BUCKET = 'varindo-product-images';
const PREFIX = 'swatches/';
const OBJECT_NAME = `embeddings/${MODEL}.json`;
const INDEX_URL = `https://storage.googleapis.com/${BUCKET}/${OBJECT_NAME}`;
const VOYAGE_API_URL = 'https://api.voyageai.com/v1/multimodalembeddings';
const BATCH_SIZE = 10;

const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;
const outFile = process.argv[2] || join(tmpdir(), `${MODEL}.json`);

if (!VOYAGE_API_KEY) {
  console.error('Missing VOYAGE_API_KEY');
  process.exit(1);
}

function chunk(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

async function listSwatches() {
  const swatches = [];
  let pageToken = '';
  do {
    const params = new URLSearchParams({ prefix: PREFIX, fields: 'items(name,generation),nextPageToken' });
    if (pageToken) params.set('pageToken', pageToken);
    const res = await fetch(`https://storage.googleapis.com/storage/v1/b/${BUCKET}/o?${params}`);
    if (!res.ok) throw new Error(`Listing ${BUCKET} failed (${res.status})`);
    const page = await res.json();
    for (const item of page.items || []) {
      if (!item.name.endsWith('.webp')) continue;
      swatches.push({
        slug: item.name.slice(PREFIX.length, -'.webp'.length),
        generation: item.generation,
        // Pin the generation: swatches are cached as immutable for a year, so a
        // file replaced in place can come back stale from its plain URL.
        url: `https://storage.googleapis.com/${BUCKET}/${item.name}?generation=${item.generation}`,
      });
    }
    pageToken = page.nextPageToken || '';
  } while (pageToken);
  return swatches;
}

async function fetchPublishedEntries() {
  const res = await fetch(INDEX_URL, { cache: 'no-store' });
  // A bucket anonymous users can read but not list answers 403 for a missing object.
  if (res.status === 404 || res.status === 403) return [];
  if (!res.ok) throw new Error(`Fetching the published index failed (${res.status})`);
  const index = await res.json();
  if (index.model !== MODEL || index.dimension !== DIMENSION) return [];
  return index.entries;
}

async function embedBatch(swatches) {
  const res = await fetch(VOYAGE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${VOYAGE_API_KEY}` },
    body: JSON.stringify({
      inputs: swatches.map((swatch) => ({ content: [{ type: 'image_url', image_url: swatch.url }] })),
      model: MODEL,
      output_dimension: DIMENSION,
    }),
  });
  if (!res.ok) throw new Error(`Voyage embedding error (${res.status}): ${await res.text()}`);

  const embeddings = (await res.json()).data?.map((d) => d.embedding);
  if (!embeddings || embeddings.length !== swatches.length) {
    throw new Error('Voyage did not return one embedding per input');
  }
  return embeddings;
}

function encodeEmbedding(embedding) {
  return Buffer.from(new Float32Array(embedding).buffer).toString('base64');
}

async function main() {
  const [swatches, published] = await Promise.all([listSwatches(), fetchPublishedEntries()]);
  const publishedBySlug = new Map(published.map((entry) => [entry.slug, entry]));

  const entries = [];
  const pending = [];
  for (const swatch of swatches) {
    const existing = publishedBySlug.get(swatch.slug);
    if (existing && existing.generation === swatch.generation) entries.push(existing);
    else pending.push(swatch);
  }

  const dropped = published.length - entries.length - pending.filter((s) => publishedBySlug.has(s.slug)).length;
  console.log(
    `${swatches.length} swatches: ${entries.length} unchanged, ${pending.length} to embed, ` +
    `${dropped} dropped from the published index.`
  );

  let failed = 0;
  for (const batch of chunk(pending, BATCH_SIZE)) {
    try {
      const embeddings = await embedBatch(batch);
      batch.forEach((swatch, i) => {
        entries.push({ slug: swatch.slug, generation: swatch.generation, embedding: encodeEmbedding(embeddings[i]) });
      });
    } catch (err) {
      failed += batch.length;
      console.error(`Batch starting at "${batch[0].slug}" failed:`, err.message);
    }
    console.log(`Progress: ${entries.length}/${swatches.length} (${failed} failed)`);
  }

  entries.sort((a, b) => a.slug.localeCompare(b.slug));
  await writeFile(
    outFile,
    JSON.stringify({ model: MODEL, dimension: DIMENSION, builtAt: new Date().toISOString(), entries })
  );

  console.log(`\nWrote ${entries.length} entries to ${outFile}`);
  if (failed) console.log(`${failed} swatches failed and are missing; rerun to retry them.`);
  console.log(
    `Publish with:\n  gcloud storage cp ${outFile} gs://${BUCKET}/${OBJECT_NAME} ` +
    '--content-type=application/json --cache-control=no-cache'
  );
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
