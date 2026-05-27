import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductExplorer } from '@/components/ProductExplorer';
import { getFilterOptions, getPublicProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Lamitak Product Catalog',
  description: 'Search and browse Lamitak HPL products available through Varindo in Indonesia.'
};

export default async function ProductsPage() {
  const products = await getPublicProducts();
  const filterOptions = await getFilterOptions();

  return (
    <div>
      {/* Page header */}
      <div className="bg-varindo-ink text-white border-b border-varindo-ink">
        <div className="shell py-12 sm:py-16">
          <p className="label text-varindo-400 mb-4">Lamitak HPL</p>
          <h1 className="display text-white text-5xl sm:text-6xl lg:text-7xl mb-4">
            Product Catalog
          </h1>
          <p className="text-[14px] leading-7 text-varindo-400 max-w-xl">
            Search by product code, design name, collection, finish, or colour family.
          </p>
        </div>
      </div>

      {/* Explorer */}
      <div className="shell py-10 sm:py-12">
        <Suspense
          fallback={
            <div className="border border-varindo-line bg-white py-12 px-6 text-center">
              <p className="label text-varindo-500">Loading catalog…</p>
            </div>
          }
        >
          <ProductExplorer products={products} filterOptions={filterOptions} />
        </Suspense>
      </div>
    </div>
  );
}
