import Link from 'next/link';
import type { Product } from '@/types/product';
import { formatIDR } from '@/lib/utils';
import { ProductImage } from './ProductImage';

export function ProductCard({ product, showPromoPricing = false }: { product: Product; showPromoPricing?: boolean }) {
  return (
    <article className="group font-sans bg-white border border-varindo-line transition-all duration-300 hover:border-varindo-400 hover:shadow-card-hover">
      {/* Image area — square swatch feel */}
      <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-varindo-50">
          <ProductImage
            src={product.imageUrl || ''}
            imageUrls={product.imageUrlCandidates || []}
            alt={product.name}
          />
          {/* Promo badge */}
          {showPromoPricing && product.isPromoItem && (
            <span className="absolute top-3 left-3 bg-varindo-gold text-white text-[9px] font-semibold tracking-[0.18em] uppercase px-2.5 py-1">
              Promo
            </span>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-varindo-ink/0 transition-colors duration-300 group-hover:bg-varindo-ink/[0.04]" />
        </div>
      </Link>

      {/* Info */}
      <div className="px-4 py-4">
        {/* Product code / collection */}
        {product.code && (
          <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-varindo-500 mb-1">{product.code}</p>
        )}

        <Link
          href={`/products/${product.slug}`}
          className="block text-[13px] font-medium leading-[1.45] text-varindo-ink hover:text-varindo-gold transition-colors line-clamp-2 min-h-[38px]"
        >
          {product.name}
        </Link>

        {/* Finish tag */}
        {product.finish && (
          <p className="mt-1.5 text-[10px] tracking-[0.12em] uppercase text-varindo-400">{product.finish}</p>
        )}

        {/* Price */}
        <div className="mt-3 pt-3 border-t border-varindo-line/60">
          {showPromoPricing && product.isPromoItem && typeof product.promoPrice === 'number' ? (
            <div className="flex items-baseline gap-2">
              <span className="text-[13px] font-semibold text-varindo-ink">{formatIDR(product.promoPrice)}</span>
              <span className="text-[11px] text-varindo-400 line-through">{formatIDR(product.price)}</span>
            </div>
          ) : (
            <span className="text-[13px] font-semibold text-varindo-ink">{formatIDR(product.price)}</span>
          )}
          <p className="mt-0.5 text-[10px] tracking-[0.12em] uppercase text-varindo-400">incl. tax</p>
        </div>
      </div>
    </article>
  );
}
