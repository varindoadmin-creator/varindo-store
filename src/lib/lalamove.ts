import { createHmac } from 'node:crypto';

// Lalamove API v3: a quotation prices one trip for one vehicle type and holds
// that price for a few minutes; placing an order with the quotation id books
// the driver. Varindo pays, so the price is shown to staff, never to buyers.
// Sandbox until LALAMOVE_IS_PRODUCTION=true — keys only work against their own
// environment.
const HOST = process.env.LALAMOVE_IS_PRODUCTION === 'true'
  ? 'https://rest.lalamove.com'
  : 'https://rest.sandbox.lalamove.com';
const MARKET = 'ID';
const LANGUAGE = 'id_ID';

export function isLalamoveConfigured() {
  return Boolean(process.env.LALAMOVE_API_KEY && process.env.LALAMOVE_API_SECRET && pickup());
}

/** The warehouse every trip starts from. */
export function pickup() {
  const lat = process.env.LALAMOVE_PICKUP_LAT;
  const lng = process.env.LALAMOVE_PICKUP_LNG;
  const address = process.env.LALAMOVE_PICKUP_ADDRESS;
  const phone = process.env.LALAMOVE_PICKUP_PHONE;
  if (!lat || !lng || !address || !phone) return null;
  return { lat, lng, address, phone, name: process.env.LALAMOVE_PICKUP_NAME || 'Varindo' };
}

async function call<T>(method: 'GET' | 'POST', path: string, data?: unknown): Promise<T> {
  const body = data === undefined ? '' : JSON.stringify({ data });
  const timestamp = Date.now().toString();
  // Signed: timestamp, method, path, a blank line, then the body.
  const signature = createHmac('sha256', process.env.LALAMOVE_API_SECRET || '')
    .update(`${timestamp}\r\n${method}\r\n${path}\r\n\r\n${body}`)
    .digest('hex');

  const res = await fetch(`${HOST}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `hmac ${process.env.LALAMOVE_API_KEY}:${timestamp}:${signature}`,
      Market: MARKET
    },
    body: body || undefined,
    cache: 'no-store'
  });
  const text = await res.text();
  if (!res.ok) throw new LalamoveError(res.status, text);
  return (JSON.parse(text) as { data: T }).data;
}

export class LalamoveError extends Error {
  constructor(public status: number, public body: string) {
    super(`Lalamove ${status}: ${body}`);
  }

  /** Lalamove's own explanation, for showing to staff. */
  get detail() {
    try {
      const parsed = JSON.parse(this.body) as { errors?: { message?: string; id?: string }[] };
      return parsed.errors?.map((e) => e.message || e.id).filter(Boolean).join('; ') || this.message;
    } catch {
      return this.message;
    }
  }
}

export type LalamoveService = { key: string; description: string };

/** Vehicle types Lalamove offers in Indonesia, across its cities, once each. */
export async function getServices(): Promise<LalamoveService[]> {
  const cities = await call<{ services?: { key: string; description?: string }[] }[]>('GET', '/v3/cities');
  const seen = new Map<string, LalamoveService>();
  for (const city of cities) {
    for (const s of city.services || []) {
      if (!seen.has(s.key)) seen.set(s.key, { key: s.key, description: s.description || s.key });
    }
  }
  return Array.from(seen.values());
}

export type Quotation = {
  quotationId: string;
  serviceType: string;
  expiresAt: string;
  priceBreakdown: { total: string; currency: string };
  distance?: { value: string; unit: string };
  stops: { stopId: string; address: string }[];
};

export async function getQuotation(input: {
  serviceType: string;
  dropoff: { lat: number; lng: number; address: string };
}): Promise<Quotation> {
  const from = pickup();
  if (!from) throw new Error('Lalamove pickup is not configured.');
  return call<Quotation>('POST', '/v3/quotations', {
    serviceType: input.serviceType,
    language: LANGUAGE,
    stops: [
      { coordinates: { lat: from.lat, lng: from.lng }, address: from.address },
      { coordinates: { lat: String(input.dropoff.lat), lng: String(input.dropoff.lng) }, address: input.dropoff.address }
    ]
  });
}

/** A quotation made earlier, with its stop ids, which booking needs. */
export async function getQuotationById(quotationId: string): Promise<Quotation> {
  return call<Quotation>('GET', `/v3/quotations/${encodeURIComponent(quotationId)}`);
}

export type LalamoveOrder = {
  orderId: string;
  quotationId: string;
  shareLink: string;
  status: string;
  priceBreakdown: { total: string; currency: string };
};

export async function placeOrder(input: {
  quotation: Quotation;
  recipient: { name: string; phone: string; remarks: string };
  reference: string;
}): Promise<LalamoveOrder> {
  const from = pickup();
  if (!from) throw new Error('Lalamove pickup is not configured.');
  const [senderStop, recipientStop] = input.quotation.stops;
  return call<LalamoveOrder>('POST', '/v3/orders', {
    quotationId: input.quotation.quotationId,
    sender: { stopId: senderStop.stopId, name: from.name, phone: toE164(from.phone) },
    recipients: [{
      stopId: recipientStop.stopId,
      name: input.recipient.name.slice(0, 100),
      phone: toE164(input.recipient.phone),
      remarks: input.recipient.remarks.slice(0, 1000)
    }],
    isRecipientSMSEnabled: true,
    metadata: { varindoOrderId: input.reference }
  });
}

export async function getLalamoveOrder(orderId: string): Promise<LalamoveOrder> {
  return call<LalamoveOrder>('GET', `/v3/orders/${encodeURIComponent(orderId)}`);
}

/** Lalamove wants +62… numbers; buyers type 0812…, 62812… or +62 812-…. */
export function toE164(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('62')) return `+${digits}`;
  if (digits.startsWith('0')) return `+62${digits.slice(1)}`;
  return `+62${digits}`;
}
