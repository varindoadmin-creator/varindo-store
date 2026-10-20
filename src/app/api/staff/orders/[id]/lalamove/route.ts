import { NextRequest, NextResponse } from 'next/server';
import { getOrder, saveOrder } from '@/lib/orders';
import { formatIDR } from '@/lib/utils';
import { verifyStaffKey } from '@/lib/staffLink';
import {
  LalamoveError,
  getQuotation,
  getQuotationById,
  getServices,
  isLalamoveConfigured,
  placeOrder
} from '@/lib/lalamove';

export const dynamic = 'force-dynamic';

type Body = { key?: string; action?: 'services' | 'quote' | 'book'; serviceType?: string; quotationId?: string };

function price(p: { total: string; currency: string }) {
  return p.currency === 'IDR' ? formatIDR(Number(p.total)) : `${p.currency} ${p.total}`;
}

function fail(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

// The staff page's Lalamove actions: list vehicle types, price a trip, book it.
// Every call carries the order's staff key from the paid-order email.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return fail('Invalid request body.');
  }
  if (!verifyStaffKey(id, body.key)) return fail('Forbidden', 403);
  if (!isLalamoveConfigured()) return fail('Lalamove belum dikonfigurasi (API key, secret, atau alamat gudang).', 503);

  const order = await getOrder(id);
  if (!order) return fail('Pesanan tidak ditemukan.', 404);

  try {
    if (body.action === 'services') {
      return NextResponse.json({ success: true, services: await getServices() });
    }

    if (order.status !== 'paid') return fail('Pesanan belum dibayar.');
    if (order.delivery?.lalamove) return fail('Lalamove sudah dipesan untuk pesanan ini.');
    const location = order.customer.location;
    if (!location) return fail('Alamat pembeli tidak memiliki lokasi peta.');
    const serviceType = (body.serviceType || '').trim();
    if (!/^[A-Z0-9_]{2,40}$/.test(serviceType)) return fail('Pilih jenis kendaraan.');

    if (body.action === 'quote') {
      const quotation = await getQuotation({
        serviceType,
        dropoff: { lat: location.lat, lng: location.lng, address: location.formattedAddress || order.customer.address }
      });
      return NextResponse.json({
        success: true,
        quotationId: quotation.quotationId,
        price: price(quotation.priceBreakdown),
        expiresAt: quotation.expiresAt,
        distance: quotation.distance
          ? quotation.distance.unit === 'm' ? `${(Number(quotation.distance.value) / 1000).toFixed(1)} km` : `${quotation.distance.value} ${quotation.distance.unit}`
          : undefined
      });
    }

    if (body.action === 'book') {
      const quotationId = (body.quotationId || '').trim();
      if (!/^[\w-]{4,64}$/.test(quotationId)) return fail('Minta harga dulu.');
      const quotation = await getQuotationById(quotationId);
      if (quotation.serviceType !== serviceType) return fail('Harga untuk kendaraan lain. Minta harga lagi.');

      const c = order.customer;
      const remarks = [
        `Pesanan ${order.id}`,
        order.lines.map((l) => `${l.code} × ${l.quantity}`).join(', '),
        c.address,
        c.notes ? `Catatan: ${c.notes}` : ''
      ].filter(Boolean).join('\n');

      const booked = await placeOrder({ quotation, recipient: { name: c.name, phone: c.phone, remarks }, reference: order.id });
      const updated = {
        ...order,
        updatedAt: new Date().toISOString(),
        delivery: {
          ...order.delivery,
          lalamove: {
            orderId: booked.orderId,
            serviceType,
            shareLink: booked.shareLink,
            status: booked.status,
            price: price(booked.priceBreakdown),
            bookedAt: new Date().toISOString()
          }
        }
      };
      await saveOrder(updated);
      return NextResponse.json({ success: true, lalamove: updated.delivery.lalamove });
    }

    return fail('Unknown action.');
  } catch (error) {
    console.error('[staff/lalamove]', id, body.action, error);
    return fail(error instanceof LalamoveError ? `Lalamove: ${error.detail}` : 'Gagal menghubungi Lalamove.', 502);
  }
}
