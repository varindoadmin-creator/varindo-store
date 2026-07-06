import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductsByCollectionGroup } from '@/lib/products';
import type { CollectionGroup } from '@/lib/products';
import { SITE_URL } from '@/lib/seo';
import { buildCollectionPageJsonLd, buildItemListJsonLd } from '@/lib/structured-data';
import { JsonLd } from '@/components/JsonLd';
import { CollectionClient } from './CollectionClient';

export const dynamic = 'force-dynamic';
export const revalidate = 600;

const groupMeta: Partial<Record<CollectionGroup, { title: string; description: string }>> = {
  'new-arrivals': {
    title: 'HPL Lamitak Produk Terbaru',
    description: 'motif HPL Lamitak terbaru — tekstur modern, finishing premium, harga termasuk PPN. Sampel gratis, dealer resmi Lamitak Indonesia.'
  },
  'new-collections': {
    title: 'HPL Lamitak Produk Terbaru',
    description: 'motif HPL Lamitak terbaru — tekstur modern, finishing premium, harga termasuk PPN. Sampel gratis, dealer resmi Lamitak Indonesia.'
  },
  'best-sellers': {
    title: 'HPL Lamitak Terlaris',
    description: 'motif HPL Lamitak terlaris pilihan pelanggan Varindo. Harga transparan termasuk PPN, sampel gratis, dealer resmi Lamitak Indonesia.'
  },
  woods: {
    title: 'HPL Lamitak Woods',
    description: 'motif kayu HPL Lamitak untuk kitchen set, wardrobe, dan panel dinding. Harga termasuk PPN, sampel gratis dari dealer resmi.'
  },
  patterns: {
    title: 'HPL Lamitak Patterns',
    description: 'motif dekoratif HPL Lamitak untuk backsplash, island, dan furnitur statement. Harga termasuk PPN, sampel gratis tersedia.'
  },
  solids: {
    title: 'HPL Lamitak Solids',
    description: 'warna polos HPL Lamitak untuk interior minimalis, laci, dan partisi. Harga transparan termasuk PPN, dealer resmi Lamitak.'
  }
};

export async function generateMetadata({ params }: { params: { group: string } }): Promise<Metadata> {
  const group = params.group as CollectionGroup;
  const meta = groupMeta[group];
  if (!meta) return { title: 'Koleksi' };

  const products = await getProductsByCollectionGroup(group);
  const n = products.length;
  const title = `${meta.title} - ${n} Motif & Harga | Varindo`;
  const description = `Jelajahi ${n} ${meta.description}`;
  const url = `${SITE_URL}/collections/${group}`;

  return {
    // title.absolute bypasses the root layout's "%s | Varindo" template — this string already ends in "| Varindo".
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' }
  };
}

export default async function CollectionPage({ params }: { params: { group: string } }) {
  const group = params.group as CollectionGroup;
  if (!groupMeta[group]) notFound();

  const products = await getProductsByCollectionGroup(group);
  const meta = groupMeta[group]!;
  const n = products.length;
  const url = `${SITE_URL}/collections/${group}`;

  return (
    <>
      <JsonLd data={buildCollectionPageJsonLd(`${meta.title} - ${n} Motif & Harga`, `Jelajahi ${n} ${meta.description}`, url)} />
      <JsonLd data={buildItemListJsonLd(products)} />
      <CollectionClient group={group} products={products} />
    </>
  );
}
