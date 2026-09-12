'use client';

import Link from 'next/link';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import type { BlogPost } from '@/data/blog-posts';

function formatDate(iso: string, lang: 'id' | 'en') {
  return new Date(iso).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function QualityLaminateClient({ post }: { post: BlogPost }) {
  const { lang } = useLang();
  const waUrl = buildWhatsAppUrl('Halo Admin Varindo, saya ingin tanya rekomendasi HPL Lamitak berkualitas untuk proyek saya.');

  const reasons = [
    {
      title: lang === 'id' ? 'Tampilan Alami' : 'A Natural, Authentic Look',
      body: lang === 'id'
        ? 'Motif kayu, marmer, dan tekstur kain pada HPL Lamitak dicetak dengan detail serat dan pori yang halus, lalu dipadukan dengan finishing bertekstur seperti Dri-Matt®, Suede, atau Brushed agar terasa senyata mungkin saat disentuh. HPL murah cenderung memiliki motif yang datar, berulang, dan terlihat "dicetak" dari jarak dekat — terutama pada motif kayu yang seharusnya tampak alami.'
        : 'Lamitak\'s wood, marble, and fabric motifs are printed with fine, consistent grain detail, then paired with textured finishes like Dri-Matt®, Suede, or Brushed so they feel as convincing as they look. Cheap laminate tends to have flat, repetitive motifs that read as visibly "printed" up close — especially on wood grains that are supposed to look organic.'
    },
    {
      title: lang === 'id' ? 'Desain & Warna Eksklusif' : 'Exclusive Designs & Colours',
      body: lang === 'id'
        ? 'Koleksi Lamitak mencakup ratusan motif di kategori Woods, Patterns, dan Solids — termasuk desain dekoratif eksklusif seperti Bookmatched dan Saville yang sulit ditemukan pada HPL generik. Koleksi ini juga diperbarui secara berkala lewat rilis Produk Terbaru, memberi lebih banyak pilihan untuk tampilan interior yang tidak pasaran.'
        : "Lamitak's collection spans hundreds of motifs across Woods, Patterns, and Solids — including exclusive decorative designs like Bookmatched and Saville that are hard to find in generic laminate. The range is also refreshed regularly through New Arrivals, giving you more options for an interior that doesn't look off-the-shelf."
    },
    {
      title: lang === 'id' ? 'Tahan Lama' : 'Built for the Long Term',
      body: lang === 'id'
        ? 'HPL Lamitak umumnya sesuai dengan standar internasional ISO 4586, dengan ketebalan 0.7mm untuk finishing non-glossy dan 1.0mm untuk high gloss — dirancang tahan gesekan dan benturan dalam penggunaan normal. HPL berkualitas rendah lebih rentan tergores, memudar, atau terkelupas dari substrat dalam beberapa tahun pemakaian, yang berarti biaya renovasi ulang lebih cepat datang.'
        : 'Lamitak HPL typically conforms to the international ISO 4586 standard, with 0.7mm thickness for non-gloss finishes and 1.0mm for high gloss — built to resist abrasion and impact under normal use. Lower-grade laminate is more prone to scratching, fading, or delaminating from the substrate within a few years, which means renovation costs come around sooner than expected.'
    },
    {
      title: lang === 'id' ? 'Mudah Dirawat & Dibersihkan' : 'Easy to Maintain & Clean',
      body: lang === 'id'
        ? 'Permukaan HPL Lamitak cukup dibersihkan dengan air hangat dan kain tidak abrasif untuk sebagian besar noda harian, tanpa perlakuan khusus. Panduan perawatan dan pembersihan lengkap tersedia di halaman Apa Itu HPL kami.'
        : "Lamitak HPL surfaces can be cleaned with warm water and a non-abrasive cloth for most everyday stains, with no special treatment required. The full care and cleaning guide is available on our What Are Laminates page."
    }
  ];

  return (
    <div>
      <div className="bg-white">
        <div className="shell py-14 sm:py-20">
          <Link href="/blog" className="text-[12px] font-semibold tracking-[-0.016em] text-varindo-mid hover:text-varindo-ink transition-colors">
            {t('blog', 'backToBlog', lang)}
          </Link>
          <p className="label mt-6 mb-4">{post.category[lang]}</p>
          <h1 className="display text-varindo-ink text-[36px] sm:text-[48px] lg:text-[56px] mb-5 max-w-3xl">
            {post.title[lang]}
          </h1>
          <p className="text-[17px] leading-7 text-varindo-mid max-w-2xl mb-4">
            {post.excerpt[lang]}
          </p>
          <p className="text-[12px] text-varindo-mid">
            {t('blog', 'publishedOn', lang)}{' '}
            <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
          </p>
        </div>
      </div>

      <div className="shell py-12 sm:py-16 max-w-3xl space-y-12">

        <section>
          <div className="rounded-card bg-varindo-canvas p-6 sm:p-8">
            <p className="text-[17px] leading-8 text-varindo-mid">
              {lang === 'id'
                ? 'HPL akan menempel di dinding, kabinet, atau furnitur Anda selama bertahun-tahun — bukan transaksi sekali pakai. Perbedaan antara HPL berkualitas dan HPL murah mungkin tidak terlihat di hari pemasangan, tapi akan sangat terasa dalam lima atau sepuluh tahun ke depan: pada tampilan yang tetap meyakinkan, warna yang tidak mudah pudar, dan permukaan yang tetap mudah dibersihkan. Berikut alasan mengapa investasi pada HPL berkualitas seperti Lamitak layak dipertimbangkan sejak awal.'
                : "Laminate stays on your walls, cabinetry, or furniture for years — it's not a one-time transaction. The difference between quality laminate and cheap laminate rarely shows on installation day, but it becomes obvious five or ten years later: in whether the look still holds up, whether the colour has faded, and whether the surface is still easy to clean. Here's why investing in quality HPL like Lamitak is worth deciding on from the start."}
            </p>
          </div>
        </section>

        <section>
          <p className="label mb-4">
            {lang === 'id' ? 'Empat Alasan Utama' : 'Four Key Reasons'}
          </p>
          <div className="space-y-4">
            {reasons.map((reason, i) => (
              <div key={reason.title} className="rounded-card bg-varindo-canvas p-6 sm:p-8 flex gap-5">
                <span className="display text-[32px] text-varindo-link shrink-0 leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-varindo-ink mb-2">{reason.title}</p>
                  <p className="text-[17px] leading-7 text-varindo-mid">{reason.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[14px] leading-7 text-varindo-mid">
            {lang === 'id'
              ? 'Lihat spesifikasi teknis dan panduan perawatan lengkap di halaman '
              : 'See the full technical specifications and care guide on our '}
            <Link href="/apa-itu-laminate" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-link transition-colors">
              {lang === 'id' ? 'Apa Itu HPL?' : 'What Are Laminates?'}
            </Link>
            {lang === 'id' ? '.' : ' page.'}
          </p>
        </section>

        <section>
          <p className="label mb-4">
            {lang === 'id' ? 'Biaya Sebenarnya dari Memilih yang Murah' : 'The Real Cost of Choosing Cheap'}
          </p>
          <div className="rounded-card bg-varindo-canvas p-6 sm:p-8 space-y-4">
            <p className="text-[17px] leading-8 text-varindo-mid">
              {lang === 'id'
                ? 'HPL murah memang terlihat menghemat anggaran di awal, tapi sering kali harus diganti lebih cepat karena tergores, memudar, atau terkelupas — sehingga biaya material, tenaga kerja, dan waktu proyek justru dikeluarkan dua kali. HPL Lamitak dijual dengan kisaran harga transparan mulai dari sekitar Rp400 ribuan hingga sekitar Rp3,9 juta per lembar tergantung koleksi, motif, dan ukuran, sudah termasuk PPN — sehingga Anda dapat membandingkan nilai jangka panjangnya, bukan hanya harga di depan.'
                : "Cheap laminate looks like it saves money upfront, but often needs replacing sooner due to scratching, fading, or delamination — so material, labour, and project time end up spent twice. Lamitak HPL is sold at a transparent price range of roughly Rp400,000 to around Rp3.9 million per sheet depending on collection, motif, and size, tax included — so you can compare long-term value, not just the sticker price."}
            </p>
            <p className="text-[14px] leading-7 text-varindo-mid">
              {lang === 'id' ? 'Cek kisaran harga per koleksi dan ukuran di halaman ' : 'Check price ranges by collection and size on our '}
              <Link href="/harga-lamitak" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-link transition-colors">
                {lang === 'id' ? 'Harga HPL Lamitak' : 'Lamitak HPL Price'}
              </Link>
              {lang === 'id' ? '.' : ' page.'}
            </p>
          </div>
        </section>

        <section className="rounded-card bg-varindo-canvas px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="display text-[28px] text-varindo-ink mb-2">
              {lang === 'id' ? 'Ingin lihat dan meraba langsung materialnya?' : 'Want to see and feel the material yourself?'}
            </p>
            <p className="text-[14px] text-varindo-mid max-w-lg">
              {lang === 'id'
                ? 'Jelajahi koleksi lengkap Lamitak atau minta sampel fisik gratis sebelum menentukan pilihan.'
                : "Browse the full Lamitak collection or request a free physical sample before you decide."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/products" className="btn-ink justify-center">
              {lang === 'id' ? 'Lihat Produk' : 'Browse Products'}
            </Link>
            <a href={waUrl} target="_blank" rel="noreferrer" className="btn-ghost justify-center">
              {lang === 'id' ? 'Tanya via WhatsApp' : 'Ask via WhatsApp'}
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
