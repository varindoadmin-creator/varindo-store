'use client';

const SIZE_OPTIONS = [
  { label: "4'x8' / 1220 x 2440mm", tokens: ["4x8", "4'X8", "4'x8", "1220x2440"] },
  { label: "4'x10' / 1220 x 3050mm", tokens: ["4x10", "4'X10", "4'x10", "1220x3050"] }
];

const CATEGORY_OPTIONS = [
  'Patterns',
  'Protak',
  'Protak Core',
  'Saville',
  'Solid Core',
  'Solids',
  'Solids+',
  'Woods',
  'Bookmatched'
];

function normalizeFilterText(value?: string | null) {
  return (value || '')
    .toLowerCase()
    .replace(/[’′`]/g, "'")
    .replace(/[×]/g, 'x')
    .replace(/\s+/g, '')
    .replace(/mm/g, '');
}

function getProductSearchText(product: Product) {
  return [
    product.code,
    product.name,
    product.design,
    product.description,
    product.collection,
    product.category,
    product.size,
    product.colorFamily
  ]
    .filter(Boolean)
    .join(' ');
}

function matchesSizeOption(product: Product, selectedSize: string) {
  if (!selectedSize) return true;

  const option = SIZE_OPTIONS.find((item) => item.label === selectedSize);
  if (!option) return product.size === selectedSize;

  const compactText = normalizeFilterText(getProductSearchText(product));

  if (selectedSize.includes("4'x8")) {
    return compactText.includes("4'x8") || compactText.includes("4x8") || compactText.includes("1220x2440");
  }

  if (selectedSize.includes("4'x10")) {
    return compactText.includes("4'x10") || compactText.includes("4x10") || compactText.includes("1220x3050");
  }

  return option.tokens.some((token) => compactText.includes(normalizeFilterText(token)));
}

function matchesCategoryOption(product: Product, selectedCategory: string) {
  if (!selectedCategory) return true;

  const rawText = getProductSearchText(product);
  const lowerText = rawText.toLowerCase();
  const compactText = normalizeFilterText(rawText);
  const selected = selectedCategory.toLowerCase();

  if (selected === 'bookmatched') {
    return /\bart\s*\d+/i.test(rawText) || compactText.startsWith('art') || lowerText.includes('bookmatched');
  }

  return lowerText.includes(selected);
}

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Product } from '@/types/product';
import { searchProducts } from '@/lib/products';
import { ProductGrid } from './ProductGrid';

const PRODUCTS_PER_PAGE = 24;

type FilterOptions = {
  collections: string[];
  categories: string[];
  finishes: string[];
  sizes: string[];
  colorFamilies: string[];
};

type ProductExplorerProps = {
  products: Product[];
  filterOptions: FilterOptions;
  showCollectionTabs?: boolean;
  showPromoPricing?: boolean;
};

function cleanFilterValue(value?: string | null) {
  return (value || '').trim();
}

function isValidFinish(value?: string | null) {
  const finish = cleanFilterValue(value);
  const normalized = finish.toLowerCase();
  if (!finish) return false;
  if (['-', 'n/a', 'na', 'null', 'undefined', 'surface'].includes(normalized)) return false;
  if (normalized.includes('promo')) return false;
  return true;
}

function isValidCollection(value?: string | null) {
  const collection = cleanFilterValue(value);
  const normalized = collection.toLowerCase();
  if (!collection) return false;
  if (['-', 'n/a', 'na', 'null', 'undefined'].includes(normalized)) return false;
  if (normalized.includes('promo')) return false;
  if (normalized === 'promo items') return false;
  return true;
}

function uniqueSorted(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.map(cleanFilterValue).filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function SelectWrapper({
  label,
  value,
  onChange,
  children
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label text-varindo-600 mb-2 block">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="field-select w-full"
        >
          {children}
        </select>
        {/* chevron */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-varindo-400">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </label>
  );
}

const collectionTabs = [
  { label: 'All Products', href: '/products' },
  { label: 'New', href: '/collections/new-collections' },
  { label: 'Best Sellers', href: '/collections/best-sellers' },
  { label: 'Promo', href: '/collections/promo-items' },
  { label: 'Woods', href: '/collections/woods' },
  { label: 'Patterns', href: '/collections/patterns' },
  { label: 'Solids', href: '/collections/solids' }
];

export function ProductExplorer({ products, filterOptions, showCollectionTabs = true, showPromoPricing = false }: ProductExplorerProps) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [collection, setCollection] = useState('');
  
  const [category, setCategory] = useState('');const [size, setSize] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setQuery(searchParams.get('search') || '');
    setPage(1);
  }, [searchParams]);

  useEffect(() => { setPage(1); }, [query, collection, category, size]);

  const filteredProducts = useMemo(() => {
    let result = searchProducts(products, query);
    if (collection === '__promo-items') result = result.filter((p) => p.isPromoItem);
    else if (collection) result = result.filter((p) => p.collection === collection);
    if (category) result = result.filter((p) => matchesCategoryOption(p, category));
if (size) result = result.filter((p) => matchesSizeOption(p, size));
    return result;
  }, [products, query, collection, category, size]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const hasActiveFilters = query || collection || category || size;

  const clearFilters = () => {
    setQuery('');
    setCollection('');
    setCategory('');
            setSize('');
    setPage(1);
  };

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-0">
      {/* Collection tabs */}
      {showCollectionTabs && (
        <div className="flex gap-0 overflow-x-auto border-b border-varindo-line mb-8 scrollbar-none">
          {collectionTabs.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="shrink-0 px-5 py-3 text-[10px] font-semibold tracking-[0.18em] uppercase text-varindo-600 border-b-2 border-transparent hover:text-varindo-ink hover:border-varindo-ink transition-all duration-150 whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
        </div>
      )}

      {/* Filter bar */}
      <div className="border border-varindo-line bg-white mb-8">
        {/* Filter header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-varindo-line">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-varindo-500">
              <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-varindo-700">Filter &amp; Search</p>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-[10px] tracking-[0.14em] uppercase text-varindo-gold hover:text-varindo-ink transition-colors font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Filter inputs */}
        <div className="p-5 grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Search input */}
          <label className="block">
            <span className="label text-varindo-600 mb-2 block">Search</span>
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Code, design, colour…"
                className="field pr-9"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-varindo-400">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </div>
          </label>

          <SelectWrapper label="Collection" value={collection} onChange={setCollection}>
            <option value="">All collections</option>
            {uniqueSorted(filterOptions.collections).filter(isValidCollection).map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </SelectWrapper>

          <SelectWrapper label="Category" value={category} onChange={setCategory}>
            <option value="">All categories</option>
            {CATEGORY_OPTIONS.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </SelectWrapper>

          <SelectWrapper label="Size" value={size} onChange={setSize}>
            <option value="">All sizes</option>
            {SIZE_OPTIONS.map((item) => (
              <option key={item.label} value={item.label}>{item.label}</option>
            ))}
          </SelectWrapper>
        </div>

        {/* Results count */}
        <div className="border-t border-varindo-line/60 px-5 py-3 flex items-center justify-between bg-varindo-50/50">
          <p className="text-[12px] text-varindo-500">
            <span className="font-semibold text-varindo-ink">{filteredProducts.length.toLocaleString()}</span>
            {' '}product{filteredProducts.length !== 1 ? 's' : ''}
            {filteredProducts.length > 0 && (
              <span className="text-varindo-400">
                {' '}· Showing {startIndex + 1}–{Math.min(endIndex, filteredProducts.length)}
              </span>
            )}
          </p>
          {hasActiveFilters && (
            <p className="text-[11px] text-varindo-gold font-medium">Filters active</p>
          )}
        </div>
      </div>

      {/* Product grid */}
      <ProductGrid products={paginatedProducts} showPromoPricing={showPromoPricing || collection === '__promo-items'} />

      {/* Pagination */}
      {filteredProducts.length > PRODUCTS_PER_PAGE && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-1 pt-2">
          <button
            type="button"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            className="border border-varindo-line bg-white px-5 py-2.5 text-[11px] font-medium tracking-[0.14em] uppercase text-varindo-700 hover:border-varindo-ink hover:text-varindo-ink transition-all disabled:cursor-not-allowed disabled:opacity-30"
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((n) => n === 1 || n === totalPages || Math.abs(n - safePage) <= 2)
            .map((n, i, arr) => {
              const prev = arr[i - 1];
              const gap = prev && n - prev > 1;
              return (
                <span key={n} className="flex items-center gap-1">
                  {gap && <span className="px-1 text-varindo-400 text-sm">·</span>}
                  <button
                    type="button"
                    onClick={() => goToPage(n)}
                    className={`h-10 min-w-10 px-3.5 text-[12px] font-medium border transition-all ${
                      n === safePage
                        ? 'border-varindo-ink bg-varindo-ink text-white'
                        : 'border-varindo-line bg-white text-varindo-700 hover:border-varindo-ink hover:text-varindo-ink'
                    }`}
                  >
                    {n}
                  </button>
                </span>
              );
            })}

          <button
            type="button"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
            className="border border-varindo-line bg-white px-5 py-2.5 text-[11px] font-medium tracking-[0.14em] uppercase text-varindo-700 hover:border-varindo-ink hover:text-varindo-ink transition-all disabled:cursor-not-allowed disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
