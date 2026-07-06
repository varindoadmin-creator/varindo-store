import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';
import { SurfaceMatchClient } from './SurfaceMatchClient';

const title = 'Cari HPL dari Foto - Surface Match AI | Varindo';
const description =
  'Upload foto interior Anda dan biarkan AI kami menemukan kode HPL Lamitak yang paling mirip motif dan warnanya, lengkap dengan skor kecocokan.';
const url = `${SITE_URL}/surface-match`;
const ogImage = `${SITE_URL}/portfolio.webp`;

// Without this, Next marks the route fully static with no revalidation, and
// Hostinger's CDN caches it for up to a year (s-maxage=31536000) — content
// updates would never reach visitors until the cache is manually purged.
export const revalidate = 600;

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
