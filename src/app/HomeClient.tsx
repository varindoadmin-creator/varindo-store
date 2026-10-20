'use client';

import Link from 'next/link';
import type { Product } from '@/types/product';
import { ProductGrid } from '@/components/ProductGrid';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/lib/LangContext';
import { SURFACE_MATCH_ENABLED } from '@/lib/features';
import { t } from '@/lib/i18n';

type Props = {
  newProducts: Product[];
  bestSellers: Product[];

};

/* Every band opens the same way: a clay-ticked mono label, a Fraunces
   heading, and an optional link sitting on the far right of the same
   baseline. One component so the rhythm can't drift section to section. */
function SectionHead({
  label, title, body, action, actionHref,
}: {
  label: string; title: string; body?: string; action?: string; actionHref?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
      <div className="max-w-2xl">
        <p className="label-marked mb-3">{label}</p>
        <h2 className="display text-[30px] text-varindo-ink sm:text-[40px]">{title}</h2>
        {body && <p className="copy mt-3 max-w-xl">{body}</p>}
      </div>
      {action && actionHref && (
        <Link href={actionHref} className="link-arrow shrink-0">
          {action} <span aria-hidden="true">›</span>
        </Link>
      )}
    </div>
  );
}

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

  const viewAll = t('home', 'viewAll', lang).replace('→', '').trim();

  return (
    <div>
      {/* ─── HERO ─────────────────────────────────────────────────
          Two columns, so the first viewport carries the headline, the
          catalogue's search field and a real surface at the same time.
          The old centred stack pushed the visual below the fold and
          left the search on a band of its own further down; both now
          sit above it, and one whole section disappears. */}
      <section className="band">
        <div className="shell py-12 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-14">

            <div className="animate-fade-up">
              <p className="label-marked mb-5">{t('home', 'heroBadge', lang)}</p>
              <h1 className="display text-balance text-[38px] text-varindo-ink sm:text-[46px] lg:text-[50px] xl:text-[58px]">
                {t('home', 'heroLine1', lang)}<br />
                {t('home', 'heroLine2', lang)}{' '}{t('home', 'heroLine3', lang)}
              </h1>
              <p className="copy mt-5 max-w-lg">{t('home', 'heroBody', lang)}</p>

              {/* The catalogue's front door, in the hero rather than on a
                  band of its own 800px further down the page. */}
              <form action="/products" className="relative mt-8 max-w-lg">
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
                  className="h-12 w-full rounded-ctl border border-varindo-line bg-varindo-paper pl-11 pr-4 text-[15px] text-varindo-ink outline-none transition-colors placeholder:text-varindo-mid focus:border-varindo-clay"
                />
              </form>

              <div className="mt-3 flex flex-wrap gap-2">
                {quickSearch.map((item) => (
                  <Link key={item.href} href={item.href} className="chip">
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
                <Link href="/products" className="btn-blue">{t('home', 'browseCta', lang)}</Link>
                {SURFACE_MATCH_ENABLED && (
                  <Link href="/surface-match" className="link-arrow">
                    {t('home', 'surfaceMatchCta', lang)} <span aria-hidden="true">›</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Surface — the only thing on the page allowed to carry colour */}
            <div
              className="animate-fade-up delay-100 h-[clamp(240px,42vw,480px)] rounded-card border border-varindo-line bg-cover bg-center"
              style={{ backgroundImage: "url('/portfolio.webp')" }}
              role="img"
              aria-label={t('home', 'portfolioLabel', lang)}
            />
          </div>
        </div>
      </section>

      {/* ─── MATERIAL LIBRARY ─────────────────────────────────── */}
      <section className="band-alt band-line">
        <div className="shell band-pad">
          <Reveal>
            <SectionHead
              label={t('home', 'collectionsSectionLabel', lang)}
              title={t('home', 'collectionsSectionTitle', lang)}
              action={t('nav', 'allProducts', lang)}
              actionHref="/products"
            />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {materialLibrary.map((item, i) => (
              <Reveal key={item.href} delay={i * 60} className="h-full">
                <Link href={item.href}
                  className="surface-card group flex h-full flex-col p-6 hover:border-varindo-clay hover:bg-varindo-clay-wash">
                  <h3 className="display text-[24px] text-varindo-ink">{item.title}</h3>
                  <p className="copy mt-2 flex-1 text-[15px]">{item.desc}</p>
                  <span className="link-arrow mt-5">
                    {viewAll} <span aria-hidden="true">›</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEW ARRIVALS ─────────────────────────────────────── */}
      {newProducts.length > 0 && (
        <section className="band band-line">
          <div className="shell band-pad">
            <Reveal>
              <SectionHead
                label={t('home', 'newArrivalsLabel', lang)}
                title={t('home', 'newArrivalsTitle', lang)}
                body={t('home', 'newArrivalsBody', lang)}
                action={viewAll}
                actionHref="/collections/new-arrivals"
              />
            </Reveal>
            <Reveal delay={60}>
              <ProductGrid products={newProducts} />
            </Reveal>
          </div>
        </section>
      )}

      {/* ─── BEST SELLERS ─────────────────────────────────────── */}
      {bestSellers.length > 0 && (
        <section className="band-alt band-line">
          <div className="shell band-pad">
            <Reveal>
              <SectionHead
                label={t('home', 'bestSellersLabel', lang)}
                title={t('home', 'bestSellersTitle', lang)}
                body={t('home', 'bestSellersBody', lang)}
                action={viewAll}
                actionHref="/collections/best-sellers"
              />
            </Reveal>
            <Reveal delay={60}>
              <ProductGrid products={bestSellers} />
            </Reveal>
          </div>
        </section>
      )}

      {/* ─── PORTFOLIO ────────────────────────────────────────── */}
      <section className="band band-line">
        <div className="shell band-pad">
          <Reveal className="grid items-center gap-8 lg:grid-cols-2">
            <div className="order-2 lg:order-1 lg:pr-10">
              <p className="label-marked mb-3">{t('home', 'portfolioLabel', lang)}</p>
              <h2 className="display text-[30px] text-varindo-ink sm:text-[40px]">
                {t('home', 'portfolioTitle1', lang)}
              </h2>
              <p className="mono mt-2 text-[15px] text-varindo-mid">{t('home', 'portfolioTitle2', lang)}</p>
              <p className="copy mt-4 max-w-md">{t('home', 'portfolioBody', lang)}</p>
              <Link href="/portfolio" className="btn-ink mt-7">
                {t('home', 'portfolioCta', lang)}
              </Link>
            </div>
            <div
              className="order-1 h-[clamp(240px,34vw,420px)] rounded-card border border-varindo-line bg-cover bg-center lg:order-2"
              style={{ backgroundImage: "url('/banner.webp')" }}
              role="img"
              aria-label={t('home', 'portfolioLabel', lang)}
            />
          </Reveal>
        </div>
      </section>

      {/* ─── WHY VARINDO ──────────────────────────────────────── */}
      <section className="band-alt band-line">
        <div className="shell band-pad">
          <Reveal>
            <SectionHead
              label={t('home', 'whyLabel', lang)}
              title={`${t('home', 'whyTitle1', lang)} ${t('home', 'whyTitle2', lang)}`}
              body={t('home', 'whyBody', lang)}
            />
          </Reveal>
          {/* Numbered, because these are three claims a specifier checks
              in order, not three equivalent marketing tiles. */}
          <div className="grid gap-4 sm:grid-cols-3">
            {whyItems.map((item, i) => (
              <Reveal key={item.title} delay={i * 60} className="h-full">
                <div className="surface-card h-full p-6">
                  <p className="mono mb-3 text-[11px] font-medium tracking-[0.12em] text-varindo-clay-ink">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="text-[16px] font-semibold leading-[1.3] text-varindo-ink">
                    {item.title}
                  </h3>
                  <p className="copy mt-2 text-[15px]">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
