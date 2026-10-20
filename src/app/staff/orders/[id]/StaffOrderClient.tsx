'use client';

import { useEffect, useState } from 'react';
import type { Order } from '@/lib/orders';
import { formatIDR } from '@/lib/utils';

type Service = { key: string; description: string };
type Quote = { quotationId: string; price: string; expiresAt: string; distance?: string };

const STATUS: Record<Order['status'], string> = {
  pending: 'Menunggu pembayaran',
  paid: 'Sudah dibayar',
  failed: 'Pembayaran gagal',
  expired: 'Pembayaran kedaluwarsa',
  refunded: 'Dana dikembalikan'
};

/* For the team only, so Indonesian only. One order: what to pack, where it
   goes, and — when the buyer pinned the address — a Lalamove booking in two
   steps: get the price for a vehicle, then book it while the price holds. */
export function StaffOrderClient({ order, staffKey, lalamoveReady }: { order: Order; staffKey: string; lalamoveReady: boolean }) {
  const [booking, setBooking] = useState(order.delivery?.lalamove);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceType, setServiceType] = useState('');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const c = order.customer;
  const canBook = lalamoveReady && order.status === 'paid' && Boolean(c.location) && !booking;

  const call = async (action: string, extra: Record<string, string> = {}) => {
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/staff/orders/${order.id}/lalamove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: staffKey, action, serviceType, ...extra })
      });
      const data = await res.json();
      if (!data.success) setError(data.error || 'Gagal.');
      return data.success ? data : null;
    } catch {
      setError('Koneksi bermasalah.');
      return null;
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!canBook) return;
    call('services').then((data) => data && setServices(data.services));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canBook]);

  const expired = quote ? Date.parse(quote.expiresAt) < Date.now() : false;

  return (
    <div className="shell max-w-3xl py-10 sm:py-14">
      <p className="label mb-2">Pesanan · Staf</p>
      <h1 className="mono mb-2 text-[22px] text-varindo-ink sm:text-[26px]">{order.id}</h1>
      <p className="mb-8 text-[15px] text-varindo-deep">
        {STATUS[order.status]} · {formatIDR(order.total)} · {new Date(order.createdAt).toLocaleString('id-ID')}
      </p>

      <section className="mb-6 rounded-card border border-varindo-line bg-varindo-canvas p-6">
        <h2 className="label-marked mb-4">Kirim ke</h2>
        <p className="text-[15px] font-semibold text-varindo-ink">{c.name}</p>
        <p className="text-[14px] text-varindo-deep">{c.phone}{c.email ? ` · ${c.email}` : ''}</p>
        <p className="mt-2 whitespace-pre-line text-[14px] leading-[1.5] text-varindo-ink">{c.address}</p>
        <p className="text-[14px] text-varindo-ink">{c.city}, {c.province} {c.postalCode}</p>
        {c.notes && <p className="mt-2 text-[14px] italic text-varindo-deep">Catatan: {c.notes}</p>}
        {c.location ? (
          <a href={`https://www.google.com/maps/search/?api=1&query=${c.location.lat},${c.location.lng}`} target="_blank" rel="noreferrer"
            className="link-arrow mt-3 inline-block text-[14px]">Buka di Google Maps →</a>
        ) : (
          <p className="mt-3 text-[13px] text-varindo-mid">Pembeli tidak memilih lokasi di peta.</p>
        )}
      </section>

      <section className="mb-6 rounded-card border border-varindo-line bg-varindo-canvas p-6">
        <h2 className="label-marked mb-4">Barang</h2>
        <ul className="divide-y divide-varindo-line">
          {order.lines.map((l) => (
            <li key={l.code} className="flex justify-between gap-3 py-2.5 text-[14px]">
              <span><span className="mono font-medium text-varindo-ink">{l.code}</span> <span className="text-varindo-deep">{l.name}</span></span>
              <span className="mono shrink-0 text-varindo-ink">× {l.quantity}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-card border border-varindo-line bg-varindo-canvas p-6">
        <h2 className="label-marked mb-4">Lalamove</h2>

        {booking ? (
          <div className="space-y-1 text-[14px] text-varindo-ink">
            <p>Dipesan {new Date(booking.bookedAt).toLocaleString('id-ID')} · {booking.serviceType} · {booking.price}</p>
            <p>Status: <span className="mono">{booking.status}</span> · ID <span className="mono">{booking.orderId}</span></p>
            <a href={booking.shareLink} target="_blank" rel="noreferrer" className="link-arrow inline-block">Lacak pengiriman →</a>
          </div>
        ) : !lalamoveReady ? (
          <p className="text-[14px] text-varindo-deep">Lalamove belum dikonfigurasi. Kirim seperti biasa.</p>
        ) : order.status !== 'paid' ? (
          <p className="text-[14px] text-varindo-deep">Bisa dipesan setelah pembayaran diterima.</p>
        ) : !c.location ? (
          <p className="text-[14px] text-varindo-deep">Tanpa lokasi peta, Lalamove tidak bisa dipesan dari sini. Kirim seperti biasa, atau pesan di aplikasi Lalamove.</p>
        ) : (
          <div className="space-y-4">
            <label className="block">
              <span className="label mb-2 block">Kendaraan</span>
              <select value={serviceType} onChange={(e) => { setServiceType(e.target.value); setQuote(null); }} className="field-select" disabled={busy && !services.length}>
                <option value="" disabled>{services.length ? 'Pilih kendaraan' : 'Memuat…'}</option>
                {services.map((s) => <option key={s.key} value={s.key}>{s.description} ({s.key})</option>)}
              </select>
              <span className="mt-1.5 block text-[12px] text-varindo-mid">HPL 4&apos;×8&apos; (1220 × 2440 mm) perlu bak terbuka atau box yang cukup panjang.</span>
            </label>

            {quote && !expired && (
              <p className="rounded-ctl border border-varindo-line bg-varindo-paper px-3.5 py-3 text-[14px] text-varindo-ink">
                Harga <span className="mono font-medium">{quote.price}</span>{quote.distance ? ` · ${quote.distance}` : ''} · berlaku sampai {new Date(quote.expiresAt).toLocaleTimeString('id-ID')}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button type="button" disabled={!serviceType || busy} className="btn-ghost disabled:opacity-40"
                onClick={async () => { const d = await call('quote'); if (d) setQuote(d); }}>
                {quote ? 'Minta harga lagi' : 'Minta harga'}
              </button>
              <button type="button" disabled={!quote || expired || busy} className="btn-blue disabled:opacity-40"
                onClick={async () => {
                  if (!quote || !confirm(`Pesan Lalamove ${serviceType} seharga ${quote.price}?`)) return;
                  const d = await call('book', { quotationId: quote.quotationId });
                  if (d) setBooking(d.lalamove);
                }}>
                Pesan Lalamove
              </button>
            </div>
            {expired && <p className="text-[13px] text-varindo-clay-ink">Harga sudah kedaluwarsa. Minta harga lagi.</p>}
          </div>
        )}

        {error && <p className="mt-4 rounded-ctl bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700" role="alert">{error}</p>}
      </section>
    </div>
  );
}
