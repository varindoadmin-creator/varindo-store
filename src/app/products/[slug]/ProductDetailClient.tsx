'use client';

import Link from 'next/link';
import type { Product } from '@/types/product';
import { ProductImageZoom } from '@/components/ProductImageZoom';
import { buildProductEnquiryMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import { formatIDR } from '@/lib/utils';
import { buildProductImageAlt } from '@/lib/seo';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

type Props = {
  product: Product;
  /** Computed server-side (page.tsx) rather than imported here — productDescription.ts's ~20
   *  template-variant functions have no reason to ship to the browser for a value that only
   *  ever needs to be computed once, server-side, per render. */
  descriptionParagraph: string;
  suitableFor: string;
};

export function ProductDetailClient({ product, descriptionParagraph, suitableFor }: Props) {
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
    ['Newedge Code (23mm Width)',             product.newedge23mm],
    ['Newedge Code (44mm Width)',             product.newedge44mm],
    [t('detail', 'specColourFamily', lang),  product.colorFamily],
  ].filter(([, v]) => Boolean(v));

  return (
    <div>
      {/* Breadcrumb — mirrors the BreadcrumbList JSON-LD (Beranda › Katalog › Koleksi › Produk) */}
      <div className="bg-varindo-canvas">
        <nav aria-label="Breadcrumb" className="shell flex flex-wrap items-center gap-2 py-4 text-[12px] tracking-[-0.01em]">
          <Link href="/" className="text-varindo-mid transition-colors hover:text-varindo-ink">
            {t('detail', 'breadcrumbHome', lang)}
          </Link>
          <span className="text-varindo-mid">›</span>
          <Link href="/products" className="text-varindo-mid transition-colors hover:text-varindo-ink">
            {t('detail', 'breadcrumbCatalog', lang)}
          </Link>
          {collectionLabel && (
            <>
              <span className="text-varindo-mid">›</span>
              <Link href="/products" className="text-varindo-mid transition-colors hover:text-varindo-ink">
                {collectionLabel}
              </Link>
            </>
          )}
          <span className="text-varindo-mid">›</span>
          <span className="max-w-xs truncate text-varindo-ink">{product.name}</span>
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
              downloadHref={`/api/products/${product.slug}/image`}
              alt={imageAlt}
            />
            <p className="mt-5 max-w-md text-[12px] leading-[1.5] text-varindo-mid">
              {t('detail', 'colourNote', lang)}
            </p>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <p className="eyebrow text-varindo-mid">{product.brand || 'Lamitak'}</p>
              <Link href="/otorisasi"
                className="inline-flex items-center gap-1 text-[16px] tracking-[-0.01em] text-varindo-link transition-colors hover:underline">
                <svg width="11" height="11" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4 10.5L8 14.5L16 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t('footer', 'otorisasiLink', lang)}
              </Link>
            </div>
            {/* Product name — NEVER translated */}
            <h1 className="display text-varindo-ink text-[40px] mb-6">{product.name}</h1>

            <div className="mb-8">
              <span className="display text-[40px] text-varindo-ink">{formatIDR(product.price)}</span>
              <p className="mt-1 text-[16px] tracking-[-0.01em] text-varindo-mid">
                {t('detail', 'inclTax', lang)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <a href={enquiryUrl} target="_blank" rel="noreferrer" className="btn-blue">
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
              <Link href="/products" className="link-arrow">
                {t('detail', 'backCatalog', lang)}
              </Link>
            </div>

            {/* Description — deterministic per-product copy, always Bahasa Indonesia */}
            <div className="mb-5 rounded-card bg-varindo-canvas p-7">
              <h2 className="mb-3 text-[24px] font-normal tracking-[-0.01em] text-varindo-ink">
                {t('detail', 'descriptionTitle', lang)}
              </h2>
              <p className="copy">{descriptionParagraph}</p>
              <p className="copy mt-3">
                <span className="text-varindo-ink">{t('detail', 'suitableFor', lang)}:</span> {suitableFor}.
              </p>
            </div>

            {/* Spec table */}
            <div className="rounded-card bg-varindo-canvas p-7">
              <h2 className="mb-4 text-[24px] font-normal tracking-[-0.01em] text-varindo-ink">
                {t('detail', 'specsTitle', lang)}
              </h2>
              <dl>
                {specs.map(([label, value], i) => (
                  <div key={label}
                    className={`flex items-start gap-4 py-3 ${i !== specs.length - 1 ? 'border-b border-varindo-line/50' : ''}`}>
                    <dt className="w-32 shrink-0 text-[16px] tracking-[-0.01em] text-varindo-mid">{label}</dt>
                    <dd className="text-[16px] tracking-[-0.01em] text-varindo-ink">{value}</dd>
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
