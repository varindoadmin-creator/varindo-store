'use client';

import Link from 'next/link';
import type { Product } from '@/types/product';
import { formatIDR } from '@/lib/utils';
import { buildProductImageAlt } from '@/lib/seo';
import { ProductImage } from './ProductImage';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

/* Borderless, shadowless: a 28px-rounded image plate with the caption
   sitting on open canvas beneath it. The laminate provides the colour. */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { lang } = useLang();

  return (
    <article className="group">
      <Link href={`/products/${product.slug}`} aria-label={product.name} className="block">
        <div className="relative aspect-square overflow-hidden rounded-card bg-varindo-canvas">
          <ProductImage src={product.imageUrl || ''} imageUrls={product.imageUrlCandidates || []} alt={buildProductImageAlt(product)} priority={priority} />
        </div>
      </Link>

      <div className="px-1 pt-4">
        {product.code && (
          <p className="mb-1 text-[12px] tracking-[-0.01em] text-varindo-mid">{product.code}</p>
        )}
        <Link href={`/products/${product.slug}`}
          className="block min-h-[44px] text-[17px] font-semibold leading-[1.3] tracking-[-0.022em] text-varindo-ink transition-colors line-clamp-2 group-hover:text-varindo-link">
          {product.name}
        </Link>
        {product.finish && (
          <p className="mt-1 text-[12px] tracking-[-0.01em] text-varindo-mid">{product.finish}</p>
        )}
        <p className="mt-3 text-[17px] tracking-[-0.022em] text-varindo-ink">
          {formatIDR(product.price)}
          <span className="ml-1.5 text-[12px] text-varindo-mid">{t('card', 'inclTax', lang)}</span>
        </p>
      </div>
    </article>
  );
}
