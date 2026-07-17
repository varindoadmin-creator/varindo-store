import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getBlogPost } from '@/data/blog-posts';
import { BuyerSafeguardClient } from './BuyerSafeguardClient';

export const revalidate = 600;

const title = 'Jaminan Pembeli Lamitak: Cara Memastikan Keaslian HPL Anda | Varindo';
const description =
  'Pelajari cara kerja Jaminan Pembeli Lamitak — inskripsi laser, inspeksi multi-titik, dan verifikasi kode — serta mengapa membeli HPL hanya dari dealer resmi seperti Varindo penting untuk memastikan keasliannya.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${SITE_URL}/blog/buyer-safeguard` },
  openGraph: { title, description, url: `${SITE_URL}/blog/buyer-safeguard`, type: 'article' }
};

export default function BuyerSafeguardPage() {
  const post = getBlogPost('buyer-safeguard')!;
  return <BuyerSafeguardClient post={post} />;
}
