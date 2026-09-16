'use client';

import Link from 'next/link';
import type { Product } from '@/types/product';
import { ProductGrid } from '@/components/ProductGrid';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

type Props = {
  newProducts: Product[];
  bestSellers: Product[];

};

export function HomeClient({ newProducts, bestSellers }: Props) {
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
      {/* ─── HERO ─────────────────────────────────────────────────
          The split panel: deep panel carrying the editorial headline on
          one side, full-bleed product photography on the other, each
          flush to its own viewport edge. */}
      <section className="grid lg:grid-cols-2">
        <div className="order-2 flex flex-col justify-center bg-varindo-obsidian px-6 py-16 sm:px-12 sm:py-20 lg:order-1 lg:px-16 lg:py-24 xl:px-24">
          <div className="mx-auto w-full max-w-[560px] lg:mx-0">
            <p className="animate-fade-up text-[14px] font-bold uppercase leading-[1.4] tracking-label text-white">
              {t('home', 'heroBadge', lang)}
            </p>
            <h1 className="display animate-fade-up mt-4 text-[40px] text-white sm:text-[56px] lg:text-[64px] xl:text-[72px]">
              {t('home', 'heroLine1', lang)}<br />
              {t('home', 'heroLine2', lang)}{' '}{t('home', 'heroLine3', lang)}
            </h1>
            <p className="animate-fade-up delay-100 mt-5 max-w-[480px] text-[16px] leading-[1.5] text-white/80">
              {t('home', 'heroBody', lang)}
            </p>
            <div className="animate-fade-up delay-200 mt-10 flex flex-wrap items-center gap-3">
              <Link href="/products" className="btn-white">{t('home', 'browseCta', lang)}</Link>
              <Link href="/surface-match" className="btn-ghost-white">
                {t('home', 'surfaceMatchCta', lang)}
              </Link>
            </div>
            {/* The sample request is the third call — an annotation on the
                panel rather than a third box competing with the two buttons. */}
            <Link
              href="/request-sample"
              className="link-arrow animate-fade-up delay-300 mt-6 text-white">
              {t('detail', 'sampleCta', lang)} <span aria-hidden="true">›</span>
            </Link>
          </div>
        </div>

        {/* Product visual — flush to the viewport edge, no radius */}
        <div
          className="order-1 h-[clamp(280px,42vw,620px)] bg-cover bg-center lg:order-2 lg:h-auto lg:min-h-[620px]"
          style={{ backgroundImage: "url('/portfolio.webp')" }}
          role="img"
          aria-label={t('home', 'heroBadge', lang)}
        />
      </section>

      {/* ─── SEARCH ───────────────────────────────────────────── */}
      <section className="band-alt">
        <div className="shell band-pad">
          <Reveal className="max-w-[680px]">
            <p className="label mb-3">{t('home', 'quickSearchLabel', lang)}</p>
            <h2 className="display text-[40px] text-varindo-ink sm:text-[48px]">
              {t('home', 'quickSearchTitle', lang)}
            </h2>
            <form action="/products" className="relative mt-8">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-varindo-mid">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="search"
                name="search"
                aria-label={t('home', 'quickSearchTitle', lang)}
                placeholder={t('home', 'searchPlaceholder', lang)}
                className="h-12 w-full rounded-xl2 border border-varindo-line bg-white pl-10 pr-4 text-[16px] tracking-normal text-varindo-ink outline-none transition-colors placeholder:text-varindo-mid focus:border-varindo-ink"
              />
            </form>
            <div className="mt-6 flex flex-wrap gap-2">
              {quickSearch.map((item) => (
                <Link key={item.href} href={item.href} className="btn-soft">
                  {item.label}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── MATERIAL LIBRARY ─────────────────────────────────── */}
      <section className="band">
        <div className="shell band-pad">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label mb-2">{t('home', 'collectionsSectionLabel', lang)}</p>
              <h2 className="display text-[40px] text-varindo-ink sm:text-[48px]">
                {t('home', 'collectionsSectionTitle', lang)}
              </h2>
            </div>
            <Link href="/products" className="link-arrow">
              {t('home', 'collectionsViewAll', lang).replace('→', '›')}
            </Link>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-3">
            {materialLibrary.map((item, i) => (
              <Reveal key={item.href} delay={i * 80} className="h-full">
                <Link href={item.href}
                  className="surface-card-alt group block h-full p-6 hover:bg-varindo-wash">
                  <h3 className="section-title text-[24px] sm:text-[24px]">
                    {item.title}
                  </h3>
                  <p className="copy mt-3">{item.desc}</p>
                  <span className="link-arrow mt-6">
                    {t('home', 'viewAll', lang).replace('→', '').trim()} <span aria-hidden="true">›</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEW ARRIVALS ─────────────────────────────────────── */}
      {newProducts.length > 0 && (
        <section className="band-alt">
          <div className="shell band-pad">
            <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <h2 className="display text-[40px] text-varindo-ink sm:text-[48px]">{t('home', 'newArrivalsTitle', lang)}</h2>
                <p className="copy mt-3 max-w-xl">{t('home', 'newArrivalsBody', lang)}</p>
              </div>
              <Link href="/collections/new-arrivals" className="link-arrow shrink-0">
                {t('home', 'viewAll', lang).replace('→', '')} <span aria-hidden="true">›</span>
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
        <section className="band">
          <div className="shell band-pad">
            <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <h2 className="display text-[40px] text-varindo-ink sm:text-[48px]">{t('home', 'bestSellersTitle', lang)}</h2>
                <p className="copy mt-3 max-w-xl">{t('home', 'bestSellersBody', lang)}</p>
              </div>
              <Link href="/collections/best-sellers" className="link-arrow shrink-0">
                {t('home', 'viewAll', lang).replace('→', '')} <span aria-hidden="true">›</span>
              </Link>
            </Reveal>
            <Reveal delay={100}>
              <ProductGrid products={bestSellers} />
            </Reveal>
          </div>
        </section>
      )}

      {/* ─── PORTFOLIO ────────────────────────────────────────── */}
      <section className="band-alt">
        <div className="shell band-pad">
          <Reveal className="grid items-center gap-6 lg:grid-cols-2">
            <div className="order-2 lg:order-1 lg:pr-10">
              <h2 className="display text-[40px] text-varindo-ink sm:text-[48px]">
                {t('home', 'portfolioTitle1', lang)} {t('home', 'portfolioTitle2', lang)}
              </h2>
              <p className="copy mt-4 max-w-md">{t('home', 'portfolioBody', lang)}</p>
              <Link href="/portfolio" className="btn-ink mt-8">
                {t('home', 'portfolioCta', lang)}
              </Link>
            </div>
            <div
              className="order-1 h-[clamp(280px,38vw,480px)] rounded-card bg-cover bg-center lg:order-2"
              style={{ backgroundImage: "url('/banner.webp')" }}
              role="img"
              aria-label={t('home', 'portfolioLabel', lang)}
            />
          </Reveal>
        </div>
      </section>

      {/* ─── WHY VARINDO ──────────────────────────────────────── */}
      <section className="band">
        <div className="shell band-pad">
          <Reveal className="mb-10 max-w-2xl">
            <h2 className="display text-[40px] text-varindo-ink sm:text-[48px]">
              {t('home', 'whyTitle1', lang)} {t('home', 'whyTitle2', lang)}
            </h2>
            <p className="copy mt-4">{t('home', 'whyBody', lang)}</p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-3">
            {whyItems.map((item, i) => (
              <Reveal key={item.title} delay={i * 80} className="h-full">
                <div className="surface-card-alt h-full p-6">
                  <h3 className="section-title text-[24px] sm:text-[24px]">
                    {item.title}
                  </h3>
                  <p className="copy mt-3">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
