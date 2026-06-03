'use client';

import Link from 'next/link';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

export function Footer() {
  const { lang } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-varindo-ink text-varindo-200">
      <div className="shell pt-14 pb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">

        {/* Brand */}
        <div>
          <img src="/varindo-logo-transparent.png" alt="Varindo"
            style={{ width: '80px', filter: 'brightness(0) invert(1)' }}
            className="h-auto object-contain opacity-80 mb-6" />
          <p className="text-[13px] leading-7 text-varindo-400 max-w-xs">
            {t('footer', 'tagline', lang)}
          </p>
        </div>

        {/* Collections */}
        <div>
          <p className="label text-varindo-500 mb-5">{t('footer', 'collections', lang)}</p>
          <ul className="space-y-3">
            {[
              { href: '/collections/new-arrivals', id: 'Produk Terbaru',  en: 'New Arrivals' },
              { href: '/collections/best-sellers', id: 'Produk Terlaris', en: 'Best Sellers' },
              { href: '/collections/promo-items',  id: 'Produk Promo',     en: 'Promo Items' },
              { href: '/collections/woods',        id: 'Woods',           en: 'Woods' },
              { href: '/collections/patterns',     id: 'Patterns',        en: 'Patterns' },
              { href: '/collections/solids',       id: 'Solids',          en: 'Solids' },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-[13px] text-varindo-400 hover:text-white transition-colors">
                  {item[lang]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="label text-varindo-500 mb-5">{t('footer', 'company', lang)}</p>
          <ul className="space-y-3">
            {[
              { href: '/about',              label: t('footer', 'aboutLink', lang) },
              { href: '/contact',            label: t('footer', 'contactLink', lang) },
              { href: '/request-catalogue',  label: t('footer', 'catalogueLink', lang) },
              { href: '/request-quote',      label: t('footer', 'quoteLink', lang) },
              { href: '/request-sample',     label: t('footer', 'sampleLink', lang) },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-[13px] text-varindo-400 hover:text-white transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="label text-varindo-500 mb-5">{t('footer', 'contact', lang)}</p>
          <address className="not-italic space-y-3">
            <p className="text-[13px] text-varindo-400">
              <span className="block text-varindo-500 text-[10px] tracking-[0.16em] uppercase mb-1">
                {t('footer', 'phone', lang)}
              </span>
              0812 8888 5224<br />0812 1001 5224
            </p>
            <p className="text-[13px] text-varindo-400">
              <span className="block text-varindo-500 text-[10px] tracking-[0.16em] uppercase mb-1">Email</span>
              contact@varindo.co.id
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/[0.07]">
        <div className="shell py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-[11px] text-varindo-600">
            {t('footer', 'copyright', lang, { year })}
          </p>
          <p className="text-[11px] text-varindo-700">
            {t('footer', 'dealerBadge', lang)}
          </p>
        </div>
      </div>
    </footer>
  );
}
