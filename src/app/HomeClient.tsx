'use client';

import Link from 'next/link';
import type { Product } from '@/types/product';
import { ProductGrid } from '@/components/ProductGrid';
import { Reveal } from '@/components/Reveal';
import { ChapterHeading } from '@/components/ChapterHeading';
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

  // Chapters are numbered in the order they render; the product rows can
  // be empty, so the count is taken as the page is built.
  let chapter = 0;
  const next = () => ++chapter;

  return (
    <div>
      {/* ─── HERO ─────────────────────────────────────────────────
          A thesis statement alone in a tall white field: left-aligned,
          40px, no weight. The two actions sit quietly beneath it. */}
      <section className="bg-white pt-[var(--space-hero)]">
        <div className="shell">
          <p className="label animate-fade-up">{t('home', 'heroBadge', lang)}</p>
          <h1 className="display animate-fade-up mt-4 max-w-[900px] text-[40px] leading-[1] text-varindo-ink sm:text-[64px]">
            {t('home', 'heroLine1', lang)}{' '}
            {t('home', 'heroLine2', lang)}{' '}{t('home', 'heroLine3', lang)}
          </h1>
          <p className="animate-fade-up mt-6 max-w-[720px] text-[24px] leading-[1.15] tracking-[-0.01em] text-varindo-mid">
            {t('home', 'heroBody', lang)}
          </p>
          <div className="animate-fade-up delay-100 mt-8 flex flex-wrap items-center gap-3">
            <Link href="/products" className="btn-blue">{t('home', 'browseCta', lang)}</Link>
            <Link href="/surface-match" className="btn-ghost">{t('home', 'surfaceMatchCta', lang)}</Link>
            <Link href="/request-sample" className="btn-ghost">{t('detail', 'sampleCta', lang)}</Link>
          </div>

          {/* Photography is the only colour on the page */}
          <div
            className="animate-fade-up delay-200 mt-16 h-[clamp(260px,46vw,560px)] rounded-card bg-varindo-canvas bg-cover bg-center"
            style={{ backgroundImage: "url('/portfolio.webp')" }}
            role="img"
            aria-label={t('home', 'heroBadge', lang)}
          />
        </div>
      </section>

      {/* ─── SEARCH ───────────────────────────────────────────── */}
      <section className="band">
        <div className="shell pt-[var(--space-section)]">
          <Reveal className="max-w-[720px]">
            <p className="label">{t('home', 'quickSearchTitle', lang)}</p>
            <form action="/products" className="relative mt-4">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-varindo-mid">
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
                className="field h-14 pl-11 text-[18px]"
              />
            </form>
            <div className="mt-4 flex flex-wrap gap-3">
              {quickSearch.map((item) => (
                <Link key={item.href} href={item.href} className="btn-ghost">
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
            <ChapterHeading n={next()}>{t('home', 'collectionsSectionTitle', lang)}</ChapterHeading>
            <Link href="/products" className="link-arrow shrink-0">
              {t('home', 'collectionsViewAll', lang).replace('→', '').trim()}
            </Link>
          </Reveal>
          <div className="grid gap-8 sm:grid-cols-3">
            {materialLibrary.map((item, i) => (
              <Reveal key={item.href} delay={i * 80} className="h-full">
                <Link href={item.href} className="group block h-full">
                  <h3 className="text-[24px] leading-[1.15] tracking-[-0.01em] text-varindo-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[16px] leading-[1.25] text-varindo-mid">{item.desc}</p>
                  <span className="link-arrow mt-4 group-hover:decoration-varindo-ink">
                    {t('home', 'viewAll', lang).replace('→', '').trim()}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEW ARRIVALS ─────────────────────────────────────── */}
      {newProducts.length > 0 && (
        <section className="band">
          <div className="shell band-pad">
            <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-[640px]">
                <ChapterHeading n={next()}>{t('home', 'newArrivalsTitle', lang)}</ChapterHeading>
                <p className="copy mt-4">{t('home', 'newArrivalsBody', lang)}</p>
              </div>
              <Link href="/collections/new-arrivals" className="link-arrow shrink-0">
                {t('home', 'viewAll', lang).replace('→', '').trim()}
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
              <div className="max-w-[640px]">
                <ChapterHeading n={next()}>{t('home', 'bestSellersTitle', lang)}</ChapterHeading>
                <p className="copy mt-4">{t('home', 'bestSellersBody', lang)}</p>
              </div>
              <Link href="/collections/best-sellers" className="link-arrow shrink-0">
                {t('home', 'viewAll', lang).replace('→', '').trim()}
              </Link>
            </Reveal>
            <Reveal delay={100}>
              <ProductGrid products={bestSellers} />
            </Reveal>
          </div>
        </section>
      )}

      {/* ─── PORTFOLIO ────────────────────────────────────────── */}
      <section className="band">
        <div className="shell band-pad">
          <Reveal>
            <ChapterHeading n={next()}>
              {t('home', 'portfolioTitle1', lang)} {t('home', 'portfolioTitle2', lang)}
            </ChapterHeading>
            <div className="mt-8 grid items-end gap-8 lg:grid-cols-[2fr_1fr]">
              <div
                className="h-[clamp(260px,38vw,460px)] rounded-card bg-varindo-canvas bg-cover bg-center"
                style={{ backgroundImage: "url('/banner.webp')" }}
                role="img"
                aria-label={t('home', 'portfolioLabel', lang)}
              />
              <div>
                <p className="copy max-w-[640px]">{t('home', 'portfolioBody', lang)}</p>
                <Link href="/portfolio" className="btn-blue mt-6">
                  {t('home', 'portfolioCta', lang)}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── WHY VARINDO ──────────────────────────────────────── */}
      <section className="band">
        <div className="shell band-pad">
          <Reveal className="mb-10 max-w-[640px]">
            <ChapterHeading n={next()}>
              {t('home', 'whyTitle1', lang)} {t('home', 'whyTitle2', lang)}
            </ChapterHeading>
            <p className="copy mt-4">{t('home', 'whyBody', lang)}</p>
          </Reveal>
          <Reveal delay={100}>
            <ul className="list-band">
              {whyItems.map((item) => (
                <li key={item.title} className="grid gap-2 sm:grid-cols-[1fr_2fr] sm:gap-8">
                  <h3 className="text-[16px] leading-[1.25] text-varindo-ink">{item.title}</h3>
                  <p className="text-[16px] leading-[1.25] text-varindo-mid">{item.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
