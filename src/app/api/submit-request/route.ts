import { NextRequest, NextResponse } from 'next/server';
import { sendRequestNotification } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

const SUPABASE_URL      = process.env.SUPABASE_URL;
const SUPABASE_KEY      = process.env.SUPABASE_SERVICE_ROLE_KEY;

type RequestBody = {
  type: 'catalogue' | 'quote' | 'sample' | 'price-list';
  name?: string;
  address?: string;
  phone?: string;
  // Quote: array of { code, qty }
  items?: { code: string; qty: string }[];
  // Sample: array of codes
  samples?: string[];
};

const MAX_TEXT_LENGTH = 500;
const MAX_QUOTE_ITEMS = 10;
const MAX_SAMPLE_ITEMS = 5;

function cleanText(value: unknown, maxLength = MAX_TEXT_LENGTH) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

async function insertRows(rows: Record<string, unknown> | Record<string, unknown>[]) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/requests`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'apikey':        SUPABASE_KEY!,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer':        'return=minimal',
    },
    body: JSON.stringify(rows),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase error ${res.status}: ${err}`);
  }
}

export async function POST(req: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('[submit-request] Supabase env vars not set');
    return NextResponse.json(
      { success: false, error: 'Submission service is not configured.' },
      { status: 503 }
    );
  }

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

  if (!type || !['catalogue', 'quote', 'sample', 'price-list'].includes(type)) {
    return NextResponse.json({ success: false, error: 'Invalid request type.' }, { status: 400 });
  }

  if (!name || !phone || (type !== 'price-list' && !address)) {
    return NextResponse.json(
      { success: false, error: 'Name, phone, and the required address must be provided.' },
      { status: 400 }
    );
  }

  let notificationItems: { code: string; qty: string }[] | undefined;
  let notificationSamples: string[] | undefined;

  try {
    if (type === 'catalogue') {
      // One row per catalogue request
      await insertRows({
        request_type:  'catalogue',
        status:        'new',
        customer_name: name || null,
        address:       address || null,
        phone:         phone || null,
        source:        'website',
        raw_data:      { name, address, phone },
      });

    } else if (type === 'quote') {
      // One row per product item
      const items = Array.isArray(body.items)
        ? body.items.slice(0, MAX_QUOTE_ITEMS).map((item) => ({
            code: cleanText(item?.code, 80),
            qty: cleanText(item?.qty, 20),
          }))
        : [];
      const invalidItem = items.some((item) => {
        const quantity = Number(item.qty);
        return !item.code || !Number.isFinite(quantity) || quantity <= 0;
      });
      if (items.length === 0 || invalidItem || (body.items?.length || 0) > MAX_QUOTE_ITEMS) {
        return NextResponse.json({ success: false, error: 'Invalid quote items.' }, { status: 400 });
      }
      notificationItems = items;

      // Insert the whole request in one PostgREST statement so a network/database
      // failure cannot leave only some quote lines persisted.
      await insertRows(items.map((item) => ({
          request_type:  'quote',
          status:        'new',
          customer_name: name || null,
          address:       address || null,
          phone:         phone || null,
          item_code:     item.code || null,
          quantity:      Number(item.qty),
          unit:          'lembar',
          source:        'website',
          raw_data:      { name, address, phone, item },
        })));

    } else if (type === 'price-list') {
      // One row per price list download request
      await insertRows({
        request_type:  'price-list',
        status:        'new',
        customer_name: name || null,
        phone:         phone || null,
        source:        'website',
        raw_data:      { name, phone },
      });

    } else if (type === 'sample') {
      // One row per sample code
      const samples = Array.isArray(body.samples)
        ? body.samples.slice(0, MAX_SAMPLE_ITEMS).map((code) => cleanText(code, 80)).filter(Boolean)
        : [];
      if (samples.length === 0 || (body.samples?.length || 0) > MAX_SAMPLE_ITEMS) {
        return NextResponse.json({ success: false, error: 'Invalid samples.' }, { status: 400 });
      }
      notificationSamples = samples;

      // As above, keep a multi-sample request atomic.
      await insertRows(samples.map((code) => ({
          request_type:  'sample',
          status:        'new',
          customer_name: name || null,
          address:       address || null,
          phone:         phone || null,
          item_code:     code,
          unit:          'pcs',
          source:        'website',
          raw_data:      { name, address, phone, code },
        })));
    }

    // Send email notification (non-blocking — don't fail the response if email errors)
    sendRequestNotification({ type, name, phone, address, items: notificationItems, samples: notificationSamples })
      .catch((e) => console.error('[submit-request] Email notification failed:', e));

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('[submit-request] Supabase insert failed:', err);
    return NextResponse.json(
      { success: false, error: 'Could not save request. Please try again.' },
      { status: 500 }
    );
  }
}
