'use client';

import Link from 'next/link';
import type { Product } from '@/types/product';
import { formatIDR } from '@/lib/utils';
import { ProductImage } from './ProductImage';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

export function ProductCard({ product }: { product: Product }) {
  const { lang } = useLang();

  return (
    <article className="group bg-white border border-varindo-line transition-all duration-300 hover:border-varindo-400 hover:shadow-card-hover">
      <Link href={`/products/${product.slug}`} aria-label={product.name} className="block">
        <div className="relative aspect-square overflow-hidden bg-varindo-50">
          <ProductImage src={product.imageUrl || ''} imageUrls={product.imageUrlCandidates || []} alt={product.name} />
          <div className="absolute inset-0 bg-varindo-ink/0 transition-colors duration-300 group-hover:bg-varindo-ink/[0.04]" />
        </div>
      </Link>

      <div className="px-4 py-4">
        {product.code && (
          <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-varindo-500 mb-1">{product.code}</p>
        )}
        <Link href={`/products/${product.slug}`}
          className="block text-[13px] font-medium leading-[1.45] text-varindo-ink hover:text-varindo-gold transition-colors line-clamp-2 min-h-[38px]">
          {product.name}
        </Link>
        {product.finish && (
          <p className="mt-1.5 text-[10px] tracking-[0.12em] uppercase text-varindo-400">{product.finish}</p>
        )}
        <div className="mt-3 pt-3 border-t border-varindo-line/60">
          <span className="text-[13px] font-semibold text-varindo-ink">{formatIDR(product.price)}</span>
          <p className="mt-0.5 text-[10px] tracking-[0.12em] uppercase text-varindo-400">
            {t('card', 'inclTax', lang)}
          </p>
        </div>
      </div>
    </article>
  );
}
