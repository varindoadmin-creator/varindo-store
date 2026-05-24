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

export function getLamitakImageUrl(code: string) {
  const normalized = normalizeCloudinaryProductCode(code);
  return `https://res.cloudinary.com/varindo/image/upload/v1778402032/lamitak/lamitak-${normalized}.jpg`;
}
