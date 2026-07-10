const PRODUCT_IMAGES_FOLDER = 'product-images';

export function normalizeCloudinaryProductCode(code: string) {
  return code
    .toLowerCase()
    .trim()
    .replace(/([a-z]+)\s*([0-9])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function uniq(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function productImageUrl(numberCode: string, extension: 'webp' | 'jpg' | 'png') {
  return `https://res.cloudinary.com/varindo/image/upload/${PRODUCT_IMAGES_FOLDER}/${numberCode}.${extension}`;
}

function legacyImageUrl(normalizedCode: string, extension: 'webp' | 'jpg') {
  return `https://res.cloudinary.com/varindo/image/upload/v1778402032/lamitak/lamitak-${normalizedCode}.${extension}`;
}

export function getNumberKeysFromProductCode(code: string) {
  const matches = code.toLowerCase().match(/\d{4,5}/g) || [];
  const keys: string[] = [];

  for (const value of matches) {
    keys.push(value);

    // 5-digit variants often share images with the last 4 digits.
    // Example: 11358 -> 1358, 15291 -> 5291.
    if (value.length === 5 && value.startsWith('1')) {
      keys.push(value.slice(1));
    }
  }

  return uniq(keys);
}

export function getLamitakImageUrlCandidates(code: string) {
  const normalized = normalizeCloudinaryProductCode(code);
  const numberKeys = getNumberKeysFromProductCode(code);

  const productImageCandidates = numberKeys.flatMap((numberCode) => [
    productImageUrl(numberCode, 'webp'),
    productImageUrl(numberCode, 'jpg'),
    productImageUrl(numberCode, 'png')
  ]);

  const legacyCandidates = [
    legacyImageUrl(normalized, 'webp'),
    legacyImageUrl(normalized, 'jpg')
  ];

  return uniq([...productImageCandidates, ...legacyCandidates]);
}

export function getLamitakImageUrl(code: string) {
  return getLamitakImageUrlCandidates(code)[0];
}

/** Crops a Cloudinary image to a fixed size (default: 1200x630 for Open Graph/Twitter cards). */
export function getOgImageUrl(secureUrl: string, width = 1200, height = 630) {
  if (!secureUrl.includes('/upload/')) return secureUrl;
  return secureUrl.replace('/upload/', `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`);
}

export type PercentBox = { xPct: number; yPct: number; wPct: number; hPct: number };

/**
 * Crops a Cloudinary image to a region given as percentages of the original width/height
 * (e.g. from a vision model's approximate bounding box). Pads the box a bit before clamping,
 * since such boxes are only approximate and a tight crop risks clipping the item.
 */
export function getCroppedImageUrl(
  secureUrl: string,
  box: PercentBox,
  originalWidth: number,
  originalHeight: number,
  paddingPct = 0.06
) {
  if (!secureUrl.includes('/upload/') || !originalWidth || !originalHeight) return secureUrl;

  const padX = box.wPct * paddingPct;
  const padY = box.hPct * paddingPct;

  const x0 = Math.max(0, box.xPct - padX);
  const y0 = Math.max(0, box.yPct - padY);
  const x1 = Math.min(100, box.xPct + box.wPct + padX);
  const y1 = Math.min(100, box.yPct + box.hPct + padY);

  const x = Math.round((x0 / 100) * originalWidth);
  const y = Math.round((y0 / 100) * originalHeight);
  const w = Math.max(1, Math.round(((x1 - x0) / 100) * originalWidth));
  const h = Math.max(1, Math.round(((y1 - y0) / 100) * originalHeight));

  return secureUrl.replace('/upload/', `/upload/c_crop,x_${x},y_${y},w_${w},h_${h}/`);
}
