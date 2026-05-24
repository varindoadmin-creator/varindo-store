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

function getSharedFamilyPriority(prefix: string, base4: string, suffix: string) {
  const prefixUpper = prefix.toUpperCase();
  const suffixLower = suffix.toLowerCase();

  // These code families often share the same visual with the base 4-digit design.
  // Example: SCA 1104D, SCA 11104D, ATS 1104M, ATS 11104M, TSP 1104NC, TSW 11104.
  // We prioritize the most common existing image patterns before trying exact missing files.
  if (['ATS', 'ATP', 'TSP', 'TSW', 'CATS', 'CATP', 'TSA'].includes(prefixUpper)) {
    return [
      `sca-${base4}d`,
      `sca-1${base4}d`,
      `sct-${base4}`,
      `sct-1${base4}`,
      `scm-${base4}`,
      `scm-1${base4}`,
      `scx-${base4}`,
      `scx-1${base4}`,
      `tsp-${base4}nc`,
      `tsp-1${base4}nc`,
      `ats-${base4}m`,
      `ats-1${base4}m`,
      `atp-${base4}m`,
      `atp-1${base4}m`,
      `tsw-${base4}${suffixLower}`,
      `tsw-1${base4}${suffixLower}`,
      `tsa-${base4}${suffixLower}`,
      `tsa-1${base4}${suffixLower}`
    ];
  }

  // For SCA/SCT/SCM/SCX, keep exact item first, but still add cross-family fallbacks.
  return [
    `sca-${base4}d`,
    `sca-1${base4}d`,
    `sct-${base4}`,
    `sct-1${base4}`,
    `scm-${base4}`,
    `scm-1${base4}`,
    `scx-${base4}`,
    `scx-1${base4}`
  ];
}

export function getLamitakImageUrlCandidates(code: string) {
  const exact = normalizeCloudinaryProductCode(code);
  const design = getDesignNumber(code);
  const prefix = getPrefix(code);
  const suffix = getSuffix(code);

  if (!design || !prefix) {
    return [imageUrlFromNormalizedCode(exact)];
  }

  const prefixLower = prefix.toLowerCase();
  const base4 = design.base4.toLowerCase();
  const raw = design.raw.toLowerCase();
  const suffixLower = suffix.toLowerCase();

  const exactFamilyCandidates = [
    exact,
    `${prefixLower}-${raw}${suffixLower}`,
    `${prefixLower}-${base4}${suffixLower}`,
    `${prefixLower}-1${base4}${suffixLower}`,
    `${prefixLower}-${raw}`,
    `${prefixLower}-${base4}`,
    `${prefixLower}-1${base4}`
  ];

  const sharedFamilyCandidates = getSharedFamilyPriority(prefix, base4, suffix);

  // For newer/pattern/promo families that often do not have their own image file yet,
  // try shared 4-digit family images first. This helps ATS/TSP/TSW/etc. reuse SCA/SCT images.
  const prefixUpper = prefix.toUpperCase();
  const sharedFirst = ['ATS', 'ATP', 'TSP', 'TSW', 'CATS', 'CATP', 'TSA'].includes(prefixUpper);

  const candidates = sharedFirst
    ? [...sharedFamilyCandidates, ...exactFamilyCandidates]
    : [...exactFamilyCandidates, ...sharedFamilyCandidates];

  return uniq(candidates).map(imageUrlFromNormalizedCode);
}

export function getLamitakImageUrl(code: string) {
  return getLamitakImageUrlCandidates(code)[0];
}
