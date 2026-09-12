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

export function BuyerSafeguardClient({ post }: { post: BlogPost }) {
  const { lang } = useLang();
  const waUrl = buildWhatsAppUrl('Halo Admin Varindo, saya ingin bertanya seputar Jaminan Pembeli Lamitak.');

  const checkSteps = lang === 'id'
    ? [
        'Balikkan lembar HPL dan periksa bagian belakang untuk mencari cetakan laser berwarna hitam.',
        'Cocokkan merek dan Kode Artikel pada cetakan laser tersebut dengan kode produk yang Anda pesan.',
        'Jika cetakan tidak ada, tidak terbaca, atau kodenya tidak sesuai pesanan, tanyakan langsung ke penjual sebelum melanjutkan pembelian.',
        'Untuk kepastian tambahan, kirim foto kode tersebut ke tim Varindo via WhatsApp agar kami bantu verifikasi.'
      ]
    : [
        "Turn the laminate sheet over and check the backing for a black laser-printed mark.",
        'Match the brand and Article Code on that laser print against the product code you ordered.',
        "If the print is missing, unreadable, or the code doesn't match your order, ask the seller directly before proceeding with the purchase.",
        "For extra assurance, send a photo of the code to the Varindo team via WhatsApp and we'll help verify it."
      ];

  const safeguardSteps = [
    {
      title: t('home', 'safeguard1Title', lang),
      body: lang === 'id'
        ? 'Setiap lembar HPL Lamitak diverifikasi dengan cetakan laser hitam pada bagian belakang sebelum meninggalkan fasilitas produksi. Cetakan ini melekat permanen pada material dan tidak dapat dipalsukan atau ditempel ulang seperti label kertas biasa.'
        : "Every sheet of Lamitak laminate is verified with a black laser print on the backing before it leaves the production facility. The mark is permanently etched into the material — it can't be forged or reapplied the way a paper label can."
    },
    {
      title: t('home', 'safeguard2Title', lang),
      body: lang === 'id'
        ? 'Sebelum didistribusikan, seluruh HPL Lamitak diperiksa oleh tim gudang dan operasional terlatih pada beberapa titik dalam rantai pasok — memastikan setiap lembar yang sampai ke tangan dealer resmi sesuai standar kualitas Lamitak.'
        : "Before distribution, every Lamitak laminate is inspected by trained warehouse and operations staff at multiple points in the supply chain — ensuring every sheet that reaches an authorized dealer meets Lamitak's quality standard."
    },
    {
      title: t('home', 'safeguard3Title', lang),
      body: lang === 'id'
        ? 'Setiap inskripsi laser mencantumkan merek dan Kode Artikel, sehingga Anda dapat mencocokkan kode pada lembar fisik dengan kode yang Anda pesan — memastikan Anda menerima motif dan produk yang sesuai, bukan produk substitusi.'
        : "Each laser inscription includes the brand and Article Code, so you can match the code on the physical sheet against the code you ordered — confirming you received the exact design and product, not a substitute."
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
                ? 'Setiap permukaan Lamitak membawa lebih dari sekadar inspirasi desain — ia membawa janji keaslian. Program Jaminan Pembeli (Buyer Safeguard) adalah sistem verifikasi yang diterapkan Lamitak di sepanjang rantai produksi dan distribusi, agar setiap lembar HPL yang sampai ke proyek Anda benar-benar ciptaan eksklusif Lamitak — bukan produk substitusi atau tiruan yang beredar dengan label serupa.'
                : "Every Lamitak surface carries more than design inspiration — it carries a promise of authenticity. The Buyer Safeguard program is a verification system built into Lamitak's production and distribution chain, so every sheet that reaches your project is a genuine Lamitak creation — not a substitute or imitation sold under a similar label."}
            </p>
          </div>
        </section>

        <section>
          <p className="label mb-4">
            {lang === 'id' ? 'Tiga Lapis Perlindungan' : 'Three Layers of Protection'}
          </p>
          <div className="space-y-4">
            {safeguardSteps.map((step, i) => (
              <div key={step.title} className="rounded-card bg-varindo-canvas p-6 sm:p-8 flex gap-5">
                <span className="display text-[32px] text-varindo-link shrink-0 leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-varindo-ink mb-2">{step.title}</p>
                  <p className="text-[17px] leading-7 text-varindo-mid">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="label mb-4">
            {lang === 'id' ? 'Cara Memeriksa Lembar HPL Anda' : 'How to Check Your Own Sheet'}
          </p>
          <div className="rounded-card bg-varindo-canvas p-6 sm:p-8 space-y-4">
            <p className="text-[17px] leading-8 text-varindo-mid">
              {lang === 'id'
                ? 'Anda dapat memverifikasi keaslian lembar HPL yang Anda terima dengan langkah sederhana berikut:'
                : 'You can verify the authenticity of the sheet you received with the following simple steps:'}
            </p>
            <ol className="space-y-3">
              {checkSteps.map((item, i) => (
                <li key={item} className="flex items-start gap-3 text-[14px] leading-7 text-varindo-mid">
                  <span className="text-[12px] font-semibold text-varindo-link shrink-0 mt-[3px]">{i + 1}.</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section>
          <p className="label mb-4">
            {lang === 'id' ? 'Lebih dari Sekadar Keaslian' : 'Beyond Authenticity'}
          </p>
          <div className="rounded-card bg-varindo-canvas p-6 sm:p-8">
            <p className="text-[17px] leading-8 text-varindo-mid">
              {t('home', 'safeguardBody3', lang)}
            </p>
          </div>
        </section>

        <section>
          <p className="label mb-4">
            {t('home', 'safeguard4Title', lang)}
          </p>
          <div className="rounded-card bg-varindo-canvas p-6 sm:p-8 space-y-4">
            <p className="text-[17px] leading-8 text-varindo-mid">
              {lang === 'id'
                ? 'Cetakan laser dan proses inspeksi hanya bernilai jika Anda membelinya dari sumber yang sah. Produk substitusi yang beredar di pasaran sering kali tidak melalui proses verifikasi ini sama sekali, sehingga keaslian dan kualitasnya tidak dapat dipastikan. Pastikan pembelian dilakukan hanya melalui dealer resmi seperti Varindo untuk menghindari produk substitusi dan memastikan keaslian setiap lembar.'
                : "The laser print and inspection process only hold value if you buy through a legitimate channel. Substitute products circulating in the market often skip this verification entirely, so their authenticity and quality can't be confirmed. Purchase only through authorized dealers like Varindo to avoid inferior substitutions and ensure the authenticity of every sheet."}
            </p>
            <p className="text-[14px] leading-7 text-varindo-mid">
              {lang === 'id' ? 'Baca juga: ' : 'Related reading: '}
              <Link href="/otorisasi" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-link transition-colors">
                {lang === 'id' ? 'Verifikasi Keaslian Produk Lamitak' : 'Verify Lamitak Product Authenticity'}
              </Link>
              {lang === 'id' ? ' dan ' : ' and '}
              <Link href="/apa-itu-laminate" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-link transition-colors">
                {lang === 'id' ? 'Apa Itu HPL?' : 'What Are Laminates?'}
              </Link>
            </p>
          </div>
        </section>

        <section className="rounded-card bg-varindo-canvas px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="display text-[28px] text-varindo-ink mb-2">
              {lang === 'id' ? 'Ingin memastikan keaslian produk Anda?' : 'Want to confirm your product is genuine?'}
            </p>
            <p className="text-[14px] text-varindo-mid max-w-lg">
              {lang === 'id'
                ? 'Kirim foto kode produk Anda ke tim Varindo untuk verifikasi, atau tanyakan produk Lamitak lainnya.'
                : 'Send a photo of your product code to the Varindo team for verification, or ask about other Lamitak products.'}
            </p>
          </div>
          <a href={waUrl} target="_blank" rel="noreferrer" className="btn-ink shrink-0 justify-center">
            {lang === 'id' ? 'Tanya via WhatsApp' : 'Ask via WhatsApp'}
          </a>
        </section>

      </div>
    </div>
  );
}
