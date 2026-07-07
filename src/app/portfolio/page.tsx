import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';
import { PortfolioPageClient } from './PortfolioPageClient';

export const revalidate = 600;

const title = 'Katalog Lamitak 2026/2027 - Lihat Online | Varindo';
const description =
  'Jelajahi portofolio digital Lamitak 2026/2027 langsung di situs ini — tekstur, finishing, dan rangkaian permukaan untuk setiap proyek interior.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${SITE_URL}/portfolio` },
  openGraph: { title, description, url: `${SITE_URL}/portfolio`, type: 'website' }
};

export default function PortfolioPage() {
  return <PortfolioPageClient />;
}
