import { randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Storage } from '@google-cloud/storage';
import type { MidtransStatus } from './midtrans';

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'refunded';

export type OrderLine = {
  slug: string;
  code: string;
  name: string;
  size?: string;
  /** Unit price including PPN, from the catalogue at the moment of ordering. */
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  lines: OrderLine[];
  total: number;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    notes?: string;
    /** Map position from the checkout address search, when the buyer used it. Lalamove needs it. */
    location?: { lat: number; lng: number; placeId?: string; formattedAddress?: string };
  };
  delivery?: {
    lalamove?: {
      orderId: string;
      serviceType: string;
      shareLink: string;
      status: string;
      /** What Varindo pays Lalamove, as Lalamove quoted it. */
      price: string;
      bookedAt: string;
    };
  };
  payment: {
    redirectUrl?: string;
    paymentType?: string;
    transactionId?: string;
    transactionStatus?: string;
  };
};

/**
 * Order ids double as the key to the order page, so they are long and random
 * rather than sequential: nobody can walk the ids to see other people's orders.
 */
export function newOrderId(now = new Date()) {
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  return `VAR-${date}-${randomBytes(6).toString('hex').toUpperCase()}`;
}

export function isOrderId(value: string) {
  return /^VAR-\d{8}-[0-9A-F]{12}$/.test(value);
}

/** What a Midtrans transaction status means for the order. */
export function orderStatusFromMidtrans(s: Pick<MidtransStatus, 'transaction_status' | 'fraud_status'>): OrderStatus {
  switch (s.transaction_status) {
    case 'settlement':
      return 'paid';
    case 'capture':
      // A card payment Midtrans' fraud screen holds for review is not paid yet.
      return s.fraud_status === 'accept' ? 'paid' : 'pending';
    case 'deny':
    case 'cancel':
    case 'failure':
      return 'failed';
    case 'expire':
      return 'expired';
    case 'refund':
    case 'partial_refund':
      return 'refunded';
    default:
      return 'pending';
  }
}

// ── Storage ────────────────────────────────────────────────────────
// One JSON object per order in ORDERS_BUCKET. Cloud Run's filesystem is
// wiped with every instance, so production must have the bucket; locally,
// with it unset, orders go to .data/orders instead.
let storage: Storage | null = null;
const LOCAL_DIR = path.join(process.cwd(), '.data', 'orders');

function bucket() {
  const name = process.env.ORDERS_BUCKET;
  if (!name) return null;
  storage ??= new Storage();
  return storage.bucket(name);
}

export async function saveOrder(order: Order) {
  const body = JSON.stringify(order, null, 2);
  const b = bucket();
  if (b) {
    await b.file(`orders/${order.id}.json`).save(body, { contentType: 'application/json', resumable: false });
    return;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ORDERS_BUCKET is not set — orders cannot be stored.');
  }
  await mkdir(LOCAL_DIR, { recursive: true });
  await writeFile(path.join(LOCAL_DIR, `${order.id}.json`), body);
}

export async function getOrder(id: string): Promise<Order | null> {
  if (!isOrderId(id)) return null;
  const b = bucket();
  try {
    if (b) {
      const [contents] = await b.file(`orders/${id}.json`).download();
      return JSON.parse(contents.toString('utf8')) as Order;
    }
    return JSON.parse(await readFile(path.join(LOCAL_DIR, `${id}.json`), 'utf8')) as Order;
  } catch (error) {
    const code = (error as { code?: number | string }).code;
    if (code === 404 || code === 'ENOENT') return null;
    throw error;
  }
}

/**
 * Applies what Midtrans says about the payment. Returns the updated order and
 * whether this update is the one that marked it paid, so the paid
 * notification goes out once even though Midtrans may notify several times.
 */
export async function applyPaymentStatus(order: Order, s: MidtransStatus) {
  const status = orderStatusFromMidtrans(s);
  const becamePaid = status === 'paid' && order.status !== 'paid';
  // A paid order only moves on to refunded: a late "expire" for an abandoned
  // payment method must not undo a payment that went through by another.
  const next = order.status === 'paid' && status !== 'refunded' ? 'paid' : status;
  const updated: Order = {
    ...order,
    status: next,
    updatedAt: new Date().toISOString(),
    payment: {
      ...order.payment,
      paymentType: s.payment_type ?? order.payment.paymentType,
      transactionId: s.transaction_id ?? order.payment.transactionId,
      transactionStatus: s.transaction_status
    }
  };
  if (
    updated.status !== order.status ||
    updated.payment.transactionStatus !== order.payment.transactionStatus
  ) {
    await saveOrder(updated);
  }
  return { order: updated, becamePaid };
}
