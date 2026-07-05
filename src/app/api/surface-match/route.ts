import { NextRequest, NextResponse } from 'next/server';
import { getPublicProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

const VOYAGE_API_URL = 'https://api.voyageai.com/v1/multimodalembeddings';
const VOYAGE_MODEL = 'voyage-multimodal-3.5';
const EMBEDDING_DIMENSION = 1024;
const MATCH_COUNT = 6;

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

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many searches. Please wait a bit before trying again.' },
        { status: 429 }
      );
    }

    const { imageUrl } = await req.json();

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const voyageKey = process.env.VOYAGE_API_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!voyageKey || !supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Visual search not configured' }, { status: 503 });
    }

    const queryEmbedding = await embedImage(imageUrl, voyageKey);

    const matchRes = await fetch(`${supabaseUrl}/rest/v1/rpc/match_products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        query_embedding: queryEmbedding,
        match_count: MATCH_COUNT,
      }),
    });

    if (!matchRes.ok) {
      const err = await matchRes.text();
      console.error('[surface-match] Supabase match error:', err);
      return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }

    const ranked: { product_code: string; similarity: number }[] = await matchRes.json();

    const products = await getPublicProducts();
    const productByCode = new Map(products.map((p) => [p.code.toUpperCase(), p]));

    const matches = ranked
      .map((r) => {
        const product = productByCode.get((r.product_code || '').toUpperCase());
        if (!product) return null;
        return {
          code: product.code,
          name: product.name,
          collection: product.collection,
          category: product.category,
          imageUrl: product.imageUrl,
          score: r.similarity,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ matches });
  } catch (err) {
    console.error('[surface-match] Error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
