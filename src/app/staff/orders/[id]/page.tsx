import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOrder, saveOrder } from '@/lib/orders';
import { verifyStaffKey } from '@/lib/staffLink';
import { getLalamoveOrder, isLalamoveConfigured } from '@/lib/lalamove';
import { StaffOrderClient } from './StaffOrderClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pesanan (Staf)',
  robots: { index: false, follow: false }
};

// Opened from the paid-order email. Without the right key it is a 404, so
// the page's existence says nothing about which order ids are real.
export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { id } = await params;
  const { key } = await searchParams;
  if (!verifyStaffKey(id, key)) notFound();
  let order = await getOrder(id);
  if (!order) notFound();

  // A booked trip's status moves on (driver assigned, picked up, completed);
  // read it fresh rather than show what it was at booking.
  const booked = order.delivery?.lalamove;
  if (booked && isLalamoveConfigured()) {
    try {
      const live = await getLalamoveOrder(booked.orderId);
      if (live.status !== booked.status) {
        order = { ...order, delivery: { ...order.delivery, lalamove: { ...booked, status: live.status } } };
        await saveOrder(order);
      }
    } catch (error) {
      console.error('[staff] Lalamove status check failed', id, error);
    }
  }

  return <StaffOrderClient order={order} staffKey={key as string} lalamoveReady={isLalamoveConfigured()} />;
}
