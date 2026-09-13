import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';
import { SurfaceMatchClient } from './SurfaceMatchClient';

const title = 'Cari HPL dari Foto - Surface Match | Varindo';
const description =
  'Foto contoh HPL, permukaan interior, atau halaman katalog, lalu temukan desain Lamitak yang paling mirip beserta kode produk dan ukurannya.';
const url = `${SITE_URL}/surface-match`;
const ogImage = `${SITE_URL}/portfolio.webp`;

export const metadata: Metadata = {
  // title.absolute bypasses the root layout's "%s | Varindo" template — this string already ends in "| Varindo".
  title: { absolute: title },
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    type: 'website',
    images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImage],
  },
};

export default function SurfaceMatchPage() {
  return <SurfaceMatchClient />;
}
