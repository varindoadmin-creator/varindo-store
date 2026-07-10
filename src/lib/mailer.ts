import nodemailer from 'nodemailer';

const NOTIFY_TO = 'contact@varindo.co.id';

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

type RequestType = 'sample' | 'quote' | 'catalogue' | 'price-list';

interface NotifyParams {
  type: RequestType;
  name?: string;
  phone?: string;
  address?: string;
  items?: { code: string; qty: string }[];
  samples?: string[];
}

const LABEL: Record<RequestType, string> = {
  sample:      'Sample Request',
  quote:       'Quote Request',
  catalogue:   'Catalogue Request',
  'price-list': 'Price List Download',
};

function buildHtml(p: NotifyParams): string {
  const rows = (pairs: [string, string][]) =>
    pairs.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#6b6560;font-size:13px;white-space:nowrap">${k}</td><td style="padding:6px 0;font-size:13px;color:#1a1714">${v}</td></tr>`).join('');

  const itemsHtml = p.type === 'quote' && p.items?.length
    ? `<h3 style="margin:24px 0 8px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6b6560">Items</h3>
       <table style="border-collapse:collapse;width:100%">
         <tr style="background:#f5f3f0"><th style="padding:6px 8px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.1em">Code</th><th style="padding:6px 8px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.1em">Qty</th></tr>
         ${p.items.map(i => `<tr style="border-top:1px solid #e8e4df"><td style="padding:6px 8px;font-size:13px">${i.code}</td><td style="padding:6px 8px;font-size:13px">${i.qty} lembar</td></tr>`).join('')}
       </table>`
    : p.type === 'sample' && p.samples?.length
    ? `<h3 style="margin:24px 0 8px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6b6560">Samples</h3>
       <ul style="margin:0;padding-left:18px">
         ${p.samples.map(s => `<li style="font-size:13px;padding:3px 0">${s}</li>`).join('')}
       </ul>`
    : '';

  return `
<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1714">
  <div style="background:#1a1714;padding:20px 28px">
    <p style="margin:0;color:#a8763e;font-size:11px;letter-spacing:.18em;text-transform:uppercase">Varindo Website</p>
    <h1 style="margin:4px 0 0;color:#fff;font-size:22px;font-weight:300">${LABEL[p.type]}</h1>
  </div>
  <div style="padding:28px;border:1px solid #e8e4df;border-top:none">
    <h3 style="margin:0 0 8px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6b6560">Customer</h3>
    <table style="border-collapse:collapse">
      ${rows([
        ['Name',    p.name    || '—'],
        ['Phone',   p.phone   || '—'],
        ['Address', p.address || '—'],
      ])}
    </table>
    ${itemsHtml}
    <p style="margin:28px 0 0;font-size:11px;color:#a8a49f">Sent from varindo.co.id</p>
  </div>
</div>`;
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
      const text = m.content.replace(/\n/g, '<br>');
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
    <p style="margin:0;padding:16px 20px;font-size:11px;color:#a8a49f;border-top:1px solid #e8e4df">Language: ${lang} · Sent from varindo.co.id</p>
  </div>
</div>`;

  await transporter.sendMail({
    from:    `"Varindo VIA" <${process.env.SMTP_USER}>`,
    to:      NOTIFY_TO,
    subject: `[VIA Transcript] ${userMessages.length} msg — ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`,
    html,
  });
}

export async function sendRequestNotification(params: NotifyParams): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return; // silently skip if SMTP not configured

  await transporter.sendMail({
    from:    `"Varindo Website" <${process.env.SMTP_USER}>`,
    to:      NOTIFY_TO,
    subject: `[${LABEL[params.type]}] ${params.name || 'New request'} — varindo.co.id`,
    html:    buildHtml(params),
  });
}
