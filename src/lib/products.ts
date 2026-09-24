import { cache } from 'react';
import { lamitakProductsFromCsv } from '@/data/lamitak-products-from-csv';
import type { Product } from '@/types/product';
import { getSwatchUrl, getSwatchUrlCandidates } from './productImages';
import { normalizeCode, slugify, uniq } from './utils';

export type CollectionGroup = 'new-arrivals' | 'new-collections' | 'best-sellers' | 'woods' | 'patterns' | 'solids';

function addPpn(price?: number | null) {
  if (typeof price !== 'number') return null;
  return Math.round(price * 1.11);
}

function enrichProduct(product: Product): Product {
  const priceIncludingPpn = addPpn(product.price);
  const imageUrlCandidates = product.imageUrlCandidates?.length
    ? product.imageUrlCandidates
    : getSwatchUrlCandidates(product.design);

  return {
    ...product,
    price: priceIncludingPpn,
    slug: product.slug || slugify(`${product.code} ${product.name}`),
    imageUrl: product.imageUrl || imageUrlCandidates[0] || getSwatchUrl(product.design),
    imageUrlCandidates,
    taxIncluded: true,
    badges: product.badges || []
  };
}

function toPublicProduct(product: Product): Product {
  const { stockOnHand: _stockOnHand, unit: _unit, ...publicProduct } = product;
  return publicProduct;
}

function toPublicProducts(products: Product[]) {
  return products.map(toPublicProduct);
}

/**
 * Every function below calls getAllProducts() independently (a homepage request alone calls it
 * 3x via getPublicProducts/getNewCollectionProducts/getBestSellerProducts). React's cache()
 * memoizes it per request so the filter+enrich pass over all 802 products only runs once,
 * instead of once per caller — a free server-response-time win with no behaviour change.
 */
export const getAllProducts = cache(async () => {
  return lamitakProductsFromCsv
    .filter((product) => product.active)
    .map(enrichProduct);
});

export async function getPublicProducts() {
  return toPublicProducts(await getAllProducts());
}

export async function getProductBySlug(slug: string) {
  const products = await getAllProducts();
  const product = products.find((product) => product.slug === slug);
  return product ? toPublicProduct(product) : undefined;
}

export async function getProductByCode(code: string) {
  const products = await getAllProducts();
  const normalized = normalizeCode(code);
  const product = products.find((product) => normalizeCode(product.code) === normalized);
  return product ? toPublicProduct(product) : undefined;
}

export async function getFilterOptions() {
  const products = await getAllProducts();

  return {
    collections: uniq(products.map((product) => product.collection).filter(Boolean) as string[]).sort(),
    categories: uniq(products.map((product) => product.category).filter(Boolean) as string[]).sort(),
    finishes: [],
    sizes: uniq(products.map((product) => product.size).filter(Boolean) as string[]).sort(),
    colorFamilies: []
  };
}

