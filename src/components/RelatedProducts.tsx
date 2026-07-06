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
      <p className="label text-varindo-gold mb-6">{t('detail', 'relatedTitle', lang)}</p>
      <ProductGrid products={products} />
    </section>
  );
}
