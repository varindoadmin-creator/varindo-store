'use client';

import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';
import { formatIDR } from '@/lib/utils';
import { ProductImage } from '@/components/ProductImage';
import { QuantityStepper } from '@/components/QuantityStepper';

export function CartPageClient() {
  const { lang } = useLang();
  const { items, ready, subtotal, setQuantity, remove } = useCart();

  return (
    <div className="shell py-10 sm:py-14">
      <h1 className="display mb-8 text-[34px] leading-[1.1] text-varindo-ink sm:text-[44px]">{t('shop', 'cartTitle', lang)}</h1>

      {ready && items.length === 0 && (
        <div className="rounded-card border border-varindo-line bg-varindo-canvas px-6 py-14 text-center">
          <p className="mb-6 text-[16px] text-varindo-deep">{t('shop', 'cartEmpty', lang)}</p>
          <Link href="/products" className="btn-ink">{t('shop', 'browseCatalog', lang)}</Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <ul className="divide-y divide-varindo-line border-y border-varindo-line">
            {items.map((item) => (
              <li key={item.slug} className="flex gap-4 py-5">
                <Link href={`/products/${item.slug}`} className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-ctl border border-varindo-line bg-varindo-canvas sm:h-24 sm:w-24">
                  <ProductImage src={item.imageUrl || ''} alt={item.name} />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="mono mb-1 text-[11px] font-medium uppercase tracking-[0.08em] text-varindo-clay-ink">{item.code}</p>
                  <Link href={`/products/${item.slug}`} className="line-clamp-2 text-[15px] font-semibold leading-[1.35] text-varindo-ink hover:text-varindo-link">
                    {item.name}
                  </Link>
                  <p className="mono mt-1 text-[13px] text-varindo-mid">{formatIDR(item.price)} · {t('shop', 'perSheet', lang)}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <QuantityStepper size="sm" value={item.quantity} onChange={(n) => setQuantity(item.slug, n)} />
                      <button type="button" onClick={() => remove(item.slug)} className="text-[13px] text-varindo-mid transition-colors hover:text-varindo-clay">
                        {t('shop', 'remove', lang)}
                      </button>
                    </div>
                    <p className="mono text-[15px] font-medium text-varindo-ink">{formatIDR(item.price * item.quantity)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="rounded-card border border-varindo-line bg-varindo-canvas p-6 lg:sticky lg:top-24">
            <h2 className="label-marked mb-4">{t('shop', 'orderSummary', lang)}</h2>
            <dl className="space-y-2 text-[14px]">
              <div className="flex justify-between gap-4">
                <dt className="text-varindo-deep">{t('shop', 'subtotal', lang)}</dt>
                <dd className="mono text-varindo-ink">{formatIDR(subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-varindo-deep">{t('shop', 'shipping', lang)}</dt>
                <dd className="text-varindo-ink">{t('shop', 'shippingFree', lang)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-varindo-line pt-3 text-[16px] font-semibold">
                <dt className="text-varindo-ink">{t('shop', 'total', lang)}</dt>
                <dd className="mono text-varindo-ink">{formatIDR(subtotal)}</dd>
              </div>
            </dl>
            <p className="mt-2 text-[12px] text-varindo-mid">{t('shop', 'taxIncluded', lang)}</p>
            <Link href="/checkout" className="btn-blue mt-6 w-full">{t('shop', 'checkout', lang)}</Link>
            <Link href="/products" className="link-arrow mt-4 inline-block text-[14px]">{t('shop', 'continueShopping', lang)}</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
