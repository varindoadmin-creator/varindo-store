'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { Product } from '@/types/product';
import { searchProducts } from '@/lib/products';
import { ProductGrid } from './ProductGrid';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

const PRODUCTS_PER_PAGE = 24;

const SIZE_OPTIONS = ["4'x8' / 1220 x 2440mm", "4'x10' / 1220 x 3050mm"];
const CATEGORY_OPTIONS = ['Patterns','Protak','Protak Core','Saville','Solid Core','Solids','Solids+','Woods','Bookmatched'];
const COLLECTION_OPTIONS = ['Woods', 'Patterns', 'Solids'];

// The size strings carry both the imperial and the metric name. The rail is
// 240px wide, so the chips show the imperial half and the metric stays in
// the title attribute, where a specifier checking dimensions can reach it.
const SIZE_SHORT: Record<string, string> = {
  "4'x8' / 1220 x 2440mm":  "4' × 8'",
  "4'x10' / 1220 x 3050mm": "4' × 10'",
};

function normalizeText(v?: string | null) { return (v || '').toLowerCase().trim(); }
function matchesSize(p: Product, s: string) { return !s || normalizeText(p.size) === normalizeText(s); }
function matchesCategory(p: Product, c: string) { return !c || normalizeText(p.category) === normalizeText(c); }

type FilterOptions = { collections: string[]; categories: string[]; finishes: string[]; sizes: string[]; colorFamilies: string[] };
type Props = { products: Product[]; filterOptions: FilterOptions; showCollectionTabs?: boolean; };

/* One filter group in the rail: a mono label and a wrapped set of chips.
   Chips rather than selects because a specifier scanning 787 laminates
   needs to see which axes are already narrowed without opening anything,
   and because a chip can show its own on/off state where a <select>
   collapses every unchosen option out of sight. */
