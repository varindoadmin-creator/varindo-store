'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/lib/LangContext';
import { t, type Lang } from '@/lib/i18n';
import { useIsTwa } from '@/lib/useIsTwa';

const PLAY_STORE_URL = 'https://play.google.com/apps/testing/co.varindo.catalog';
const PLAY_BADGE_SRC: Record<Lang, string> = { id: '/play-badge-id.png', en: '/play-badge-en.png' };
// Google's official badge art is 646x250 (2.584:1) at every locale.
const PLAY_BADGE_RATIO = 646 / 250;

/* Footer is the page's quietest band: fine print in graphite on fog,
   column headings in the label voice, separators only as hairlines.
   It stays light rather than going to the deep panel — both brand marks
   are near-black ink on transparent and would vanish on black. */
export function Footer() {
  const { lang } = useLang();
  const year = new Date().getFullYear();
  const isTwa = useIsTwa();

  const linkClass = 'text-[14px] leading-[1.5] text-varindo-mid transition-colors hover:text-varindo-ink hover:underline';
  const headingClass = 'mb-4 text-[14px] font-bold uppercase leading-[1.4] tracking-label text-varindo-ink';

  return (
    <footer className="border-t border-varindo-wash bg-varindo-canvas text-varindo-mid">
      <div className="shell grid gap-10 pb-10 pt-14 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">

        {/* Brand */}
        <div>
          <div className="mb-6 flex items-center gap-4">
            <Image src="/varindo-logo-transparent.png" alt="Varindo" width={80} height={44}
              className="h-auto w-[72px] object-contain" />
            <div className="h-7 w-px bg-varindo-line" />
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold uppercase leading-none tracking-label text-varindo-mid">Authorized Dealer of</span>
              <Image src="/lamitak-logo-mark.png" alt="Lamitak" width={106} height={50}
                className="h-[24px] w-auto max-w-none object-contain" />
            </div>
          </div>
          <p className="mb-5 max-w-xs text-[14px] leading-[1.5] text-varindo-mid">
            {t('footer', 'tagline', lang)}
          </p>
          <address className="max-w-xs text-[14px] not-italic leading-[1.5] text-varindo-mid">
            <span className={headingClass + ' mb-1 block'}>{t('contact', 'headOffice', lang)}</span>
            Branz BSD Tower A Unit 3310<br />
            Jl. BSD Boulevard Parcel 55-F<br />
            Tangerang 15339, Banten
            <span className={headingClass + ' mb-1 mt-4 block'}>{t('contact', 'hours', lang)}</span>
            <span className="whitespace-pre-line">{t('contact', 'hoursValue', lang)}</span>
          </address>
        </div>

        {/* Collections */}
        <div>
          <p className={headingClass}>{t('footer', 'collections', lang)}</p>
          <ul className="space-y-2.5">
            {[
              { href: '/collections/new-arrivals', id: 'Produk Terbaru',  en: 'New Arrivals' },
              { href: '/collections/best-sellers', id: 'Produk Terlaris', en: 'Best Sellers' },
              { href: '/collections/woods',        id: 'Woods',           en: 'Woods' },
              { href: '/collections/patterns',     id: 'Patterns',        en: 'Patterns' },
              { href: '/collections/solids',       id: 'Solids',          en: 'Solids' },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>{item[lang]}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className={headingClass}>{t('footer', 'company', lang)}</p>
          <ul className="space-y-2.5">
            {[
              { href: '/about',              label: t('footer', 'aboutLink', lang) },
              { href: '/contact',            label: t('footer', 'contactLink', lang) },
              { href: '/request-catalogue',  label: t('footer', 'catalogueLink', lang) },
              { href: '/request-sample',     label: t('footer', 'sampleLink', lang) },
              { href: '/blog',               label: t('footer', 'blogLink', lang) },
              { href: '/otorisasi',          label: t('footer', 'otorisasiLink', lang) },
              { href: '/privacy',            label: lang === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy' },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className={headingClass}>{t('footer', 'contact', lang)}</p>
          <address className="space-y-3 not-italic">
            <p className="text-[14px] leading-[1.5] text-varindo-mid">
              <span className={headingClass + ' mb-1 block'}>{t('footer', 'phone', lang)}</span>
              <a href="tel:+6281288885224" className={linkClass}>0812 8888 5224</a><br />
              <a href="tel:+6281210015224" className={linkClass}>0812 1001 5224</a>
            </p>
            <p>
              <a href="https://wa.me/6281288885224" target="_blank" rel="noopener noreferrer"
                className="link-arrow">
                WhatsApp
              </a>
            </p>
            <p className="text-[14px] leading-[1.5] text-varindo-mid">
              <span className={headingClass + ' mb-1 block'}>Email</span>
              <a href="mailto:contact@varindo.co.id" className={linkClass}>contact@varindo.co.id</a>
            </p>
          </address>
        </div>
      </div>

      {!isTwa && (
        <div className="border-t border-varindo-wash">
          <div className="shell flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
            <p className="text-center text-[14px] leading-[1.5] text-varindo-mid sm:text-left">
              {t('footer', 'appTagline', lang)}
            </p>
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center transition-opacity hover:opacity-70">
              <Image src={PLAY_BADGE_SRC[lang]} alt={t('footer', 'appLink', lang)}
                width={Math.round(40 * PLAY_BADGE_RATIO)} height={40} className="h-10 w-auto" />
            </a>
          </div>
        </div>
      )}

      <div className="border-t border-varindo-wash">
        <div className="shell py-5">
          <p className="text-[12px] leading-[1.5] text-varindo-mid">
            {t('footer', 'copyright', lang, { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
