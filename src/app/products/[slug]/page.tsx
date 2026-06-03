import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug } from '@/lib/products';
import { ProductDetailClient } from './ProductDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Produk Tidak Ditemukan' };
  return {
    title: product.name,
    description: product.description || `${product.name} — Varindo Lamitak HPL Catalog.`
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  return <ProductDetailClient product={product} />;
}
