'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FormEvent, useState, useEffect } from 'react';

const collectionItems = [
  { href: '/collections/new-arrivals', label: 'New Arrivals' },
  { href: '/collections/best-sellers', label: 'Best Sellers' },
  { href: '/collections/promo-items',  label: 'Promo Items' },
  { href: '/collections/woods',        label: 'Woods' },
  { href: '/collections/patterns',     label: 'Patterns' },
  { href: '/collections/solids',       label: 'Solids' }
];

function HeaderSearch({ onSearch }: { onSearch?: () => void }) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : '/products');
    onSearch?.();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by code, design, finish…"
        aria-label="Search products"
        className="h-10 w-full border border-varindo-line bg-varindo-50 px-4 pr-12 text-[13px] text-varindo-ink outline-none transition-all duration-150 placeholder:text-varindo-400 focus:border-varindo-ink focus:bg-white"
      />
      <button
        type="submit"
        aria-label="Submit search"
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
          Authorized Lamitak Dealer&nbsp;·&nbsp;Indonesia
        </p>
      </div>

      <header
        className={`sticky top-0 z-50 bg-varindo-paper transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_1px_0_rgba(26,23,20,0.10)]' : 'shadow-none'
        }`}
      >
        <div className="rule" />

        <div className="shell">
          <div className="flex h-[68px] items-center justify-between gap-6">

            {/* Logo */}
            <Link href="/" className="shrink-0" aria-label="Varindo Home">
              <img
                src="/varindo-logo-transparent.png"
                alt="CV. Varindo Forma Hutama"
                style={{ width: '88px' }}
                className="h-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8 text-[11px] font-semibold tracking-[0.16em] uppercase text-varindo-700">
              <Link href="/" className="hover:text-varindo-ink transition-colors">Home</Link>

              <div className="group relative py-6">
                <button className="flex items-center gap-1 hover:text-varindo-ink transition-colors cursor-pointer">
                  Collections
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" className="translate-y-px">
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="invisible absolute left-1/2 top-full -translate-x-1/2 w-52 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 z-[100]">
                  <div className="mt-2 border border-varindo-line bg-white shadow-luxury py-1">
                    {collectionItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-5 py-3 text-[11px] font-medium tracking-[0.1em] uppercase text-varindo-700 hover:bg-varindo-50 hover:text-varindo-ink transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="rule mx-4 my-1" />
                    <Link
                      href="/products"
                      className="block px-5 py-3 text-[11px] font-semibold tracking-[0.1em] uppercase text-varindo-ink hover:bg-varindo-50 transition-colors"
                    >
                      All Products →
                    </Link>
                  </div>
                </div>
              </div>

              <Link href="/about"   className="hover:text-varindo-ink transition-colors">About</Link>
              <Link href="/contact" className="hover:text-varindo-ink transition-colors">Contact</Link>
            </nav>

            {/* Search */}
            <div className="hidden lg:block min-w-0 flex-1 max-w-xs xl:max-w-sm">
              <HeaderSearch />
            </div>

            {/* CTA */}
            <div className="hidden sm:flex shrink-0 items-center gap-3">
              <a
                href="https://wa.me/6281288885224"
                target="_blank"
                rel="noreferrer"
                className="btn-ink text-[10px] py-2.5 px-5"
              >
                Chat with Us
              </a>
            </div>

            {/* Hamburger */}
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((v) => !v)}
              className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] shrink-0"
            >
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
                { href: '/',         label: 'Home' },
                { href: '/products', label: 'All Products' },
                { href: '/about',    label: 'About' },
                { href: '/contact',  label: 'Contact' }
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-700 hover:text-varindo-ink transition-colors border-b border-varindo-line/50 last:border-0"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="rule" />
            <div className="shell py-4">
              <p className="label mb-3">Collections</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {collectionItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="border border-varindo-line bg-white px-3 py-3 text-center text-[10px] font-semibold tracking-[0.14em] uppercase text-varindo-700 hover:border-varindo-ink hover:text-varindo-ink transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="shell pb-5 pt-2">
              <a
                href="https://wa.me/6281288885224"
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="btn-ink w-full justify-center"
              >
                Chat with Us
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
