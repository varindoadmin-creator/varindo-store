import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';
import { OtorisasiPageClient } from './OtorisasiPageClient';

export const revalidate = 600;

const title = 'Dealer Resmi HPL Lamitak - Cara Verifikasi Keaslian Produk | Varindo';
const description =
  'CV. Varindo Forma Hutama adalah dealer resmi HPL Lamitak (PT. TAK Products and Services) di Indonesia. Pelajari cara memverifikasi keaslian produk sebelum membeli.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${SITE_URL}/otorisasi` },
  openGraph: { title, description, url: `${SITE_URL}/otorisasi`, type: 'website' }
};

export default function OtorisasiPage() {
  return <OtorisasiPageClient />;
}
