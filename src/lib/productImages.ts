/**
 * Product swatch images, served from Cloud Storage.
 *
 * Images are Lamitak's own full-bleed swatches, mirrored from their Shopify
 * storefront into gs://varindo-product-images. They are keyed by **design
 * name**, not product code, because a design is exactly what a swatch depicts:
 * WY 5217D (4'x8') and WY 15217D (4'x10') are both HERMES MARCELLO WALNUT and
 * share one file. All 230 such size pairs in the catalogue agree on design, so
 * this needs no per-code special casing.
 *
 * Most files are Lamitak's `_crop` images. 43 designs publish no `_crop`, and
 * their `_main` image is a room mock-up, so those use the flat `_image_1`
 * instead (Iron Dri-Matt® and Rosy publish neither and are cropped from the
 * panel in their render).
 */

const BUCKET_BASE = 'https://storage.googleapis.com/varindo-product-images/swatches';

// Swatch objects are served with a one-year immutable Cache-Control, so a file
// replaced in place stays stale in browsers and Google's edge cache. Bump this
// whenever swatches are replaced, to give every swatch URL a new cache key.
const SWATCH_VERSION = '2';

/**
 * Mirrors how Lamitak names its image files, which is not quite a plain
 * slugify — each of these was found by diffing against their live filenames:
 *   accents fold          AUGUSTE BÉTON      -> auguste-beton
 *   apostrophes vanish    MATEO L'AMETLLA    -> mateo-lametlla   (not l-ametlla)
 *   Dri-Matt loses its
 *   internal hyphen       BLUEBERRY DRI-MATT -> blueberry-drimatt
 */
export function toSwatchSlug(design: string) {
  return design
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')   // strip combining accent marks
    .replace(/[®™]/g, '')
    .replace(/['’]/g, '')
    .replace(/dri-matt/gi, 'drimatt')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function getSwatchUrl(design?: string | null) {
  const slug = design ? toSwatchSlug(design) : '';
  return slug ? `${BUCKET_BASE}/${slug}.webp?v=${SWATCH_VERSION}` : '';
}

/**
 * One candidate per design. ProductImage still walks a list and falls back on
 * error, so a design whose swatch is ever missing lands on the "image coming
 * soon" tile.
 */
export function getSwatchUrlCandidates(design?: string | null) {
  const url = getSwatchUrl(design);
  return url ? [url] : [];
}
