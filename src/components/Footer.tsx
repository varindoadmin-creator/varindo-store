'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

const PLAY_STORE_URL = 'https://play.google.com/apps/testing/co.varindo.catalog';

function PlayStoreIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 2.5v19a1 1 0 0 0 1.53.85l15-9.5a1 1 0 0 0 0-1.7l-15-9.5A1 1 0 0 0 3 2.5z" />
    </svg>
  );
}

export function Footer() {
  const { lang } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-varindo-ink text-varindo-200">
      <div className="shell pt-14 pb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <Image src="/varindo-logo-transparent.png" alt="Varindo" width={80} height={44}
              style={{ filter: 'brightness(0) invert(1)' }}
              className="h-auto object-contain opacity-80" />
            <div className="h-8 w-px bg-white/15" />
            <div className="flex flex-col gap-1.5">
              <span className="text-[8px] font-semibold tracking-[0.05em] text-varindo-400">
                Authorized Dealer of
              </span>
              <Image src="/lamitak-logo-mark.png" alt="Lamitak" width={112} height={28}
                style={{ filter: 'brightness(0) invert(1)' }}
                className="w-auto object-contain opacity-80" />
            </div>
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
              { href: '/blog',               label: t('footer', 'blogLink', lang) },
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
        <div className="shell py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-varindo-300 text-center sm:text-left">
            {t('footer', 'appTagline', lang)}
          </p>
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-white hover:bg-white hover:text-varindo-ink transition-colors shrink-0">
            <PlayStoreIcon />
            {t('footer', 'appLink', lang)}
          </a>
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
