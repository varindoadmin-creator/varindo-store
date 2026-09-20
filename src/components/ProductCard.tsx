'use client';

import Link from 'next/link';
import type { Product } from '@/types/product';
import { formatIDR } from '@/lib/utils';
import { buildProductImageAlt } from '@/lib/seo';
import { ProductImage } from './ProductImage';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

/* A specimen card, not a shop tile: the swatch is square and full-bleed
   inside a hairline plate, and everything a specifier writes down — the
   article code, the price — is mono. The code sits above the name because
   it is what gets typed into an order; the name is how you recognise it. */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { lang } = useLang();

  return (
    <article className="group">
      <Link href={`/products/${product.slug}`} aria-label={product.name} className="block">
        <div className="relative aspect-square overflow-hidden rounded-card border border-varindo-line bg-varindo-canvas transition-colors duration-200 group-hover:border-varindo-line-firm">
          <ProductImage src={product.imageUrl || ''} imageUrls={product.imageUrlCandidates || []} alt={buildProductImageAlt(product)} priority={priority} />
        </div>
      </Link>

      <div className="pt-3.5">
        {product.code && (
          <p className="mono mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-varindo-clay-ink">
            {product.code}
          </p>
        )}
        <Link href={`/products/${product.slug}`}
          className="block min-h-[42px] text-[15px] font-semibold leading-[1.35] text-varindo-ink transition-colors line-clamp-2 group-hover:text-varindo-link">
          {product.name}
        </Link>
        {product.finish && (
          <p className="mt-1 text-[13px] text-varindo-mid">{product.finish}</p>
        )}
        <p className="mono mt-2.5 flex items-baseline gap-1.5 text-[15px] text-varindo-ink">
          {formatIDR(product.price)}
          <span className="text-[11px] font-normal text-varindo-mid">{t('card', 'inclTax', lang)}</span>
        </p>
      </div>
    </article>
  );
}
