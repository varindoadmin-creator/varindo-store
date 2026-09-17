import nodemailer from 'nodemailer';

const NOTIFY_TO = 'contact@varindo.co.id';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
}

/**
 * Rule for whether a chat is worth emailing to the admin inbox: the visitor must have typed
 * something with actual substance. Filters out test/gibberish input (e.g. "Aa", "asdf", "😊")
 * so admins aren't notified about chats nobody needs to follow up on.
 */
const MIN_MEANINGFUL_CHARS = 4;

function isMeaningfulVisitorText(text: string): boolean {
  const stripped = text.trim();
  if (stripped.length < MIN_MEANINGFUL_CHARS) return false;
  if (!/[a-zA-Z]/.test(stripped)) return false; // pure emoji/punctuation/digits, e.g. "😊", "???"

  const lettersOnly = stripped.toLowerCase().replace(/[^a-z]/g, '');
  const uniqueLetters = new Set(lettersOnly).size;
  if (lettersOnly.length >= 3 && uniqueLetters <= 2) return false; // keyboard mash, e.g. "aaaa", "kkkkk"

  return true;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendChatTranscript(messages: ChatMessage[], lang: string): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  const userMessages = messages.filter(m => m.role === 'user');
  if (userMessages.length === 0) return;

  const combinedVisitorText = userMessages.map(m => m.content).join(' ');
  if (!isMeaningfulVisitorText(combinedVisitorText)) return;

  const lines = messages
    .filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0) // skip greeting
    .map(m => {
      const who = m.role === 'user' ? '👤 Visitor' : '🤖 VIA';
      const text = escapeHtml(m.content).replace(/\n/g, '<br>');
      return `<tr style="border-top:1px solid #e8e4df;vertical-align:top">
        <td style="padding:10px 12px;width:80px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#6b6560;white-space:nowrap">${who}</td>
        <td style="padding:10px 12px;font-size:13px;color:#1a1714;line-height:1.6">${text}</td>
      </tr>`;
    })
    .join('');

  const html = `
<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:620px;margin:0 auto;color:#1a1714">
  <div style="background:#1a1714;padding:20px 28px">
    <p style="margin:0;color:#a8763e;font-size:11px;letter-spacing:.18em;text-transform:uppercase">Varindo VIA — Chat Transcript</p>
    <h1 style="margin:4px 0 0;color:#fff;font-size:22px;font-weight:300">${userMessages.length} message${userMessages.length > 1 ? 's' : ''} from visitor</h1>
  </div>
  <div style="border:1px solid #e8e4df;border-top:none">
    <table style="border-collapse:collapse;width:100%">${lines}</table>
    <p style="margin:0;padding:16px 20px;font-size:11px;color:#a8a49f;border-top:1px solid #e8e4df">Language: ${escapeHtml(lang)} · Sent from varindo.co.id</p>
  </div>
</div>`;

  await transporter.sendMail({
    from:    `"Varindo VIA" <${process.env.SMTP_USER}>`,
    to:      NOTIFY_TO,
    subject: `[VIA Transcript] ${userMessages.length} msg — ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`,
    html,
  });
}
