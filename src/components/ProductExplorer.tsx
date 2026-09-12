'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Product } from '@/types/product';
import { searchProducts } from '@/lib/products';
import { ProductGrid } from './ProductGrid';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

const PRODUCTS_PER_PAGE = 24;

const SIZE_OPTIONS = ["4'x8' / 1220 x 2440mm", "4'x10' / 1220 x 3050mm"];
const CATEGORY_OPTIONS = ['Patterns','Protak','Protak Core','Saville','Solid Core','Solids','Solids+','Woods','Bookmatched'];

function normalizeText(v?: string | null) { return (v || '').toLowerCase().trim(); }
function matchesSize(p: Product, s: string) { return !s || normalizeText(p.size) === normalizeText(s); }
function matchesCategory(p: Product, c: string) { return !c || normalizeText(p.category) === normalizeText(c); }

type FilterOptions = { collections: string[]; categories: string[]; finishes: string[]; sizes: string[]; colorFamilies: string[] };
type Props = { products: Product[]; filterOptions: FilterOptions; showCollectionTabs?: boolean; };

function SelectWrapper({ label, value, onChange, children }: { label: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label mb-2 block">{label}</span>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="field-select w-full">
          {children}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-varindo-mid">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </label>
  );
}

export function ProductExplorer({ products, showCollectionTabs = true }: Props) {
  const { lang } = useLang();
  const searchParams = useSearchParams();
  const [query, setQuery]       = useState(searchParams.get('search') || '');
  const [collection, setCollection] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize]         = useState('');
  const [page, setPage]         = useState(1);

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
  const hasFilters = Boolean(query || collection || category || size);

  const clearFilters = () => { setQuery(''); setCollection(''); setCategory(''); setSize(''); setPage(1); };
  const goToPage = (n: number) => { setPage(Math.min(Math.max(n, 1), totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const collectionTabs = [
    { label: t('explorer', 'tabAll', lang),         href: '/products' },
    { label: t('explorer', 'tabNewArrivals', lang),  href: '/collections/new-arrivals' },
    { label: t('explorer', 'tabBestSellers', lang),  href: '/collections/best-sellers' },
    { label: 'Woods',                                href: '/collections/woods' },
    { label: 'Patterns',                             href: '/collections/patterns' },
    { label: 'Solids',                               href: '/collections/solids' },
  ];

  return (
    <div className="space-y-0">
      {showCollectionTabs && (
        <div className="mb-8 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {collectionTabs.map(({ label, href }) => (
            <Link key={href} href={href}
              className="shrink-0 rounded-pill bg-varindo-canvas px-4 py-2 text-[14px] tracking-[-0.016em] text-varindo-ink whitespace-nowrap transition-colors hover:bg-varindo-wash">
              {label}
            </Link>
          ))}
        </div>
      )}

      <div className="mb-10 rounded-card bg-varindo-canvas p-6 sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className="text-[21px] font-semibold tracking-[-0.01em] text-varindo-ink">
            {t('explorer', 'filterTitle', lang)}
          </span>
          {hasFilters && (
            <button onClick={clearFilters} className="link-arrow text-[14px]">
              {t('explorer', 'clearAll', lang)}
            </button>
          )}
        </div>

        <div>
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <label className="block">
              <span className="label mb-2 block">{t('explorer', 'searchLabel', lang)}</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder={t('explorer', 'searchPlaceholder', lang)}
                className="field w-full" />
            </label>

            <SelectWrapper label={t('explorer', 'collectionLabel', lang)} value={collection} onChange={setCollection}>
              <option value="">{t('explorer', 'allCollections', lang)}</option>
              <option value="Woods">Woods</option>
              <option value="Patterns">Patterns</option>
              <option value="Solids">Solids</option>
            </SelectWrapper>

            <SelectWrapper label={t('explorer', 'categoryLabel', lang)} value={category} onChange={setCategory}>
              <option value="">{t('explorer', 'allCategories', lang)}</option>
              {CATEGORY_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
            </SelectWrapper>

            <SelectWrapper label={t('explorer', 'sizeLabel', lang)} value={size} onChange={setSize}>
              <option value="">{t('explorer', 'allSizes', lang)}</option>
              {SIZE_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
            </SelectWrapper>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[14px] tracking-[-0.016em] text-varindo-mid">
            <p>
              <span className="text-varindo-ink">{filteredProducts.length}</span>
              {' '}{filteredProducts.length === 1 ? t('explorer', 'productFound', lang) : t('explorer', 'productsFound', lang)}
              {filteredProducts.length > 0 && (
                <span> · {t('explorer', 'showing', lang)} <span className="text-varindo-ink">{startIndex + 1}–{Math.min(endIndex, filteredProducts.length)}</span></span>
              )}
            </p>
          </div>
        </div>
      </div>

      <ProductGrid products={paginated} />

      {filteredProducts.length > PRODUCTS_PER_PAGE && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-16">
          <button type="button" onClick={() => goToPage(safePage - 1)} disabled={safePage === 1}
            className="btn-soft disabled:cursor-not-allowed disabled:opacity-40">
            {t('explorer', 'previous', lang)}
          </button>
          <span className="px-4 text-[14px] tracking-[-0.016em] text-varindo-mid">
            {t('explorer', 'page', lang)} <span className="text-varindo-ink">{safePage}</span> {t('explorer', 'of', lang)} {totalPages}
          </span>
          <button type="button" onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages}
            className="btn-soft disabled:cursor-not-allowed disabled:opacity-40">
            {t('explorer', 'next', lang)}
          </button>
        </div>
      )}
    </div>
  );
}
