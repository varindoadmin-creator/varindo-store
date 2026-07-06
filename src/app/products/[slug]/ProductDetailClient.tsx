'use client';

import Link from 'next/link';
import type { Product } from '@/types/product';
import { ProductImageZoom } from '@/components/ProductImageZoom';
import { buildProductEnquiryMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import { formatIDR } from '@/lib/utils';
import { buildProductImageAlt } from '@/lib/seo';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

export function ProductDetailClient({ product }: { product: Product }) {
  const { lang } = useLang();
  const enquiryUrl = buildWhatsAppUrl(buildProductEnquiryMessage(product));
  const imageAlt = buildProductImageAlt(product);

  const collectionLabel = product.collection || product.category;
  const sampleUrl = `/request-sample?code=${encodeURIComponent(product.code)}`;

  const specs = [
    [t('detail', 'specCode', lang),          product.code],
    [t('detail', 'specBrand', lang),         product.brand],
    [t('detail', 'specDesign', lang),        product.design],
    [t('detail', 'specCollection', lang),    product.collection],
    [t('detail', 'specSubCollection', lang), product.category],
    [t('detail', 'specSize', lang),          product.size],
    [t('detail', 'specThickness', lang),     product.thickness],
    [t('detail', 'specColourFamily', lang),  product.colorFamily],
  ].filter(([, v]) => Boolean(v));

  return (
    <div>
      {/* Breadcrumb — mirrors the BreadcrumbList JSON-LD (Beranda › Katalog › Koleksi › Produk) */}
      <div className="border-b border-varindo-line bg-varindo-50">
        <nav aria-label="Breadcrumb" className="shell py-4 flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase flex-wrap">
          <Link href="/" className="text-varindo-500 hover:text-varindo-ink transition-colors">
            {t('detail', 'breadcrumbHome', lang)}
          </Link>
          <span className="text-varindo-300">·</span>
          <Link href="/products" className="text-varindo-500 hover:text-varindo-ink transition-colors">
            {t('detail', 'breadcrumbCatalog', lang)}
          </Link>
          {collectionLabel && (
            <>
              <span className="text-varindo-300">·</span>
              <Link href="/products" className="text-varindo-500 hover:text-varindo-ink transition-colors">
                {collectionLabel}
              </Link>
            </>
          )}
          <span className="text-varindo-300">·</span>
          <span className="text-varindo-ink font-medium truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      {/* Main */}
      <div className="shell py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:items-start">

          {/* Image */}
          <div>
            <ProductImageZoom
              src={product.imageUrl || ''}
              imageUrls={product.imageUrlCandidates || []}
              alt={imageAlt}
            />
            <div className="mt-4 border border-varindo-line/60 bg-varindo-50 px-5 py-4">
              <p className="text-[11px] leading-6 text-varindo-500">{t('detail', 'colourNote', lang)}</p>
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="label text-varindo-gold mb-3">{product.brand || 'Lamitak'}</p>
            {/* Product name — NEVER translated */}
            <h1 className="display text-varindo-ink text-4xl sm:text-5xl mb-6">{product.name}</h1>

            <div className="border-t border-b border-varindo-line py-5 mb-7">
              <span className="font-display text-3xl font-light text-varindo-ink">{formatIDR(product.price)}</span>
              <p className="mt-2 text-[11px] tracking-[0.14em] uppercase text-varindo-400">
                {t('detail', 'inclTax', lang)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <a href={enquiryUrl} target="_blank" rel="noreferrer" className="btn-ink">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.19 1.6 6L0 24l6.19-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.85 0-3.66-.5-5.23-1.43l-.37-.22-3.87 1.02 1.03-3.77-.24-.38A9.93 9.93 0 0 1 2 12C2 6.49 6.49 2 12 2s10 4.49 10 10-4.49 10-10 10z"/>
                </svg>
                {t('detail', 'enquireCta', lang)}
              </a>
              <Link href={sampleUrl} className="btn-ghost">
                {t('detail', 'sampleCta', lang)}
              </Link>
            </div>

            <div className="mb-10">
              <Link href="/products" className="text-[11px] font-medium tracking-[0.12em] uppercase text-varindo-500 hover:text-varindo-ink transition-colors">
                {t('detail', 'backCatalog', lang)}
              </Link>
            </div>

            {/* Spec table */}
            <div className="border border-varindo-line">
              <div className="border-b border-varindo-line px-5 py-3.5 bg-varindo-50">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-700">
                  {t('detail', 'specsTitle', lang)}
                </p>
              </div>
              <dl>
                {specs.map(([label, value], i) => (
                  <div key={label}
                    className={`flex items-start gap-4 px-5 py-3.5 ${i !== specs.length - 1 ? 'border-b border-varindo-line/60' : ''}`}>
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
