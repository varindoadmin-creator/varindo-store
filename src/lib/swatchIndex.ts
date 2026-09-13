/**
 * Visual search index for Surface Match.
 *
 * One Voyage multimodal embedding per swatch in gs://varindo-product-images,
 * built by scripts/embed-swatches.mjs and published alongside the swatches.
 * Entries are keyed by swatch slug, the same design key productImages.ts uses,
 * so a match resolves to every size of that design.
 *
 * ~560 vectors of 1024 dimensions is small enough to scan in full on every
 * query, so there is no vector database in the loop.
 */

export const EMBEDDING_MODEL = 'voyage-multimodal-3.5';
export const EMBEDDING_DIMENSION = 1024;

const INDEX_URL = `https://storage.googleapis.com/varindo-product-images/embeddings/${EMBEDDING_MODEL}.json`;
const VOYAGE_API_URL = 'https://api.voyageai.com/v1/multimodalembeddings';
const RELOAD_AFTER_MS = 60 * 60 * 1000;

type PublishedIndex = {
  model: string;
  dimension: number;
  entries: { slug: string; generation: string; embedding: string }[];
};

export type SwatchIndex = { slugs: string[]; vectors: Float32Array[] };

let loaded: { index: SwatchIndex; at: number } | null = null;
let loading: Promise<SwatchIndex> | null = null;

function normalize(vector: Float32Array) {
  let norm = 0;
  for (let i = 0; i < vector.length; i++) norm += vector[i] * vector[i];
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < vector.length; i++) vector[i] /= norm;
  return vector;
}

/** Embeddings are published as base64 little-endian float32. */
function decodeEmbedding(base64: string) {
  // Copy into a fresh buffer: Buffer.from may hand back a view into a shared
  // pool at an offset Float32Array can't align to.
  return normalize(new Float32Array(new Uint8Array(Buffer.from(base64, 'base64')).buffer));
}

async function fetchIndex(): Promise<SwatchIndex> {
  const res = await fetch(INDEX_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Swatch index fetch failed (${res.status})`);

  const published = (await res.json()) as PublishedIndex;
  if (published.model !== EMBEDDING_MODEL || published.dimension !== EMBEDDING_DIMENSION) {
    throw new Error(`Swatch index was built with ${published.model}/${published.dimension}`);
  }

  return {
    slugs: published.entries.map((entry) => entry.slug),
    vectors: published.entries.map((entry) => decodeEmbedding(entry.embedding)),
  };
}

/** Cached per instance and refreshed hourly; a failed refresh keeps serving the last good copy. */
export async function getSwatchIndex(): Promise<SwatchIndex> {
  if (loaded && Date.now() - loaded.at < RELOAD_AFTER_MS) return loaded.index;

  loading ??= fetchIndex()
    .then((index) => {
      loaded = { index, at: Date.now() };
      return index;
    })
    .finally(() => {
      loading = null;
    });

  try {
    return await loading;
  } catch (err) {
    if (loaded) return loaded.index;
    throw err;
  }
}

export function nearestSwatches(index: SwatchIndex, embedding: number[], count: number) {
  const query = normalize(Float32Array.from(embedding));
  return index.vectors
    .map((vector, i) => {
      let similarity = 0;
      for (let d = 0; d < vector.length; d++) similarity += vector[d] * query[d];
      return { slug: index.slugs[i], similarity };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, count);
}

export async function embedImage(jpeg: Buffer, apiKey: string): Promise<number[]> {
  const res = await fetch(VOYAGE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      inputs: [{ content: [{ type: 'image_base64', image_base64: `data:image/jpeg;base64,${jpeg.toString('base64')}` }] }],
      model: EMBEDDING_MODEL,
      output_dimension: EMBEDDING_DIMENSION,
    }),
  });

  if (!res.ok) throw new Error(`Voyage embedding error (${res.status}): ${await res.text()}`);

  const data = await res.json();
  const embedding = data?.data?.[0]?.embedding;
  if (!Array.isArray(embedding)) throw new Error('Voyage returned no embedding');
  return embedding;
}
