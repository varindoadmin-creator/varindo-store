'use client';

import type { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

export function ProductGrid({ products }: { products: Product[] }) {
  const { lang } = useLang();

  if (products.length === 0) {
    return (
      <div className="rounded-card bg-varindo-canvas px-8 py-20 text-center">
        <h3 className="display mb-3 text-[32px] text-varindo-ink sm:text-[40px]">
          {t('explorer', 'noResultsTitle', lang)}
        </h3>
        <p className="copy mx-auto max-w-md">
          {t('explorer', 'noResultsBody', lang)}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-10 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard key={product.slug} product={product} priority={i < 4} />
      ))}
    </div>
  );
}
