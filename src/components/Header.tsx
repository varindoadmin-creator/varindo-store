'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { FormEvent, useState, useEffect, useRef } from 'react';
import { useLang } from '@/lib/LangContext';
import { useCart } from '@/lib/CartContext';
import { SURFACE_MATCH_ENABLED } from '@/lib/features';
import { t, type Lang } from '@/lib/i18n';

// The Google Play badge is left off until the Varindo app is published; its
// art (public/play-badge-*.png) and text (i18n nav.getApp) are kept for then.

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

/* Segmented control — the only place two states sit side by side. */
function LangSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex shrink-0 items-center rounded-ctl border border-varindo-line bg-varindo-canvas p-[2px]">
      {(['id', 'en'] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`mono rounded-[6px] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] transition-colors ${
            lang === l ? 'bg-varindo-paper text-varindo-ink shadow-[0_1px_2px_rgba(23,21,15,0.08)]' : 'text-varindo-mid hover:text-varindo-ink'
          }`}
        >
          {l === 'id' ? 'ID' : 'EN'}
        </button>
      ))}
    </div>
  );
}

/* Search is a hairline field with the glyph inside it. It squares off with
   the rest of the controls; the catalogue is the point of the site, so this
   is the one place the chrome is allowed to take up width. An X clears it in
   one tap, and the last few searches drop down under it on focus — kept in
   this browser only, since a code looked up yesterday is often looked up
   again today. */
const RECENT_KEY = 'varindo-recent-searches';
const RECENT_MAX = 6;

function readRecent(): string[] {
  try {
    const stored = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return Array.isArray(stored) ? stored.filter((s): s is string => typeof s === 'string').slice(0, RECENT_MAX) : [];
  } catch {
    return [];
  }
}

function writeRecent(list: string[]) {
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(list)); } catch { /* private mode: nothing kept */ }
}

