import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { PRICE_LIST_COOKIE, verifyPriceListToken } from '@/lib/priceListToken';

export const dynamic = 'force-dynamic';

// The only route that serves the price list. The PDF sits in private/, which
// nothing else reads and Next does not serve, so this check is not one gate of
// several — it is the gate.
//
// private/ is outside the traced graph of a standalone build (nothing imports
// a PDF), so next.config.mjs names it in outputFileTracingIncludes for this
// route. Without that the file is simply absent from the container and every
// download 500s while local development looks perfect.
const PDF_PATH = path.join(process.cwd(), 'private', 'price-list', 'Lamitak-PL-2026.pdf');

// What the customer's Downloads folder ends up calling it. Undated on purpose:
// the file inside states its own effective date, and a year in the filename is
// the part that goes stale first.
const DOWNLOAD_NAME = 'Daftar-Harga-Lamitak-Varindo.pdf';

export async function GET() {
  const token = (await cookies()).get(PRICE_LIST_COOKIE)?.value;
  if (!verifyPriceListToken(token)) {
    return NextResponse.json(
      { error: 'Request the price list first.' },
      { status: 403, headers: { 'Cache-Control': 'private, no-store' } }
    );
  }

  let pdf: Buffer;
  try {
    pdf = await readFile(PDF_PATH);
  } catch (err) {
    console.error('[price-list] Could not read the price list PDF:', err);
    return NextResponse.json(
      { error: 'The price list is temporarily unavailable.' },
      { status: 500, headers: { 'Cache-Control': 'private, no-store' } }
    );
  }

  // Copied into a plain Uint8Array: a web Response does not take a Node
  // Buffer, and a Buffer's own `.buffer` is typed as possibly shared and so is
  // not a body either. Two hundred kilobytes copied per download is nothing
  // against the clarity of not casting the types into agreement.
  const body = Uint8Array.from(pdf);

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': String(pdf.length),
      'Content-Disposition': `attachment; filename="${DOWNLOAD_NAME}"`,
      // Never shared and never cached by anything in between: the response is
      // only correct for the one browser holding the token.
      'Cache-Control': 'private, no-store',
    },
  });
}
