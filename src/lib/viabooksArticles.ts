// ─────────────────────────────────────────────────────────────────
//  Articles written and published in VIABooks (Digital Marketing →
//  Website Articles) — every article on /blog. /blog lists them, then
//  the guide links in src/data/blog-posts.ts; /blog/[slug] renders
//  them. Pages refresh every ARTICLE_REVALIDATE_SECONDS, so a publish
//  in VIABooks shows here within about ten minutes, no deploy.
//
//  A failed request throws rather than returning nothing. When Next.js
//  regenerates a page and that throws, it keeps serving the last good
//  version — so a VIABooks outage leaves /blog and every article as
//  they were, instead of caching an empty list or a 404 for ten
//  minutes. Only "article not found" (a real 404) means not found.
// ─────────────────────────────────────────────────────────────────

import type { BlogPost } from '@/data/blog-posts';

const VIABOOKS_API_URL = process.env.VIABOOKS_API_URL || 'https://viabooks-601025884976.asia-southeast2.run.app';
const VIABOOKS_ORGANIZATION_ID = process.env.VIABOOKS_ORGANIZATION_ID || 'cmtn75jst0001w12y30bcrr6h';

export const ARTICLE_REVALIDATE_SECONDS = 600;

type Localized = { id: string; en: string };

export type ViabooksArticleSummary = {
  slug: string;
  date: string;
  category: Localized;
  title: Localized;
  excerpt: Localized;
  coverImageUrl: string | null;
};

export type ViabooksArticle = ViabooksArticleSummary & { body: Localized; updatedAt: string };

const baseUrl = `${VIABOOKS_API_URL}/api/public/articles/${VIABOOKS_ORGANIZATION_ID}`;

/** The parsed response, or null for a 404. Throws on anything else. */
async function fetchFromViabooks<T>(path: string): Promise<T | null> {
  const res = await fetch(`${baseUrl}${path}`, { next: { revalidate: ARTICLE_REVALIDATE_SECONDS } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`VIABooks articles request ${path || '/'} failed with ${res.status}`);
  return (await res.json()) as T;
}

export async function getPublishedArticles(): Promise<ViabooksArticleSummary[]> {
  const data = await fetchFromViabooks<{ articles?: ViabooksArticleSummary[] }>('');
  return Array.isArray(data?.articles) ? data.articles : [];
}

export function getPublishedArticle(slug: string): Promise<ViabooksArticle | null> {
  return fetchFromViabooks<ViabooksArticle>(`/${encodeURIComponent(slug)}`);
}

/**
 * Everything /blog lists: VIABooks articles, newest first, then the guide
 * links. An article whose slug matches a guide entry is left out so the list
 * never holds the same slug twice.
 */
export async function getAllBlogPosts(guides: BlogPost[]): Promise<BlogPost[]> {
  const taken = new Set(guides.map((post) => post.slug));
  const articles = (await getPublishedArticles())
    .filter((article) => !taken.has(article.slug))
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((article) => ({
      slug: article.slug,
      date: article.date,
      category: article.category,
      title: article.title,
      excerpt: article.excerpt,
      coverImageUrl: article.coverImageUrl ?? undefined
    }));
  return [...articles, ...guides];
}
