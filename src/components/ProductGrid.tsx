'use client';

import type { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

export function ProductGrid({ products, showPromoPricing = false }: { products: Product[]; showPromoPricing?: boolean }) {
  const { lang } = useLang();

  if (products.length === 0) {
    return (
      <div className="border border-dashed border-varindo-line bg-white py-16 px-8 text-center">
        <p className="label mb-3">{t('explorer', 'noResults', lang)}</p>
        <p className="font-display text-3xl font-light text-varindo-ink mb-3">
          {t('explorer', 'noResultsTitle', lang)}
        </p>
        <p className="text-sm text-varindo-500 max-w-sm mx-auto leading-relaxed">
          {t('explorer', 'noResultsBody', lang)}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-px bg-varindo-line min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} showPromoPricing={showPromoPricing} />
      ))}
    </div>
  );
}
