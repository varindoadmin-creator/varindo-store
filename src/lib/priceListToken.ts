import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

// The gate on the price list PDF.
//
// The file is not in public/ — it is committed under private/, where nothing
// serves it — so the only way to it is /api/price-list, and the only way past
// that is a token this module minted. Submitting the form is what mints one:
// the price list is given in exchange for knowing who asked for it, and a URL
// that hands it over without the form would quietly undo that.
//
// The token is signed rather than stored. It carries its own expiry and a
// random nonce, and the signature is what makes it unforgeable, so no table
// or cache has to be kept in step and any instance can verify what any other
// instance minted — which matters on Cloud Run, where the request that mints
// and the request that downloads need not reach the same container.
export const PRICE_LIST_COOKIE = 'price_list_access';

// Long enough to download the thing, including a phone that has wandered off
// mid-form; short enough that the token is not a standing pass. Someone who
// comes back tomorrow fills the form in again, which is the point of it.
export const PRICE_LIST_TTL_MS = 60 * 60 * 1000;

// No fallback secret. A default here would be a default everywhere, and a gate
// whose key is in the repository is not a gate — so an unconfigured deployment
// refuses to mint and refuses to verify, loudly, rather than opening.
function signingKey(): string | null {
  const value = process.env.PRICE_LIST_TOKEN_SECRET;
  return value && value.length >= 16 ? value : null;
}

export function priceListGateConfigured(): boolean {
  return signingKey() !== null;
}

function sign(payload: string, key: string): string {
  return createHmac('sha256', key).update(payload).digest('base64url');
}

/** A fresh token, or null when no secret is configured. */
export function mintPriceListToken(): string | null {
  const key = signingKey();
  if (!key) return null;
  const payload = `${Date.now() + PRICE_LIST_TTL_MS}.${randomBytes(9).toString('base64url')}`;
  return `${payload}.${sign(payload, key)}`;
}

export function verifyPriceListToken(token: string | undefined | null): boolean {
  const key = signingKey();
  if (!key || !token) return false;

  const cut = token.lastIndexOf('.');
  if (cut < 1) return false;
  const payload = token.slice(0, cut);

  // Compared at constant time, and only then read: an expiry that has not been
  // shown to be ours is not a number worth trusting.
  const given = Buffer.from(token.slice(cut + 1));
  const expected = Buffer.from(sign(payload, key));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false;

  const expiresAt = Number(payload.slice(0, payload.indexOf('.')));
  return Number.isFinite(expiresAt) && Date.now() < expiresAt;
}
