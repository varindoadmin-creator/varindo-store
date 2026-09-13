import Anthropic from '@anthropic-ai/sdk';
import { Storage } from '@google-cloud/storage';
import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { getPublicProducts } from '@/lib/products';
import { getSwatchUrl, toSwatchSlug } from '@/lib/productImages';
import { embedImage, getSwatchIndex, nearestSwatches, type SwatchIndex } from '@/lib/swatchIndex';
import { normalizeCode } from '@/lib/utils';
import type { Product } from '@/types/product';
import type { SurfaceMatch, SurfaceMatchGroup, SurfaceMatchResponse } from '@/types/surfaceMatch';

export const dynamic = 'force-dynamic';

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
// Claude downsamples past this on the long edge anyway, and it leaves Voyage
// plenty of texture to work with.
const MAX_EDGE = 1568;
const MATCH_COUNT = 9;
const MULTI_ITEM_MATCH_COUNT = 3;
const MAX_ITEMS = 6;
// Similarity ranks, it doesn't measure confidence. On test photos built from
// real swatches, look-alike designs sat within a point or two of the right
// one, and the same design scored anywhere from 73% to 94% depending on
// framing. So results are shown ranked, and this floor only screens out photos
// with no laminate in them (a sky photo topped out at 44%). Recheck it against
// the uploads kept in SURFACE_MATCH_UPLOAD_BUCKET.
const MIN_SIMILARITY = 0.5;

const DETECT_MODEL = 'claude-opus-5';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_MAP_CLEANUP_THRESHOLD = 5000;

const requestCounts = new Map<string, { count: number; resetAt: number }>();

// Cloud Run's front end appends the address the connection came from, so the
// last X-Forwarded-For entry is the one a client can't set; anything before
// it arrived with the request.
function getClientIp(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',').pop()?.trim() || 'unknown';
}

function isRateLimited(ip: string) {
  const now = Date.now();

  if (requestCounts.size > RATE_LIMIT_MAP_CLEANUP_THRESHOLD) {
    requestCounts.forEach((entry, key) => {
      if (now > entry.resetAt) requestCounts.delete(key);
    });
  }

  const entry = requestCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

// ── Item detection (Claude) ────────────────────────────────────────

type PercentBox = { xPct: number; yPct: number; wPct: number; hPct: number };
type DetectedItem = { code: string | null; box: PercentBox | null };
type Detection = { mode: 'single' | 'multiple'; items: DetectedItem[] };

const WHOLE_PHOTO: Detection = { mode: 'single', items: [{ code: null, box: null }] };

const DETECT_PROMPT = `This photo was submitted to the search-by-photo tool of Varindo, a dealer of Lamitak HPL laminates. Customers use it to identify a laminate design.

The photo usually shows one of two things:
- a single surface: a sample chip, a cut sheet, or an installed surface such as a cabinet door or wall panel
- a page or spread from a printed catalogue or sample book, with several separate swatches

Return:
- mode: "multiple" only when the photo clearly shows two or more separate, individually identifiable swatches. Otherwise "single", including an installed surface with visible grain variation or seams.
- items: in multiple mode, one entry per swatch, most prominent first, at most ${MAX_ITEMS}. In single mode, exactly one entry.
  - code: the product code printed on or beside that item, or null if none is legible. Lamitak codes are a short letter prefix, a space, and an alphanumeric suffix, such as "ART 1009XM", "DXO 5338D" or "SCA 1143D". On catalogue pages they are often printed sideways. Transcribe characters as printed, including ones that could be O or 0, or I or 1; the code is matched against the catalogue afterwards.
  - box: in multiple mode, the swatch's bounding box as percentages (0-100) of the full image: xPct and yPct for the top-left corner, wPct and hPct for its size. Cover the swatch material itself, not hands, fingers, captions or pen marks on the page. In single mode, null.`;

const nullable = (schema: Record<string, unknown>) => ({ anyOf: [schema, { type: 'null' }] });

const DETECT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['mode', 'items'],
  properties: {
    mode: { type: 'string', enum: ['single', 'multiple'] },
    items: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['code', 'box'],
        properties: {
          code: nullable({ type: 'string' }),
          box: nullable({
            type: 'object',
            additionalProperties: false,
            required: ['xPct', 'yPct', 'wPct', 'hPct'],
            properties: {
              xPct: { type: 'number' },
              yPct: { type: 'number' },
              wPct: { type: 'number' },
              hPct: { type: 'number' },
            },
          }),
        },
      },
    },
  },
};

let anthropic: Anthropic | null = null;

