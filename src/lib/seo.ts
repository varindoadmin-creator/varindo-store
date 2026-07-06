import type { Product } from '@/types/product';

export const SITE_URL = 'https://varindo.co.id';

function formatPriceIDR(value?: number | null) {
  return typeof value === 'number' ? `Rp${value.toLocaleString('id-ID')}` : null;
}

/**
 * `product.name` is the raw Zoho item name (e.g. "DXO 5338D - LAMITAK HPL 4'x8' | STOFFA GRIGIO")
 * and already embeds the code, brand, and size — never usable as a stand-in "design name".
 * `product.design` is the clean design label ("STOFFA GRIGIO") and is populated for all current
 * products, but a future live Zoho item without local enrichment could still lack it, so fall
 * back to a stripped-down version of `name` rather than duplicating the code.
 */
export function safeDesignName(product: Product): string {
  if (product.design) return product.design;
  const cleaned = product.name
    .replace(product.code, '')
    .replace(/lamitak/gi, '')
    .replace(/hpl/gi, '')
    .replace(/\d+'\s*x\s*\d+'|\d+\s*x\s*\d+\s*mm/gi, '')
    .replace(/[|\-]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return cleaned || product.name;
}

/** `<title>` per spec: full form, or a shorter fallback if it would exceed ~60 chars. */
export function buildProductTitle(product: Product): string {
  const designName = safeDesignName(product);
  const full = `HPL Lamitak ${product.code} ${designName}${product.size ? ` ${product.size}` : ''} - Harga & Sampel | Varindo Dealer Resmi`;
  if (full.length <= 60) return full;
  return `HPL Lamitak ${product.code} ${designName} | Varindo`;
}

/** Bahasa Indonesia meta description, 140–160 chars where possible, trimmed gracefully. */
export function buildProductDescription(product: Product): string {
  const designName = safeDesignName(product);
  const categoryLabel = product.category || product.collection;
  const priceText = formatPriceIDR(product.price);

  const build = (includeThickness: boolean) => {
    const detailBits: string[] = [];
    if (categoryLabel) detailBits.push(`motif ${categoryLabel}`);
    if (product.size) detailBits.push(`ukuran ${product.size}`);
    if (includeThickness && product.thickness) detailBits.push(`tebal ${product.thickness}`);

    let desc = `HPL Lamitak ${product.code} ${designName}`;
    if (detailBits.length) desc += ` — ${detailBits.join(', ')}`;
    desc += '.';
    if (priceText) desc += ` Harga ${priceText} termasuk PPN.`;
    desc += ' Stok ready, minta sampel gratis. Dealer resmi Lamitak Indonesia.';
    return desc;
  };

  let description = build(true);
  if (description.length > 160) description = build(false);
  if (description.length > 160) description = `${description.slice(0, 157).trimEnd()}...`;
  return description;
}

export function getProductUrl(slug: string): string {
  return `${SITE_URL}/products/${slug}`;
}

/** Alt text template: "HPL Lamitak {code} {designName} motif {category} {size}" — attributes are all optional in principle, so build it defensively. */
export function buildProductImageAlt(product: Product): string {
  const designName = safeDesignName(product);
  let alt = `HPL Lamitak ${product.code} ${designName}`;
  const categoryLabel = product.category || product.collection;
  if (categoryLabel) alt += ` motif ${categoryLabel}`;
  if (product.size) alt += ` ${product.size}`;
  return alt;
}
