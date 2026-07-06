import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getPublicProducts } from '@/lib/products';
import { SITE_URL } from '@/lib/seo';
import { ProductsClient } from './ProductsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 600;

export const metadata: Metadata = {
  // title.absolute bypasses the root layout's "%s | Varindo" template — this string already ends in "| Varindo".
  title: { absolute: 'Toko HPL Lamitak Online - 800 Produk Ready Stok | Varindo' },
  description: 'Toko HPL Lamitak online dari Varindo, dealer resmi di Indonesia. 800+ produk ready stok, harga transparan termasuk PPN. Cari berdasarkan kode, desain, koleksi, atau ukuran.',
  // Search/filter/pagination are client-side state, not distinct URLs — this canonical
  // just protects against the one real query-string variant, /products?search=X.
  alternates: { canonical: `${SITE_URL}/products` }
};

export default async function ProductsPage() {
  const products = await getPublicProducts();
  return (
    <Suspense fallback={null}>
      <ProductsClient products={products} />
    </Suspense>
  );
}
