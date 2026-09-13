import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_URL } from '@/lib/seo';
import { getPublishedArticle } from '@/lib/viabooksArticles';
import { ViabooksArticleClient } from './ViabooksArticleClient';

// Every article on /blog, published from VIABooks (see src/lib/viabooksArticles.ts).
export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) return {};

  const title = `${article.title.id} | Varindo`;
  const description = article.excerpt.id;
  const url = `${SITE_URL}/blog/${article.slug}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      ...(article.coverImageUrl ? { images: [{ url: article.coverImageUrl }] } : {})
    }
  };
}

export default async function ViabooksArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();
  return <ViabooksArticleClient article={article} />;
}
