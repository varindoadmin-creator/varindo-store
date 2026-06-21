'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FormEvent, useState, useEffect } from 'react';
import { useLang } from '@/lib/LangContext';
import { t, type Lang } from '@/lib/i18n';

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

function LangSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center gap-0 border border-varindo-line overflow-hidden shrink-0">
      {(['id', 'en'] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`px-3 py-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors ${
            lang === l
              ? 'bg-varindo-ink text-white'
              : 'bg-white text-varindo-600 hover:text-varindo-ink'
          }`}
        >
          {l === 'id' ? 'ID' : 'EN'}
        </button>
      ))}
    </div>
  );
}

function HeaderSearch({ onSearch }: { onSearch?: () => void }) {
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
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t('nav', 'searchPlaceholder', lang)}
        aria-label={t('nav', 'searchPlaceholder', lang)}
        className="h-10 w-full border border-varindo-line bg-varindo-50 px-4 pr-12 text-[13px] text-varindo-ink outline-none transition-all duration-150 placeholder:text-varindo-400 focus:border-varindo-ink focus:bg-white"
      />
      <button
        type="submit"
        aria-label="Cari"
        className="absolute right-0 top-0 flex h-10 w-11 items-center justify-center bg-varindo-ink text-white transition hover:bg-varindo-800"
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </form>
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
      {/* Announcement bar */}
      <div className="bg-varindo-ink text-white text-center py-2 px-4">
        <p className="text-[10px] tracking-[0.22em] uppercase font-medium text-varindo-200">
          {t('nav', 'announcementBar', lang)}
        </p>
      </div>

      <header className={`sticky top-0 z-50 bg-varindo-paper transition-shadow duration-300 ${scrolled ? 'shadow-[0_1px_0_rgba(26,23,20,0.10)]' : ''}`}>
        <div className="rule" />

        <div className="shell">
          <div className="flex h-[68px] items-center justify-between gap-6">

            {/* Logo */}
            <Link href="/" className="shrink-0" aria-label="Varindo">
              <img src="/varindo-logo-transparent.png" alt="CV. Varindo Forma Hutama"
                style={{ width: '88px' }} className="h-auto object-contain opacity-90 hover:opacity-100 transition-opacity" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8 text-[11px] font-semibold tracking-[0.16em] uppercase text-varindo-700">
              <Link href="/" className="hover:text-varindo-ink transition-colors">
                {t('nav', 'home', lang)}
              </Link>

              <div className="group relative py-6">
                <button className="flex items-center gap-1 hover:text-varindo-ink transition-colors cursor-pointer">
                  {t('nav', 'collections', lang)}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" className="translate-y-px">
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="invisible absolute left-1/2 top-full -translate-x-1/2 w-52 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 z-[100]">
                  <div className="mt-2 border border-varindo-line bg-white shadow-luxury py-1">
                    {collectionItems.map((item) => (
                      <Link key={item.href} href={item.href}
                        className="block px-5 py-3 text-[11px] font-medium tracking-[0.1em] uppercase text-varindo-700 hover:bg-varindo-50 hover:text-varindo-ink transition-colors">
                        {collectionLabels[item.key][lang]}
                      </Link>
                    ))}
                    <div className="rule mx-4 my-1" />
                    <Link href="/products"
                      className="block px-5 py-3 text-[11px] font-semibold tracking-[0.1em] uppercase text-varindo-ink hover:bg-varindo-50 transition-colors">
                      {t('nav', 'allProducts', lang)} →
                    </Link>
                  </div>
                </div>
              </div>

              <Link href="/about" className="hover:text-varindo-ink transition-colors">
                {t('nav', 'about', lang)}
              </Link>
              <Link href="/contact" className="hover:text-varindo-ink transition-colors">
                {t('nav', 'contact', lang)}
              </Link>
            </nav>

            {/* Search */}
            <div className="hidden lg:block min-w-0 flex-1 max-w-xs xl:max-w-sm">
              <HeaderSearch />
            </div>

            {/* Right controls */}
            <div className="hidden sm:flex shrink-0 items-center gap-3">
              <LangSwitcher />
              <a href="https://wa.me/6281288885224" target="_blank" rel="noreferrer"
                className="btn-ink text-[10px] py-2.5 px-5">
                {t('nav', 'chatWithUs', lang)}
              </a>
            </div>

            {/* Mobile hamburger */}
            <button type="button" aria-label="Toggle menu" aria-expanded={isOpen}
              onClick={() => setIsOpen((v) => !v)}
              className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] shrink-0">
              <span className={`block h-[1.5px] w-6 bg-varindo-ink transition-all duration-200 ${isOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
              <span className={`block h-[1.5px] w-6 bg-varindo-ink transition-all duration-200 ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[1.5px] w-6 bg-varindo-ink transition-all duration-200 ${isOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>

        <div className="rule" />

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden bg-varindo-paper border-b border-varindo-line animate-fade-in">
            <div className="shell py-4">
              <HeaderSearch onSearch={() => setIsOpen(false)} />
            </div>
            <div className="rule" />
            <nav className="shell py-4">
              {[
                { href: '/',        label: t('nav', 'home', lang) },
                { href: '/products',label: t('nav', 'allProducts', lang) },
                { href: '/about',   label: t('nav', 'about', lang) },
                { href: '/contact', label: t('nav', 'contact', lang) },
              ].map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}
                  className="block py-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-700 hover:text-varindo-ink transition-colors border-b border-varindo-line/50 last:border-0">
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="rule" />
            <div className="shell py-4">
              <p className="label mb-3">{t('nav', 'collections', lang)}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {collectionItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}
                    className="border border-varindo-line bg-white px-3 py-3 text-center text-[10px] font-semibold tracking-[0.14em] uppercase text-varindo-700 hover:border-varindo-ink hover:text-varindo-ink transition-colors">
                    {collectionLabels[item.key][lang]}
                  </Link>
                ))}
              </div>
            </div>
            {/* Mobile lang + CTA */}
            <div className="shell pb-5 pt-2 flex gap-3 items-center">
              <LangSwitcher />
              <a href="https://wa.me/6281288885224" target="_blank" rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="btn-ink flex-1 justify-center">
                {t('nav', 'chatWithUs', lang)}
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
