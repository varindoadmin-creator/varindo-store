'use client';

import Link from 'next/link';
import type { Product } from '@/types/product';
import { ProductImageZoom } from '@/components/ProductImageZoom';
import { buildProductEnquiryMessage, buildEnquiryWhatsAppUrl } from '@/lib/whatsapp';
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
  const enquiryUrl = buildEnquiryWhatsAppUrl(buildProductEnquiryMessage(product));
  const imageAlt = buildProductImageAlt(product);

  const collectionLabel = product.collection || product.category;
  const sampleUrl = `/request-sample?code=${encodeURIComponent(product.code)}`;
  const quoteUrl = `/request-quote?code=${encodeURIComponent(product.code)}`;

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
      <div className="border-b border-varindo-line bg-varindo-canvas">
        <nav aria-label="Breadcrumb" className="mono shell flex flex-wrap items-center gap-2 py-3 text-[11px] uppercase tracking-[0.06em]">
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

      {/* Main. The swatch is the reference the whole page is about, so on
          desktop it stays pinned while the description and the spec table
          scroll past it — you can read a dimension without losing sight of
          the surface it belongs to. */}
      <div className="shell py-8 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-14">

          {/* Image */}
          <div className="lg:sticky lg:top-24">
            <ProductImageZoom
              src={product.imageUrl || ''}
              imageUrls={product.imageUrlCandidates || []}
              downloadHref={`/api/products/${product.slug}/image`}
              alt={imageAlt}
            />
            <p className="mt-4 max-w-md text-[13px] leading-[1.5] text-varindo-mid">
              {t('detail', 'colourNote', lang)}
            </p>
          </div>

          {/* Details */}
          <div>
            <div className="mb-3 flex items-center gap-4">
              <p className="eyebrow text-varindo-mid">{product.brand || 'Lamitak'}</p>
              <Link href="/otorisasi"
                className="mono inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.06em] text-varindo-link transition-colors hover:underline">
                <svg width="11" height="11" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4 10.5L8 14.5L16 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t('footer', 'otorisasiLink', lang)}
              </Link>
            </div>
            {/* Product name — NEVER translated */}
            {/* Product names arrive from the catalogue in full caps. Fraunces
                at 42px and -0.012em tracking turned that into a wall; caps
                need a little air, and a lower optical size keeps the strokes
                from going hairline-thin. */}
            <h1 className="display mb-4 text-[26px] leading-[1.15] tracking-[0.004em] text-varindo-ink [font-variation-settings:'opsz'_40,'SOFT'_12,'WONK'_0] sm:text-[34px]">{product.name}</h1>

            {/* The article code is what gets written on an order, so it sits
                with the price rather than buried mid-way down the spec table. */}
            {product.code && (
              <p className="mono mb-5 inline-flex items-center rounded-ctl border border-varindo-line bg-varindo-canvas px-2.5 py-1 text-[12px] font-medium uppercase tracking-[0.08em] text-varindo-clay-ink">
                {product.code}
              </p>
            )}

            <div className="mb-7 border-y border-varindo-line py-5">
              <span className="mono text-[28px] font-medium text-varindo-ink">{formatIDR(product.price)}</span>
              <p className="mono mt-1 text-[12px] uppercase tracking-[0.06em] text-varindo-mid">
                {t('detail', 'inclTax', lang)}
              </p>
            </div>

            <div className="mb-8 flex flex-col gap-3 sm:flex-row">
              <a href={enquiryUrl} target="_blank" rel="noreferrer" className="btn-blue">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.19 1.6 6L0 24l6.19-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.85 0-3.66-.5-5.23-1.43l-.37-.22-3.87 1.02 1.03-3.77-.24-.38A9.93 9.93 0 0 1 2 12C2 6.49 6.49 2 12 2s10 4.49 10 10-4.49 10-10 10z"/>
                </svg>
                {t('detail', 'enquireCta', lang)}
              </a>
              <Link href={sampleUrl} className="btn-ghost">
                {t('detail', 'sampleCta', lang)}
              </Link>
              <Link href={quoteUrl} className="btn-ghost">
                {t('detail', 'quoteCta', lang)}
              </Link>
            </div>

            <div className="mb-9">
              <Link href="/products" className="link-arrow">
                {t('detail', 'backCatalog', lang)}
              </Link>
            </div>

            {/* Description — deterministic per-product copy, always Bahasa Indonesia */}
            <div className="mb-4 rounded-card border border-varindo-line bg-varindo-canvas p-6">
              <h2 className="label-marked mb-3">
                {t('detail', 'descriptionTitle', lang)}
              </h2>
              <p className="copy text-[15px]">{descriptionParagraph}</p>
              <p className="copy mt-3 text-[15px]">
                <span className="font-medium text-varindo-ink">{t('detail', 'suitableFor', lang)}:</span> {suitableFor}.
              </p>
            </div>

            {/* Spec table */}
            {/* Every value is mono: these are the numbers a specifier
                copies into a drawing, and tabular figures keep the column
                aligned instead of drifting with the digit widths. */}
            <div className="rounded-card border border-varindo-line bg-varindo-canvas p-6">
              <h2 className="label-marked mb-4">
                {t('detail', 'specsTitle', lang)}
              </h2>
              <dl>
                {specs.map(([label, value], i) => (
                  <div key={label}
                    className={`flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:gap-4 ${i !== specs.length - 1 ? 'border-b border-varindo-line' : ''}`}>
                    <dt className="text-[13px] text-varindo-mid sm:w-36 sm:shrink-0">{label}</dt>
                    <dd className="mono break-words text-[14px] text-varindo-ink">{value}</dd>
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
