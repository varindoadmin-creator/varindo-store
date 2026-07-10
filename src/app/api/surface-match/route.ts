import { NextRequest, NextResponse } from 'next/server';
import { getPublicProducts } from '@/lib/products';
import { getCroppedImageUrl, type PercentBox } from '@/lib/cloudinary';
import { normalizeCode } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const VOYAGE_API_URL = 'https://api.voyageai.com/v1/multimodalembeddings';
const VOYAGE_MODEL = 'voyage-multimodal-3.5';
const EMBEDDING_DIMENSION = 1024;
const MATCH_COUNT = 6;
const MULTI_ITEM_MATCH_COUNT = 4;
const MIN_SIMILARITY = 0.85;
const MAX_ITEMS = 6;

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const DETECT_MODEL = 'claude-sonnet-4-6';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_MAP_CLEANUP_THRESHOLD = 5000;

const requestCounts = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(ip: string): boolean {
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

async function embedImage(imageUrl: string, apiKey: string): Promise<number[]> {
  const response = await fetch(VOYAGE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      inputs: [{ content: [{ type: 'image_url', image_url: imageUrl }] }],
      model: VOYAGE_MODEL,
      output_dimension: EMBEDDING_DIMENSION,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Voyage embedding error: ${err}`);
  }

  const data = await response.json();
  const embedding = data?.data?.[0]?.embedding || data?.embeddings?.[0];
  if (!embedding) throw new Error('No embedding returned from Voyage');
  return embedding;
}

type DetectedItem = { code: string | null; box: PercentBox | null };
type DetectResult = { mode: 'single' | 'multiple'; items: DetectedItem[] };

const DEFAULT_DETECT_RESULT: DetectResult = { mode: 'single', items: [{ code: null, box: null }] };

const DETECT_PROMPT = `You are analyzing a customer-submitted photo for Varindo, a Lamitak HPL laminate dealer.
The photo may show: (a) a single material sample, cut sheet, or surface, or (b) a printed catalogue page / sample book spread containing several distinct swatches.

Notes from real customer photos:
- Catalogue page photos are often taken at an angle, with a hand holding the book open. Ignore hands, fingers, and any marker/highlighter annotations (e.g. a checkmark) drawn on the page — box the swatch material itself, not the hand or annotation.
- A product code may be printed directly on a swatch/sheet in normal orientation, or printed sideways/rotated next to a swatch on a catalogue page — read it in either orientation.
- Lamitak-style codes are a short letter prefix followed by a space and an alphanumeric suffix, e.g. "ART 1009XM", "DXO 5338D", "SCA 1143D". Transcribe exactly as printed, including the space and any ambiguous characters (do not "correct" a possible 0/O or 1/I — copy what is printed).

Task:
1. Decide "mode": "single" if there is one item/surface to identify, or "multiple" only if the photo clearly shows several distinct, separately identifiable catalogue swatches (e.g. a catalogue spread with 2-6 separate sample photos).
2. For each item, check if a product code is printed/visible on or near it. If legible, extract it exactly as printed. If none is visible or legible, use null.
3. If mode is "multiple", for each item give an approximate bounding box as PERCENTAGES of the full image width and height (0-100), covering just that item's swatch/sample: {"xPct":number,"yPct":number,"wPct":number,"hPct":number} where xPct/yPct is the top-left corner. If mode is "single", omit "box" or set it to null.

Respond with ONLY a single JSON object, no markdown fences, no extra text, in this exact shape:
{"mode":"single"|"multiple","items":[{"code":string|null,"box":{"xPct":number,"yPct":number,"wPct":number,"hPct":number}|null}]}`;

function isValidBox(box: unknown): box is PercentBox {
  if (!box || typeof box !== 'object') return false;
  const b = box as Record<string, unknown>;
  return (['xPct', 'yPct', 'wPct', 'hPct'] as const).every(
    (key) => typeof b[key] === 'number' && Number.isFinite(b[key])
  );
}

async function detectItems(imageUrl: string, apiKey: string): Promise<DetectResult> {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: DETECT_MODEL,
      max_tokens: 800,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'url', url: imageUrl } },
            { type: 'text', text: DETECT_PROMPT },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic detect error: ${await response.text()}`);
  }

  const data = await response.json();
  const text: string = data?.content?.[0]?.text ?? '';
  const jsonText = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const parsed = JSON.parse(jsonText);

  if (parsed?.mode !== 'multiple') {
    const firstCode = parsed?.items?.[0]?.code;
    return { mode: 'single', items: [{ code: typeof firstCode === 'string' ? firstCode : null, box: null }] };
  }

  const items: DetectedItem[] = (Array.isArray(parsed.items) ? parsed.items : [])
    .slice(0, MAX_ITEMS)
    .map((item: unknown) => {
      const record = (item ?? {}) as Record<string, unknown>;
      return {
        code: typeof record.code === 'string' ? record.code : null,
        box: isValidBox(record.box) ? record.box : null,
      };
    });

  if (items.length === 0) return DEFAULT_DETECT_RESULT;
  return { mode: 'multiple', items };
}

