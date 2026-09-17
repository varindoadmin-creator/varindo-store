import type { Metadata } from 'next';
import Link from 'next/link';
import { getPriceTable } from '@/lib/products';
import { SITE_URL, formatPriceIDR } from '@/lib/seo';
import { buildFaqPageJsonLd, type FaqEntry } from '@/lib/structured-data';
import { JsonLd } from '@/components/JsonLd';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

const YEAR = new Date().getFullYear();

const FAQ: FaqEntry[] = [
  {
    question: 'Kenapa harga HPL Lamitak berbeda-beda antar seri?',
    answer:
      'Harga berbeda karena setiap seri Lamitak memiliki tingkat kerumitan motif, proses produksi, dan bahan baku yang berbeda. Motif dekoratif seperti Bookmatched dan Saville umumnya memiliki harga lebih tinggi dibanding warna solid karena proses cetak yang lebih kompleks.'
  },
  {
    question: 'Apakah harga yang tercantum sudah termasuk PPN?',
    answer:
      'Ya, seluruh harga yang tercantum di katalog Varindo sudah termasuk PPN. Anda tidak perlu menghitung tambahan pajak lagi saat memesan.'
  },
  {
    question: 'Apakah bisa nego harga untuk kebutuhan proyek dalam jumlah besar?',
    answer:
      'Untuk kebutuhan proyek dengan jumlah pemesanan besar, Anda dapat menghubungi tim kami via WhatsApp atau mengajukan Permintaan Penawaran agar tim Varindo dapat membantu memberikan penawaran yang sesuai.'
  },
  {
    question: 'Apakah harga di website ini sama dengan harga di marketplace?',
    answer:
      'Harga yang tercantum di website ini adalah harga resmi dealer Lamitak dan sudah termasuk PPN. Kami menyarankan Anda mengecek langsung ke tim Varindo untuk memastikan harga dan ketersediaan stok terbaru sebelum membandingkan dengan sumber lain.'
  },
  {
    question: 'Bagaimana cara memesan HPL Lamitak melalui Varindo?',
    answer:
      'Anda dapat menghubungi tim kami langsung via WhatsApp, atau mengisi formulir Permintaan Penawaran maupun Permintaan Katalog di website ini. Tim kami akan membantu proses pemesanan dan pengiriman.'
  },
  {
    question: 'Apakah saya bisa meminta sampel sebelum membeli?',
    answer:
      'Ya, Anda dapat mengajukan Permintaan Sampel gratis melalui website ini untuk memastikan warna dan tekstur sesuai kebutuhan sebelum melakukan pemesanan dalam jumlah besar.'
  }
];

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const title = `Harga HPL Lamitak Terbaru ${YEAR} per Lembar - Resmi Dealer | Varindo`;
  const description = `Cek harga HPL Lamitak ${YEAR} per lembar berdasarkan seri dan ukuran, harga resmi dealer sudah termasuk PPN. Update langsung dari katalog produk Varindo.`;
  const url = `${SITE_URL}/harga-lamitak`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' }
  };
}

