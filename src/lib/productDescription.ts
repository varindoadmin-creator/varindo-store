import type { Product } from '@/types/product';
import { safeDesignName } from './seo';

type Family = 'woods' | 'patterns' | 'solids' | 'protak';

/** Deterministic string hash (djb2-style) — same input always produces the same output, no Math.random. */
function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * `category` is the finer-grained sub-collection (Woods / Patterns / Bookmatched / Saville /
 * Solids / Solids+ / Solid Core / Protak / Protak Core across the real 802-product catalog).
 * Bookmatched and Saville fold into the "patterns" family (they're decorative pattern surfaces
 * too, at 4 and 6 products respectively) — the real category label is still interpolated into
 * the sentence, so the text stays specific even though the sentence structures are shared.
 */
function getFamily(product: Product): Family {
  const category = (product.category || product.collection || '').toLowerCase();
  if (category.includes('protak')) return 'protak';
  if (category === 'woods') return 'woods';
  if (category === 'patterns' || category === 'bookmatched' || category === 'saville') return 'patterns';
  return 'solids';
}

const APPLICATIONS: Record<Family, string> = {
  woods: 'kitchen set, lemari pakaian, panel dinding, dan furnitur interior',
  patterns: 'meja island, backsplash, panel feature wall, dan furnitur statement',
  solids: 'interior minimalis, laci, partisi, dan kabinet',
  protak: 'meja countertop, edge pasca-bentuk (postforming), dan area bersudut melengkung'
};

type Ctx = {
  design: string;
  category: string;
  size: string | null;
  thickness: string | null;
  colorFamily: string | null;
};

function sizeClause(c: Ctx) { return c.size ? `ukuran ${c.size}` : null; }
function thicknessClause(c: Ctx) { return c.thickness ? `ketebalan ${c.thickness}` : null; }
function dimensionSentence(c: Ctx, lead: string) {
  const bits = [sizeClause(c), thicknessClause(c)].filter(Boolean);
  if (bits.length === 0) return null;
  return `${lead} ${bits.join(' dan ')}.`;
}
function colorClause(c: Ctx) { return c.colorFamily ? ` dengan warna dominan ${c.colorFamily}` : ''; }

const WOODS_TEMPLATES: Array<(c: Ctx) => string> = [
  (c) => [
    `Motif ${c.design} dari koleksi HPL Lamitak Woods menghadirkan kesan kayu alami yang hangat${colorClause(c)}, cocok melengkapi konsep interior modern maupun klasik.`,
    dimensionSentence(c, 'Tersedia dalam'),
    `Permukaannya menampilkan serat kayu yang halus dan konsisten di setiap lembar, tahan gores, dan mudah dirawat untuk pemakaian jangka panjang.`
  ].filter(Boolean).join(' '),
  (c) => [
    `Menghadirkan tekstur kayu ${c.design} yang autentik, HPL Lamitak ini dirancang untuk interior yang mengutamakan kehangatan dan kesan alami${colorClause(c)}.`,
    dimensionSentence(c, 'Diproduksi dalam'),
    `Setiap lembar memiliki pola serat yang seragam sehingga mudah disambung tanpa perbedaan warna yang mencolok, ideal untuk area dengan bidang luas.`
  ].filter(Boolean).join(' '),
  (c) => [
    `${c.design} adalah pilihan tepat bagi Anda yang menginginkan nuansa kayu premium tanpa perawatan rumit${colorClause(c)}.`,
    dimensionSentence(c, 'Lembaran HPL ini hadir dalam'),
    `Lapisan permukaannya tahan terhadap goresan ringan dan panas, menjadikannya andal untuk furnitur maupun elemen dekoratif yang sering digunakan.`
  ].filter(Boolean).join(' '),
  (c) => [
    `Terinspirasi dari serat kayu asli, motif ${c.design} memberikan kedalaman visual yang membuat ruangan terasa lebih hangat dan personal${colorClause(c)}.`,
    dimensionSentence(c, 'Tersedia pada'),
    `Material HPL Lamitak ini diproduksi dengan standar dealer resmi sehingga konsistensi warna dan tekstur terjaga antar lembar.`
  ].filter(Boolean).join(' '),
  (c) => [
    `Bagi proyek yang mengusung tema natural, ${c.design} menawarkan tampilan kayu yang hangat dan mudah dipadukan dengan material lain${colorClause(c)}.`,
    dimensionSentence(c, 'Produk ini tersedia dalam'),
    `Permukaannya kokoh, tahan lembap pada penggunaan normal, dan dirancang untuk mendukung kebutuhan interior jangka panjang.`
  ].filter(Boolean).join(' ')
];

