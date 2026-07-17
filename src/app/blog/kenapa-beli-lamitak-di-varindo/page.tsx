import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getBlogPost } from '@/data/blog-posts';
import { WhyVarindoClient } from './WhyVarindoClient';

export const revalidate = 600;

const title = 'Kenapa Beli HPL Lamitak Lewat Varindo, Dealer Resmi | Varindo';
const description =
  'Alasan membeli HPL Lamitak melalui Varindo — dealer resmi Lamitak di Indonesia dengan katalog terstruktur, harga transparan, jaminan keaslian produk, dan dukungan sampel maupun proyek.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${SITE_URL}/blog/kenapa-beli-lamitak-di-varindo` },
  openGraph: { title, description, url: `${SITE_URL}/blog/kenapa-beli-lamitak-di-varindo`, type: 'article' }
};

export default function WhyVarindoPage() {
  const post = getBlogPost('kenapa-beli-lamitak-di-varindo')!;
  return <WhyVarindoClient post={post} />;
}
