import type { Product } from '@/types/product';
import { findLamitakDatabaseRecord } from '@/data/lamitak-product-database';
import { getLamitakImageUrl } from './cloudinary';
import { slugify } from './utils';

const ZOHO_BOOKS_BASE_URL = process.env.ZOHO_BOOKS_BASE_URL || 'https://www.zohoapis.com/books/v3';
const ZOHO_ACCOUNTS_BASE_URL = process.env.ZOHO_ACCOUNTS_BASE_URL || 'https://accounts.zoho.com';
const LAMITAK_SEARCH_TERM = process.env.ZOHO_LAMITAK_SEARCH_TERM || 'LAMITAK';
const ZOHO_FETCH_ALL_ACTIVE_ITEMS = (process.env.ZOHO_FETCH_ALL_ACTIVE_ITEMS || 'true').toLowerCase() === 'true';
const ZOHO_MAX_PAGES = Number(process.env.ZOHO_MAX_PAGES || 20);
const CACHE_TTL_MS = Number(process.env.ZOHO_PRODUCTS_CACHE_TTL_MS || 1000 * 60 * 10);
const PPN_RATE = Number(process.env.NEXT_PUBLIC_PPN_RATE || 0.11);

type ZohoCustomField = {
  label?: string;
  api_name?: string;
  customfield_id?: string;
  value?: string | number | boolean | null;
};

type ZohoItem = {
  item_id?: string;
  name?: string;
  sku?: string;
  rate?: number | string;
  stock_on_hand?: number | string | null;
  stock?: number | string | null;
  available_stock?: number | string | null;
  actual_available_stock?: number | string | null;
  available_for_sale_stock?: number | string | null;
  status?: string;
  description?: string;
  unit?: string;
  image_name?: string;
  custom_fields?: ZohoCustomField[];
};

type ZohoItemsResponse = {
  code?: number;
  message?: string;
  items?: ZohoItem[];
  page_context?: {
    page?: number;
    per_page?: number;
    has_more_page?: boolean;
  };
};

type CachedZohoProducts = {
  fetchedAt: number;
  products: Product[];
};

let cachedProducts: CachedZohoProducts | null = null;
let cachedAccessToken: { token: string; expiresAt: number } | null = null;

export function hasZohoConfig() {
  return Boolean(
    process.env.ZOHO_BOOKS_ORGANIZATION_ID &&
      process.env.ZOHO_CLIENT_ID &&
      process.env.ZOHO_CLIENT_SECRET &&
      process.env.ZOHO_REFRESH_TOKEN
  );
}

async function getZohoAccessToken() {
  if (cachedAccessToken && Date.now() < cachedAccessToken.expiresAt) {
    return cachedAccessToken.token;
  }

  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN || '',
    client_id: process.env.ZOHO_CLIENT_ID || '',
    client_secret: process.env.ZOHO_CLIENT_SECRET || '',
    grant_type: 'refresh_token'
  });

  const response = await fetch(`${ZOHO_ACCOUNTS_BASE_URL}/oauth/v2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params,
    cache: 'no-store'
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Zoho OAuth token request failed: ${response.status} ${text}`);
  }

  const data = (await response.json()) as { access_token?: string; expires_in?: number; error?: string };

  if (!data.access_token) {
    throw new Error(`Zoho OAuth token response missing access_token: ${JSON.stringify(data)}`);
  }

  cachedAccessToken = {
    token: data.access_token,
    expiresAt: Date.now() + Math.max((data.expires_in || 3600) - 60, 60) * 1000
  };

  return cachedAccessToken.token;
}

function getCustomFieldValue(item: ZohoItem, fieldNames: string[]) {
  const fields = item.custom_fields || [];
  const normalizedNames = fieldNames.map((name) => name.toLowerCase().replace(/[^a-z0-9]/g, ''));

  const match = fields.find((field) => {
    const label = `${field.label || ''} ${field.api_name || ''}`.toLowerCase().replace(/[^a-z0-9]/g, '');
    return normalizedNames.some((name) => label.includes(name));
  });

  if (match?.value === undefined || match?.value === null) return undefined;
  return String(match.value);
}

