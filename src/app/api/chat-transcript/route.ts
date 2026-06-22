import { NextRequest, NextResponse } from 'next/server';
import { sendChatTranscript } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { messages, lang = 'id' } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    await sendChatTranscript(messages, lang);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[chat-transcript] Failed to send:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
