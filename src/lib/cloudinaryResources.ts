type CloudinarySearchResource = {
  public_id?: string;
  secure_url?: string;
  format?: string;
  created_at?: string;
};

type CloudinarySearchResponse = {
  resources?: CloudinarySearchResource[];
  next_cursor?: string;
  error?: {
    message?: string;
  };
};

const CLOUDINARY_CACHE_TTL_MS = Number(process.env.CLOUDINARY_IMAGE_CACHE_TTL_MS || 86400000);
const CLOUDINARY_MAX_PAGES = Number(process.env.CLOUDINARY_IMAGE_MAX_PAGES || 10);
const CLOUDINARY_MAX_RESULTS = Number(process.env.CLOUDINARY_IMAGE_MAX_RESULTS || 500);
const CLOUDINARY_SEARCH_PREFIX = process.env.CLOUDINARY_IMAGE_SEARCH_PREFIX || '';

let cachedImageMap: Map<string, string> | null = null;
let cachedAt = 0;

function getCloudinaryAuthHeader() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  const token = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

  return {
    cloudName,
    authorization: `Basic ${token}`
  };
}

function getBase4NumbersFromText(text: string) {
  const matches = text.toLowerCase().match(/\d{4,5}/g) || [];

  const numbers = matches.map((value) => {
    if (value.length === 5 && value.startsWith('1')) {
      return value.slice(1);
    }

    return value;
  });

  return Array.from(new Set(numbers));
}

function scorePublicId(publicId: string) {
  const id = publicId.toLowerCase();

  // Prefer root uploaded / direct master images and more common master codes.
  if (id.includes('dxp-') && id.includes('g')) return 100;
  if (id.includes('dxp-') && id.includes('xm')) return 95;
  if (id.includes('dxo-')) return 90;
  if (id.includes('wya-') && id.includes('mt')) return 88;
  if (id.includes('sca-')) return 85;
  if (id.includes('sct-')) return 80;
  if (id.includes('wy-')) return 75;
  if (id.includes('atp-') || id.includes('ats-') || id.includes('catp-') || id.includes('cats-')) return 70;

  return 50;
}

function shouldReplaceExisting(existingUrl: string, candidate: CloudinarySearchResource) {
  const existingPublicId = existingUrl
    .replace(/^https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//, '')
    .replace(/^v\d+\//, '')
    .replace(/\.[a-z0-9]+$/i, '');

  const existingScore = scorePublicId(existingPublicId);
  const candidateScore = scorePublicId(candidate.public_id || '');

  if (candidateScore !== existingScore) {
    return candidateScore > existingScore;
  }

  // If score is the same, prefer newest upload when Cloudinary gives the created_at value.
  return true;
}

export async function getCloudinaryNumberImageMap() {
  const auth = getCloudinaryAuthHeader();

  if (!auth) {
    return new Map<string, string>();
  }

  const now = Date.now();

  if (cachedImageMap && now - cachedAt < CLOUDINARY_CACHE_TTL_MS) {
    return cachedImageMap;
  }

  const map = new Map<string, string>();
  let nextCursor: string | undefined;

  try {
    for (let page = 0; page < CLOUDINARY_MAX_PAGES; page += 1) {
      const expression = CLOUDINARY_SEARCH_PREFIX
        ? `resource_type:image AND public_id:${CLOUDINARY_SEARCH_PREFIX}*`
        : 'resource_type:image';

      const response = await fetch(`https://api.cloudinary.com/v1_1/${auth.cloudName}/resources/search`, {
        method: 'POST',
        headers: {
          Authorization: auth.authorization,
          'Content-Type': 'application/json'
        },
        cache: 'no-store',
        body: JSON.stringify({
          expression,
          max_results: CLOUDINARY_MAX_RESULTS,
          next_cursor: nextCursor,
          sort_by: [{ created_at: 'desc' }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudinary image search failed:', response.status, errorText);
        break;
      }

      const data = (await response.json()) as CloudinarySearchResponse;
      const resources = data.resources || [];

      for (const resource of resources) {
        if (!resource.public_id || !resource.secure_url) continue;

        const numbers = getBase4NumbersFromText(resource.public_id);

        for (const number of numbers) {
          const existing = map.get(number);

          if (!existing || shouldReplaceExisting(existing, resource)) {
            map.set(number, resource.secure_url);
          }
        }
      }

      if (!data.next_cursor) {
        break;
      }

      nextCursor = data.next_cursor;
    }

    cachedImageMap = map;
    cachedAt = now;

    return map;
  } catch (error) {
    console.error('Cloudinary image map failed:', error);
    return new Map<string, string>();
  }
}

export function getBase4NumbersFromProductCode(code: string) {
  return getBase4NumbersFromText(code);
}
