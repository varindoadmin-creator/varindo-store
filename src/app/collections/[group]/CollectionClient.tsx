'use client';

import Link from 'next/link';
import type { Product } from '@/types/product';
import type { CollectionGroup } from '@/lib/products';
import { ProductExplorer } from '@/components/ProductExplorer';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

const groupConfig: Partial<Record<CollectionGroup, { titleKey: string; descKey: string; accentKey: string }>> = {
  'new-arrivals':   { titleKey: 'newArrivalsTitle',  descKey: 'newArrivalsDesc',  accentKey: 'newArrivalsAccent' },
  'new-collections':{ titleKey: 'newArrivalsTitle',  descKey: 'newArrivalsDesc',  accentKey: 'newArrivalsAccent' },
  'best-sellers':   { titleKey: 'bestSellersTitle',  descKey: 'bestSellersDesc',  accentKey: 'bestSellersAccent' },
  'promo-items':    { titleKey: 'promoTitle',        descKey: 'promoDesc',        accentKey: 'promoAccent' },
  'woods':          { titleKey: 'woodsTitle',        descKey: 'woodsDesc',        accentKey: '' },
  'patterns':       { titleKey: 'patternsTitle',     descKey: 'patternsDesc',     accentKey: '' },
  'solids':         { titleKey: 'solidsTitle',       descKey: 'solidsDesc',       accentKey: '' },
};

const tabOrder: CollectionGroup[] = ['new-arrivals','best-sellers','promo-items','woods','patterns','solids'];

const filterOptions = {
  collections: ['Woods','Patterns','Solids'],
  categories:  ['Patterns','Protak','Protak Core','Saville','Solid Core','Solids','Solids+','Woods','Bookmatched'],
  finishes:    [],
  sizes:       ["4'x8' / 1220 x 2440mm", "4'x10' / 1220 x 3050mm"],
  colorFamilies: []
};

type Props = { group: CollectionGroup; products: Product[] };

export function CollectionClient({ group, products }: Props) {
  const { lang } = useLang();
  const config   = groupConfig[group];
  if (!config) return null;

  const title  = t('collections', config.titleKey,  lang);
  const desc   = t('collections', config.descKey,   lang);
  const accent = config.accentKey ? t('collections', config.accentKey, lang) : '';

  return (
    <div>
      {/* Header */}
      <div className="bg-varindo-ink text-white">
        <div className="shell py-12 sm:py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase mb-8">
            <Link href="/products" className="text-varindo-500 hover:text-varindo-300 transition-colors">
              {t('collections', 'breadcrumbCatalog', lang)}
            </Link>
            <span className="text-varindo-600">·</span>
            <span className="text-varindo-400">{title}</span>
          </div>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              {accent && <p className="label text-varindo-400 mb-4">{accent}</p>}
              <h1 className="display text-white text-5xl sm:text-6xl lg:text-7xl mb-4">{title}</h1>
              <p className="text-[14px] leading-7 text-varindo-400 max-w-xl">{desc}</p>
            </div>
            <div className="border border-varindo-700 bg-varindo-800/40 px-6 py-4 text-center shrink-0">
              <p className="font-display text-4xl font-light text-white">{products.length}</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-varindo-500 mt-1">
                {t('collections', 'products', lang)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Collection tabs */}
      <div className="border-b border-varindo-line bg-white overflow-x-auto">
        <div className="shell flex gap-0">
          {tabOrder.filter(g => groupConfig[g]).map((g) => (
            <Link key={g} href={`/collections/${g}`}
              className={`shrink-0 px-5 py-3.5 text-[10px] font-semibold tracking-[0.18em] uppercase transition-all border-b-2 ${
                g === group
                  ? 'border-varindo-ink text-varindo-ink'
                  : 'border-transparent text-varindo-500 hover:text-varindo-ink hover:border-varindo-300'
              }`}>
              {t('collections', groupConfig[g]!.titleKey, lang)}
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
