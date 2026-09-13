// ─────────────────────────────────────────────────────────────────
//  Blog / Articles index — entries that are NOT articles.
//
//  Every article on /blog is written and published in VIABooks
//  (Digital Marketing → Website Articles) and fetched by
//  src/lib/viabooksArticles.ts; there are no hand-coded article pages.
//  What stays here are links to the site's own standalone guide pages,
//  listed on /blog after the articles. Each has an `href`, and its URL
//  already has its own STATIC_PAGES entry in sitemap.ts.
// ─────────────────────────────────────────────────────────────────

export type BlogPost = {
  slug: string;
  /** Set on the guide entries below, which live outside /blog/* — overrides the
   *  default `/blog/${slug}` link and keeps the entry out of sitemap.ts' blog URLs. */
  href?: string;
  date: string; // ISO date, used for display + sitemap lastModified
  category: { id: string; en: string };
  title: { id: string; en: string };
  excerpt: { id: string; en: string };
  /** Only set on articles from VIABooks that have a cover image. */
  coverImageUrl?: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'apa-itu-hpl',
    href: '/apa-itu-laminate',
    date: '2026-07-17',
    category: { id: 'Edukasi Produk', en: 'Product Education' },
    title: {
      id: 'Apa Itu HPL? Panduan Lengkap Material, Perawatan & Sertifikasi',
      en: 'What Are Laminates? The Complete Guide to Material, Care & Certifications'
    },
    excerpt: {
      id: 'Panduan Varindo seputar High-Pressure Laminate (HPL) Lamitak — mulai dari material, cara perawatan, kode finishing, hingga sertifikasi dan standar yang berlaku.',
      en: "Varindo's guide to Lamitak High-Pressure Laminate (HPL) — the material, care instructions, finish codes, and the certifications and standards behind every sheet."
    }
  },
  {
    slug: 'harga-hpl-lamitak',
    href: '/harga-lamitak',
    date: '2026-07-17',
    category: { id: 'Panduan Pembelian', en: 'Buying Guide' },
    title: {
      id: 'Harga HPL Lamitak Terbaru per Lembar',
      en: 'Latest Lamitak HPL Prices per Sheet'
    },
    excerpt: {
      id: 'Kisaran harga HPL Lamitak dihitung langsung dari data produk aktif di katalog Varindo, sehingga selalu mengikuti harga terbaru dan sudah termasuk PPN — bukan daftar statis yang bisa kedaluwarsa.',
      en: "Lamitak HPL price ranges computed live from Varindo's active product catalogue, so they always stay current and already include PPN — not a static list that can go stale."
    }
  }
];
