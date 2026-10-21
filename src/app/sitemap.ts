import type { MetadataRoute } from 'next';
import { getPublicProducts } from '@/lib/products';
import { SITE_URL } from '@/lib/seo';
import { SURFACE_MATCH_ENABLED } from '@/lib/features';

// Only the 5 collection groups actually linked from the site nav/footer.
// 'new-collections' exists as a route (alias of 'new-arrivals') but is never linked —
// excluding it here avoids sending duplicate-content URLs to search engines.
const COLLECTION_GROUPS = ['new-arrivals', 'best-sellers', 'woods', 'patterns', 'solids'] as const;

const STATIC_PAGES: Array<{
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
  priority: number;
}> = [
  { path: '', changeFrequency: 'daily', priority: 1 },
  { path: '/products', changeFrequency: 'daily', priority: 0.9 },
  ...(SURFACE_MATCH_ENABLED
    ? [{ path: '/surface-match', changeFrequency: 'monthly' as const, priority: 0.6 }]
    : []),
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.2 }
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getPublicProducts();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority
  }));

  const collectionEntries: MetadataRoute.Sitemap = COLLECTION_GROUPS.map((group) => ({
    url: `${SITE_URL}/collections/${group}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7
  }));

  const productEntries: MetadataRoute.Sitemap = products
    .filter((product) => product.slug)
    .map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6
    }));

  return [...staticEntries, ...collectionEntries, ...productEntries];
}