function getAnthropic() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  // Short timeout, one retry: detection only refines the search, so a slow
  // call should fall back to whole-photo matching instead of holding the request.
  anthropic ??= new Anthropic({ timeout: 30_000, maxRetries: 1 });
  return anthropic;
}

function toDetection(raw: { mode: string; items: DetectedItem[] }): Detection {
  const items = raw.items.slice(0, MAX_ITEMS).map((item) => ({
    code: item.code?.trim() || null,
    box: item.box && item.box.wPct > 1 && item.box.hPct > 1 ? item.box : null,
  }));

  if (raw.mode === 'multiple') {
    const boxed = items.filter((item) => item.box);
    if (boxed.length >= 2) return { mode: 'multiple', items: boxed };
  }

  return { mode: 'single', items: [{ code: items[0]?.code ?? null, box: null }] };
}

async function detectItems(jpeg: Buffer): Promise<Detection> {
  const client = getAnthropic();
  if (!client) return WHOLE_PHOTO;

  try {
    const response = await client.beta.messages.create({
      model: DETECT_MODEL,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low', format: { type: 'json_schema', schema: DETECT_SCHEMA } },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: jpeg.toString('base64') } },
            { type: 'text', text: DETECT_PROMPT },
          ],
        },
      ],
    });

    if (response.stop_reason === 'refusal') {
      throw new Error(`Detection refused (${response.stop_details?.category ?? 'no category'})`);
    }

    const text = response.content.find((block) => block.type === 'text');
    if (!text || text.type !== 'text') throw new Error('Detection returned no text');
    return toDetection(JSON.parse(text.text));
  } catch (err) {
    console.error('[surface-match] Item detection failed, searching the whole photo:', err);
    return WHOLE_PHOTO;
  }
}

// ── Upload retention (Cloud Storage) ───────────────────────────────

let storage: Storage | null = null;

/**
 * Keeps the normalised photo so match quality (and MIN_SIMILARITY) can be
 * reviewed against real customer photos. The bucket deletes objects after
 * 30 days, which the privacy policy states. Unset locally, so nothing is kept.
 */
async function keepUpload(jpeg: Buffer) {
  const bucket = process.env.SURFACE_MATCH_UPLOAD_BUCKET;
  if (!bucket) return;

  try {
    storage ??= new Storage();
    const name = `uploads/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.jpg`;
    await storage.bucket(bucket).file(name).save(jpeg, { contentType: 'image/jpeg', resumable: false });
  } catch (err) {
    console.error('[surface-match] Could not keep upload:', err);
  }
}

// ── Matching ───────────────────────────────────────────────────────

// Folds characters a vision model can't reliably tell apart in print. A key
// two catalogue codes share maps to null, so that item falls back to visual
// search rather than guessing (none do today).
function foldCode(code: string) {
  return normalizeCode(code).replace(/o/g, '0').replace(/[il]/g, '1');
}

type Catalogue = {
  byFoldedCode: Map<string, Product | null>;
  bySwatch: Map<string, Product[]>;
};

function buildCatalogue(products: Product[]): Catalogue {
  const byFoldedCode = new Map<string, Product | null>();
  const bySwatch = new Map<string, Product[]>();

  for (const product of products) {
    const key = foldCode(product.code);
    byFoldedCode.set(key, byFoldedCode.has(key) ? null : product);

    const swatch = toSwatchSlug(product.design || '');
    if (swatch) bySwatch.set(swatch, [...(bySwatch.get(swatch) || []), product]);
  }

  return { byFoldedCode, bySwatch };
}

function toMatch(swatch: string, products: Product[], score: number, matchType: SurfaceMatch['matchType']): SurfaceMatch {
  const sorted = [...products].sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
  return {
    swatch,
    design: sorted[0].design || sorted[0].name,
    imageUrl: getSwatchUrl(sorted[0].design),
    score,
    matchType,
    products: sorted.map((product) => ({
      code: product.code,
      slug: product.slug,
      size: product.size?.split(' / ')[0] || null,
    })),
  };
}

function clampPct(value: number) {
  return Math.min(100, Math.max(0, value));
}

/** Boxes from a vision model are approximate, so pad before cropping rather than risk clipping the swatch. */
function cropToBox(jpeg: Buffer, width: number, height: number, box: PercentBox, padding = 0.06) {
  const x0 = clampPct(box.xPct - box.wPct * padding);
  const y0 = clampPct(box.yPct - box.hPct * padding);
  const x1 = clampPct(box.xPct + box.wPct * (1 + padding));
  const y1 = clampPct(box.yPct + box.hPct * (1 + padding));

  const left = Math.min(width - 1, Math.round((x0 / 100) * width));
  const top = Math.min(height - 1, Math.round((y0 / 100) * height));

  return sharp(jpeg)
    .extract({
      left,
      top,
      width: Math.max(1, Math.min(width - left, Math.round(((x1 - x0) / 100) * width))),
      height: Math.max(1, Math.min(height - top, Math.round(((y1 - y0) / 100) * height))),
    })
    .jpeg({ quality: 85 })
    .toBuffer();
}

