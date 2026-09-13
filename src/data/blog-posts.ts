// ─────────────────────────────────────────────────────────────────
//  Blog / Articles index — add a new entry here for every post added
//  under src/app/blog/[slug]/, so it appears on /blog and sitemap.ts.
// ─────────────────────────────────────────────────────────────────

export type BlogPost = {
  slug: string;
  /** Set only for entries that live outside /blog/* (e.g. standalone SEO pages) —
   *  overrides the default `/blog/${slug}` link and is excluded from sitemap.ts'
   *  blog entries since that URL already has its own STATIC_PAGES entry. */
  href?: string;
  date: string; // ISO date, used for display + sitemap lastModified
  category: { id: string; en: string };
  title: { id: string; en: string };
  excerpt: { id: string; en: string };
  /** Only set on articles published from VIABooks (see src/lib/viabooksArticles.ts). */
  coverImageUrl?: string;
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
  },
  {
    slug: 'pentingnya-memilih-hpl-berkualitas',
    date: '2026-07-17',
    category: { id: 'Edukasi Produk', en: 'Product Education' },
    title: {
      id: 'Kenapa Memilih HPL Berkualitas Itu Penting: Tampilan Alami hingga Perawatan Mudah',
      en: 'Why Choosing High-Quality Laminate Matters: From Natural Looks to Easy Maintenance'
    },
    excerpt: {
      id: 'HPL murah mungkin terlihat serupa pada pandangan pertama, tapi berbeda jauh dalam tampilan alami, pilihan desain, daya tahan jangka panjang, dan kemudahan perawatan — inilah alasan HPL berkualitas seperti Lamitak layak dipertimbangkan.',
      en: "Cheap laminate might look similar at first glance, but differs sharply in natural appearance, design choice, long-term durability, and ease of maintenance — here's why quality HPL like Lamitak is worth the investment."
    }
  },
  {
    slug: 'kenapa-beli-lamitak-di-varindo',
    date: '2026-07-17',
    category: { id: 'Panduan Pembelian', en: 'Buying Guide' },
    title: {
      id: 'Kenapa Membeli HPL Lamitak Harus Lewat Varindo, Dealer Resmi',
      en: 'Why You Should Buy Lamitak HPL Through Varindo, an Authorized Dealer'
    },
    excerpt: {
      id: 'Sebagai dealer resmi Lamitak di Indonesia, Varindo menawarkan lebih dari sekadar harga — mulai dari jaminan keaslian produk, katalog terstruktur, harga transparan, hingga dukungan sampel dan proyek.',
      en: 'As an authorized Lamitak dealer in Indonesia, Varindo offers more than just price — genuine product guarantees, a structured catalogue, transparent pricing, and sample and project support.'
    }
  },
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

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
