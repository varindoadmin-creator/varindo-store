import { NextRequest, NextResponse } from 'next/server';
import { autocomplete, isPlacesConfigured } from '@/lib/googlePlaces';

export const dynamic = 'force-dynamic';

// Address suggestions while the buyer types at checkout. Each call is billed
// by Google, so inputs that cannot be an address are answered here for free.
export async function GET(req: NextRequest) {
  if (!isPlacesConfigured()) return NextResponse.json({ suggestions: [] }, { status: 503 });
  const input = (req.nextUrl.searchParams.get('q') || '').trim().slice(0, 120);
  const session = (req.nextUrl.searchParams.get('session') || '').slice(0, 64);
  if (input.length < 3 || !/^[\w-]{8,64}$/.test(session)) return NextResponse.json({ suggestions: [] });
  try {
    return NextResponse.json({ suggestions: await autocomplete(input, session) });
  } catch (error) {
    console.error('[places] autocomplete failed', error);
    return NextResponse.json({ suggestions: [] }, { status: 502 });
  }
}
