import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/products';
import { createSnapTransaction, isMidtransConfigured } from '@/lib/midtrans';
import { newOrderId, saveOrder, type Order, type OrderLine } from '@/lib/orders';
import { isShippingProvince } from '@/lib/shipping';

export const dynamic = 'force-dynamic';

const MAX_LINES = 30;
const MAX_QTY = 500;

type Body = {
  items?: { slug?: unknown; quantity?: unknown }[];
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  address?: unknown;
  city?: unknown;
  province?: unknown;
  postalCode?: unknown;
  notes?: unknown;
  location?: { lat?: unknown; lng?: unknown; placeId?: unknown; formattedAddress?: unknown };
};

function clean(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

// Only a position inside Indonesia's bounding box is kept; anything else is
// dropped rather than refused, since delivery works without it.
function cleanLocation(raw: Body['location']) {
  const lat = Number(raw?.lat);
  const lng = Number(raw?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -11.5 || lat > 6.5 || lng < 94 || lng > 141.5) return undefined;
  return {
    lat,
    lng,
    placeId: clean(raw?.placeId, 300) || undefined,
    formattedAddress: clean(raw?.formattedAddress, 300) || undefined
  };
}

function bad(error: string) {
  return NextResponse.json({ success: false, error }, { status: 400 });
}

// Creates the order and its Midtrans transaction, and answers with the
// payment page to send the customer to. The cart only says which products and
// how many: every price is looked up again here, so what the customer pays is
// the catalogue's price whatever their browser sent.
export async function POST(req: NextRequest) {
  if (!isMidtransConfigured()) {
    console.error('[orders] MIDTRANS_SERVER_KEY is not set — checkout is unavailable.');
    return NextResponse.json({ success: false, error: 'checkout-unavailable' }, { status: 503 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return bad('Invalid request body.');
  }

  const customer = {
    name: clean(body.name, 120),
    phone: clean(body.phone, 40),
    email: clean(body.email, 120) || undefined,
    address: clean(body.address, 500),
    city: clean(body.city, 100),
    province: clean(body.province, 60),
    postalCode: clean(body.postalCode, 10),
    notes: clean(body.notes, 500) || undefined,
    location: cleanLocation(body.location)
  };
  if (!customer.name || !customer.phone || !customer.address || !customer.city || !customer.postalCode) {
    return bad('Missing customer details.');
  }
  if (!/^\d{5}$/.test(customer.postalCode)) return bad('Invalid postal code.');
  if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) return bad('Invalid email.');
  if (!isShippingProvince(customer.province)) return bad('outside-shipping-area');

  const requested = Array.isArray(body.items) ? body.items : [];
  if (requested.length === 0 || requested.length > MAX_LINES) return bad('Invalid cart.');

  const lines: OrderLine[] = [];
  for (const item of requested) {
    const slug = clean(item?.slug, 200);
    const quantity = Number(item?.quantity);
    if (!slug || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY) return bad('Invalid cart.');
    if (lines.some((line) => line.slug === slug)) return bad('Invalid cart.');
    const product = await getProductBySlug(slug);
    if (!product || typeof product.price !== 'number' || product.price <= 0) {
      return bad('product-unavailable');
    }
    lines.push({
      slug,
      code: product.code,
      name: product.name,
      size: product.size,
      price: product.price,
      quantity
    });
  }

  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const now = new Date();
  const order: Order = {
    id: newOrderId(now),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    status: 'pending',
    lines,
    total,
    customer,
    payment: {}
  };

  const origin = process.env.STORE_URL || req.nextUrl.origin;
  try {
    // Saved before Midtrans hears of it, so a payment notification can never
    // arrive for an order this store has no record of.
    await saveOrder(order);
    const snap = await createSnapTransaction({
      orderId: order.id,
      grossAmount: total,
      items: lines.map((line) => ({ id: line.code, name: line.name, price: line.price, quantity: line.quantity })),
      customer,
      finishUrl: `${origin}/order/${order.id}`,
      notificationUrl: `${origin}/api/midtrans/notification`
    });
    order.payment.redirectUrl = snap.redirectUrl;
    await saveOrder(order);
    return NextResponse.json({ success: true, orderId: order.id, redirectUrl: snap.redirectUrl });
  } catch (error) {
    console.error('[orders] could not create order', order.id, error);
    return NextResponse.json({ success: false, error: 'server-error' }, { status: 502 });
  }
}
