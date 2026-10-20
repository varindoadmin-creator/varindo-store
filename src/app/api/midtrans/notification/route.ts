import { NextRequest, NextResponse } from 'next/server';
import { getTransactionStatus, isValidNotificationSignature } from '@/lib/midtrans';
import { applyPaymentStatus, getOrder } from '@/lib/orders';
import { sendOrderPaidNotification } from '@/lib/mailer';
import { staffOrderUrl } from '@/lib/staffLink';

export const dynamic = 'force-dynamic';

// Midtrans' HTTP notification: it calls this whenever a payment changes state
// and retries until it gets a 200. The body is only trusted as far as its
// signature; the status itself is read back from Midtrans' API, so a replayed
// old notification cannot move an order backwards to a state it has left.
export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!isValidNotificationSignature(body)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const order = await getOrder(body.order_id);
  // Not ours — e.g. Midtrans' dashboard "test notification". Answered 200 so
  // Midtrans does not keep retrying it.
  if (!order) return NextResponse.json({ ok: true });

  try {
    const status = await getTransactionStatus(order.id);
    if (!status) return NextResponse.json({ ok: true });
    if (Number(status.gross_amount) !== order.total) {
      console.error('[midtrans] amount mismatch', order.id, status.gross_amount, order.total);
      return NextResponse.json({ ok: true });
    }

    const { order: updated, becamePaid } = await applyPaymentStatus(order, status);
    if (becamePaid) {
      await sendOrderPaidNotification(updated, staffOrderUrl(updated.id)).catch((error) =>
        console.error('[midtrans] paid-order email failed', order.id, error)
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    // A non-200 makes Midtrans retry later, which is what we want here.
    console.error('[midtrans] notification failed', order.id, error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
