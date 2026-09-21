import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';


// Sample, Catalogue and Quote requests go to VIABooks (via-corporate), the
// business's own accounting system, instead of the old via-project
// Supabase table — matched by the org id VIABooks uses for CV. Varindo
// Forma Hutama. Price List downloads are unaffected and still go to
// Supabase; nothing else on this site reads from VIABooks.
const VIABOOKS_API_URL = process.env.VIABOOKS_API_URL || 'https://viabooks-601025884976.asia-southeast2.run.app';
const VIABOOKS_ORGANIZATION_ID = process.env.VIABOOKS_ORGANIZATION_ID || 'cmtn75jst0001w12y30bcrr6h';

type RequestBody = {
  type: 'catalogue' | 'sample' | 'quote';
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
  requestType: 'sample' | 'catalogue' | 'quote';
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

  if (!type || !['catalogue', 'sample', 'quote'].includes(type)) {
    return NextResponse.json({ success: false, error: 'Invalid request type.' }, { status: 400 });
  }

  if (!name || !phone || !address) {
    return NextResponse.json(
      { success: false, error: 'Name, phone, and the required address must be provided.' },
      { status: 400 }
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
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('[submit-request] Insert failed:', err);
    return NextResponse.json(
      { success: false, error: 'Could not save request. Please try again.' },
      { status: 500 }
    );
  }
}
