import { NextRequest, NextResponse } from 'next/server';

// ── Proxy between the browser form and Google Apps Script ────────
//
// Why a server-side proxy?
// Google Apps Script Web App URLs respond with a redirect,
// which browsers block from fetch() due to CORS. This route
// forwards the POST server-side, avoiding the CORS issue entirely.
//
// Set in your .env:
//   GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec

const WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

export async function POST(req: NextRequest) {
  if (!WEBHOOK_URL) {
    console.error('[submit-request] GOOGLE_SHEETS_WEBHOOK_URL is not set');
    return NextResponse.json(
      { success: false, error: 'Submission service is not configured.' },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body.' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      // Apps Script redirects — follow them
      redirect: 'follow',
    });

    const text = await response.text();

    // Apps Script returns JSON — parse it
    let result: { success: boolean; error?: string };
    try {
      result = JSON.parse(text);
    } catch {
      // Apps Script returned something unexpected
      console.error('[submit-request] Unexpected Apps Script response:', text);
      result = { success: false, error: 'Unexpected response from submission service.' };
    }

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('[submit-request] Fetch to Apps Script failed:', err);
    return NextResponse.json(
      { success: false, error: 'Could not reach submission service. Please try again.' },
      { status: 500 }
    );
  }
}
