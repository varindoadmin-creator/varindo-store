'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Product } from '@/types/product';
import { ProductGrid } from './ProductGrid';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

/**
 * On the not-found page for a product address, the closest live products:
 * most such visits come from the old store's links to designs or brands the
 * catalogue no longer carries (see getSuggestionsForMissingSlug). Renders
 * nothing anywhere else, or when nothing is close.
 */
export function MissingProductSuggestions() {
  const { lang } = useLang();
  const pathname = usePathname();
  const slug = /^\/products\/([^/]+)/.exec(pathname || '')?.[1];
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    fetch(`/api/products/suggest?slug=${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : { products: [] }))
      .then((data) => !cancelled && setProducts(data.products || []))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (products.length === 0) return null;

  return (
    <section className="shell border-t border-varindo-line pb-14 pt-10 sm:pb-20">
      <h2 className="section-title mb-6">{t('notFound', 'suggestionsTitle', lang)}</h2>
      <ProductGrid products={products} />
    </section>
  );
}
