import { cloudinaryFileRecords } from '@/data/cloudinary-files';

type CloudinarySearchResource = {
  public_id?: string;
  secure_url?: string;
  format?: string;
  created_at?: string;
  bytes?: number;
  width?: number;
  height?: number;
};

type CloudinarySearchResponse = {
  resources?: CloudinarySearchResource[];
  next_cursor?: string;
  error?: {
    message?: string;
  };
};

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'varindo';
const CLOUDINARY_CACHE_TTL_MS = Number(process.env.CLOUDINARY_IMAGE_CACHE_TTL_MS || 86400000);
const CLOUDINARY_MAX_PAGES = Number(process.env.CLOUDINARY_IMAGE_MAX_PAGES || 20);
const CLOUDINARY_MAX_RESULTS = Number(process.env.CLOUDINARY_IMAGE_MAX_RESULTS || 500);
const RAW_CLOUDINARY_SEARCH_PREFIX = process.env.CLOUDINARY_IMAGE_SEARCH_PREFIX || 'ALL';

let cachedImageMap: Map<string, string[]> | null = null;
let cachedAt = 0;

function normalizeSearchPrefix(value: string) {
  const normalized = value.trim();

  if (!normalized || ['ALL', '*', 'ROOT', 'NONE'].includes(normalized.toUpperCase())) {
    return '';
  }

  return normalized;
}

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

export function getNumberKeysFromText(text: string) {
  const matches = text.toLowerCase().match(/\d{4,5}/g) || [];
  const keys: string[] = [];

  for (const value of matches) {
    keys.push(value);

    if (value.length === 5 && value.startsWith('1')) {
      keys.push(value.slice(1));
    }
  }

  return Array.from(new Set(keys));
}

function pushUnique(map: Map<string, string[]>, key: string, urls: string[]) {
  const existing = map.get(key) || [];
  const merged = [...existing];

  for (const url of urls) {
    if (url && !merged.includes(url)) {
      merged.push(url);
    }
  }

  map.set(key, merged);
}

function buildDeliveryUrl(publicId: string, format?: string, folder?: string) {
  const ext = (format || 'webp').replace(/^\./, '');
  const cleanPublicId = publicId.replace(/\.(webp|jpg|jpeg|png)$/i, '');
  const cleanFolder = (folder || '').trim().replace(/^\/+|\/+$/g, '');

  const rootUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${cleanPublicId}.${ext}`;
  const folderUrl = cleanFolder
    ? `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${cleanFolder}/${cleanPublicId}.${ext}`
    : '';

  // Root URL first because the user's working samples are root-level public IDs,
  // even when Cloudinary's asset folder says "lamitak".
  return folderUrl ? [rootUrl, folderUrl] : [rootUrl];
}

function addStaticCloudinaryCsvRecords(map: Map<string, string[]>) {
  for (const record of cloudinaryFileRecords) {
    const urls = buildDeliveryUrl(record.publicId, record.format, record.folder);

    for (const key of record.numberKeys) {
      pushUnique(map, key, urls);
    }
  }
}

function addCloudinaryApiResource(map: Map<string, string[]>, resource: CloudinarySearchResource) {
  if (!resource.public_id || !resource.secure_url) return;

  const numberKeys = getNumberKeysFromText(resource.public_id);

  for (const key of numberKeys) {
    pushUnique(map, key, [resource.secure_url]);
  }
}

async function addCloudinaryApiRecords(map: Map<string, string[]>) {
  const auth = getCloudinaryAuthHeader();

  if (!auth) return;

  let nextCursor: string | undefined;
  const searchPrefix = normalizeSearchPrefix(RAW_CLOUDINARY_SEARCH_PREFIX);

  for (let page = 0; page < CLOUDINARY_MAX_PAGES; page += 1) {
    const expression = searchPrefix
      ? `resource_type:image AND public_id:${searchPrefix}*`
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
      addCloudinaryApiResource(map, resource);
    }

    if (!data.next_cursor) {
      break;
    }

    nextCursor = data.next_cursor;
  }
}

export async function getCloudinaryNumberImageMap() {
  const now = Date.now();

  if (cachedImageMap && now - cachedAt < CLOUDINARY_CACHE_TTL_MS) {
    return cachedImageMap;
  }

  const map = new Map<string, string[]>();

  // 1) Use the uploaded Cloudinary CSV as the reliable source.
  addStaticCloudinaryCsvRecords(map);

  // 2) If credentials are available, also enrich from live Cloudinary Admin/Search API.
  try {
    await addCloudinaryApiRecords(map);
  } catch (error) {
    console.error('Cloudinary API enrichment failed. Continuing with CSV image map.', error);
  }

  cachedImageMap = map;
  cachedAt = now;

  console.log(`Cloudinary numeric image map loaded: ${map.size} number keys`);

  return map;
}

export function getNumberKeysFromProductCode(code: string) {
  return getNumberKeysFromText(code);
}
