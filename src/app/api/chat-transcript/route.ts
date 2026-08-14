import { NextRequest, NextResponse } from 'next/server';
import { sendChatTranscript } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

const MAX_TRANSCRIPT_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;

export async function POST(req: NextRequest) {
  try {
    const { messages, lang = 'id' } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_TRANSCRIPT_MESSAGES) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const normalized = messages.map((message) => {
      if (!message || typeof message !== 'object') return null;
      const role = message.role === 'assistant' ? 'assistant' : message.role === 'user' ? 'user' : null;
      const content = typeof message.content === 'string' ? message.content.trim() : '';
      if (!role || !content || content.length > MAX_MESSAGE_LENGTH) return null;
      return { role, content };
    });
    if (normalized.some((message) => message === null)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    await sendChatTranscript(normalized as { role: 'user' | 'assistant'; content: string }[], lang === 'en' ? 'en' : 'id');
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[chat-transcript] Failed to send:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