const PATTERNS_TEMPLATES: Array<(c: Ctx) => string> = [
  (c) => [
    `Motif ${c.design} dari kategori ${c.category} menghadirkan karakter dekoratif yang kuat, cocok dijadikan focal point pada ruangan${colorClause(c)}.`,
    dimensionSentence(c, 'Tersedia dalam'),
    `Detail polanya dirancang presisi sehingga tetap menarik dilihat dari jarak dekat maupun sebagai elemen luas pada dinding atau furnitur.`
  ].filter(Boolean).join(' '),
  (c) => [
    `${c.design} menampilkan pola ${c.category} yang ekspresif, ideal untuk area yang ingin tampil beda dari interior pada umumnya${colorClause(c)}.`,
    dimensionSentence(c, 'Lembaran HPL Lamitak ini hadir dalam'),
    `Kombinasi warna dan garis pada motifnya memberi kesan mewah tanpa perlu elemen dekorasi tambahan yang berlebihan.`
  ].filter(Boolean).join(' '),
  (c) => [
    `Untuk proyek yang membutuhkan kesan statement, motif ${c.design} pada kategori ${c.category} bisa menjadi pilihan utama${colorClause(c)}.`,
    dimensionSentence(c, 'Diproduksi dalam'),
    `Pola dekoratifnya konsisten di setiap lembar sehingga aman digunakan pada bidang yang memerlukan lebih dari satu lembar HPL.`
  ].filter(Boolean).join(' '),
  (c) => [
    `Menggabungkan estetika ${c.category} dengan kepraktisan HPL, ${c.design} cocok untuk ruangan yang ingin menonjolkan karakter visual yang berbeda${colorClause(c)}.`,
    dimensionSentence(c, 'Tersedia pada'),
    `Permukaannya tetap tahan gores dan mudah dibersihkan meski tampilannya terkesan dekoratif dan detail.`
  ].filter(Boolean).join(' '),
  (c) => [
    `${c.design} adalah salah satu desain ${c.category} yang dirancang untuk menghadirkan kesan artistik pada elemen interior maupun furnitur${colorClause(c)}.`,
    dimensionSentence(c, 'Produk ini tersedia dalam'),
    `Setiap lembar melalui proses produksi dealer resmi Lamitak sehingga kualitas cetak motif tetap terjaga dan konsisten.`
  ].filter(Boolean).join(' ')
];

const SOLIDS_TEMPLATES: Array<(c: Ctx) => string> = [
  (c) => [
    `Warna solid ${c.design} menghadirkan tampilan bersih dan minimalis, cocok untuk interior yang mengutamakan kesederhanaan${colorClause(c)}.`,
    dimensionSentence(c, 'Tersedia dalam'),
    `Permukaannya rata tanpa motif sehingga mudah dipadukan dengan warna atau material lain dalam satu ruangan.`
  ].filter(Boolean).join(' '),
  (c) => [
    `${c.design} adalah pilihan warna polos yang serbaguna, ideal untuk proyek yang membutuhkan tampilan konsisten pada banyak bidang${colorClause(c)}.`,
    dimensionSentence(c, 'Diproduksi dalam'),
    `Warnanya stabil dan tidak mudah pudar pada pemakaian normal, menjadikannya andal untuk kebutuhan interior jangka panjang.`
  ].filter(Boolean).join(' '),
  (c) => [
    `Untuk hunian maupun ruang kerja bergaya minimalis, warna ${c.design} memberi kesan rapi dan mudah dirawat${colorClause(c)}.`,
    dimensionSentence(c, 'Tersedia pada'),
    `Karena tidak memiliki motif, permukaannya juga lebih mudah dibersihkan dari noda sehari-hari.`
  ].filter(Boolean).join(' '),
  (c) => [
    `${c.design} menawarkan solusi warna solid yang netral, cocok sebagai dasar maupun aksen dalam kombinasi desain interior Anda${colorClause(c)}.`,
    dimensionSentence(c, 'Lembaran HPL Lamitak ini hadir dalam'),
    `Permukaannya tahan gores ringan dan tetap tampil rapi meski digunakan pada elemen yang sering disentuh.`
  ].filter(Boolean).join(' '),
  (c) => [
    `Mengusung konsep warna polos, ${c.design} memudahkan Anda menciptakan tampilan interior yang konsisten dari satu ruangan ke ruangan lain${colorClause(c)}.`,
    dimensionSentence(c, 'Produk ini tersedia dalam'),
    `Kualitasnya terjamin sebagai produk resmi Lamitak yang didistribusikan langsung oleh dealer resmi di Indonesia.`
  ].filter(Boolean).join(' ')
];

