'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { FormEvent, useState, useEffect } from 'react';
import { useLang } from '@/lib/LangContext';
import { t, type Lang } from '@/lib/i18n';
import { useIsTwa } from '@/lib/useIsTwa';

const PLAY_STORE_URL = 'https://play.google.com/apps/testing/co.varindo.catalog';
const PLAY_BADGE_SRC: Record<Lang, string> = { id: '/play-badge-id.png', en: '/play-badge-en.png' };
// Google's official badge art is 646x250 (2.584:1) at every locale.
const PLAY_BADGE_RATIO = 646 / 250;

const collectionItems = [
  { key: 'new-arrivals', href: '/collections/new-arrivals' },
  { key: 'best-sellers', href: '/collections/best-sellers' },
  { key: 'woods',        href: '/collections/woods' },
  { key: 'patterns',     href: '/collections/patterns' },
  { key: 'solids',       href: '/collections/solids' },
];

const collectionLabels: Record<string, { id: string; en: string }> = {
  'new-arrivals': { id: 'Produk Terbaru', en: 'New Arrivals' },
  'best-sellers': { id: 'Produk Terlaris', en: 'Best Sellers' },
  'woods':        { id: 'Woods',          en: 'Woods' },
  'patterns':     { id: 'Patterns',       en: 'Patterns' },
  'solids':       { id: 'Solids',         en: 'Solids' },
};

/* Segmented control — a Fog outline with the active state filled. */
function LangSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex shrink-0 items-center rounded-pill border border-varindo-line p-[3px]">
      {(['id', 'en'] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`rounded-[5px] px-3 py-1 text-[12px] tracking-[-0.01em] transition-colors ${
            lang === l ? 'bg-varindo-deep text-white' : 'text-varindo-mid hover:text-varindo-ink'
          }`}
        >
          {l === 'id' ? 'ID' : 'EN'}
        </button>
      ))}
    </div>
  );
}

/* Search is a plain Fog-outlined field with the glyph inside it. */
function HeaderSearch({ onSearch, size = 'sm' }: { onSearch?: () => void; size?: 'sm' | 'lg' }) {
  const router = useRouter();
  const { lang } = useLang();
  const [search, setSearch] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = search.trim();
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : '/products');
    onSearch?.();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-varindo-400">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t('nav', 'searchPlaceholder', lang)}
        aria-label={t('nav', 'searchPlaceholder', lang)}
        className={`${size === 'lg' ? 'h-12' : 'h-10'} w-full rounded-pill border border-varindo-line bg-white pl-10 pr-4 text-[16px] tracking-[-0.01em] text-varindo-ink outline-none transition-colors duration-150 placeholder:text-varindo-400 focus:border-varindo-ink`}
      />
      <button type="submit" className="sr-only">{t('nav', 'searchPlaceholder', lang)}</button>
    </form>
  );
}

