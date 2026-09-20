'use client';

import Link from 'next/link';
import type { Product } from '@/types/product';
import type { CollectionGroup } from '@/lib/products';
import { ProductExplorer } from '@/components/ProductExplorer';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

const groupConfig: Partial<Record<CollectionGroup, { titleKey: string; descKey: string; accentKey: string; introKey: string }>> = {
  'new-arrivals':   { titleKey: 'newArrivalsTitle',  descKey: 'newArrivalsDesc',  accentKey: 'newArrivalsAccent', introKey: 'newArrivalsIntro' },
  'new-collections':{ titleKey: 'newArrivalsTitle',  descKey: 'newArrivalsDesc',  accentKey: 'newArrivalsAccent', introKey: 'newArrivalsIntro' },
  'best-sellers':   { titleKey: 'bestSellersTitle',  descKey: 'bestSellersDesc',  accentKey: 'bestSellersAccent', introKey: 'bestSellersIntro' },
  'woods':          { titleKey: 'woodsTitle',        descKey: 'woodsDesc',        accentKey: '',                  introKey: 'woodsIntro' },
  'patterns':       { titleKey: 'patternsTitle',     descKey: 'patternsDesc',     accentKey: '',                  introKey: 'patternsIntro' },
  'solids':         { titleKey: 'solidsTitle',       descKey: 'solidsDesc',       accentKey: '',                  introKey: 'solidsIntro' },
};

const tabOrder: CollectionGroup[] = ['new-arrivals','best-sellers','woods','patterns','solids'];

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
  const intro  = t('collections', config.introKey,  lang);

  return (
    <div>
      {/* Header */}
      <div className="bg-varindo-paper">
        <div className="shell py-12 sm:py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[12px] mb-8">
            <Link href="/products" className="text-varindo-mid hover:text-varindo-mid transition-colors">
              {t('collections', 'breadcrumbCatalog', lang)}
            </Link>
            <span className="text-varindo-mid">·</span>
            <span className="text-varindo-mid">{title}</span>
          </div>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              {accent && <p className="label mb-4">{accent}</p>}
              <h1 className="display text-varindo-ink text-[40px] sm:text-[56px] lg:text-[80px] mb-4">{title}</h1>
              <p className="text-[16px] leading-7 text-varindo-mid max-w-xl">{desc}</p>
            </div>
            <div className="shrink-0 rounded-card border border-varindo-line bg-varindo-canvas px-6 py-4 text-center">
              <p className="mono text-[34px] font-medium text-varindo-ink">{products.length}</p>
              <p className="mono mt-1 text-[10px] uppercase tracking-[0.1em] text-varindo-mid">
                {t('collections', 'products', lang)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Collection tabs */}
      <div className="overflow-x-auto scrollbar-none">
        <div className="shell flex gap-6 border-b border-varindo-line">
          {tabOrder.filter(g => groupConfig[g]).map((g) => (
            <Link key={g} href={`/collections/${g}`}
              aria-current={g === group ? 'page' : undefined}
              className={`mono -mb-px shrink-0 whitespace-nowrap border-b-2 pb-2.5 text-[12px] font-medium uppercase tracking-[0.08em] transition-colors ${
                g === group
                  ? 'border-varindo-clay text-varindo-ink'
                  : 'border-transparent text-varindo-mid hover:border-varindo-line-firm hover:text-varindo-ink'
              }`}>
              {t('collections', groupConfig[g]!.titleKey, lang)}
            </Link>
          ))}
        </div>
      </div>

      {/* SEO intro copy — server-rendered above the grid */}
      <div className="shell pt-10 sm:pt-12">
        <p className="text-[14px] leading-7 text-varindo-mid max-w-3xl">{intro}</p>
      </div>

      {/* Explorer */}
      <div className="shell py-10 sm:py-12">
        <ProductExplorer
          products={products}
          filterOptions={filterOptions}
          showCollectionTabs={false}
                />
      </div>
    </div>
  );
}