const PROTAK_TEMPLATES: Array<(c: Ctx) => string> = [
  (c) => [
    `${c.design} merupakan varian ${c.category} yang dirancang untuk aplikasi pasca-bentuk (postforming), cocok untuk permukaan bersudut melengkung seperti meja countertop${colorClause(c)}.`,
    dimensionSentence(c, 'Tersedia dalam'),
    `Fleksibilitasnya memungkinkan pemasangan tanpa sambungan pada tepian, memberikan hasil akhir yang lebih rapi.`
  ].filter(Boolean).join(' '),
  (c) => [
    `Sebagai bagian dari kategori ${c.category}, ${c.design} cocok untuk kebutuhan meja dan countertop yang memerlukan lekukan pada tepi permukaan${colorClause(c)}.`,
    dimensionSentence(c, 'Diproduksi dalam'),
    `Material ini tetap mempertahankan ketahanan permukaan HPL standar Lamitak meski dibentuk mengikuti kontur furnitur.`
  ].filter(Boolean).join(' '),
  (c) => [
    `${c.design} menghadirkan solusi ${c.category} untuk area dapur maupun meja kerja yang membutuhkan tepian melengkung tanpa sambungan terlihat${colorClause(c)}.`,
    dimensionSentence(c, 'Tersedia pada'),
    `Permukaannya tetap tahan gores dan mudah dibersihkan seperti varian HPL Lamitak lainnya.`
  ].filter(Boolean).join(' '),
  (c) => [
    `Untuk proyek dapur atau area kerja dengan desain melengkung, ${c.design} dari kategori ${c.category} memberi hasil akhir yang lebih presisi${colorClause(c)}.`,
    dimensionSentence(c, 'Lembaran ini hadir dalam'),
    `Prosesnya memungkinkan pembentukan pada tepi countertop tanpa memperlihatkan garis sambungan material.`
  ].filter(Boolean).join(' '),
  (c) => [
    `${c.design} adalah pilihan ${c.category} yang cocok untuk furnitur dengan sudut membulat, seperti island kitchen maupun meja resepsionis${colorClause(c)}.`,
    dimensionSentence(c, 'Produk ini tersedia dalam'),
    `Kualitas pasca-bentuknya diproses sesuai standar Lamitak sehingga tetap tahan lama meski dibentuk mengikuti kontur.`
  ].filter(Boolean).join(' ')
];

const TEMPLATES: Record<Family, Array<(c: Ctx) => string>> = {
  woods: WOODS_TEMPLATES,
  patterns: PATTERNS_TEMPLATES,
  solids: SOLIDS_TEMPLATES,
  protak: PROTAK_TEMPLATES
};

export type ProductDescriptionBlock = {
  paragraph: string;
  suitableFor: string;
};

/** Deterministic per-product description: same product always yields the same paragraph (hash of code selects the variant, no randomness). */
export function buildProductDescriptionBlock(product: Product): ProductDescriptionBlock {
  const family = getFamily(product);
  const templates = TEMPLATES[family];
  const ctx: Ctx = {
    design: safeDesignName(product),
    category: product.category || product.collection || 'Lamitak',
    size: product.size || null,
    thickness: product.thickness || null,
    colorFamily: product.colorFamily || null
  };
  const variantIndex = hashString(product.code) % templates.length;
  const paragraph = templates[variantIndex](ctx);
  return { paragraph, suitableFor: APPLICATIONS[family] };
}

/** First sentence of the generated paragraph — used as a meta description fallback when product attributes are too sparse for the usual template. */
export function getFirstSentence(paragraph: string): string {
  const match = paragraph.match(/^[^.]+\./);
  return match ? match[0] : paragraph;
}
