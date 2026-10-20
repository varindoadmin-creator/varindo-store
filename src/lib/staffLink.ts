import { createHmac, timingSafeEqual } from 'node:crypto';

// The staff page for an order is reached from the paid-order email, so the
// link carries its own key: an HMAC of the order id. Only someone holding the
// email (or the secret) can open it, nothing has to be stored, and any Cloud
// Run instance can check it. As with the price list, there is no fallback
// secret — an unconfigured deployment opens nothing.
function secret(): string | null {
  const value = process.env.STAFF_LINK_SECRET;
  return value && value.length >= 16 ? value : null;
}

function sign(orderId: string, key: string) {
  return createHmac('sha256', key).update(`staff-order:${orderId}`).digest('base64url');
}

/** The staff page link for an order, or null when no secret is configured. */
export function staffOrderUrl(orderId: string): string | null {
  const key = secret();
  const origin = process.env.STORE_URL || 'https://store.varindo.co.id';
  return key ? `${origin}/staff/orders/${orderId}?key=${sign(orderId, key)}` : null;
}

export function verifyStaffKey(orderId: string, given: string | null | undefined): boolean {
  const key = secret();
  if (!key || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(sign(orderId, key));
  return a.length === b.length && timingSafeEqual(a, b);
}
