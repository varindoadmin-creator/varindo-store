import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';
import { blogPosts } from '@/data/blog-posts';
import { getAllBlogPosts } from '@/lib/viabooksArticles';
import { BlogPageClient } from './BlogPageClient';

export const revalidate = 600;

const title = 'Artikel HPL & Lamitak | Varindo';
const description =
  'Artikel dan panduan edukasi seputar High-Pressure Laminate (HPL) secara umum dan produk Lamitak secara khusus, dari tim dealer resmi Lamitak Indonesia.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: { title, description, url: `${SITE_URL}/blog`, type: 'website' }
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts(blogPosts);
  return <BlogPageClient posts={posts} />;
}
