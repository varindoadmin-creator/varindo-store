import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';
import { ApaItuLaminateClient } from './ApaItuLaminateClient';

export const revalidate = 600;

const title = 'Apa Itu Laminate HPL? Panduan, Perawatan & Sertifikasi Lamitak | Varindo';
const description =
  'Pelajari apa itu High-Pressure Laminate (HPL), fitur anti-bakteri, panduan perawatan dan pembersihan, kode finishing, sertifikasi, serta spesifikasi standar produk Lamitak.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${SITE_URL}/apa-itu-laminate` },
  openGraph: { title, description, url: `${SITE_URL}/apa-itu-laminate`, type: 'website' }
};

export default function ApaItuLaminatePage() {
  return <ApaItuLaminateClient />;
}
