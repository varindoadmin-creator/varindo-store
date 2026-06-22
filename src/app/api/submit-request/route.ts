import { NextRequest, NextResponse } from 'next/server';
import { sendRequestNotification } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

const SUPABASE_URL      = process.env.SUPABASE_URL;
const SUPABASE_KEY      = process.env.SUPABASE_SERVICE_ROLE_KEY;

type RequestBody = {
  type: 'catalogue' | 'quote' | 'sample';
  name?: string;
  address?: string;
  phone?: string;
  // Quote: array of { code, qty }
  items?: { code: string; qty: string }[];
  // Sample: array of codes
  samples?: string[];
};

async function insertRow(row: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/requests`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'apikey':        SUPABASE_KEY!,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer':        'return=minimal',
    },
    body: JSON.stringify(row),
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

  const { type, name, address, phone } = body;

  if (!type || !['catalogue', 'quote', 'sample'].includes(type)) {
    return NextResponse.json({ success: false, error: 'Invalid request type.' }, { status: 400 });
  }

  try {
    if (type === 'catalogue') {
      // One row per catalogue request
      await insertRow({
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
      const items = body.items || [];
      if (items.length === 0) {
        return NextResponse.json({ success: false, error: 'No items provided.' }, { status: 400 });
      }

      for (const item of items) {
        await insertRow({
          request_type:  'quote',
          status:        'new',
          customer_name: name || null,
          address:       address || null,
          phone:         phone || null,
          item_code:     item.code || null,
          quantity:      item.qty ? parseFloat(item.qty) : null,
          unit:          'lembar',
          source:        'website',
          raw_data:      { name, address, phone, item },
        });
      }

    } else if (type === 'sample') {
      // One row per sample code
      const samples = (body.samples || []).filter(Boolean);
      if (samples.length === 0) {
        return NextResponse.json({ success: false, error: 'No samples provided.' }, { status: 400 });
      }

      for (const code of samples) {
        await insertRow({
          request_type:  'sample',
          status:        'new',
          customer_name: name || null,
          address:       address || null,
          phone:         phone || null,
          item_code:     code,
          unit:          'pcs',
          source:        'website',
          raw_data:      { name, address, phone, code },
        });
      }
    }

    // Send email notification (non-blocking — don't fail the response if email errors)
    sendRequestNotification({ type, name, phone, address, items: body.items, samples: body.samples })
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
