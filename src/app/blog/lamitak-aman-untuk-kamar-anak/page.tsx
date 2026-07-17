import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getBlogPost } from '@/data/blog-posts';
import { KidsRoomSafetyClient } from './KidsRoomSafetyClient';

export const revalidate = 600;

const title = 'HPL Lamitak Aman untuk Kamar Anak? Formaldehida & Sertifikasi | Varindo';
const description =
  'Pelajari fakta emisi formaldehida pada HPL, apa arti sertifikasi GREENGUARD Gold dan Green Label Singapore, serta cara memilih HPL Lamitak yang rendah emisi dan aman untuk kamar tidur anak.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${SITE_URL}/blog/lamitak-aman-untuk-kamar-anak` },
  openGraph: { title, description, url: `${SITE_URL}/blog/lamitak-aman-untuk-kamar-anak`, type: 'article' }
};

export default function KidsRoomSafetyPage() {
  const post = getBlogPost('lamitak-aman-untuk-kamar-anak')!;
  return <KidsRoomSafetyClient post={post} />;
}
