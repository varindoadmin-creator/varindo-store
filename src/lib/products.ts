import { lamitakProductsFromCsv } from '@/data/lamitak-products-from-csv';
import type { Product } from '@/types/product';
import { getLamitakImageUrl, getLamitakImageUrlCandidates } from './cloudinary';
import { normalizeCode, slugify, uniq } from './utils';

export type CollectionGroup = 'new-arrivals' | 'new-collections' | 'best-sellers' | 'promo-items' | 'woods' | 'patterns' | 'solids';

function addPpn(price?: number | null) {
  if (typeof price !== 'number') return null;
  return Math.round(price * 1.11);
}

function calculatePromoPrice(price?: number | null) {
  if (typeof price !== 'number') return null;
  return Math.round(price * 0.95);
}

function toBooleanBadge(product: Product, badge: 'NEW' | 'BESTSELLER' | 'PROMO') {
  return Boolean(product.badges?.includes(badge));
}

function enrichProduct(product: Product): Product {
  const priceIncludingPpn = addPpn(product.price);
  const imageUrlCandidates = product.imageUrlCandidates?.length
    ? product.imageUrlCandidates
    : getLamitakImageUrlCandidates(product.code);

  const isPromoItem = Boolean(product.isPromoItem || toBooleanBadge(product, 'PROMO'));

  return {
    ...product,
    price: priceIncludingPpn,
    slug: product.slug || slugify(`${product.code} ${product.name}`),
    imageUrl: product.imageUrl || imageUrlCandidates[0] || getLamitakImageUrl(product.code),
    imageUrlCandidates,
    isPromoItem,
    promoPrice: isPromoItem ? calculatePromoPrice(priceIncludingPpn) : null,
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

export async function getAllProducts() {
  return lamitakProductsFromCsv
    .filter((product) => product.active)
    .map(enrichProduct);
}

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

export async function getPromoItemProducts() {
  const products = await getAllProducts();
  return toPublicProducts(sortByCode(products.filter((product) => product.isPromoItem || product.badges?.includes('PROMO'))));
}

export async function getBestSellerProducts() {
  const products = await getAllProducts();
  return toPublicProducts(sortByCode(products.filter((product) => product.badges?.includes('BESTSELLER'))));
}

export async function getProductsByCollectionGroup(group: CollectionGroup) {
  if (group === 'new-arrivals' || group === 'new-collections') return getNewCollectionProducts();
  if (group === 'best-sellers') return getBestSellerProducts();
  if (group === 'promo-items') return getPromoItemProducts();

  const products = await getAllProducts();

  if (group === 'woods') {
    return toPublicProducts(products.filter((product) => product.collection?.toLowerCase() === 'woods'));
  }

  if (group === 'patterns') {
    return toPublicProducts(products.filter((product) => product.collection?.toLowerCase() === 'patterns'));
  }

  return toPublicProducts(products.filter((product) => product.collection?.toLowerCase() === 'solids'));
}
