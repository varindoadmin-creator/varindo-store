import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getBlogPost } from '@/data/blog-posts';
import { QualityLaminateClient } from './QualityLaminateClient';

export const revalidate = 600;

const title = 'Kenapa Memilih HPL Berkualitas Itu Penting | Varindo';
const description =
  'Perbedaan HPL berkualitas dan HPL murah — tampilan alami, pilihan desain eksklusif, daya tahan jangka panjang, dan kemudahan perawatan. Kenali alasan memilih Lamitak untuk interior Anda.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${SITE_URL}/blog/pentingnya-memilih-hpl-berkualitas` },
  openGraph: { title, description, url: `${SITE_URL}/blog/pentingnya-memilih-hpl-berkualitas`, type: 'article' }
};

export default function QualityLaminatePage() {
  const post = getBlogPost('pentingnya-memilih-hpl-berkualitas')!;
  return <QualityLaminateClient post={post} />;
}