type MatchContext = {
  photo: { data: Buffer; width: number; height: number };
  index: SwatchIndex;
  catalogue: Catalogue;
  matchCount: number;
  voyageKey: string;
};

async function matchItem(item: DetectedItem, ctx: MatchContext): Promise<SurfaceMatchGroup> {
  const crop = item.box ? await cropToBox(ctx.photo.data, ctx.photo.width, ctx.photo.height, item.box) : null;
  const thumbnail = crop
    ? `data:image/jpeg;base64,${(await sharp(crop).resize(160, 160, { fit: 'cover' }).jpeg({ quality: 70 }).toBuffer()).toString('base64')}`
    : null;

  const byCode = item.code ? ctx.catalogue.byFoldedCode.get(foldCode(item.code)) : null;
  if (byCode) {
    const swatch = toSwatchSlug(byCode.design || '');
    const sizes = ctx.catalogue.bySwatch.get(swatch) || [byCode];
    return { thumbnail, detectedCode: item.code, matches: [toMatch(swatch, sizes, 1, 'code')] };
  }

  const embedding = await embedImage(crop ?? ctx.photo.data, ctx.voyageKey);
  const matches = nearestSwatches(ctx.index, embedding, ctx.matchCount * 2)
    .filter((candidate) => candidate.similarity >= MIN_SIMILARITY)
    .flatMap((candidate) => {
      const products = ctx.catalogue.bySwatch.get(candidate.slug);
      return products ? [toMatch(candidate.slug, products, candidate.similarity, 'visual')] : [];
    })
    .slice(0, ctx.matchCount);

  return { thumbnail, detectedCode: item.code, matches };
}

export async function POST(req: NextRequest) {
  if (isRateLimited(getClientIp(req))) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const voyageKey = process.env.VOYAGE_API_KEY;
  if (!voyageKey) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  if (Number(req.headers.get('content-length') || 0) > MAX_UPLOAD_BYTES + 64 * 1024) {
    return NextResponse.json({ error: 'too_large' }, { status: 413 });
  }

  let upload: Blob;
  try {
    const value = (await req.formData()).get('file');
    if (!(value instanceof Blob)) throw new Error('No file field');
    upload = value;
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  if (upload.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: 'too_large' }, { status: 413 });
  }

  // One normalised JPEG feeds everything downstream: upright (EXIF applied),
  // bounded in size, transparency flattened. Anything sharp can't decode is
  // not an image we can search.
  let photo: MatchContext['photo'];
  try {
    const { data, info } = await sharp(Buffer.from(await upload.arrayBuffer()))
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 85 })
      .toBuffer({ resolveWithObject: true });
    photo = { data, width: info.width, height: info.height };
  } catch {
    return NextResponse.json({ error: 'unsupported_image' }, { status: 415 });
  }

  try {
    const [detection, index, products] = await Promise.all([
      detectItems(photo.data),
      getSwatchIndex(),
      getPublicProducts(),
      keepUpload(photo.data),
    ]);

    const ctx: MatchContext = {
      photo,
      index,
      catalogue: buildCatalogue(products),
      matchCount: detection.mode === 'multiple' ? MULTI_ITEM_MATCH_COUNT : MATCH_COUNT,
      voyageKey,
    };

    const settled = await Promise.allSettled(detection.items.map((item) => matchItem(item, ctx)));
    const failures = settled.filter((result) => result.status === 'rejected');
    failures.forEach((failure) => console.error('[surface-match] Matching an item failed:', failure.reason));

    // Every item failing means search itself is down, not that nothing matched.
    if (failures.length === settled.length) {
      return NextResponse.json({ error: 'search_failed' }, { status: 502 });
    }

    const body: SurfaceMatchResponse = {
      mode: detection.mode,
      groups: settled.map((result, i) =>
        result.status === 'fulfilled'
          ? result.value
          : { thumbnail: null, detectedCode: detection.items[i].code, matches: [] }
      ),
    };
    return NextResponse.json(body);
  } catch (err) {
    console.error('[surface-match] Error:', err);
    return NextResponse.json({ error: 'search_failed' }, { status: 500 });
  }
}
