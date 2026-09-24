import { NextResponse } from 'next/server';
import { getSuggestionsForMissingSlug } from '@/lib/products';

// Suggestions for the not-found page, for a product address that no longer
// resolves (see getSuggestionsForMissingSlug). The not-found boundary can't
// see the URL on the server, so it asks from the browser.
export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get('slug')?.slice(0, 200) || '';
  const products = slug ? await getSuggestionsForMissingSlug(slug) : [];
  return NextResponse.json({ products }, { headers: { 'Cache-Control': 'public, max-age=600' } });
}