function compact(value?: string | null) {
  return (value || '')
    .toLowerCase()
    .replace(/[’′`]/g, "'")
    .replace(/[×]/g, 'x')
    .replace(/\s+/g, '')
    .replace(/mm/g, '');
}

function productSearchText(product: Product) {
  return [
    product.code,
    normalizeCode(product.code),
    product.name,
    product.design,
    product.collection,
    product.category,
    product.size,
    product.thickness,
    product.description,
    product.price ? String(product.price) : ''
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function searchProducts(products: Product[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return products;

  const compactQuery = compact(normalized);
  const tokens = normalized.split(/\s+/).map((token) => token.trim()).filter(Boolean);

  return products.filter((product) => {
    const haystack = productSearchText(product);
    const compactHaystack = compact(haystack);

    if (compactQuery && compactHaystack.includes(compactQuery)) return true;

    return tokens.every((token) => {
      const compactToken = compact(token);
      return haystack.includes(token) || compactHaystack.includes(compactToken);
    });
  });
}

function sortByCode(products: Product[]) {
  return [...products].sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
}

export async function getNewCollectionProducts() {
  const products = await getAllProducts();
  return toPublicProducts(sortByCode(products.filter((product) => product.badges?.includes('NEW'))));
}

export async function getBestSellerProducts() {
  const products = await getAllProducts();
  return toPublicProducts(sortByCode(products.filter((product) => product.badges?.includes('BESTSELLER'))));
}

export async function getProductsByCollectionGroup(group: CollectionGroup) {
  if (group === 'new-arrivals' || group === 'new-collections') return getNewCollectionProducts();
  if (group === 'best-sellers') return getBestSellerProducts();
  const products = await getAllProducts();

  if (group === 'woods') {
    return toPublicProducts(products.filter((product) => product.collection?.toLowerCase() === 'woods'));
  }

  if (group === 'patterns') {
    return toPublicProducts(products.filter((product) => product.collection?.toLowerCase() === 'patterns'));
  }

  return toPublicProducts(products.filter((product) => product.collection?.toLowerCase() === 'solids'));
}

/**
 * Deterministic "related products" for a product detail page: prefer the same category
 * (more specific), fall back to the same collection if there aren't enough, always
 * excluding the product itself. Sorted by code rather than randomized so the result is
 * stable across requests/builds and safe to server-render for crawlers.
 */
export async function getRelatedProducts(product: Product, count = 8) {
  const products = await getAllProducts();
  const others = products.filter((p) => p.slug !== product.slug);

  const sameCategory = product.category
    ? others.filter((p) => p.category?.toLowerCase() === product.category!.toLowerCase())
    : [];

  const sameCollection = product.collection
    ? others.filter((p) => p.collection?.toLowerCase() === product.collection!.toLowerCase())
    : [];

  const seen = new Set<string>();
  const combined = [...sortByCode(sameCategory), ...sortByCode(sameCollection)].filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

  return toPublicProducts(combined.slice(0, count));
}

export type PriceTableRow = { collection: string; size: string; minPrice: number; maxPrice: number; count: number };

/** Min/max price per collection + size, computed live from product data — never goes stale. */
export async function getPriceTable(): Promise<PriceTableRow[]> {
  const products = await getPublicProducts();
  const groups = new Map<string, { collection: string; size: string; prices: number[] }>();

  for (const p of products) {
    if (!p.collection || !p.size || typeof p.price !== 'number') continue;
    const key = `${p.collection}|${p.size}`;
    if (!groups.has(key)) groups.set(key, { collection: p.collection, size: p.size, prices: [] });
    groups.get(key)!.prices.push(p.price);
  }

  return Array.from(groups.values())
    .map(({ collection, size, prices }) => ({
      collection,
      size,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      count: prices.length
    }))
    .sort((a, b) => a.collection.localeCompare(b.collection) || a.size.localeCompare(b.size));
}

// ─── Old product addresses ──────────────────────────────────────────────────
// Before this site, varindo.co.id was a Shopify store whose product addresses
// read `<code>-hpl-<brand>-<name>` (`/products/dxp-1375k-hpl-lamitak-beige-escher`).
// Search engines still crawl them, and people still arrive from old results,
// so a slug that matches nothing is read for the product code it starts with.

// Up to this many leading slug words can make up a code ("mba-2013-c" is three).
const MAX_CODE_WORDS = 4;

/**
 * The live product an old address pointed at, when its leading words spell a
 * current product code exactly (punctuation aside). Longest match wins, so
 * "dxp-1375k-…" is DXP 1375K and never a shorter code that happens to prefix it.
 */
export async function getProductByLegacySlug(slug: string) {
  const products = await getAllProducts();
  const byCode = new Map(products.map((product) => [normalizeCode(product.code), product]));
  const words = slug.toLowerCase().split('-');
  let match: Product | undefined;
  for (let n = 1; n <= Math.min(MAX_CODE_WORDS, words.length); n += 1) {
    match = byCode.get(words.slice(0, n).join('')) ?? match;
  }
  return match ? toPublicProduct(match) : undefined;
}

// Words in an old address that say nothing about which design it was: brands
// the old store sold, the product type, sheet sizes and finishes.
const NON_DESIGN_WORDS = new Set([
  'hpl', 'lamitak', 'edl', 'aica', 'mb', 'carta', 'grasmerino', 'newedge', 'abs', 'edge',
  'type', 'meter', 'mm', 'ft', 'matt', 'gloss', 'high', 'pro', 'dri', 'the', 'and', 'oembed'
]);

/**
 * Products to offer on the not-found page for a product address that no longer
 * resolves: designs sharing a name word with it first, then the same code
 * series (the letters before the number, "SCA" for sca-1135d). Empty when
 * nothing is close; the page then shows only its search.
 */
export async function getSuggestionsForMissingSlug(slug: string, count = 8) {
  const products = await getAllProducts();
  const words = slug.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const series = /^[a-z]+/.exec(words[0] || '')?.[0];
  const nameWords = words.filter((w) => !/\d/.test(w) && w.length > 2 && !NON_DESIGN_WORDS.has(w));

  const scored = products
    .map((product) => {
      const design = (product.design || product.name).toLowerCase().split(/[^a-z0-9]+/);
      const nameScore = nameWords.filter((w) => design.includes(w)).length;
      const productSeries = /^[a-z]+/.exec(product.code.toLowerCase())?.[0];
      const seriesScore = series && productSeries === series ? 1 : 0;
      return { product, score: nameScore * 2 + seriesScore };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.product.code.localeCompare(b.product.code, undefined, { numeric: true }));

  return toPublicProducts(scored.slice(0, count).map((entry) => entry.product));
}
