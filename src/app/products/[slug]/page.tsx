import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductImageZoom } from '@/components/ProductImageZoom';
import { buildProductEnquiryMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import { formatIDR } from '@/lib/utils';
import { getAllProducts, getProductBySlug } from '@/lib/products';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.name,
    description: product.description || `View ${product.name} in the Varindo Lamitak catalog.`
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const enquiryUrl = buildWhatsAppUrl(buildProductEnquiryMessage(product));

  const specs = [
    ['Code', product.code],
    ['Brand', product.brand],
    ['Design', product.design],
    ['Category', product.category],
    ['Collection', product.collection],
    ['Finish', product.finish],
    ['Size', product.size],
    ['Thickness', product.thickness],
    ['Colour Family', product.colorFamily]
  ].filter(([, value]) => Boolean(value));

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b border-varindo-line bg-varindo-50">
        <div className="shell py-4 flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase">
          <Link href="/products" className="text-varindo-500 hover:text-varindo-ink transition-colors">
            Catalog
          </Link>
          <span className="text-varindo-300">·</span>
          <span className="text-varindo-ink font-medium truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="shell py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:items-start">

          {/* Image */}
          <div>
            <ProductImageZoom
              src={product.imageUrl || ''}
              imageUrls={product.imageUrlCandidates || []}
              alt={product.name}
            />
            {/* Colour disclaimer */}
            <div className="mt-4 border border-varindo-line/60 bg-varindo-50 px-5 py-4">
              <p className="text-[11px] leading-6 text-varindo-500">
                <span className="font-medium text-varindo-700">Note:</span> Actual colours may vary from digital display. We recommend viewing a physical sample prior to specification.
              </p>
            </div>
          </div>

          {/* Details */}
          <div>
            {/* Brand / label */}
            <p className="label text-varindo-gold mb-3">{product.brand || 'Lamitak'}</p>

            {/* Name */}
            <h1 className="display text-varindo-ink text-4xl sm:text-5xl mb-6">
              {product.name}
            </h1>

            {/* Price */}
            <div className="border-t border-b border-varindo-line py-5 mb-7">
              {product.isPromoItem && typeof product.promoPrice === 'number' ? (
                <div>
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="font-display text-3xl font-light text-varindo-ink">{formatIDR(product.promoPrice)}</span>
                    <span className="text-[13px] text-varindo-400 line-through">{formatIDR(product.price)}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="bg-varindo-gold text-white text-[9px] font-semibold tracking-[0.2em] uppercase px-3 py-1">
                      Promo 5% Off
                    </span>
                  </div>
                </div>
              ) : (
                <span className="font-display text-3xl font-light text-varindo-ink">{formatIDR(product.price)}</span>
              )}
              <p className="mt-2 text-[11px] tracking-[0.14em] uppercase text-varindo-400">
                Tax included · Free shipping (Java &amp; Bali)
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <a
                href={enquiryUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-ink"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.19 1.6 6L0 24l6.19-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.85 0-3.66-.5-5.23-1.43l-.37-.22-3.87 1.02 1.03-3.77-.24-.38A9.93 9.93 0 0 1 2 12C2 6.49 6.49 2 12 2s10 4.49 10 10-4.49 10-10 10z"/>
                </svg>
                Enquire via WhatsApp
              </a>
              <Link href="/products" className="btn-ghost">
                ← Back to Catalog
              </Link>
            </div>

            {/* Spec table */}
            <div className="border border-varindo-line">
              <div className="border-b border-varindo-line px-5 py-3.5 bg-varindo-50">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-700">Product Specifications</p>
              </div>
              <dl>
                {specs.map(([label, value], i) => (
                  <div
                    key={label}
                    className={`flex items-start gap-4 px-5 py-3.5 ${
                      i !== specs.length - 1 ? 'border-b border-varindo-line/60' : ''
                    }`}
                  >
                    <dt className="text-[11px] tracking-[0.14em] uppercase text-varindo-400 w-28 shrink-0 pt-px">{label}</dt>
                    <dd className="text-[13px] font-medium text-varindo-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
