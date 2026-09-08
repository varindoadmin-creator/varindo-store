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

export function WhyVarindoClient({ post }: { post: BlogPost }) {
  const { lang } = useLang();
  const waUrl = buildWhatsAppUrl('Halo Admin Varindo, saya ingin bertanya seputar pembelian HPL Lamitak melalui Varindo.');

  const reasons = [
    {
      title: lang === 'id' ? 'Status Dealer Resmi' : 'Official Authorized Dealer Status',
      body: lang === 'id'
        ? 'CV. Varindo Forma Hutama adalah Authorized Dealer HPL Lamitak, produk dari PT. TAK Products and Services, yang beroperasi di berbagai wilayah Indonesia. Artinya, seluruh produk pada katalog kami bersumber langsung dari jalur distribusi resmi Lamitak — bukan dari perantara yang tidak dapat diverifikasi.'
        : 'CV. Varindo Forma Hutama is an Authorized Dealer of HPL Lamitak, a product of PT. TAK Products and Services, operating across multiple regions of Indonesia. That means every product in our catalogue is sourced directly through Lamitak\'s official distribution channel — not through an unverifiable intermediary.'
    },
    {
      title: lang === 'id' ? 'Setiap Lembar Dilindungi Jaminan Pembeli' : 'Every Sheet Backed by Buyer Safeguard',
      body: lang === 'id'
        ? 'Produk yang Anda terima dari Varindo membawa inskripsi laser, telah melalui inspeksi multi-titik, dan dapat diverifikasi kodenya — bagian dari program Jaminan Pembeli Lamitak yang tidak berlaku pada produk substitusi dari penjual tidak resmi.'
        : 'Products you receive from Varindo carry a laser inscription, have gone through multi-point inspection, and can have their code verified — part of the Lamitak Buyer Safeguard program that doesn\'t apply to substitute products sold by unauthorized sellers.'
    },
    {
      title: lang === 'id' ? 'Katalog Terstruktur & Lengkap' : 'A Fully Structured Catalogue',
      body: lang === 'id'
        ? 'Ratusan produk aktif dapat dicari berdasarkan kode, nama desain, koleksi, sub koleksi, ukuran, dan ketebalan — jauh lebih cepat dibanding mencari lewat katalog cetak atau perantara yang stoknya belum tentu terbarui.'
        : 'Hundreds of active products can be searched by code, design name, collection, sub collection, size, and thickness — far faster than browsing a printed catalogue or going through a middleman whose stock information may be outdated.'
    },
    {
      title: lang === 'id' ? 'Harga Transparan, Termasuk Pajak' : 'Transparent Pricing, Tax Included',
      body: lang === 'id'
        ? 'Setiap harga yang tercantum di katalog Varindo sudah termasuk PPN, sehingga tidak ada biaya tersembunyi yang muncul belakangan saat proses pemesanan.'
        : 'Every price listed in Varindo\'s catalogue already includes PPN (VAT), so there are no hidden costs that surface later in the ordering process.'
    },
    {
      title: lang === 'id' ? 'Dukungan Sampel & Proyek' : 'Sample & Project Support',
      body: lang === 'id'
        ? 'Anda dapat meminta sampel fisik gratis atau meminta katalog cetak — semua dapat diproses langsung oleh tim kami tanpa perantara tambahan.'
        : 'You can request free physical samples or request a printed catalogue — all processed directly by our team with no additional middleman.'
    }
  ];

  return (
    <div>
      <div className="bg-varindo-ink text-white border-b border-varindo-800">
        <div className="shell py-14 sm:py-20">
          <Link href="/blog" className="text-[11px] font-semibold tracking-[0.14em] uppercase text-varindo-400 hover:text-white transition-colors">
            {t('blog', 'backToBlog', lang)}
          </Link>
          <p className="label text-varindo-400 mt-6 mb-4">{post.category[lang]}</p>
          <h1 className="display text-white text-4xl sm:text-5xl lg:text-6xl mb-5 max-w-3xl">
            {post.title[lang]}
          </h1>
          <p className="text-[14px] leading-7 text-varindo-400 max-w-2xl mb-4">
            {post.excerpt[lang]}
          </p>
          <p className="text-[11px] text-varindo-500">
            {t('blog', 'publishedOn', lang)}{' '}
            <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
          </p>
        </div>
      </div>

      <div className="shell py-12 sm:py-16 max-w-3xl space-y-12">

        <section>
          <div className="border border-varindo-line bg-white p-6 sm:p-8">
            <p className="text-[14px] leading-8 text-varindo-600">
              {lang === 'id'
                ? 'Semakin populer sebuah merek, semakin banyak pula penjual tidak resmi yang ikut menjualnya — sering kali tanpa jaminan keaslian, harga yang jelas, atau dukungan purna jual. Untuk HPL Lamitak, dari mana Anda membeli sama pentingnya dengan merek yang Anda pilih. Berikut alasan mengapa membeli melalui Varindo, dealer resmi Lamitak di Indonesia, adalah pilihan yang lebih aman.'
                : "The more popular a brand becomes, the more unauthorized sellers start offering it too — often without a genuine authenticity guarantee, clear pricing, or after-sales support. For Lamitak HPL, where you buy from matters just as much as the brand you choose. Here's why buying through Varindo, an authorized Lamitak dealer in Indonesia, is the safer choice."}
            </p>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">
            {lang === 'id' ? 'Lima Alasan Utama' : 'Five Key Reasons'}
          </p>
          <div className="space-y-4">
            {reasons.map((reason, i) => (
              <div key={reason.title} className="border border-varindo-line bg-white p-6 sm:p-8 flex gap-5">
                <span className="font-display text-3xl font-light text-varindo-gold shrink-0 leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-varindo-ink mb-2">{reason.title}</p>
                  <p className="text-[14px] leading-7 text-varindo-600">{reason.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">
            {lang === 'id' ? 'Melayani Berbagai Wilayah di Indonesia' : 'Serving Multiple Regions Across Indonesia'}
          </p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8">
            <p className="text-[14px] leading-8 text-varindo-600">
              {lang === 'id'
                ? 'Varindo beroperasi dari Kantor Utama di Tangerang, Kantor Terdaftar di Bandung, dan Hub Medan, melayani kebutuhan HPL Lamitak untuk desainer interior, arsitek, dan kontraktor di berbagai wilayah — termasuk Jakarta, Tangerang, Bandung, dan Surabaya.'
                : 'Varindo operates from a Head Office in Tangerang, a Registered Office in Bandung, and a Medan Hub, serving Lamitak HPL needs for interior designers, architects, and contractors across multiple regions — including Jakarta, Tangerang, Bandung, and Surabaya.'}
            </p>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">
            {lang === 'id' ? 'Baca Juga' : 'Related Reading'}
          </p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8 flex flex-col gap-2">
            <Link href="/blog/buyer-safeguard" className="text-[13px] text-varindo-ink underline underline-offset-2 hover:text-varindo-gold transition-colors">
              {lang === 'id' ? 'Jaminan Pembeli Lamitak: Cara Memastikan Keaslian HPL Anda' : "Lamitak Buyer Safeguard: How to Verify Your Laminate's Authenticity"}
            </Link>
            <Link href="/otorisasi" className="text-[13px] text-varindo-ink underline underline-offset-2 hover:text-varindo-gold transition-colors">
              {lang === 'id' ? 'Verifikasi Keaslian Produk Lamitak' : 'Verify Lamitak Product Authenticity'}
            </Link>
            <Link href="/harga-lamitak" className="text-[13px] text-varindo-ink underline underline-offset-2 hover:text-varindo-gold transition-colors">
              {lang === 'id' ? 'Harga HPL Lamitak Terbaru' : 'Latest Lamitak HPL Prices'}
            </Link>
          </div>
        </section>

        <section className="border border-varindo-line bg-varindo-50 px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display text-2xl font-light text-varindo-ink mb-2">
              {lang === 'id' ? 'Siap memesan HPL Lamitak asli?' : 'Ready to order genuine Lamitak HPL?'}
            </p>
            <p className="text-[13px] text-varindo-600 max-w-lg">
              {lang === 'id'
                ? 'Hubungi tim Varindo untuk penawaran, sampel, atau pertanyaan produk lainnya.'
                : 'Contact the Varindo team for a quote, samples, or any other product questions.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a href={waUrl} target="_blank" rel="noreferrer" className="btn-ink justify-center">
              {lang === 'id' ? 'Tanya via WhatsApp' : 'Ask via WhatsApp'}
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
