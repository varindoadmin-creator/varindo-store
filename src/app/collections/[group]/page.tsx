import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductExplorer } from '@/components/ProductExplorer';
import { CollectionGroup, getProductsByCollectionGroup } from '@/lib/products';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 600;

const groups: Partial<Record<CollectionGroup, { title: string; subtitle: string; description: string; accent?: string }>> = {
  'new-arrivals': {
    title: 'New Arrivals',
    subtitle: 'Fresh Lamitak designs and latest surface selections',
    description: 'Browse newly introduced Lamitak designs selected from the latest product code families.',
    accent: 'varindo'
  },
  'best-sellers': {
    title: 'Best Sellers',
    subtitle: 'Popular Lamitak choices for interior projects',
    description: 'Explore frequently selected Lamitak surfaces for residential, retail, and commercial interiors.',
    accent: 'varindo'
  },
  'promo-items': {
    title: 'Promo Items',
    subtitle: 'Selected Lamitak products with promotional pricing',
    description: 'Browse selected promotional items while availability lasts.',
    accent: 'varindo'
  },
  woods: {
    title: 'Woods',
    subtitle: 'Warm woodgrain laminates for refined interiors',
    description: 'Explore Lamitak wood designs for cabinetry, wall panels, furniture, and interior detailing.'
  },
  patterns: {
    title: 'Patterns',
    subtitle: 'Decorative patterns, Saville, and Bookmatched designs',
    description: 'Browse expressive Lamitak designs for feature walls, furniture, counters, and project highlights.'
  },
  solids: {
    title: 'Solids',
    subtitle: 'Clean solid surfaces for modern spaces',
    description: 'Explore solid colours, solid core, Protak, and Protak Core options for versatile interior applications.'
  }
};

export function generateMetadata({ params }: { params: { group: string } }): Metadata {
  const group = params.group as CollectionGroup;
  const page = groups[group];
  if (!page) return { title: 'Collection Not Found' };
  return {
    title: `${page.title} Collection`,
    description: page.description
  };
}

export default async function CollectionPage({ params }: { params: { group: string } }) {
  const group = params.group as CollectionGroup;
  const page = groups[group];
  if (!page) notFound();

  const products = await getProductsByCollectionGroup(group);
  const filterOptions = {
    collections: Array.from(new Set(products.map((p) => p.collection).filter(Boolean) as string[])).sort(),
    categories: Array.from(new Set(products.map((p) => p.category).filter(Boolean) as string[])).sort(),
    finishes: Array.from(new Set(products.map((p) => p.finish).filter(Boolean) as string[])).sort(),
    sizes: Array.from(new Set(products.map((p) => p.size).filter(Boolean) as string[])).sort(),
    colorFamilies: Array.from(new Set(products.map((p) => p.colorFamily).filter(Boolean) as string[])).sort()
  };

  return (
    <div>
      {/* Collection header */}
      <div className="bg-varindo-ink text-white">
        <div className="shell py-12 sm:py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase mb-8">
            <Link href="/products" className="text-varindo-500 hover:text-varindo-300 transition-colors">
              Catalog
            </Link>
            <span className="text-varindo-600">·</span>
            <span className="text-varindo-400">{page.title}</span>
          </div>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              {page.accent && <p className="label text-varindo-400 mb-4">{page.accent}</p>}
              <h1 className="display text-white text-5xl sm:text-6xl lg:text-7xl mb-4">
                {page.title}
              </h1>
              <p className="text-[14px] leading-7 text-varindo-400 max-w-xl">{page.description}</p>
            </div>

            {/* Stats */}
            <div className="border border-varindo-700 bg-varindo-800/40 px-6 py-4 text-center shrink-0">
              <p className="font-display text-4xl font-light text-white">{products.length}</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-varindo-500 mt-1">Products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Collection tabs bar */}
      <div className="border-b border-varindo-line bg-white overflow-x-auto">
        <div className="shell flex gap-0">
          {(Object.keys(groups) as CollectionGroup[]).map((g) => (
            <Link
              key={g}
              href={`/collections/${g}`}
              className={`shrink-0 px-5 py-3.5 text-[10px] font-semibold tracking-[0.18em] uppercase transition-all border-b-2 ${
                g === group
                  ? 'border-varindo-ink text-varindo-ink'
                  : 'border-transparent text-varindo-500 hover:text-varindo-ink hover:border-varindo-300'
              }`}
            >
              {groups[g].title}
            </Link>
          ))}
        </div>
      </div>

      {/* Explorer */}
      <div className="shell py-10 sm:py-12">
        <ProductExplorer
          products={products}
          filterOptions={filterOptions}
          showCollectionTabs={false}
          showPromoPricing={group === 'promo-items'}
        />
      </div>
    </div>
  );
}