type Match = {
  code: string;
  name: string;
  collection?: string;
  category?: string;
  imageUrl?: string;
  score: number;
  matchType: 'code' | 'visual';
};

type ResultGroup = {
  cropImageUrl: string | null;
  detectedCode: string | null;
  matches: Match[];
};

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many searches. Please wait a bit before trying again.' },
        { status: 429 }
      );
    }

    const { imageUrl, width, height } = await req.json();

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const voyageKey = process.env.VOYAGE_API_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (!voyageKey || !supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Visual search not configured' }, { status: 503 });
    }

    let detection: DetectResult = DEFAULT_DETECT_RESULT;
    if (anthropicKey) {
      try {
        detection = await detectItems(imageUrl, anthropicKey);
      } catch (err) {
        console.error('[surface-match] Item detection failed, falling back to visual-only search:', err);
        detection = DEFAULT_DETECT_RESULT;
      }
    }

    const hasDimensions = typeof width === 'number' && typeof height === 'number' && width > 0 && height > 0;
    const matchCount = detection.items.length > 1 ? MULTI_ITEM_MATCH_COUNT : MATCH_COUNT;

    const products = await getPublicProducts();
    const productByCode = new Map(products.map((p) => [normalizeCode(p.code), p]));

    const groups = await Promise.all(
      detection.items.map(async (item): Promise<ResultGroup> => {
        const cropImageUrl =
          item.box && hasDimensions ? getCroppedImageUrl(imageUrl, item.box, width, height) : null;

        const resolvedByCode = item.code ? productByCode.get(normalizeCode(item.code)) : undefined;

        if (resolvedByCode) {
          return {
            cropImageUrl,
            detectedCode: item.code,
            matches: [
              {
                code: resolvedByCode.code,
                name: resolvedByCode.name,
                collection: resolvedByCode.collection,
                category: resolvedByCode.category,
                imageUrl: resolvedByCode.imageUrl,
                score: 1,
                matchType: 'code',
              },
            ],
          };
        }

        const searchImageUrl = cropImageUrl || imageUrl;

        try {
          const queryEmbedding = await embedImage(searchImageUrl, voyageKey);

          const matchRes = await fetch(`${supabaseUrl}/rest/v1/rpc/match_products`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({ query_embedding: queryEmbedding, match_count: matchCount }),
          });

          if (!matchRes.ok) {
            throw new Error(await matchRes.text());
          }

          const ranked: { product_code: string; similarity: number }[] = await matchRes.json();

          const matches: Match[] = [];
          for (const r of ranked) {
            if (r.similarity < MIN_SIMILARITY) continue;
            const product = productByCode.get(normalizeCode(r.product_code || ''));
            if (!product) continue;
            matches.push({
              code: product.code,
              name: product.name,
              collection: product.collection,
              category: product.category,
              imageUrl: product.imageUrl,
              score: r.similarity,
              matchType: 'visual',
            });
          }

          return { cropImageUrl, detectedCode: item.code, matches };
        } catch (err) {
          console.error('[surface-match] Visual search failed for an item:', err);
          return { cropImageUrl, detectedCode: item.code, matches: [] };
        }
      })
    );

    return NextResponse.json({ mode: detection.mode, groups });
  } catch (err) {
    console.error('[surface-match] Error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
