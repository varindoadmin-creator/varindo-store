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

function imageUrlFromNormalizedCode(normalizedCode: string) {
  return `https://res.cloudinary.com/varindo/image/upload/v1778402032/lamitak/lamitak-${normalizedCode}.jpg`;
}

function uniq(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function getDesignNumber(code: string) {
  const normalized = code.toUpperCase().trim();
  const match = normalized.match(/\b\d{4,5}\b/);
  if (!match) return null;

  const number = match[0];

  // Many Lamitak 4x10 / related variants add a leading "1" before the
  // same 4-digit design family. Example: 11104 should share image logic
  // with 1104.
  if (number.length === 5 && number.startsWith('1')) {
    return {
      raw: number,
      base4: number.slice(1)
    };
  }

  return {
    raw: number,
    base4: number
  };
}

function getPrefix(code: string) {
  const match = code.toUpperCase().trim().match(/^([A-Z]+)/);
  return match?.[1] || '';
}

function getSuffix(code: string) {
  const normalized = code.toUpperCase().trim();
  const match = normalized.match(/\d{4,5}([A-Z]+)$/);
  return match?.[1] || '';
}

export function getLamitakImageUrlCandidates(code: string) {
  const normalized = normalizeCloudinaryProductCode(code);
  const design = getDesignNumber(code);
  const prefix = getPrefix(code);
  const suffix = getSuffix(code);

  const candidates = [normalized];

  if (design && prefix) {
    const prefixLower = prefix.toLowerCase();
    const base4 = design.base4.toLowerCase();
    const raw = design.raw.toLowerCase();
    const suffixLower = suffix.toLowerCase();

    // Same-prefix family variants.
    candidates.push(`${prefixLower}-${raw}${suffixLower}`);
    candidates.push(`${prefixLower}-${base4}${suffixLower}`);
    candidates.push(`${prefixLower}-1${base4}${suffixLower}`);
    candidates.push(`${prefixLower}-${raw}`);
    candidates.push(`${prefixLower}-${base4}`);
    candidates.push(`${prefixLower}-1${base4}`);

    // Shared-image family variants across common Lamitak code families.
    // Example: SCA 1104D / SCA 11104D / TSA 1104 / TSW 11104 can reuse
    // the same 1104 design-family image when exact image files are missing.
    candidates.push(`sca-${base4}d`);
    candidates.push(`sca-1${base4}d`);
    candidates.push(`tsa-${base4}`);
    candidates.push(`tsa-1${base4}`);
    candidates.push(`tsw-${base4}`);
    candidates.push(`tsw-1${base4}`);

    // Other common categories where the 4-digit design family may share visuals.
    candidates.push(`sct-${base4}`);
    candidates.push(`sct-1${base4}`);
    candidates.push(`scm-${base4}`);
    candidates.push(`scm-1${base4}`);
    candidates.push(`scx-${base4}`);
    candidates.push(`scx-1${base4}`);
    candidates.push(`tsp-${base4}`);
    candidates.push(`tsp-1${base4}`);
    candidates.push(`ats-${base4}`);
    candidates.push(`ats-1${base4}`);
    candidates.push(`atp-${base4}`);
    candidates.push(`atp-1${base4}`);
    candidates.push(`cats-${base4}`);
    candidates.push(`cats-1${base4}`);
    candidates.push(`catp-${base4}`);
    candidates.push(`catp-1${base4}`);
  }

  return uniq(candidates).map(imageUrlFromNormalizedCode);
}

export function getLamitakImageUrl(code: string) {
  return getLamitakImageUrlCandidates(code)[0];
}
