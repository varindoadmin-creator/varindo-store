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
      {/* An 80px title over a 787-product catalogue was spending the whole
          first screen on the word "Catalogue". It now reads as a document
          header: label, title, one line of scope, then the instrument. */}
      <div className="band-alt border-b border-varindo-line">
        <div className="shell py-9 sm:py-11">
          <p className="label-marked mb-3">{t('products', 'badge', lang)}</p>
          <h1 className="display mb-3 text-[34px] text-varindo-ink sm:text-[44px]">
            {t('products', 'title', lang)}
          </h1>
          <p className="copy max-w-xl">
            {t('products', 'subtitle', lang)}
          </p>
        </div>
      </div>
      <div className="shell py-8 sm:py-10">
        <Suspense fallback={
          <div className="rounded-card border border-varindo-line bg-varindo-canvas px-6 py-12 text-center">
            <p className="label">{t('products', 'loading', lang)}</p>
          </div>
        }>
          <ProductExplorer products={products} filterOptions={filterOptions} />
        </Suspense>
      </div>
    </div>
  );
}
