import type { Product } from '@/types/product';
import { SITE_URL, getProductUrl } from './seo';

const LEGAL_NAME = 'CV. Varindo Forma Hutama';

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: LEGAL_NAME,
    alternateName: 'Varindo',
    url: SITE_URL,
    logo: `${SITE_URL}/varindo-logo-transparent.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+62-811-945-224',
      email: 'contact@varindo.co.id',
      contactType: 'customer service',
      areaServed: 'ID',
      availableLanguage: ['id', 'en']
    }
  };
}

/** Head Office only — no GPS coordinates are available, so `geo` is omitted (it's optional in schema.org). */
export function buildLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeGoodsStore',
    name: LEGAL_NAME,
    image: `${SITE_URL}/varindo-logo-transparent.png`,
    url: SITE_URL,
    telephone: '+62-811-945-224',
    email: 'contact@varindo.co.id',
    priceRange: 'IDR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Branz BSD Tower A Unit 3310, Jl. BSD Boulevard Parcel 55-F',
      addressLocality: 'Tangerang',
      addressRegion: 'Banten',
      postalCode: '15339',
      addressCountry: 'ID'
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00'
    }
  };
}

export function buildProductJsonLd(product: Product) {
  const json: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.code,
    brand: { '@type': 'Brand', name: 'Lamitak' },
    url: getProductUrl(product.slug)
  };

  if (product.imageUrl) json.image = product.imageUrl;
  if (product.description) json.description = product.description;

  if (typeof product.price === 'number') {
    json.offers = {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock',
      url: getProductUrl(product.slug),
      seller: { '@type': 'Organization', name: LEGAL_NAME }
    };
  }

  return json;
}

export function buildCollectionPageJsonLd(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url
  };
}

export function buildItemListJsonLd(products: Product[], limit = 20) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.slice(0, limit).map((product, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: getProductUrl(product.slug),
      name: product.name
    }))
  };
}

export function buildProductBreadcrumbJsonLd(product: Product) {
  const collectionLabel = product.collection || product.category;

  const items = [
    { name: 'Home', item: SITE_URL },
    { name: 'Katalog', item: `${SITE_URL}/products` },
    ...(collectionLabel ? [{ name: collectionLabel, item: `${SITE_URL}/products` }] : []),
    { name: product.name, item: getProductUrl(product.slug) }
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: entry.name,
      item: entry.item
    }))
  };
}