function HeaderSearch({ onSearch, size = 'sm' }: { onSearch?: () => void; size?: 'sm' | 'lg' }) {
  const router = useRouter();
  const { lang } = useLang();
  const [search, setSearch] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { setRecent(readRecent()); }, []);

  // Close the dropdown on a tap anywhere else.
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open]);

  const go = (raw: string) => {
    const query = raw.trim();
    if (query) {
      // Newest first, once each, whatever the case it was typed in.
      const next = [query, ...readRecent().filter((r) => r.toLowerCase() !== query.toLowerCase())].slice(0, RECENT_MAX);
      writeRecent(next);
      setRecent(next);
    }
    setOpen(false);
    inputRef.current?.blur();
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : '/products');
    onSearch?.();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    go(search);
  };

  const remove = (item: string) => {
    const next = recent.filter((r) => r !== item);
    writeRecent(next);
    setRecent(next);
  };

  const clearAll = () => {
    writeRecent([]);
    setRecent([]);
    setOpen(false);
  };

  // While typing, only the recent searches that match what is typed.
  const typed = search.trim().toLowerCase();
  const shown = typed ? recent.filter((r) => r.toLowerCase().includes(typed) && r.toLowerCase() !== typed) : recent;
  const lg = size === 'lg';

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="relative w-full">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-varindo-mid">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <input
        ref={inputRef}
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
        placeholder={t('nav', 'searchPlaceholder', lang)}
        aria-label={t('nav', 'searchPlaceholder', lang)}
        className={`${lg ? 'h-12 text-[16px] pr-12' : 'h-10 text-[14px] pr-10'} w-full rounded-ctl border border-varindo-line bg-varindo-canvas pl-9 text-varindo-ink outline-none transition-colors duration-150 placeholder:text-varindo-mid focus:border-varindo-clay focus:bg-varindo-paper [&::-webkit-search-cancel-button]:appearance-none`}
      />
      {search && (
        <button
          type="button"
          onClick={() => { setSearch(''); setOpen(true); inputRef.current?.focus(); }}
          aria-label={t('nav', 'clearSearch', lang)}
          className={`absolute right-1 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full text-varindo-mid transition-colors hover:text-varindo-ink ${lg ? 'h-10 w-10' : 'h-8 w-8'}`}
        >
          <svg width={lg ? 16 : 14} height={lg ? 16 : 14} viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
      <button type="submit" className="sr-only">{t('nav', 'searchPlaceholder', lang)}</button>

      {open && shown.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-ctl border border-varindo-line bg-varindo-paper shadow-[0_8px_24px_rgba(23,21,15,0.08)]">
          <div className="flex items-center justify-between px-3 pb-1 pt-2.5">
            <span className="label">{t('nav', 'recentSearches', lang)}</span>
            <button type="button" onClick={clearAll} className="text-[12px] text-varindo-mid transition-colors hover:text-varindo-clay">
              {t('nav', 'clearRecent', lang)}
            </button>
          </div>
          <ul>
            {shown.map((item) => (
              <li key={item} className="flex items-center">
                <button
                  type="button"
                  onClick={() => { setSearch(item); go(item); }}
                  className={`flex min-w-0 flex-1 items-center gap-2.5 px-3 text-left text-varindo-ink transition-colors hover:bg-varindo-canvas ${lg ? 'py-3 text-[16px]' : 'py-2 text-[14px]'}`}
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 text-varindo-mid">
                    <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 4.5V8L10.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="truncate">{item}</span>
                </button>
                <button
                  type="button"
                  onClick={() => remove(item)}
                  aria-label={`${t('nav', 'removeRecent', lang)}: ${item}`}
                  className={`flex shrink-0 items-center justify-center text-varindo-mid transition-colors hover:text-varindo-ink ${lg ? 'h-11 w-11' : 'h-9 w-9'}`}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}

/* The cart is a bag glyph with the number of sheets in it. It stays outside
   the mobile menu, beside the hamburger, so the cart is one tap away on
   every screen. */
function CartLink() {
  const { lang } = useLang();
  const { count } = useCart();
  const label = count > 0 ? `${t('shop', 'cart', lang)} (${count})` : t('shop', 'cart', lang);
  return (
    <Link href="/cart" aria-label={label}
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-ctl text-varindo-deep transition-colors hover:text-varindo-ink">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 10V6.5a3 3 0 0 1 6 0V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {count > 0 && (
        <span className="mono absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-pill bg-varindo-clay px-1 text-[10px] font-medium leading-none text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}

export function Header() {
  const { lang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  return (
    <>
      {/* Promo ribbon — one quiet mono line, closed by a hairline */}
      <div className="border-b border-varindo-line bg-varindo-canvas px-4 py-2 text-center">
        <p className="mono text-[11px] uppercase tracking-[0.1em] text-varindo-deep">
          {t('nav', 'announcementBar', lang)}
        </p>
      </div>

      {/* Global nav — a hairline holds it to the page at every scroll
          position; only the ground changes when you leave the top. */}
      <header
        className={`sticky top-0 z-50 border-b border-varindo-line transition-colors duration-300 ${
          scrolled
            ? 'bg-varindo-nav/85 backdrop-blur-[20px]'
            : 'bg-varindo-paper'
        }`}
      >
        <div className="shell">
          <div className="flex h-[64px] items-center justify-between gap-6">

            {/* Logo + Lamitak authorized dealer badge */}
            <div className="flex shrink-0 items-center gap-3 lg:gap-4">
              <Link href="/" className="shrink-0" aria-label="Varindo">
                <Image src="/varindo-logo-transparent.png" alt="CV. Varindo Forma Hutama"
                  width={88} height={48} className="h-auto w-[74px] object-contain transition-opacity hover:opacity-70" priority />
              </Link>
              <div className="h-7 w-px bg-varindo-line" />
              <div className="flex shrink-0 flex-col justify-center gap-[3px]">
                <span className="mono whitespace-nowrap text-[8px] uppercase leading-none tracking-[0.1em] text-varindo-mid">
                  Authorized Dealer of
                </span>
                <Image src="/lamitak-logo-mark.png" alt="Lamitak"
                  width={106} height={50} className="h-[22px] w-auto max-w-none object-contain sm:h-[24px] lg:h-[26px]" priority />
              </div>
            </div>

            {/* Desktop nav — 14px medium: the old 12px/400 was under-legible */}
            <nav className="hidden items-center gap-6 text-[14px] font-medium text-varindo-deep lg:flex">
              <Link href="/" className="transition-colors hover:text-varindo-ink">
                {t('nav', 'home', lang)}
              </Link>

              <div className="group relative py-5">
                <button className="flex cursor-pointer items-center gap-1 transition-colors hover:text-varindo-ink">
                  {t('nav', 'collections', lang)}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" className="translate-y-px transition-transform group-hover:rotate-180">
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="invisible absolute left-1/2 top-full z-[100] w-56 -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="mt-2 overflow-hidden rounded-xl2 border border-varindo-line bg-varindo-paper p-1.5 shadow-luxury">
                    {collectionItems.map((item) => (
                      <Link key={item.href} href={item.href}
                        className="block rounded-[6px] px-3 py-2 text-[14px] text-varindo-deep transition-colors hover:bg-varindo-canvas hover:text-varindo-ink">
                        {collectionLabels[item.key][lang]}
                      </Link>
                    ))}
                    <Link href="/products"
                      className="mt-1 block rounded-[6px] border-t border-varindo-line px-3 py-2 pt-2.5 text-[14px] font-medium text-varindo-link transition-colors hover:bg-varindo-canvas">
                      {t('nav', 'allProducts', lang)} ›
                    </Link>
                  </div>
                </div>
              </div>

              {SURFACE_MATCH_ENABLED && (
                <Link href="/surface-match" className="transition-colors hover:text-varindo-ink">
                  {t('nav', 'surfaceMatch', lang)}
                </Link>
              )}
            </nav>

            {/* Search */}
            <div className="hidden min-w-0 flex-1 max-w-xs lg:block xl:max-w-sm">
              <HeaderSearch />
            </div>

            {/* Right controls */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-3">
              <div className="hidden sm:block">
                <LangSwitcher />
              </div>
              <CartLink />

              {/* Mobile hamburger */}
              <button type="button" aria-label="Toggle menu" aria-expanded={isOpen}
                onClick={() => setIsOpen((v) => !v)}
                className="flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-[5px] lg:hidden">
                <span className={`block h-[1.5px] w-[18px] bg-varindo-ink transition-all duration-200 ${isOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
                <span className={`block h-[1.5px] w-[18px] bg-varindo-ink transition-all duration-200 ${isOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-[1.5px] w-[18px] bg-varindo-ink transition-all duration-200 ${isOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu — a white sheet, generously spaced */}
        {isOpen && (
          <div className="animate-fade-in border-t border-varindo-line bg-varindo-paper lg:hidden">
            <div className="shell pb-6 pt-2">
              <HeaderSearch size="lg" onSearch={() => setIsOpen(false)} />

              <nav className="mt-6">
                {[
                  { href: '/',         label: t('nav', 'home', lang) },
                  { href: '/products', label: t('nav', 'allProducts', lang) },
                  ...(SURFACE_MATCH_ENABLED ? [{ href: '/surface-match', label: t('nav', 'surfaceMatch', lang) }] : []),
                ].map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}
                    className="display block border-b border-varindo-line py-3 text-[24px] text-varindo-ink transition-colors hover:text-varindo-link">
                    {item.label}
                  </Link>
                ))}
              </nav>

              <p className="label mb-3 mt-8">{t('nav', 'collections', lang)}</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {collectionItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}
                    className="rounded-ctl border border-varindo-line bg-varindo-canvas px-4 py-3 text-center text-[14px] text-varindo-ink transition-colors hover:bg-varindo-wash">
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
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
