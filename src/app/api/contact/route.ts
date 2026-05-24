import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ContactPayload = {
  name?: string;
  phone?: string;
  email?: string;
};

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ContactPayload;
    const name = payload.name?.trim() || '';
    const phone = payload.phone?.trim() || '';
    const email = payload.email?.trim() || '';

    if (!name || !phone || !email) {
      return NextResponse.json({ success: false, message: 'Please fill in your name, phone, and email.' }, { status: 400 });
    }

    const smtpHost = requiredEnv('SMTP_HOST');
    const smtpPort = Number(process.env.SMTP_PORT || '465');
    const smtpUser = requiredEnv('SMTP_USER');
    const smtpPass = requiredEnv('SMTP_PASS');
    const to = process.env.CONTACT_FORM_TO?.trim() || 'contact@varindo.co.id';
    const from = process.env.SMTP_FROM?.trim() || smtpUser;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const subject = `Varindo Website Enquiry - ${name}`;
    const text = [
      'New enquiry from the Varindo website.',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`
    ].join('\n');

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1c1917;">
        <h2 style="margin: 0 0 16px;">New enquiry from the Varindo website</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      </div>
    `;

    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject,
      text,
      html
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form submission failed:', error);
    return NextResponse.json(
      { success: false, message: 'Sorry, we could not submit your message right now. Please contact us by WhatsApp or email.' },
      { status: 500 }
    );
  }
}
