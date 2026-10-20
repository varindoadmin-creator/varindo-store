'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCart } from '@/lib/CartContext';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';
import { formatIDR } from '@/lib/utils';
import { buildEnquiryWhatsAppUrl } from '@/lib/whatsapp';
import type { OrderStatus } from '@/lib/orders';

type Props = {
  order: {
    id: string;
    status: OrderStatus;
    total: number;
    lines: { code: string; name: string; price: number; quantity: number }[];
    redirectUrl?: string;
  };
};

const STATUS_KEY: Record<OrderStatus, string> = {
  pending: 'statusPending',
  paid: 'statusPaid',
  failed: 'statusFailed',
  expired: 'statusExpired',
  refunded: 'statusRefunded'
};

export function OrderPageClient({ order }: Props) {
  const { lang } = useLang();
  const { clear } = useCart();
  const router = useRouter();

  // Arriving back from Midtrans (it adds order_id to the URL) means the cart
  // became this order. Opening an old order's link later must not empty a
  // cart that has been filled since.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('order_id') === order.id) clear();
  }, [clear, order.id]);

  const body = order.status === 'paid' ? 'bodyPaid' : order.status === 'pending' ? 'bodyPending' : 'bodyFailed';
  const whatsApp = buildEnquiryWhatsAppUrl(`Halo Admin Varindo, saya ingin menanyakan pesanan ${order.id}.`);

  return (
    <div className="shell max-w-3xl py-10 sm:py-14">
      <p className="label mb-2">{t('shop', 'orderNumber', lang)}</p>
      <p className="mono mb-6 text-[15px] text-varindo-ink">{order.id}</p>

      <h1 className="display mb-3 text-[32px] leading-[1.1] text-varindo-ink sm:text-[42px]">
        {t('shop', STATUS_KEY[order.status], lang)}
      </h1>
      <p className="mb-8 max-w-xl text-[16px] leading-[1.6] text-varindo-deep">{t('shop', body, lang)}</p>

      <div className="mb-8 flex flex-wrap gap-3">
        {order.redirectUrl && (
          <a href={order.redirectUrl} className="btn-blue">{t('shop', 'continuePayment', lang)}</a>
        )}
        {order.status === 'pending' && (
          <button type="button" onClick={() => router.refresh()} className="btn-ghost">{t('shop', 'refreshStatus', lang)}</button>
        )}
        <a href={whatsApp} target="_blank" rel="noreferrer" className="btn-ghost">{t('shop', 'askOnWhatsApp', lang)}</a>
      </div>

      <section className="rounded-card border border-varindo-line bg-varindo-canvas p-6">
        <h2 className="label-marked mb-4">{t('shop', 'orderSummary', lang)}</h2>
        <ul className="divide-y divide-varindo-line border-y border-varindo-line">
          {order.lines.map((line) => (
            <li key={line.code} className="flex justify-between gap-3 py-3 text-[14px]">
              <span className="min-w-0">
                <span className="mono block text-[11px] uppercase tracking-[0.08em] text-varindo-clay-ink">{line.code}</span>
                <span className="line-clamp-1 text-varindo-ink">{line.name}</span>
                <span className="mono text-[13px] text-varindo-mid">{line.quantity} × {formatIDR(line.price)}</span>
              </span>
              <span className="mono shrink-0 text-varindo-ink">{formatIDR(line.price * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between gap-4 text-[16px] font-semibold">
          <span className="text-varindo-ink">{t('shop', 'total', lang)}</span>
          <span className="mono text-varindo-ink">{formatIDR(order.total)}</span>
        </div>
        <p className="mt-2 text-[12px] text-varindo-mid">{t('shop', 'taxIncluded', lang)} {t('shop', 'shipping', lang)}: {t('shop', 'shippingFree', lang)}.</p>
      </section>

      <Link href="/products" className="link-arrow mt-8 inline-block">{t('shop', 'continueShopping', lang)}</Link>
    </div>
  );
}
