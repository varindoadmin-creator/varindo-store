// ─────────────────────────────────────────────────────────────────
//  Articles written and published in VIABooks (Digital Marketing →
//  Website Articles). The hand-coded posts in src/data/blog-posts.ts
//  stay as they are; /blog lists both, and /blog/[slug] renders the
//  VIABooks ones. Pages refresh every ARTICLE_REVALIDATE_SECONDS, so a
//  publish in VIABooks shows here within about ten minutes, no deploy.
//
//  Every fetch fails soft: if VIABooks is unreachable, /blog still
//  shows the hand-coded posts instead of erroring.
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

export async function getPublishedArticles(): Promise<ViabooksArticleSummary[]> {
  try {
    const res = await fetch(baseUrl, { next: { revalidate: ARTICLE_REVALIDATE_SECONDS } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.articles) ? data.articles : [];
  } catch {
    return [];
  }
}

export async function getPublishedArticle(slug: string): Promise<ViabooksArticle | null> {
  try {
    const res = await fetch(`${baseUrl}/${encodeURIComponent(slug)}`, { next: { revalidate: ARTICLE_REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    return (await res.json()) as ViabooksArticle;
  } catch {
    return null;
  }
}

/**
 * Hand-coded posts plus VIABooks articles for /blog: newest VIABooks articles
 * first, then the hand-coded posts in their existing order. A VIABooks article
 * whose slug a hand-coded page already owns is left out, since that page would
 * win the URL anyway (VIABooks refuses such slugs, so this is only a backstop).
 */
export async function getAllBlogPosts(staticPosts: BlogPost[]): Promise<BlogPost[]> {
  const taken = new Set(staticPosts.map((post) => post.slug));
  const remote = (await getPublishedArticles())
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
  return [...remote, ...staticPosts];
}
