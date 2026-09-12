'use client';

import type { Product } from '@/types/product';
import { ProductGrid } from './ProductGrid';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

export function RelatedProducts({ products }: { products: Product[] }) {
  const { lang } = useLang();
  if (products.length === 0) return null;

  return (
    <section className="shell pb-14 sm:pb-20">
      <h2 className="section-title mb-8">{t('detail', 'relatedTitle', lang)}</h2>
      <ProductGrid products={products} />
    </section>
  );
}
