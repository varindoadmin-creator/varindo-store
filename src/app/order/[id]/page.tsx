import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { applyPaymentStatus, getOrder } from '@/lib/orders';
import { getTransactionStatus, isMidtransConfigured } from '@/lib/midtrans';
import { sendOrderPaidNotification } from '@/lib/mailer';
import { staffOrderUrl } from '@/lib/staffLink';
import { OrderPageClient } from './OrderPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pesanan',
  robots: { index: false }
};

// Midtrans sends the buyer here when they finish on its payment page. Its
// notification can lag behind them, so a pending order is checked with
// Midtrans directly before the page is drawn.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let order = await getOrder(id);
  if (!order) notFound();

  if (order.status === 'pending' && isMidtransConfigured()) {
    try {
      const status = await getTransactionStatus(order.id);
      if (status && Number(status.gross_amount) === order.total) {
        const result = await applyPaymentStatus(order, status);
        order = result.order;
        if (result.becamePaid) {
          await sendOrderPaidNotification(order, staffOrderUrl(order.id)).catch((error) => console.error('[order] paid-order email failed', id, error));
        }
      }
    } catch (error) {
      // The stored status is still worth showing.
      console.error('[order] status check failed', id, error);
    }
  }

  return (
    <OrderPageClient
      order={{
        id: order.id,
        status: order.status,
        total: order.total,
        lines: order.lines.map(({ code, name, price, quantity }) => ({ code, name, price, quantity })),
        redirectUrl: order.status === 'pending' ? order.payment.redirectUrl : undefined
      }}
    />
  );
}
