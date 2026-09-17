'use client';

import Link from 'next/link';
import type { Product } from '@/types/product';
import { formatIDR } from '@/lib/utils';
import { buildProductImageAlt } from '@/lib/seo';
import { ProductImage } from './ProductImage';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

/* Borderless, shadowless: a 12px-rounded image plate with a two-line
   caption on the open page beneath it. The laminate provides the colour. */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { lang } = useLang();

  return (
    <article className="group">
      <Link href={`/products/${product.slug}`} aria-label={product.name} className="block">
        <div className="relative aspect-square overflow-hidden rounded-card bg-varindo-canvas">
          <ProductImage src={product.imageUrl || ''} imageUrls={product.imageUrlCandidates || []} alt={buildProductImageAlt(product)} priority={priority} />
        </div>
      </Link>

      <div className="pt-3">
        {product.code && (
          <p className="mb-1 text-[12px] tracking-[-0.01em] text-varindo-mid">{product.code}</p>
        )}
        <Link href={`/products/${product.slug}`}
          className="block min-h-[40px] text-[16px] leading-[1.25] tracking-[-0.01em] text-varindo-ink line-clamp-2 group-hover:underline group-hover:decoration-varindo-line group-hover:underline-offset-4">
          {product.name}
        </Link>
        {product.finish && (
          <p className="mt-1 text-[16px] leading-[1.25] tracking-[-0.01em] text-varindo-mid">{product.finish}</p>
        )}
        <p className="mt-3 text-[16px] leading-[1.25] tracking-[-0.01em] text-varindo-ink">
          {formatIDR(product.price)}
          <span className="ml-1.5 text-[12px] text-varindo-mid">{t('card', 'inclTax', lang)}</span>
        </p>
      </div>
    </article>
  );
}
