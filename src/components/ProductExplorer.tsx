'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Product } from '@/types/product';
import { searchProducts } from '@/lib/products';
import { ProductGrid } from './ProductGrid';

const PRODUCTS_PER_PAGE = 24;

const SIZE_OPTIONS = [
  "4'x8' / 1220 x 2440mm",
  "4'x10' / 1220 x 3050mm"
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

function normalizeText(value?: string | null) {
  return (value || '').toLowerCase().trim();
}

function matchesSize(product: Product, selectedSize: string) {
  if (!selectedSize) return true;
  return normalizeText(product.size) === normalizeText(selectedSize);
}

function matchesCategory(product: Product, selectedCategory: string) {
  if (!selectedCategory) return true;
  return normalizeText(product.category) === normalizeText(selectedCategory);
}

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
        <select value={value} onChange={(e) => onChange(e.target.value)} className="field-select w-full">
          {children}
        </select>
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
  { label: 'New Arrivals', href: '/collections/new-arrivals' },
  { label: 'Best Sellers', href: '/collections/best-sellers' },
  { label: 'Promo', href: '/collections/promo-items' },
  { label: 'Woods', href: '/collections/woods' },
  { label: 'Patterns', href: '/collections/patterns' },
  { label: 'Solids', href: '/collections/solids' }
];

export function ProductExplorer({ products, showCollectionTabs = true, showPromoPricing = false }: ProductExplorerProps) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [collection, setCollection] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setQuery(searchParams.get('search') || '');
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
  }, [query, collection, category, size]);

  const filteredProducts = useMemo(() => {
    let result = searchProducts(products, query);

    if (collection === '__promo-items') {
      result = result.filter((product) => product.isPromoItem);
    } else if (collection) {
      result = result.filter((product) => product.collection === collection);
    }

    if (category) {
      result = result.filter((product) => matchesCategory(product, category));
    }

    if (size) {
      result = result.filter((product) => matchesSize(product, size));
    }

    return result;
  }, [products, query, collection, category, size]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const hasActiveFilters = Boolean(query || collection || category || size);

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

      <div className="border border-varindo-line bg-white mb-8">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-varindo-line">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-varindo-500">
              <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span className="label text-varindo-700">Filter & Search</span>
          </div>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-[11px] font-medium tracking-[0.12em] uppercase text-varindo-gold hover:text-varindo-ink transition-colors">
              Clear All
            </button>
          )}
        </div>

        <div className="p-5">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <label className="block">
              <span className="label text-varindo-600 mb-2 block">Search</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search code, design name, collection, size..."
                className="field w-full"
              />
            </label>

            <SelectWrapper label="Collection" value={collection} onChange={setCollection}>
              <option value="">All collections</option>
              <option value="Woods">Woods</option>
              <option value="Patterns">Patterns</option>
              <option value="Solids">Solids</option>
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
                <option key={item} value={item}>{item}</option>
              ))}
            </SelectWrapper>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-varindo-500">
            <p>
              <span className="font-semibold text-varindo-ink">{filteredProducts.length}</span> product{filteredProducts.length === 1 ? '' : 's'} found
              {filteredProducts.length > 0 && (
                <span> · Showing <span className="font-semibold text-varindo-ink">{startIndex + 1}-{Math.min(endIndex, filteredProducts.length)}</span></span>
              )}
            </p>
          </div>
        </div>
      </div>

      <ProductGrid products={paginatedProducts} showPromoPricing={showPromoPricing || collection === '__promo-items'} />

      {filteredProducts.length > PRODUCTS_PER_PAGE && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-10">
          <button
            type="button"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="px-4 text-sm text-varindo-500">
            Page <span className="font-semibold text-varindo-ink">{safePage}</span> of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
            className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
