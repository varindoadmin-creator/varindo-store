import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getRelatedProducts } from '@/lib/products';
import { getOgImageUrl } from '@/lib/cloudinary';
import { buildProductTitle, buildProductDescription, getProductUrl } from '@/lib/seo';
import { buildProductJsonLd, buildProductBreadcrumbJsonLd } from '@/lib/structured-data';
import { JsonLd } from '@/components/JsonLd';
import { RelatedProducts } from '@/components/RelatedProducts';
import { ProductDetailClient } from './ProductDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Produk Tidak Ditemukan' };

  const title = buildProductTitle(product);
  const description = buildProductDescription(product);
  const url = getProductUrl(product.slug);
  const ogImage = product.imageUrl ? getOgImageUrl(product.imageUrl) : undefined;

  return {
    // Bypass the root layout's "%s | Varindo" title template — our title already ends in "| Varindo".
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product);
  return (
    <>
      <JsonLd data={buildProductJsonLd(product)} />
      <JsonLd data={buildProductBreadcrumbJsonLd(product)} />
      <ProductDetailClient product={product} />
      <RelatedProducts products={related} />
    </>
  );
}