function extractCode(item: ZohoItem) {
  const source = `${item.sku || ''} ${item.name || ''}`.trim();
  const withoutPrefix = source.replace(/^LAM[-_\s]*/i, '').trim();

  const codeMatch = withoutPrefix.match(/\b[A-Z]{2,4}[\s-]?\d{3,5}[A-Z]{0,3}\b/i);
  if (!codeMatch) return item.sku || item.name || 'LAMITAK';

  return codeMatch[0].toUpperCase().replace(/([A-Z]{2,4})[-\s]?(\d)/, '$1 $2');
}

function inferSize(item: ZohoItem) {
  const customSize = getCustomFieldValue(item, ['size', 'ukuran']);
  if (customSize) return customSize;

  const name = item.name || '';
  const sizeMatch = name.match(/4\s*['’]?[xX×]\s*\d{1,2}\s*['’]?/);
  return sizeMatch ? sizeMatch[0].replace(/\s+/g, '').toUpperCase() : undefined;
}

function inferCollection(item: ZohoItem) {
  return getCustomFieldValue(item, ['collection', 'kategori', 'category']) || undefined;
}

function inferFinish(item: ZohoItem) {
  const customFinish = getCustomFieldValue(item, ['finish', 'finishing']);
  if (customFinish) return customFinish;

  const code = extractCode(item);
  const finishMatch = code.match(/[A-Z]{1,3}$/);
  return finishMatch ? finishMatch[0] : undefined;
}

function inferColorFamily(item: ZohoItem) {
  return getCustomFieldValue(item, ['color family', 'colour family', 'warna', 'color']) || undefined;
}

