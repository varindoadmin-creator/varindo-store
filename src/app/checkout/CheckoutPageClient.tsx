'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useCart } from '@/lib/CartContext';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';
import { formatIDR } from '@/lib/utils';
import { SHIPPING_PROVINCES } from '@/lib/shipping';
import { buildEnquiryWhatsAppUrl } from '@/lib/whatsapp';

const OUTSIDE = 'outside';

export function CheckoutPageClient() {
  const { lang } = useLang();
  const { items, ready, subtotal } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', city: '', province: '', postalCode: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const outside = form.province === OUTSIDE;
  const canSubmit = Boolean(
    items.length > 0 && !outside && !submitting &&
    form.name.trim() && form.phone.trim() && form.address.trim() && form.city.trim() && form.province &&
    /^\d{5}$/.test(form.postalCode.trim())
  );

  const outsideWhatsApp = buildEnquiryWhatsAppUrl([
    'Halo Admin Varindo, saya ingin memesan untuk dikirim ke luar Jawa & Bali:',
    '',
    ...items.map((i) => `${i.code} — ${i.quantity} lembar`),
    '',
    'Kota tujuan:',
    '',
    'Terima kasih.'
  ].join('\n'));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })) })
      });
      const data = await res.json();
      if (data.success && data.redirectUrl) {
        // The cart stays until the order page: a buyer who backs out of the
        // payment page still has it.
        window.location.href = data.redirectUrl;
        return;
      }
      setError(
        data.error === 'checkout-unavailable' ? t('shop', 'unavailable', lang)
        : data.error === 'product-unavailable' ? t('shop', 'productUnavailable', lang)
        : t('forms', 'serverError', lang)
      );
    } catch {
      setError(t('forms', 'networkError', lang));
    }
    setSubmitting(false);
  };

  if (ready && items.length === 0) {
    return (
      <div className="shell py-14">
        <div className="rounded-card border border-varindo-line bg-varindo-canvas px-6 py-14 text-center">
          <p className="mb-6 text-[16px] text-varindo-deep">{t('shop', 'cartEmpty', lang)}</p>
          <Link href="/products" className="btn-ink">{t('shop', 'browseCatalog', lang)}</Link>
        </div>
      </div>
    );
  }

  const req = <span className="text-varindo-ember">*</span>;

  return (
    <div className="shell py-10 sm:py-14">
      <h1 className="display mb-8 text-[34px] leading-[1.1] text-varindo-ink sm:text-[44px]">{t('shop', 'checkoutTitle', lang)}</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <section className="rounded-card border border-varindo-line bg-varindo-canvas p-6 sm:p-7">
          <h2 className="label-marked mb-5">{t('shop', 'deliveryDetails', lang)}</h2>
          <div className="space-y-5">
            <label className="block">
              <span className="label mb-2 block">{t('forms', 'nameLabel', lang)} {req}</span>
              <input type="text" required value={form.name} onChange={set('name')} autoComplete="name" className="field" placeholder={t('forms', 'namePlaceholder', lang)} />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="label mb-2 block">{t('forms', 'phoneLabel', lang)} {req}</span>
                <input type="tel" required value={form.phone} onChange={set('phone')} autoComplete="tel" className="field" placeholder={t('forms', 'phonePlaceholder', lang)} />
              </label>
              <label className="block">
                <span className="label mb-2 block">{t('shop', 'emailLabel', lang)}</span>
                <input type="email" value={form.email} onChange={set('email')} autoComplete="email" className="field" placeholder={t('shop', 'emailPlaceholder', lang)} />
              </label>
            </div>
            <label className="block">
              <span className="label mb-2 block">{t('shop', 'streetLabel', lang)} {req}</span>
              <textarea required rows={3} value={form.address} onChange={set('address')} autoComplete="street-address" className="field h-auto resize-none py-3" placeholder={t('shop', 'streetPlaceholder', lang)} />
            </label>
            <div className="grid gap-5 sm:grid-cols-[1fr_1fr_120px]">
              <label className="block">
                <span className="label mb-2 block">{t('shop', 'cityLabel', lang)} {req}</span>
                <input type="text" required value={form.city} onChange={set('city')} autoComplete="address-level2" className="field" />
              </label>
              <label className="block">
                <span className="label mb-2 block">{t('shop', 'provinceLabel', lang)} {req}</span>
                <select required value={form.province} onChange={set('province')} className="field-select">
                  <option value="" disabled>{t('shop', 'provinceChoose', lang)}</option>
                  {SHIPPING_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  <option value={OUTSIDE}>{t('shop', 'provinceOther', lang)}</option>
                </select>
              </label>
              <label className="block">
                <span className="label mb-2 block">{t('shop', 'postalLabel', lang)} {req}</span>
                <input type="text" required inputMode="numeric" maxLength={5} pattern="\d{5}" value={form.postalCode} onChange={set('postalCode')} autoComplete="postal-code" className="field mono" />
              </label>
            </div>
            {outside && (
              <div className="rounded-ctl border border-varindo-clay/40 bg-varindo-clay-wash p-4 text-[14px] leading-[1.5] text-varindo-deep">
                <p className="mb-3">{t('shop', 'outsideArea', lang)}</p>
                <a href={outsideWhatsApp} target="_blank" rel="noreferrer" className="btn-ghost">{t('shop', 'askOnWhatsApp', lang)}</a>
              </div>
            )}
            <label className="block">
              <span className="label mb-2 block">{t('shop', 'notesLabel', lang)}</span>
              <textarea rows={2} value={form.notes} onChange={set('notes')} className="field h-auto resize-none py-3" placeholder={t('shop', 'notesPlaceholder', lang)} />
            </label>
          </div>
        </section>

        <aside className="rounded-card border border-varindo-line bg-varindo-canvas p-6 lg:sticky lg:top-24">
          <h2 className="label-marked mb-4">{t('shop', 'orderSummary', lang)}</h2>
          <ul className="mb-4 divide-y divide-varindo-line border-y border-varindo-line">
            {items.map((item) => (
              <li key={item.slug} className="flex justify-between gap-3 py-3 text-[13px]">
                <span className="min-w-0">
                  <span className="mono block text-[11px] uppercase tracking-[0.08em] text-varindo-clay-ink">{item.code}</span>
                  <span className="line-clamp-1 text-varindo-ink">{item.name}</span>
                  <span className="mono text-varindo-mid">{item.quantity} × {formatIDR(item.price)}</span>
                </span>
                <span className="mono shrink-0 text-varindo-ink">{formatIDR(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 text-[14px]">
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

          {error && <p className="mt-4 rounded-ctl bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700" role="alert">{error}</p>}

          <button type="submit" disabled={!canSubmit} className="btn-blue mt-6 w-full disabled:cursor-not-allowed disabled:opacity-40">
            {submitting ? t('shop', 'paying', lang) : t('shop', 'payNow', lang)}
          </button>
          <p className="mt-3 text-[12px] leading-[1.5] text-varindo-mid">{t('shop', 'payNote', lang)}</p>
          <Link href="/cart" className="link-arrow mt-4 inline-block text-[14px]">← {t('shop', 'cart', lang)}</Link>
        </aside>
      </form>
    </div>
  );
}
