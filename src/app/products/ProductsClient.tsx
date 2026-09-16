'use client';

import { Suspense } from 'react';
import type { Product } from '@/types/product';
import { ProductExplorer } from '@/components/ProductExplorer';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

const filterOptions = {
  collections:   ['Woods', 'Patterns', 'Solids'],
  categories:    ['Patterns','Protak','Protak Core','Saville','Solid Core','Solids','Solids+','Woods','Bookmatched'],
  finishes:      [],
  sizes:         ["4'x8' / 1220 x 2440mm", "4'x10' / 1220 x 3050mm"],
  colorFamilies: []
};

export function ProductsClient({ products }: { products: Product[] }) {
  const { lang } = useLang();
  return (
    <div>
      <div className="bg-white">
        <div className="shell py-12 sm:py-16">
          <p className="label mb-4">{t('products', 'badge', lang)}</p>
          <h1 className="display text-varindo-ink text-[40px] sm:text-[56px] lg:text-[80px] mb-4">
            {t('products', 'title', lang)}
          </h1>
          <p className="text-[16px] leading-7 text-varindo-mid max-w-xl">
            {t('products', 'subtitle', lang)}
          </p>
        </div>
      </div>
      <div className="shell py-10 sm:py-12">
        <Suspense fallback={
          <div className="rounded-card bg-varindo-canvas py-12 px-6 text-center">
            <p className="label">{t('products', 'loading', lang)}</p>
          </div>
        }>
          <ProductExplorer products={products} filterOptions={filterOptions} />
        </Suspense>
      </div>
    </div>
  );
}
