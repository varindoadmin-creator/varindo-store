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
          <div className="flex items-center gap-4 mb-6">
            <img src="/varindo-logo-transparent.png" alt="Varindo"
              style={{ width: '80px', filter: 'brightness(0) invert(1)' }}
              className="h-auto object-contain opacity-80" />
            <div className="h-8 w-px bg-white/15" />
            <img src="/lamitak-authorized-dealer.png" alt="Authorized Dealer of Lamitak"
              style={{ height: '32px', filter: 'brightness(0) invert(1)' }}
              className="w-auto object-contain opacity-80" />
          </div>
          <p className="text-[13px] leading-7 text-varindo-400 max-w-xs mb-5">
            {t('footer', 'tagline', lang)}
          </p>
          <address className="not-italic text-[13px] leading-7 text-varindo-400 max-w-xs">
            <span className="block text-varindo-500 text-[10px] tracking-[0.16em] uppercase mb-1">
              {t('contact', 'headOffice', lang)}
            </span>
            Branz BSD Tower A Unit 3310<br />
            Jl. BSD Boulevard Parcel 55-F<br />
            Tangerang 15339, Banten
            <span className="block mt-3 text-varindo-500 text-[10px] tracking-[0.16em] uppercase mb-1">
              {t('contact', 'hours', lang)}
            </span>
            <span className="whitespace-pre-line">{t('contact', 'hoursValue', lang)}</span>
          </address>
        </div>

        {/* Collections */}
        <div>
          <p className="label text-varindo-500 mb-5">{t('footer', 'collections', lang)}</p>
          <ul className="space-y-3">
            {[
              { href: '/collections/new-arrivals', id: 'Produk Terbaru',  en: 'New Arrivals' },
              { href: '/collections/best-sellers', id: 'Produk Terlaris', en: 'Best Sellers' },
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
              { href: '/price-list',         label: t('footer', 'priceListLink', lang) },
              { href: '/otorisasi',          label: t('footer', 'otorisasiLink', lang) },
              { href: '/privacy',            label: lang === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy' },
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
              <a href="tel:+6281288885224" className="hover:text-white transition-colors">0812 8888 5224</a>
              <br />
              <a href="tel:+6281210015224" className="hover:text-white transition-colors">0812 1001 5224</a>
            </p>
            <p className="text-[13px] text-varindo-400">
              <a href="https://wa.me/6281288885224" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                WhatsApp →
              </a>
            </p>
            <p className="text-[13px] text-varindo-400">
              <span className="block text-varindo-500 text-[10px] tracking-[0.16em] uppercase mb-1">Email</span>
              <a href="mailto:contact@varindo.co.id" className="hover:text-white transition-colors">contact@varindo.co.id</a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/[0.07]">
        <div className="shell py-5">
          <p className="text-[11px] text-varindo-600">
            {t('footer', 'copyright', lang, { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
