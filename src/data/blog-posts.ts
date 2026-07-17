// ─────────────────────────────────────────────────────────────────
//  Blog / Articles index — add a new entry here for every post added
//  under src/app/blog/[slug]/, so it appears on /blog and sitemap.ts.
// ─────────────────────────────────────────────────────────────────

export type BlogPost = {
  slug: string;
  date: string; // ISO date, used for display + sitemap lastModified
  category: { id: string; en: string };
  title: { id: string; en: string };
  excerpt: { id: string; en: string };
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'buyer-safeguard',
    date: '2026-07-17',
    category: { id: 'Edukasi Produk', en: 'Product Education' },
    title: {
      id: 'Jaminan Pembeli Lamitak: Cara Memastikan Keaslian HPL Anda',
      en: "Lamitak Buyer Safeguard: How to Verify Your Laminate's Authenticity"
    },
    excerpt: {
      id: 'Mengenal program Jaminan Pembeli Lamitak — inskripsi laser, inspeksi multi-titik, dan verifikasi kode — serta mengapa membeli hanya dari dealer resmi penting untuk memastikan keaslian setiap lembar HPL.',
      en: "A closer look at Lamitak's Buyer Safeguard program — laser inscription, multi-point inspection, and code verification — and why buying only through authorized dealers matters for every sheet's authenticity."
    }
  },
  {
    slug: 'lamitak-aman-untuk-kamar-anak',
    date: '2026-07-17',
    category: { id: 'Edukasi Produk', en: 'Product Education' },
    title: {
      id: 'Apakah HPL Lamitak Aman untuk Kamar Tidur Anak? Fakta Emisi Formaldehida & Sertifikasi',
      en: "Is Lamitak HPL Safe for Kids' Bedrooms? The Facts on Formaldehyde Emissions & Certification"
    },
    excerpt: {
      id: 'Panduan bagi orang tua dan desainer interior seputar keamanan HPL Lamitak untuk ruang anak — sertifikasi GREENGUARD Gold, batas emisi formaldehida, Green Label Singapore, dan cara memilih material rendah emisi.',
      en: "A guide for homeowners and interior designers on the safety of Lamitak HPL for children's spaces — GREENGUARD Gold certification, formaldehyde emission limits, Green Label Singapore, and how to choose low-emission materials."
    }
  }
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
