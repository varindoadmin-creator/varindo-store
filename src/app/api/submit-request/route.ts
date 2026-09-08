import { NextRequest, NextResponse } from 'next/server';
import { sendRequestNotification } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

const SUPABASE_URL      = process.env.SUPABASE_URL;
const SUPABASE_KEY      = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Sample and Catalogue requests now go to VIABooks (via-corporate), the
// business's own accounting system, instead of the old via-project
// Supabase table — matched by the org id VIABooks uses for CV. Varindo
// Forma Hutama. Price List downloads are unaffected and still go to
// Supabase; nothing else on this site reads from VIABooks.
const VIABOOKS_API_URL = process.env.VIABOOKS_API_URL || 'https://viabooks-601025884976.asia-southeast2.run.app';
const VIABOOKS_ORGANIZATION_ID = process.env.VIABOOKS_ORGANIZATION_ID || 'cmts823pu000jt761mx48ltsq';

type RequestBody = {
  type: 'catalogue' | 'sample' | 'price-list';
  name?: string;
  address?: string;
  phone?: string;
  // Sample: array of codes
  samples?: string[];
};

const MAX_TEXT_LENGTH = 500;
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

async function submitToViabooks(payload: {
  requestType: 'sample' | 'catalogue';
  customerName?: string;
  phone?: string;
  address?: string;
  itemCode?: string;
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

  if (!type || !['catalogue', 'sample', 'price-list'].includes(type)) {
    return NextResponse.json({ success: false, error: 'Invalid request type.' }, { status: 400 });
  }

  if (!name || !phone || (type !== 'price-list' && !address)) {
    return NextResponse.json(
      { success: false, error: 'Name, phone, and the required address must be provided.' },
      { status: 400 }
    );
  }

  if (type === 'price-list' && (!SUPABASE_URL || !SUPABASE_KEY)) {
    console.error('[submit-request] Supabase env vars not set');
    return NextResponse.json(
      { success: false, error: 'Submission service is not configured.' },
      { status: 503 }
    );
  }

  let notificationSamples: string[] | undefined;

  try {
    if (type === 'catalogue') {
      await submitToViabooks({ requestType: 'catalogue', customerName: name, phone, address });

    } else if (type === 'price-list') {
      // One row per price list download request — unaffected by the VIABooks move.
      await insertRows({
        request_type:  'price-list',
        status:        'new',
        customer_name: name || null,
        phone:         phone || null,
        source:        'website',
        raw_data:      { name, phone },
      });

    } else if (type === 'sample') {
      const samples = Array.isArray(body.samples)
        ? body.samples.slice(0, MAX_SAMPLE_ITEMS).map((code) => cleanText(code, 80)).filter(Boolean)
        : [];
      if (samples.length === 0 || (body.samples?.length || 0) > MAX_SAMPLE_ITEMS) {
        return NextResponse.json({ success: false, error: 'Invalid samples.' }, { status: 400 });
      }
      notificationSamples = samples;

      // One request per sample code, matching VIABooks' one-row-per-request
      // contract — run together so one failure doesn't silently drop the rest.
      await Promise.all(
        samples.map((code) => submitToViabooks({ requestType: 'sample', customerName: name, phone, address, itemCode: code }))
      );
    }

    // Send email notification (non-blocking — don't fail the response if email errors)
    sendRequestNotification({ type, name, phone, address, samples: notificationSamples })
      .catch((e) => console.error('[submit-request] Email notification failed:', e));

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('[submit-request] Insert failed:', err);
    return NextResponse.json(
      { success: false, error: 'Could not save request. Please try again.' },
      { status: 500 }
    );
  }
}