function toNumber(value: unknown) {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function inferStockOnHand(item: ZohoItem) {
  const stockFromKnownFields = [
    item.stock_on_hand,
    item.available_stock,
    item.actual_available_stock,
    item.available_for_sale_stock,
    item.stock
  ]
    .map(toNumber)
    .find((value) => typeof value === 'number');

  if (typeof stockFromKnownFields === 'number') return stockFromKnownFields;

  const customStock = getCustomFieldValue(item, [
    'stock on hand',
    'stock_on_hand',
    'available stock',
    'available_stock',
    'qty available',
    'quantity available',
    'stok',
    'stock'
  ]);

  return toNumber(customStock);
}

function isExcludedCatalogItem(item: ZohoItem) {
  const fields = JSON.stringify(item.custom_fields || []).toLowerCase();
  const text = `${item.name || ''} ${item.sku || ''} ${item.description || ''} ${fields}`.toLowerCase();

  // Hide Lamitak accessory / edging products from the public HPL catalog.
  // Example: EAS 1108D0/23 - NEWEDGE ABS EDGING W23MM X T1.0MM | SCT 1108LU
  return (
    text.includes('newedge abs') ||
    text.includes('abs edging') ||
    text.includes('edging w') ||
    text.includes('edgebanding') ||
    text.includes('edge banding') ||
    /^eas[\s-]/i.test(item.sku || '') ||
    /^eas[\s-]/i.test(item.name || '')
  );
}

function isLamitakItem(item: ZohoItem) {
  if (isExcludedCatalogItem(item)) return false;

  const fields = JSON.stringify(item.custom_fields || []).toLowerCase();
  const text = `${item.name || ''} ${item.sku || ''} ${fields}`.toLowerCase();
  const searchTerm = LAMITAK_SEARCH_TERM.toLowerCase();

  return (
    text.includes('lamitak') ||
    text.includes(searchTerm) ||
    text.includes('brandlamitak') ||
    text.includes('brand lamitak') ||
    /^lam[-_\s]/i.test(item.sku || '') ||
    /^lam[-_\s]/i.test(item.name || '')
  );
}

function mapZohoItemToProduct(item: ZohoItem): Product {
  const code = extractCode(item);
  const databaseRecord = findLamitakDatabaseRecord(code);
  const name = item.name || code;
  const zohoRateExcludingTax = item.rate === undefined || item.rate === null ? null : Number(item.rate);
  const websitePriceIncludingTax =
    typeof zohoRateExcludingTax === 'number' && Number.isFinite(zohoRateExcludingTax)
      ? Math.round(zohoRateExcludingTax * (1 + PPN_RATE))
      : null;

  return {
    slug: slugify(`${code} ${name}`),
    code,
    name,
    brand: 'LAMITAK',
    design: databaseRecord?.design,
    collection: databaseRecord?.collection || inferCollection(item),
    category: databaseRecord?.category,
    finish: databaseRecord?.finish || inferFinish(item),
    size: databaseRecord?.size || inferSize(item),
    thickness: databaseRecord?.thickness || getCustomFieldValue(item, ['thickness', 'tebal']),
    colorFamily: inferColorFamily(item),
    // Zoho Books rate is maintained excluding PPN.
    // Public catalog price is shown including PPN.
    price: websitePriceIncludingTax,
    priceExcludingTax: typeof zohoRateExcludingTax === 'number' && Number.isFinite(zohoRateExcludingTax) ? zohoRateExcludingTax : null,
    taxIncluded: true,
    stockOnHand: inferStockOnHand(item),
    unit: item.unit,
    currency: 'IDR',
    active: item.status ? item.status.toLowerCase() === 'active' : true,
    imageUrl: getLamitakImageUrl(code),
    description: item.description || undefined
  };
}

async function fetchZohoItemsPage(accessToken: string, page: number) {
  const params = new URLSearchParams({
    organization_id: process.env.ZOHO_BOOKS_ORGANIZATION_ID || '',
    page: String(page),
    per_page: '200',
    status: 'active'
  });

  // Important: do not use name_contains by default.
  // Varindo has hundreds of Lamitak items, and not every Zoho item may contain
  // the exact same searchable text in the same field. Fetch all active items,
  // then filter for Lamitak locally using name, SKU, and custom fields.
  if (!ZOHO_FETCH_ALL_ACTIVE_ITEMS && LAMITAK_SEARCH_TERM) {
    params.set('name_contains', LAMITAK_SEARCH_TERM);
  }

  const response = await fetch(`${ZOHO_BOOKS_BASE_URL}/items?${params.toString()}`, {
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`
    },
    next: { revalidate: Math.max(60, Math.floor(CACHE_TTL_MS / 1000)) }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Zoho Books items request failed: ${response.status} ${text}`);
  }

  const data = (await response.json()) as ZohoItemsResponse;

  if (data.code && data.code !== 0) {
    throw new Error(`Zoho Books returned error: ${data.code} ${data.message || ''}`);
  }

  return data;
}

export async function fetchZohoLamitakProducts() {
  if (!hasZohoConfig()) return null;

  if (cachedProducts && Date.now() - cachedProducts.fetchedAt < CACHE_TTL_MS) {
    return cachedProducts.products;
  }

  const accessToken = await getZohoAccessToken();
  const items: ZohoItem[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= ZOHO_MAX_PAGES) {
    const data = await fetchZohoItemsPage(accessToken, page);
    items.push(...(data.items || []));
    hasMore = Boolean(data.page_context?.has_more_page);
    page += 1;
  }

  if (hasMore && page > ZOHO_MAX_PAGES) {
    console.warn(`Zoho product fetch stopped at ZOHO_MAX_PAGES=${ZOHO_MAX_PAGES}. Increase ZOHO_MAX_PAGES if some products are missing.`);
  }

  const products = items
    .filter(isLamitakItem)
    .map(mapZohoItemToProduct)
    .filter((product) => product.active);

  cachedProducts = {
    fetchedAt: Date.now(),
    products
  };

  return products;
}
