'use client';

import Link from 'next/link';
import type { Product } from '@/types/product';
import { formatIDR } from '@/lib/utils';
import { buildProductImageAlt } from '@/lib/seo';
import { ProductImage } from './ProductImage';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

/* Borderless, shadowless: an 8px image plate with the caption sitting on
   open canvas beneath it, separated by whitespace alone. The laminate is
   the only colour on the card. */
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
          <p className="mb-1 font-mono text-[12px] leading-none text-varindo-mid">{product.code}</p>
        )}
        <Link href={`/products/${product.slug}`}
          className="block min-h-[42px] text-[16px] font-normal leading-[1.3] text-varindo-ink transition-opacity line-clamp-2 group-hover:opacity-60">
          {product.name}
        </Link>
        {product.finish && (
          <p className="mt-1 text-[14px] leading-[1.3] text-varindo-mid">{product.finish}</p>
        )}
        <p className="mt-2 text-[16px] text-varindo-ink">
          {formatIDR(product.price)}
          <span className="ml-1.5 text-[12px] text-varindo-mid">{t('card', 'inclTax', lang)}</span>
        </p>
      </div>
    </article>
  );
}