export function Header() {
  const { lang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isTwa = useIsTwa();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  return (
    <>
      {/* Promo ribbon — one quiet caption line on a Mist band */}
      <div className="bg-varindo-canvas px-4 py-2 text-center">
        <p className="text-[12px] leading-[1.2] tracking-[-0.01em] text-varindo-mid">
          {t('nav', 'announcementBar', lang)}
        </p>
      </div>

      {/* Global nav — the white page shows through; a Fog hairline
          appears only once content scrolls beneath it */}
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_1px_0_#e6e6e6]' : ''
        }`}
      >
        <div className="shell">
          <div className="flex h-[72px] items-center justify-between gap-6">

            {/* Logo + Lamitak authorized dealer badge */}
            <div className="flex shrink-0 items-center gap-3 lg:gap-4">
              <Link href="/" className="shrink-0" aria-label="Varindo">
                <Image src="/varindo-logo-transparent.png" alt="CV. Varindo Forma Hutama"
                  width={88} height={48} className="h-auto w-[74px] object-contain transition-opacity hover:opacity-70" priority />
              </Link>
              <div className="h-7 w-px bg-varindo-line" />
              <div className="flex shrink-0 flex-col justify-center gap-[3px]">
                <span className="whitespace-nowrap text-[9px] leading-none tracking-[-0.01em] text-varindo-mid">
                  Authorized Dealer of
                </span>
                <Image src="/lamitak-logo-mark.png" alt="Lamitak"
                  width={106} height={50} className="h-[22px] w-auto max-w-none object-contain sm:h-[24px] lg:h-[26px]" priority />
              </div>
            </div>

            {/* Desktop nav — 16px, weight 400, nothing shouting */}
            <nav className="hidden items-center gap-6 text-[16px] tracking-[-0.01em] text-varindo-mid lg:flex">
              <Link href="/" className="transition-colors hover:text-varindo-ink">
                {t('nav', 'home', lang)}
              </Link>

              <div className="group relative py-5">
                <button className="flex cursor-pointer items-center gap-1 transition-colors hover:text-varindo-ink">
                  {t('nav', 'collections', lang)}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" className="translate-y-px">
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="invisible absolute left-1/2 top-full z-[100] w-56 -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="mt-2 overflow-hidden rounded-xl2 bg-white p-2 shadow-luxury">
                    {collectionItems.map((item) => (
                      <Link key={item.href} href={item.href}
                        className="block rounded-xl2 px-4 py-2.5 text-[16px] tracking-[-0.01em] text-varindo-deep transition-colors hover:bg-varindo-canvas hover:text-varindo-ink">
                        {collectionLabels[item.key][lang]}
                      </Link>
                    ))}
                    <Link href="/products"
                      className="mt-1 block rounded-xl2 px-4 py-2.5 text-[16px] tracking-[-0.01em] text-varindo-link transition-colors hover:bg-varindo-canvas">
                      {t('nav', 'allProducts', lang)} ›
                    </Link>
                  </div>
                </div>
              </div>

              <Link href="/surface-match" className="transition-colors hover:text-varindo-ink">
                {t('nav', 'surfaceMatch', lang)}
              </Link>
              <Link href="/blog" className="transition-colors hover:text-varindo-ink">
                {t('nav', 'blog', lang)}
              </Link>
              <Link href="/about" className="transition-colors hover:text-varindo-ink">
                {t('nav', 'about', lang)}
              </Link>
              <Link href="/contact" className="transition-colors hover:text-varindo-ink">
                {t('nav', 'contact', lang)}
              </Link>
            </nav>

            {/* Search */}
            <div className="hidden min-w-0 max-w-xs flex-1 xl:block">
              <HeaderSearch />
            </div>

            {/* Right controls */}
            <div className="hidden shrink-0 items-center gap-3 sm:flex">
              {!isTwa && (
                <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center transition-opacity hover:opacity-70">
                  <Image src={PLAY_BADGE_SRC[lang]} alt={t('nav', 'getApp', lang)}
                    width={Math.round(30 * PLAY_BADGE_RATIO)} height={30} className="h-[30px] w-auto" />
                </a>
              )}
              <LangSwitcher />
            </div>

            {/* Mobile hamburger — the one glyph, in a 16px-radius ink frame */}
            <button type="button" aria-label="Toggle menu" aria-expanded={isOpen}
              onClick={() => setIsOpen((v) => !v)}
              className="flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-[5px] rounded-nav border border-varindo-ink bg-white lg:hidden">
              <span className={`block h-[1.5px] w-[18px] bg-varindo-ink transition-all duration-200 ${isOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
              <span className={`block h-[1.5px] w-[18px] bg-varindo-ink transition-all duration-200 ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[1.5px] w-[18px] bg-varindo-ink transition-all duration-200 ${isOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu — a white sheet, generously spaced */}
        {isOpen && (
          <div className="animate-fade-in bg-white lg:hidden">
            <div className="shell pb-6 pt-2">
              <HeaderSearch size="lg" onSearch={() => setIsOpen(false)} />

              <nav className="mt-6">
                {[
                  { href: '/',         label: t('nav', 'home', lang) },
                  { href: '/products', label: t('nav', 'allProducts', lang) },
                  { href: '/surface-match', label: t('nav', 'surfaceMatch', lang) },
                  { href: '/blog',     label: t('nav', 'blog', lang) },
                  { href: '/about',    label: t('nav', 'about', lang) },
                  { href: '/contact',  label: t('nav', 'contact', lang) },
                ].map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}
                    className="block py-2 text-[40px] leading-[1.1] tracking-[-0.01em] text-varindo-ink transition-colors hover:text-varindo-mid">
                    {item.label}
                  </Link>
                ))}
              </nav>

              <p className="label mb-3 mt-8">{t('nav', 'collections', lang)}</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {collectionItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}
                    className="btn-ghost">
                    {collectionLabels[item.key][lang]}
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <LangSwitcher />
                  <a href="https://wa.me/6281288885224" target="_blank" rel="noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="btn-blue flex-1 justify-center">
                    {t('nav', 'chatWithUs', lang)}
                  </a>
                </div>
                {!isTwa && (
                  <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center justify-center">
                    <Image src={PLAY_BADGE_SRC[lang]} alt={t('nav', 'getApp', lang)}
                      width={Math.round(40 * PLAY_BADGE_RATIO)} height={40} className="h-10 w-auto" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
