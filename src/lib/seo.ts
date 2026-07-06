import type { Product } from '@/types/product';

export const SITE_URL = 'https://varindo.co.id';

export function formatPriceIDR(value?: number | null) {
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

/**
 * Bahasa Indonesia meta description, 140–160 chars where possible, trimmed gracefully.
 * `fallbackLead` (the first sentence of the generated product description block — see
 * productDescription.ts) is used as the opening line only when category/collection AND size
 * are both missing, since the usual "HPL Lamitak {code} {design} — motif X, ukuran Y" opener
 * would otherwise read as a bare code with nothing to say about it. Never triggers against the
 * current 802-product dataset (those attributes are always populated) — it's a safety net for
 * a future live Zoho item without local enrichment.
 */
export function buildProductDescription(product: Product, fallbackLead?: string): string {
  const designName = safeDesignName(product);
  const categoryLabel = product.category || product.collection;
  const priceText = formatPriceIDR(product.price);
  const isSparse = !categoryLabel && !product.size;

  const build = (includeThickness: boolean) => {
    let desc: string;
    if (isSparse && fallbackLead) {
      desc = fallbackLead;
    } else {
      const detailBits: string[] = [];
      if (categoryLabel) detailBits.push(`motif ${categoryLabel}`);
      if (product.size) detailBits.push(`ukuran ${product.size}`);
      if (includeThickness && product.thickness) detailBits.push(`tebal ${product.thickness}`);

      desc = `HPL Lamitak ${product.code} ${designName}`;
      if (detailBits.length) desc += ` — ${detailBits.join(', ')}`;
      desc += '.';
    }
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
