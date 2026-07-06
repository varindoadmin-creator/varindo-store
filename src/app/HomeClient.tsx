'use client';

import Link from 'next/link';
import type { Product } from '@/types/product';
import { ProductGrid } from '@/components/ProductGrid';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

type Props = {
  allCount: number;
  newProducts: Product[];
  bestSellers: Product[];

};

export function HomeClient({ allCount, newProducts, bestSellers }: Props) {
  const { lang } = useLang();

  const quickSearch = [
    { label: 'Woods',       href: '/collections/woods' },
    { label: 'Patterns',    href: '/collections/patterns' },
    { label: 'Solids',      href: '/collections/solids' },
  ];

  const materialLibrary = [
    { title: 'Woods',       href: '/collections/woods',       desc: t('home', 'woodsDesc', lang) },
    { title: 'Patterns',    href: '/collections/patterns',    desc: t('home', 'patternsDesc', lang) },
    { title: 'Solids',      href: '/collections/solids',      desc: t('home', 'solidsDesc', lang) },
  ];

  const whyItems = [
    { title: t('home', 'why1Title', lang), body: t('home', 'why1Body', lang) },
    { title: t('home', 'why2Title', lang), body: t('home', 'why2Body', lang) },
    { title: t('home', 'why3Title', lang), body: t('home', 'why3Body', lang) },
  ];

  return (
    <div>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-varindo-ink min-h-[calc(100vh-100px)] flex items-center">
        <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: "url('/portfolio.webp')" }} />
        <div className="absolute inset-0 -z-10 bg-varindo-ink/55" />
        <div className="absolute inset-y-0 left-0 -z-10 w-3/4 bg-gradient-to-r from-varindo-ink/75 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-varindo-ink/60 to-transparent" />

        <div className="shell w-full grid lg:grid-cols-2 gap-12 py-20 lg:py-28 items-center">
          <div className="animate-fade-up">
            <p className="label text-varindo-300 mb-5">{t('home', 'heroBadge', lang)}</p>
            <h1 className="display text-white text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-6 leading-[1.0]">
              {t('home', 'heroLine1', lang)}<br />
              <em className="text-varindo-300 not-italic">{t('home', 'heroLine2', lang)}</em><br />
              {t('home', 'heroLine3', lang)}
            </h1>
            <p className="text-[14px] leading-7 text-white/65 max-w-md mb-8">
              {t('home', 'heroBody', lang)}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="btn-ghost-white">
                {t('home', 'browseCta', lang)}
              </Link>
              <Link href="/surface-match" className="btn-ghost-white">
                {t('home', 'surfaceMatchCta', lang)}
              </Link>
            </div>
          </div>

          <div className="animate-fade-up delay-200">
            <div className="bg-white border border-varindo-line p-6 sm:p-8 shadow-luxury">
              <div className="mb-6">
                <p className="label text-varindo-gold mb-1">{t('home', 'quickSearchLabel', lang)}</p>
                <p className="font-display text-2xl font-light text-varindo-ink">{t('home', 'quickSearchTitle', lang)}</p>
              </div>
              <form action="/products" className="relative mb-5">
                <input type="search" name="search" aria-label={t('home', 'quickSearchTitle', lang)}
                  placeholder={t('home', 'searchPlaceholder', lang)} className="field pr-12" />
                <button type="submit" aria-label="Cari"
                  className="absolute right-0 top-0 h-11 w-11 bg-varindo-ink flex items-center justify-center text-white hover:bg-varindo-800 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </form>
              <div className="grid grid-cols-3 gap-px bg-varindo-line border border-varindo-line">
                {quickSearch.map((item) => (
                  <Link key={item.href} href={item.href}
                    className="bg-white p-4 hover:bg-varindo-50 transition-colors group">
                    <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-varindo-ink group-hover:text-varindo-gold transition-colors">
                      {item.label}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-varindo-line">
                <p className="text-[11px] text-varindo-400">
                  <span className="font-semibold text-varindo-ink">{allCount.toLocaleString('id-ID')}</span>
                  {' '}{t('home', 'productCount', lang)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10">
          <div className="shell py-4 flex items-center gap-8 overflow-x-auto">
            {[t('home', 'stripDealer', lang)].map((item) => (
              <span key={item} className="text-[10px] tracking-[0.2em] uppercase text-white/40 shrink-0">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MATERIAL LIBRARY ─────────────────────────────────── */}
      <section className="border-b border-varindo-line">
        <div className="shell py-[var(--space-section)]">
          <Reveal className="flex items-end justify-between mb-10">
            <div>
              <p className="label mb-3">{t('home', 'collectionsSectionLabel', lang)}</p>
              <h2 className="display text-varindo-ink text-4xl sm:text-5xl lg:text-6xl">
                {t('home', 'collectionsSectionTitle', lang)}
              </h2>
            </div>
            <Link href="/products" className="hidden sm:block text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-500 hover:text-varindo-ink transition-colors">
              {t('home', 'collectionsViewAll', lang)}
            </Link>
          </Reveal>
          <div className="grid grid-cols-3 gap-px bg-varindo-line border border-varindo-line">
            {materialLibrary.map((item, i) => (
              <Reveal key={item.href} delay={i * 80}>
                <Link href={item.href}
                  className="block h-full bg-white p-6 hover:bg-varindo-50 transition-colors group">
                  <div className="w-6 h-[1.5px] bg-varindo-line group-hover:bg-varindo-gold transition-colors mb-4" />
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-ink group-hover:text-varindo-gold transition-colors mb-3">
                    {item.title}
                  </p>
                  <p className="text-[12px] leading-6 text-varindo-400">{item.desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEW ARRIVALS ─────────────────────────────────────── */}
      {newProducts.length > 0 && (
        <section className="border-b border-varindo-line">
          <div className="shell py-[var(--space-section)]">
            <Reveal className="flex items-end justify-between mb-10">
              <div>
                <p className="label mb-3">{t('home', 'newArrivalsLabel', lang)}</p>
                <h2 className="display text-varindo-ink text-4xl sm:text-5xl lg:text-6xl">{t('home', 'newArrivalsTitle', lang)}</h2>
                <p className="mt-3 text-[13px] leading-7 text-varindo-500 max-w-lg">{t('home', 'newArrivalsBody', lang)}</p>
              </div>
              <Link href="/collections/new-arrivals" className="hidden sm:block text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-500 hover:text-varindo-ink transition-colors shrink-0 ml-6">
                {t('home', 'viewAll', lang)}
              </Link>
            </Reveal>
            <Reveal delay={100}>
              <ProductGrid products={newProducts} />
            </Reveal>
          </div>
        </section>
      )}

      {/* ─── BEST SELLERS ─────────────────────────────────────── */}
      {bestSellers.length > 0 && (
        <section className="border-b border-varindo-line bg-varindo-50">
          <div className="shell py-[var(--space-section)]">
            <Reveal className="flex items-end justify-between mb-10">
              <div>
                <p className="label mb-3">{t('home', 'bestSellersLabel', lang)}</p>
                <h2 className="display text-varindo-ink text-4xl sm:text-5xl lg:text-6xl">{t('home', 'bestSellersTitle', lang)}</h2>
                <p className="mt-3 text-[13px] leading-7 text-varindo-500 max-w-lg">{t('home', 'bestSellersBody', lang)}</p>
              </div>
              <Link href="/collections/best-sellers" className="hidden sm:block text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-500 hover:text-varindo-ink transition-colors shrink-0 ml-6">
                {t('home', 'viewAll', lang)}
              </Link>
            </Reveal>
            <Reveal delay={100}>
              <ProductGrid products={bestSellers} />
            </Reveal>
          </div>
        </section>
      )}

      {/* ─── PORTFOLIO CTA ────────────────────────────────────── */}
      <section>
        <div className="grid lg:grid-cols-2 min-h-[420px]">
          <Reveal className="bg-varindo-ink text-white flex flex-col justify-center px-8 py-14 sm:px-12 sm:py-16 lg:px-16">
            <p className="label text-varindo-400 mb-5">{t('home', 'portfolioLabel', lang)}</p>
            <h2 className="display text-white text-4xl sm:text-5xl lg:text-6xl mb-6">
              {t('home', 'portfolioTitle1', lang)}<br />
              <em className="text-varindo-300 not-italic">{t('home', 'portfolioTitle2', lang)}</em>
            </h2>
            <p className="text-[14px] leading-7 text-varindo-400 max-w-sm mb-8">{t('home', 'portfolioBody', lang)}</p>
            <a href="https://online.flippingbook.com/view/842367758/4-5/" target="_blank" rel="noreferrer" className="btn-ghost-white self-start">
              {t('home', 'portfolioCta', lang)}
            </a>
          </Reveal>
          <div className="relative min-h-[280px] bg-cover bg-center" style={{ backgroundImage: "url('/banner.webp')" }}>
            <div className="absolute inset-0 bg-gradient-to-r from-varindo-ink/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* ─── WHY VARINDO ──────────────────────────────────────── */}
      <section className="border-t border-varindo-line bg-varindo-50">
        <div className="shell py-[var(--space-section)]">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <Reveal>
              <p className="label mb-4">{t('home', 'whyLabel', lang)}</p>
              <h2 className="display text-varindo-ink text-4xl sm:text-5xl lg:text-6xl mb-5">
                {t('home', 'whyTitle1', lang)}<br />{t('home', 'whyTitle2', lang)}
              </h2>
              <p className="text-[14px] leading-7 text-varindo-500 max-w-md">{t('home', 'whyBody', lang)}</p>
            </Reveal>
            <div className="grid sm:grid-cols-3 gap-px bg-varindo-line border border-varindo-line">
              {whyItems.map((item, i) => (
                <Reveal key={item.title} delay={i * 80} className="h-full">
                  <div className="h-full bg-white p-6">
                    <div className="w-6 h-[1.5px] bg-varindo-gold mb-4" />
                    <h3 className="text-[13px] font-semibold text-varindo-ink mb-2">{item.title}</h3>
                    <p className="text-[12px] leading-6 text-varindo-500">{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
