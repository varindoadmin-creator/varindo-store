import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductsByCollectionGroup } from '@/lib/products';
import type { CollectionGroup } from '@/lib/products';
import { CollectionClient } from './CollectionClient';

export const dynamic = 'force-dynamic';
export const revalidate = 600;

const groupMeta: Partial<Record<CollectionGroup, { titleEN: string; descEN: string }>> = {
  'new-arrivals':  { titleEN: 'New Arrivals',  descEN: 'Browse newly introduced Lamitak designs.' },
  'new-collections':{ titleEN: 'New Arrivals', descEN: 'Browse newly introduced Lamitak designs.' },
  'best-sellers':  { titleEN: 'Best Sellers',  descEN: 'Explore frequently selected Lamitak surfaces.' },
  'promo-items':   { titleEN: 'Promo Items',   descEN: 'Browse selected Lamitak promotional items.' },
  'woods':         { titleEN: 'Woods',         descEN: 'Lamitak woodgrain surfaces for interior projects.' },
  'patterns':      { titleEN: 'Patterns',      descEN: 'Decorative Lamitak pattern surfaces.' },
  'solids':        { titleEN: 'Solids',        descEN: 'Lamitak solid colour and core surfaces.' }
};

export function generateMetadata({ params }: { params: { group: string } }): Metadata {
  const meta = groupMeta[params.group as CollectionGroup];
  if (!meta) return { title: 'Koleksi' };
  return { title: meta.titleEN, description: meta.descEN };
}

export default async function CollectionPage({ params }: { params: { group: string } }) {
  const group = params.group as CollectionGroup;
  if (!groupMeta[group]) notFound();

  const products = await getProductsByCollectionGroup(group);
  return <CollectionClient group={group} products={products} />;
}
