import { NextRequest, NextResponse } from 'next/server';
import { PRICE_LIST_COOKIE, PRICE_LIST_TTL_MS, mintPriceListToken } from '@/lib/priceListToken';

export const dynamic = 'force-dynamic';


// Every request form on the site — Sample, Catalogue, Quote and Price List —
// goes to VIABooks (via-corporate), the business's own accounting system,
// instead of the old via-project Supabase table, matched by the org id
// VIABooks uses for CV. Varindo Forma Hutama.
const VIABOOKS_API_URL = process.env.VIABOOKS_API_URL || 'https://viabooks-601025884976.asia-southeast2.run.app';
const VIABOOKS_ORGANIZATION_ID = process.env.VIABOOKS_ORGANIZATION_ID || 'cmtn75jst0001w12y30bcrr6h';

type RequestBody = {
  type: 'catalogue' | 'sample' | 'quote' | 'price-list';
  name?: string;
  address?: string;
  phone?: string;
  // Sample: array of codes
  samples?: string[];
  // Quote: array of { code, qty }
  items?: { code: string; qty: string }[];
};

const MAX_TEXT_LENGTH = 500;
const MAX_SAMPLE_ITEMS = 5;
const MAX_QUOTE_ITEMS = 10;

function cleanText(value: unknown, maxLength = MAX_TEXT_LENGTH) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

async function submitToViabooks(payload: {
  requestType: 'sample' | 'catalogue' | 'quote' | 'price-list';
  customerName?: string;
  phone?: string;
  address?: string;
  itemCode?: string;
  // Quote lines only — VIABooks rejects a quantity on the other two types.
  quantity?: number;
}) {
  const res = await fetch(`${VIABOOKS_API_URL}/api/public/requests/${VIABOOKS_ORGANIZATION_ID}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`VIABooks error ${res.status}: ${err}`);
  }
}

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const type = body.type;
  const name = cleanText(body.name, 120);
  const address = cleanText(body.address);
  const phone = cleanText(body.phone, 40);

  if (!type || !['catalogue', 'sample', 'quote', 'price-list'].includes(type)) {
    return NextResponse.json({ success: false, error: 'Invalid request type.' }, { status: 400 });
  }

  if (!name || !phone || !address) {
    return NextResponse.json(
      { success: false, error: 'Name, phone, and the required address must be provided.' },
      { status: 400 }
    );
  }

  // The price list is given in exchange for these details, so the token that
  // opens /api/price-list is minted here and nowhere else. Checked before the
  // request is filed rather than after: with no secret configured the download
  // cannot be delivered whatever happens next, and a request recorded for a
  // price list the customer never received is worse than an honest failure.
  const priceListToken = type === 'price-list' ? mintPriceListToken() : null;
  if (type === 'price-list' && !priceListToken) {
    console.error('[submit-request] PRICE_LIST_TOKEN_SECRET is not set — the price list cannot be released.');
    return NextResponse.json(
      { success: false, error: 'The price list is temporarily unavailable. Please contact us on WhatsApp.' },
      { status: 500 }
    );
  }

  try {
    if (type === 'catalogue') {
      await submitToViabooks({ requestType: 'catalogue', customerName: name, phone, address });

    } else if (type === 'sample') {
      const samples = Array.isArray(body.samples)
        ? body.samples.slice(0, MAX_SAMPLE_ITEMS).map((code) => cleanText(code, 80)).filter(Boolean)
        : [];
      if (samples.length === 0 || (body.samples?.length || 0) > MAX_SAMPLE_ITEMS) {
        return NextResponse.json({ success: false, error: 'Invalid samples.' }, { status: 400 });
      }

      // One request per sample code, matching VIABooks' one-row-per-request
      // contract — run together so one failure doesn't silently drop the rest.
      await Promise.all(
        samples.map((code) => submitToViabooks({ requestType: 'sample', customerName: name, phone, address, itemCode: code }))
      );

    } else if (type === 'quote') {
      // A quote line is a code and how many of it to price. The quantity is
      // the question being asked, so a line without a usable one is rejected
      // rather than sent as a bare code VIABooks cannot quote against.
      const items = Array.isArray(body.items)
        ? body.items.slice(0, MAX_QUOTE_ITEMS).map((item) => ({
            code: cleanText(item?.code, 80),
            qty: Number(cleanText(item?.qty, 20)),
          }))
        : [];
      const invalid = items.some(
        (item) => !item.code || !Number.isInteger(item.qty) || item.qty <= 0
      );
      if (items.length === 0 || invalid || (body.items?.length || 0) > MAX_QUOTE_ITEMS) {
        return NextResponse.json({ success: false, error: 'Invalid quote items.' }, { status: 400 });
      }

      // One request per product line, as samples are — VIABooks groups the
      // lines of one submission back into a single request on arrival.
      await Promise.all(
        items.map((item) =>
          submitToViabooks({ requestType: 'quote', customerName: name, phone, address, itemCode: item.code, quantity: item.qty })
        )
      );

    } else if (type === 'price-list') {
      // One row, like a catalogue — there is nothing to itemise. What the
      // customer gets back is the download, not a promise to be contacted.
      await submitToViabooks({ requestType: 'price-list', customerName: name, phone, address });
    }

    const res = NextResponse.json({ success: true });

    if (priceListToken) {
      // httpOnly, so the token is not something a page can read out and pass
      // around, and the download page and /api/price-list both simply find it
      // on the request. lax rather than strict: the customer arrives at the
      // download page by a client navigation, but a browser that treats the
      // form post as a fresh top-level visit still has to bring it along.
      res.cookies.set({
        name:     PRICE_LIST_COOKIE,
        value:    priceListToken,
        httpOnly: true,
        sameSite: 'lax',
        secure:   process.env.NODE_ENV === 'production',
        path:     '/',
        maxAge:   Math.floor(PRICE_LIST_TTL_MS / 1000),
      });
    }

    return res;

  } catch (err) {
    console.error('[submit-request] Insert failed:', err);
    return NextResponse.json(
      { success: false, error: 'Could not save request. Please try again.' },
      { status: 500 }
    );
  }
}
