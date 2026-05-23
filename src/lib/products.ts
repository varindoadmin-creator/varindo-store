import { lamitakProducts } from '@/data/lamitak-products';
import type { Product } from '@/types/product';
import { getLamitakImageUrl } from './cloudinary';
import { normalizeCode, slugify, uniq } from './utils';
import { fetchZohoLamitakProducts } from './zoho';

export type CollectionGroup = 'woods' | 'patterns' | 'solids';

function enrichProduct(product: Product): Product {
  return {
    ...product,
    slug: product.slug || slugify(`${product.code} ${product.name}`),
    imageUrl: product.imageUrl || getLamitakImageUrl(product.code)
  };
}

async function getSourceProducts() {
  try {
    const zohoProducts = await fetchZohoLamitakProducts();
    if (zohoProducts && zohoProducts.length > 0) {
      return zohoProducts;
    }
  } catch (error) {
    console.error('Zoho product fetch failed. Falling back to local starter data.', error);
  }

  return lamitakProducts;
}

export async function getAllProducts() {
  const products = await getSourceProducts();
  return products.filter((product) => product.active).map(enrichProduct);
}

export async function getProductBySlug(slug: string) {
  const products = await getAllProducts();
  return products.find((product) => product.slug === slug);
}

export async function getProductByCode(code: string) {
  const products = await getAllProducts();
  const normalized = normalizeCode(code);
  return products.find((product) => normalizeCode(product.code) === normalized);
}

export async function getFilterOptions() {
  const products = await getAllProducts();
  return {
    collections: uniq(products.map((product) => product.collection).filter(Boolean) as string[]).sort(),
    categories: uniq(products.map((product) => product.category).filter(Boolean) as string[]).sort(),
    finishes: uniq(products.map((product) => product.finish).filter(Boolean) as string[]).sort(),
    sizes: uniq(products.map((product) => product.size).filter(Boolean) as string[]).sort(),
    colorFamilies: uniq(products.map((product) => product.colorFamily).filter(Boolean) as string[]).sort()
  };
}

export function searchProducts(products: Product[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return products;

  return products.filter((product) => {
    const haystack = [
      product.code,
      product.name,
      product.collection,
      product.category,
      product.design,
      product.finish,
      product.size,
      product.colorFamily,
      product.description
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export async function getNewCollectionProducts() {
  const products = await getAllProducts();
  const tagged = products.filter((product) => product.badges?.includes('NEW'));
  return tagged.length > 0 ? tagged : products.slice(0, 4);
}

export async function getBestSellerProducts() {
  const products = await getAllProducts();
  const tagged = products.filter((product) => product.badges?.includes('BESTSELLER'));
  return tagged.length > 0 ? tagged : products.slice(0, 4);
}

export async function getProductsByCollectionGroup(group: CollectionGroup) {
  const products = await getAllProducts();

  if (group === 'woods') {
    return products.filter((product) => product.category?.toLowerCase() === 'woods');
  }

  if (group === 'patterns') {
    return products.filter((product) => {
      const category = product.category?.toLowerCase() || '';
      return category === 'patterns' || category === 'saville' || category.includes('protak');
    });
  }

  return products.filter((product) => {
    const category = product.category?.toLowerCase() || '';
    return category === 'solids' || category === 'solids+' || category === 'solid core';
  });
}