function ChipGroup({
  label, options, value, onChange, allLabel, titleFor,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  allLabel: string;
  titleFor?: (o: string) => string;
}) {
  return (
    <div>
      <p className="label mb-2.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" onClick={() => onChange('')}
          className={value === '' ? 'chip-on' : 'chip'} aria-pressed={value === ''}>
          {allLabel}
        </button>
        {options.map((option) => (
          <button key={option} type="button" onClick={() => onChange(value === option ? '' : option)}
            title={titleFor?.(option)}
            className={value === option ? 'chip-on' : 'chip'} aria-pressed={value === option}>
            {SIZE_SHORT[option] || option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ProductExplorer({ products, showCollectionTabs = true }: Props) {
  const { lang } = useLang();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [query, setQuery]       = useState(searchParams.get('search') || '');
  const [collection, setCollection] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize]         = useState('');
  const [page, setPage]         = useState(1);
  const [railOpen, setRailOpen] = useState(false);

  useEffect(() => { setQuery(searchParams.get('search') || ''); setPage(1); }, [searchParams]);
  useEffect(() => { setPage(1); }, [query, collection, category, size]);

  const filteredProducts = useMemo(() => {
    let result = searchProducts(products, query);
    if (collection) result = result.filter((p) => p.collection === collection);
    if (category) result = result.filter((p) => matchesCategory(p, category));
    if (size) result = result.filter((p) => matchesSize(p, size));
    return result;
  }, [products, query, collection, category, size]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PRODUCTS_PER_PAGE;
  const endIndex   = startIndex + PRODUCTS_PER_PAGE;
  const paginated  = filteredProducts.slice(startIndex, endIndex);
  const activeCount = [query, collection, category, size].filter(Boolean).length;
  const hasFilters = activeCount > 0;

  const clearFilters = () => { setQuery(''); setCollection(''); setCategory(''); setSize(''); setPage(1); };
  const goToPage = (n: number) => { setPage(Math.min(Math.max(n, 1), totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // Woods / Patterns / Solids used to sit here as links to their own pages
  // as well as in the filter rail. Two controls, side by side, that looked
  // identical and behaved differently — one navigated away, one filtered in
  // place. The rail owns collection now; this strip keeps only the views
  // that really are separate pages.
  const collectionTabs = [
    { label: t('explorer', 'tabAll', lang),         href: '/products' },
    { label: t('explorer', 'tabNewArrivals', lang),  href: '/collections/new-arrivals' },
    { label: t('explorer', 'tabBestSellers', lang),  href: '/collections/best-sellers' },
  ];

  const rail = (
    <div className="space-y-6">
      <label className="block">
        <span className="label mb-2.5 block">{t('explorer', 'searchLabel', lang)}</span>
        <input value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder={t('explorer', 'searchPlaceholder', lang)}
          className="field w-full" />
      </label>

      <ChipGroup
        label={t('explorer', 'collectionLabel', lang)}
        options={COLLECTION_OPTIONS}
        value={collection}
        onChange={setCollection}
        allLabel={t('explorer', 'allCollections', lang)}
      />

      <ChipGroup
        label={t('explorer', 'categoryLabel', lang)}
        options={CATEGORY_OPTIONS}
        value={category}
        onChange={setCategory}
        allLabel={t('explorer', 'allCategories', lang)}
      />

      <ChipGroup
        label={t('explorer', 'sizeLabel', lang)}
        options={SIZE_OPTIONS}
        value={size}
        onChange={setSize}
        allLabel={t('explorer', 'allSizes', lang)}
        titleFor={(o) => o}
      />
    </div>
  );

  return (
    <div>
      {showCollectionTabs && (
        <div className="mb-7 flex gap-6 overflow-x-auto border-b border-varindo-line scrollbar-none">
          {collectionTabs.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                aria-current={active ? 'page' : undefined}
                className={`mono -mb-px shrink-0 whitespace-nowrap border-b-2 pb-2.5 text-[12px] font-medium uppercase tracking-[0.08em] transition-colors ${
                  active
                    ? 'border-varindo-clay text-varindo-ink'
                    : 'border-transparent text-varindo-mid hover:border-varindo-line-firm hover:text-varindo-ink'
                }`}>
                {label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Rail beside the grid, not a filter block stacked on top of it.
          At 787 products the filters are the primary instrument, and a
          stacked block pushed every result below the fold and scrolled
          away the moment you started comparing swatches. */}
      <div className="lg:grid lg:grid-cols-[228px_minmax(0,1fr)] lg:gap-10">

        <aside className="lg:sticky lg:top-24 lg:self-start">
          {/* Desktop: a static header over an always-open rail. */}
          <div className="mb-4 hidden items-center justify-between gap-3 border-b border-varindo-line pb-3 lg:flex">
            <span className="label">
              {t('explorer', 'filterTitle', lang)}
              {activeCount > 0 && <span className="ml-2 text-varindo-clay-ink">[{activeCount}]</span>}
            </span>
            {hasFilters && (
              <button onClick={clearFilters} className="link-arrow text-[13px]">
                {t('explorer', 'clearAll', lang)}
              </button>
            )}
          </div>

          {/* Below lg the rail collapses behind a disclosure so the grid
              still starts in the first screenful on a phone. The disclosure
              IS the header here — carrying the same title and active count
              as the desktop label, which would otherwise print twice. */}
          <button type="button" onClick={() => setRailOpen((v) => !v)}
            aria-expanded={railOpen}
            className="btn-ghost mb-4 w-full justify-between lg:hidden">
            <span>
              {t('explorer', 'filterTitle', lang)}
              {activeCount > 0 && <span className="mono ml-2 text-varindo-clay-ink">[{activeCount}]</span>}
            </span>
            <svg width="12" height="12" viewBox="0 0 10 10" fill="none" aria-hidden="true"
              className={`transition-transform duration-200 ${railOpen ? 'rotate-180' : ''}`}>
              <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className={`${railOpen ? 'block' : 'hidden'} lg:block`}>
            {rail}
            {hasFilters && (
              <button onClick={clearFilters} className="link-arrow mt-6 lg:hidden">
                {t('explorer', 'clearAll', lang)}
              </button>
            )}
          </div>
        </aside>

        <div className="mt-8 lg:mt-0">
          <p className="mono mb-5 border-b border-varindo-line pb-3 pr-16 text-[13px] leading-[1.5] text-varindo-mid sm:pr-0">
            <span className="text-varindo-ink">{filteredProducts.length}</span>
            {' '}{filteredProducts.length === 1 ? t('explorer', 'productFound', lang) : t('explorer', 'productsFound', lang)}
            {filteredProducts.length > 0 && (
              <span> · {t('explorer', 'showing', lang)} <span className="text-varindo-ink">{startIndex + 1}–{Math.min(endIndex, filteredProducts.length)}</span></span>
            )}
          </p>

          <ProductGrid products={paginated} />

          {filteredProducts.length > PRODUCTS_PER_PAGE && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3 border-t border-varindo-line pt-8">
              <button type="button" onClick={() => goToPage(safePage - 1)} disabled={safePage === 1}
                className="btn-ghost disabled:cursor-not-allowed disabled:opacity-40">
                {t('explorer', 'previous', lang)}
              </button>
              <span className="mono px-3 text-[13px] text-varindo-mid">
                {t('explorer', 'page', lang)} <span className="text-varindo-ink">{safePage}</span> {t('explorer', 'of', lang)} {totalPages}
              </span>
              <button type="button" onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages}
                className="btn-ghost disabled:cursor-not-allowed disabled:opacity-40">
                {t('explorer', 'next', lang)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