export default async function HargaLamitakPage() {
  const priceTable = await getPriceTable();
  const waUrl = buildWhatsAppUrl('Halo Admin Varindo, saya ingin tanya harga HPL Lamitak terbaru untuk kebutuhan proyek saya.');

  return (
    <div>
      <JsonLd data={buildFaqPageJsonLd(FAQ)} />

      <div className="bg-white">
        <div className="shell py-14 sm:py-20">
          <p className="label mb-4">Harga Resmi Dealer</p>
          <h1 className="display text-varindo-ink text-[36px] sm:text-[48px] lg:text-[56px] mb-5">
            Harga HPL Lamitak Terbaru {YEAR} per Lembar
          </h1>
          <p className="text-[17px] leading-7 text-varindo-mid max-w-2xl">
            Tabel harga di bawah ini dihitung langsung dari data produk aktif di katalog Varindo,
            sehingga selalu mengikuti harga terbaru — bukan daftar statis yang bisa kedaluwarsa.
            Semua harga sudah termasuk PPN dan berlaku untuk pembelian melalui dealer resmi Lamitak Indonesia.
          </p>
        </div>
      </div>

      <div className="shell py-12 sm:py-16">
        {/* Price table */}
        <section className="mb-16">
          <p className="label mb-4">Kisaran Harga per Seri &amp; Ukuran</p>
          <div className="rounded-xl2 bg-varindo-canvas overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="bg-varindo-50 border-b border-varindo-line/50">
                  <th className="px-5 py-3 font-semibold tracking-[-0.016em] text-varindo-deep text-[12px]">Koleksi</th>
                  <th className="px-5 py-3 font-semibold tracking-[-0.016em] text-varindo-deep text-[12px]">Ukuran</th>
                  <th className="px-5 py-3 font-semibold tracking-[-0.016em] text-varindo-deep text-[12px]">Kisaran Harga</th>
                  <th className="px-5 py-3 font-semibold tracking-[-0.016em] text-varindo-deep text-[12px]">Jumlah Motif</th>
                </tr>
              </thead>
              <tbody>
                {priceTable.map((row, i) => (
                  <tr key={`${row.collection}-${row.size}`} className={i !== priceTable.length - 1 ? 'border-b border-varindo-line/60' : ''}>
                    <td className="px-5 py-3.5 font-medium text-varindo-ink">{row.collection}</td>
                    <td className="px-5 py-3.5 text-varindo-mid">{row.size}</td>
                    <td className="px-5 py-3.5 text-varindo-ink font-medium">
                      {formatPriceIDR(row.minPrice)} – {formatPriceIDR(row.maxPrice)}
                    </td>
                    <td className="px-5 py-3.5 text-varindo-mid">{row.count} motif</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[12px] text-varindo-mid">
            Harga sudah termasuk PPN. Harga per kode produk dapat dilihat langsung di halaman detail masing-masing produk.
          </p>
        </section>

        {/* CTA */}
        <section className="mb-16 rounded-card bg-varindo-canvas px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="display text-[28px] text-varindo-ink mb-2">Butuh harga untuk kebutuhan proyek Anda?</p>
            <p className="text-[14px] text-varindo-mid max-w-lg">Tim kami siap membantu memberikan penawaran sesuai kebutuhan, termasuk untuk pemesanan dalam jumlah besar.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a href={waUrl} target="_blank" rel="noreferrer" className="btn-ink justify-center">Tanya via WhatsApp</a>
          </div>
        </section>

        {/* Internal links */}
        <section className="mb-16">
          <p className="label mb-4">Jelajahi Lebih Lanjut</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: '/products', label: 'Semua Produk' },
              { href: '/collections/woods', label: 'Koleksi Woods' },
              { href: '/collections/patterns', label: 'Koleksi Patterns' },
              { href: '/collections/solids', label: 'Koleksi Solids' },
              { href: '/lamitak-jakarta', label: 'Jual HPL Lamitak Jakarta' },
              { href: '/lamitak-tangerang', label: 'Jual HPL Lamitak Tangerang' },
              { href: '/lamitak-bandung', label: 'Jual HPL Lamitak Bandung' },
              { href: '/lamitak-surabaya', label: 'Jual HPL Lamitak Surabaya' }
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className="bg-white px-5 py-4 text-[14px] font-medium text-varindo-ink hover:text-varindo-link hover:bg-varindo-50 transition-colors">
                {item.label} →
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <p className="label mb-6">Pertanyaan Seputar Harga</p>
          <div className="rounded-xl2 bg-varindo-canvas divide-y divide-varindo-line/60">
            {FAQ.map((entry) => (
              <div key={entry.question} className="px-6 py-5">
                <p className="text-[17px] font-semibold text-varindo-ink mb-2">{entry.question}</p>
                <p className="text-[14px] leading-7 text-varindo-mid">{entry.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
