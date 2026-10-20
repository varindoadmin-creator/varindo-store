import { NextRequest, NextResponse } from 'next/server';
import { isPlacesConfigured, placeDetails } from '@/lib/googlePlaces';

export const dynamic = 'force-dynamic';

// The chosen suggestion's map position and address parts, which checkout uses
// to fill in city, province and postal code.
export async function GET(req: NextRequest) {
  if (!isPlacesConfigured()) return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  const id = req.nextUrl.searchParams.get('id') || '';
  const session = req.nextUrl.searchParams.get('session') || '';
  if (!/^[\w-]{10,300}$/.test(id) || !/^[\w-]{8,64}$/.test(session)) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  try {
    return NextResponse.json(await placeDetails(id, session));
  } catch (error) {
    console.error('[places] details failed', error);
    return NextResponse.json({ error: 'failed' }, { status: 502 });
  }
}
