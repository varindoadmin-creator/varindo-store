import { createHash, timingSafeEqual } from 'node:crypto';

// Midtrans Snap: the store creates a transaction server-side and sends the
// customer to the payment page Midtrans hosts, so no card or bank detail ever
// passes through this site. Sandbox until MIDTRANS_IS_PRODUCTION=true — the
// keys from the Midtrans dashboard differ between the two, and a sandbox key
// against production (or the reverse) is rejected with 401.
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const SNAP_URL = IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/v1/transactions'
  : 'https://app.sandbox.midtrans.com/snap/v1/transactions';
const API_URL = IS_PRODUCTION ? 'https://api.midtrans.com' : 'https://api.sandbox.midtrans.com';

function serverKey() {
  return process.env.MIDTRANS_SERVER_KEY || '';
}

export function isMidtransConfigured() {
  return Boolean(serverKey());
}

function authHeader() {
  return `Basic ${Buffer.from(`${serverKey()}:`).toString('base64')}`;
}

export type SnapItem = { id: string; name: string; price: number; quantity: number };

export type SnapRequest = {
  orderId: string;
  grossAmount: number;
  items: SnapItem[];
  customer: { name: string; email?: string; phone: string; address: string; city: string; postalCode: string };
  finishUrl: string;
  notificationUrl: string;
};

/** Creates a Snap transaction and returns the hosted payment page to send the customer to. */
export async function createSnapTransaction(req: SnapRequest): Promise<{ token: string; redirectUrl: string }> {
  const address = {
    first_name: req.customer.name.slice(0, 255),
    phone: req.customer.phone,
    address: req.customer.address.slice(0, 200),
    city: req.customer.city.slice(0, 100),
    postal_code: req.customer.postalCode,
    country_code: 'IDN'
  };

  const res = await fetch(SNAP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: authHeader(),
      // Sends this order's payment notifications to this deployment, whatever
      // the dashboard's default notification URL says.
      'X-Override-Notification': req.notificationUrl
    },
    body: JSON.stringify({
      transaction_details: { order_id: req.orderId, gross_amount: req.grossAmount },
      // Midtrans rejects the request unless these add up to gross_amount, and
      // caps an item name at 50 characters.
      item_details: req.items.map((item) => ({ ...item, name: item.name.slice(0, 50) })),
      customer_details: {
        first_name: address.first_name,
        email: req.customer.email || undefined,
        phone: req.customer.phone,
        billing_address: address,
        shipping_address: address
      },
      callbacks: { finish: req.finishUrl },
      expiry: { unit: 'hours', duration: 24 }
    })
  });

  if (!res.ok) {
    throw new Error(`Midtrans Snap ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { token: string; redirect_url: string };
  return { token: data.token, redirectUrl: data.redirect_url };
}

export type MidtransStatus = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  transaction_status: string;
  fraud_status?: string;
  payment_type?: string;
  transaction_id?: string;
};

/** The transaction as Midtrans has it now. Null when Midtrans has no transaction for this order yet. */
export async function getTransactionStatus(orderId: string): Promise<MidtransStatus | null> {
  const res = await fetch(`${API_URL}/v2/${encodeURIComponent(orderId)}/status`, {
    headers: { Accept: 'application/json', Authorization: authHeader() },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(`Midtrans status ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as MidtransStatus;
  // The status API answers 200 with a 404 status_code in the body when the
  // customer opened the payment page but never picked a payment method.
  if (data.status_code === '404') return null;
  return data;
}

/**
 * A notification's signature_key is SHA-512 of order_id + status_code +
 * gross_amount + server key, so only Midtrans (or whoever holds the key) can
 * produce one.
 */
export function isValidNotificationSignature(n: {
  order_id?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
}) {
  if (!serverKey() || !n.order_id || !n.status_code || !n.gross_amount || !n.signature_key) return false;
  const expected = createHash('sha512')
    .update(`${n.order_id}${n.status_code}${n.gross_amount}${serverKey()}`)
    .digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(n.signature_key);
  return a.length === b.length && timingSafeEqual(a, b);
}
