import type { MetadataRoute } from 'next';
import { getPublicProducts } from '@/lib/products';
import { SITE_URL } from '@/lib/seo';
import { CITY_SLUGS } from '@/lib/cityContent';
import { blogPosts } from '@/data/blog-posts';

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
  { path: '/surface-match', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/request-sample', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/request-quote', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/request-catalogue', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/price-list', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/harga-lamitak', changeFrequency: 'daily', priority: 0.8 },
  { path: '/apa-itu-laminate', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/otorisasi', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/portfolio', changeFrequency: 'monthly', priority: 0.5 },
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

  const cityEntries: MetadataRoute.Sitemap = CITY_SLUGS.map((slug) => ({
    url: `${SITE_URL}/lamitak-${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.5
  }));

  return [...staticEntries, ...collectionEntries, ...productEntries, ...cityEntries, ...blogEntries];
}
