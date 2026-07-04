import { NextRequest, NextResponse } from 'next/server';
import { getPublicProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 1024;
const MAX_PRODUCTS_IN_CONTEXT = 800;

function buildProductSummary(products: any[]) {
  return products
    .slice(0, MAX_PRODUCTS_IN_CONTEXT)
    .map((p) => `${p.code} | ${p.name} | ${p.collection || ''} | ${p.category || ''}`)
    .join('\n');
}

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
    }

    const products = await getPublicProducts();
    const productSummary = buildProductSummary(products);

    const systemPrompt = `You are a Lamitak surface-matching assistant. You will be shown a photo of a real-world surface (wall, floor, countertop, furniture, etc). Compare its visual characteristics — dominant colour, pattern type (woodgrain, solid colour, stone/marble, decorative pattern), and texture — against the Lamitak product list below, and pick up to 6 products whose design most closely resembles the photo.

LAMITAK PRODUCT LIST (format: Code | Name | Collection | Category):
${productSummary}

Respond ONLY with a JSON array (no markdown, no backticks, no explanation) of up to 6 best matches, ordered from most to least similar:
[{"code":"...","confidence":0.0}]

If nothing plausibly matches, return [].`;

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'url', url: imageUrl } },
            { type: 'text', text: 'Find the Lamitak products that most closely match this surface.' },
          ],
        }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[surface-match] Anthropic error:', err);
      return NextResponse.json({ error: 'AI service error' }, { status: 500 });
    }

    const data = await response.json();
    const text = (data.content || []).find((b: any) => b.type === 'text')?.text ?? '';

    let picks: { code: string; confidence?: number }[] = [];
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        picks = JSON.parse(jsonMatch[0]);
      } catch {
        picks = [];
      }
    }

    const productByCode = new Map(products.map((p) => [p.code.toUpperCase(), p]));
    const matches = picks
      .map((pick) => {
        const product = productByCode.get((pick.code || '').toUpperCase());
        if (!product) return null;
        return {
          code: product.code,
          name: product.name,
          collection: product.collection,
          category: product.category,
          imageUrl: product.imageUrl,
          score: typeof pick.confidence === 'number' ? pick.confidence : 0.75,
        };
      })
      .filter(Boolean)
      .slice(0, 6);

    return NextResponse.json({ matches });
  } catch (err) {
    console.error('[surface-match] Error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
