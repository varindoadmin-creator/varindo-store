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

function getPrefix(code: string) {
  const match = code.toUpperCase().trim().match(/^([A-Z]+)/);
  return match?.[1] || '';
}

function getSuffix(code: string) {
  const normalized = code.toUpperCase().trim();
  const match = normalized.match(/\d{4,5}([A-Z]+)$/);
  return match?.[1] || '';
}

function getDesignNumber(code: string) {
  const normalized = code.toUpperCase().trim();
  const match = normalized.match(/\b\d{4,5}\b/);
  if (!match) return null;

  const raw = match[0];
  const base4 = raw.length === 5 && raw.startsWith('1') ? raw.slice(1) : raw;

  return {
    raw,
    base4
  };
}

function numericFamilyCandidates(base4: string) {
  return [
    // Master / commonly uploaded image patterns.
    `dxp-${base4}xm`,
    `dxp-1${base4}xm`,
    `dxp-${base4}g`,
    `dxp-1${base4}g`,
    `dxo-${base4}d`,
    `dxo-1${base4}d`,

    // Solid / plain design families.
    `sca-${base4}d`,
    `sca-1${base4}d`,
    `sct-${base4}`,
    `sct-1${base4}`,
    `scm-${base4}xm`,
    `scm-1${base4}xm`,
    `scx-${base4}d`,
    `scx-1${base4}d`,

    // New collection / pattern families.
    `atp-${base4}m`,
    `atp-1${base4}m`,
    `ats-${base4}m`,
    `ats-1${base4}m`,
    `catp-${base4}m`,
    `catp-1${base4}m`,
    `cats-${base4}m`,
    `cats-1${base4}m`,
    `tsp-${base4}nc`,
    `tsp-1${base4}nc`,
    `tsw-${base4}ac`,
    `tsw-1${base4}ac`,
    `tsa-${base4}`,
    `tsa-1${base4}`,

    // Wood / miscellaneous families.
    `wy-${base4}d`,
    `wy-1${base4}d`,
    `wya-${base4}k`,
    `wya-1${base4}k`,
    `wg-${base4}d`,
    `wg-1${base4}d`,
    `mta-${base4}xl`,
    `mta-1${base4}xl`
  ];
}

export function getLamitakImageUrlCandidates(code: string) {
  const exact = normalizeCloudinaryProductCode(code);
  const prefix = getPrefix(code);
  const suffix = getSuffix(code);
  const design = getDesignNumber(code);

  if (!design || !prefix) {
    return [imageUrlFromNormalizedCode(exact)];
  }

  const prefixLower = prefix.toLowerCase();
  const suffixLower = suffix.toLowerCase();
  const raw = design.raw.toLowerCase();
  const base4 = design.base4.toLowerCase();

  const exactItemCandidates = [
    exact,
    `${prefixLower}-${raw}${suffixLower}`,
    `${prefixLower}-${base4}${suffixLower}`,
    `${prefixLower}-1${base4}${suffixLower}`,
    `${prefixLower}-${raw}`,
    `${prefixLower}-${base4}`,
    `${prefixLower}-1${base4}`
  ];

  const familyCandidates = numericFamilyCandidates(base4);

  // Prefer the numeric family first, because the same visual image may exist
  // under a different prefix/suffix than the Zoho item code.
  // Example: ATP 11358M should find DXP 1358XM if that is the uploaded image.
  return uniq([...familyCandidates, ...exactItemCandidates]).map(imageUrlFromNormalizedCode);
}

export function getLamitakImageUrl(code: string) {
  return getLamitakImageUrlCandidates(code)[0];
}
