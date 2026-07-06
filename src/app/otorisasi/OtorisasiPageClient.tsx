'use client';

import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export function OtorisasiPageClient() {
  const { lang } = useLang();
  const waUrl = buildWhatsAppUrl('Halo Admin Varindo, saya ingin memverifikasi apakah produk Lamitak yang saya lihat adalah produk resmi.');

  const verifyItems = lang === 'id'
    ? [
        'Cocokkan kode produk dan nama desain yang Anda lihat dengan katalog resmi di situs ini (varindo.co.id).',
        'Pastikan penjual dapat menunjukkan asal produk dan menyebutkan bahwa produk berasal dari jalur distribusi resmi Lamitak.',
        'Hubungi tim Varindo langsung via WhatsApp untuk menanyakan ketersediaan kode produk tertentu sebelum membeli dari pihak lain.',
        'Jika ragu, Anda juga dapat menghubungi PT. TAK Products and Services secara langsung untuk konfirmasi status distributor resmi di wilayah Anda.'
      ]
    : [
        'Match the product code and design name you see against the official catalogue on this site (varindo.co.id).',
        "Make sure the seller can show the product's origin and confirm it comes from Lamitak's official distribution channel.",
        'Contact the Varindo team directly via WhatsApp to check the availability of a specific product code before buying elsewhere.',
        'If in doubt, you may also contact PT. TAK Products and Services directly to confirm official distributor status in your area.'
      ];

  const riskItems = lang === 'id'
    ? [
        'Ketidakpastian keaslian material — material yang dijual mungkin bukan produk Lamitak asli meskipun diberi label serupa.',
        'Tidak ada jaminan konsistensi warna dan kualitas antar lembar, karena sumber dan riwayat penyimpanan produk tidak dapat dipastikan.',
        'Tidak ada dukungan purna jual maupun kejelasan jika terjadi kendala pada produk yang diterima.',
        'Harga yang tidak transparan, tanpa kejelasan apakah sudah termasuk PPN atau sesuai harga resmi dealer.'
      ]
    : [
        'Uncertain material authenticity — the material sold may not be genuine Lamitak despite a similar label.',
        "No guarantee of consistent colour and quality between sheets, since the product's source and storage history can't be confirmed.",
        'No after-sales support or clarity if an issue arises with the product received.',
        'Non-transparent pricing, with no clarity on whether PPN is included or whether it matches the official dealer price.'
      ];

  return (
    <div>
      <div className="bg-varindo-ink text-white border-b border-varindo-800">
        <div className="shell py-14 sm:py-20">
          <p className="label text-varindo-400 mb-4">
            {lang === 'id' ? 'Dealer Resmi' : 'Authorized Dealer'}
          </p>
          <h1 className="display text-white text-4xl sm:text-5xl lg:text-6xl mb-5">
            {lang === 'id' ? 'Verifikasi Keaslian Produk Lamitak' : 'Verify Lamitak Product Authenticity'}
          </h1>
          <p className="text-[14px] leading-7 text-varindo-400 max-w-2xl">
            {lang === 'id'
              ? 'Halaman ini menjelaskan status resmi Varindo sebagai dealer HPL Lamitak di Indonesia, serta cara memastikan produk yang Anda beli adalah produk asli dari sumber resmi.'
              : "This page explains Varindo's official status as an HPL Lamitak dealer in Indonesia, and how to make sure the product you're buying is genuine and from an official source."}
          </p>
        </div>
      </div>

      <div className="shell py-12 sm:py-16 max-w-3xl space-y-12">

        <section>
          <p className="label text-varindo-gold mb-4">
            {lang === 'id' ? 'Status Resmi' : 'Official Status'}
          </p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8">
            <p className="text-[14px] leading-8 text-varindo-600">
              {lang === 'id'
                ? <>CV. Varindo Forma Hutama adalah Authorized Dealer HPL Lamitak, produk dari PT. TAK Products and Services, yang beroperasi dan melayani kebutuhan HPL Lamitak di berbagai wilayah Indonesia. Status ini berarti seluruh produk yang tercantum di katalog online kami bersumber langsung dari jalur distribusi resmi Lamitak, dengan harga dan ketersediaan yang transparan.</>
                : <>CV. Varindo Forma Hutama is an Authorized Dealer of HPL Lamitak, a product of PT. TAK Products and Services, operating and serving HPL Lamitak needs across various regions of Indonesia. This status means every product listed in our online catalogue is sourced directly through Lamitak&apos;s official distribution channel, with transparent pricing and availability.</>}
            </p>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">
            {lang === 'id' ? 'Alamat & Kontak Resmi' : 'Official Address & Contact'}
          </p>
          <div className="border border-varindo-line grid sm:grid-cols-2 gap-px bg-varindo-line">
            <address className="not-italic text-[14px] leading-8 text-varindo-600 bg-white p-6 sm:p-8">
              <span className="font-semibold text-varindo-ink block mb-1">
                CV. Varindo Forma Hutama — {t('contact', 'headOffice', lang)}
              </span>
              Branz BSD Tower A Unit 3310<br />
              Jl. BSD Boulevard Parcel 55-F<br />
              Tangerang 15339, Banten, Indonesia<br />
              <span className="block mt-3">
                {lang === 'id' ? 'Telepon / WhatsApp' : 'Phone / WhatsApp'}: <a href="tel:+6281288885224" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-gold transition-colors">0812 8888 5224</a><br />
                Email: <a href="mailto:contact@varindo.co.id" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-gold transition-colors">contact@varindo.co.id</a>
              </span>
            </address>
            <address className="not-italic text-[14px] leading-8 text-varindo-600 bg-white p-6 sm:p-8">
              <span className="font-semibold text-varindo-ink block mb-1">
                CV. Varindo Forma Hutama — {t('contact', 'regOffice', lang)}
              </span>
              Ruko Pasar Modern Batununggal<br />
              Blok RA/06, Kel. Mengger<br />
              Kec. Bandung Kidul, Bandung 40267, Jawa Barat, Indonesia<br />
              <span className="block mt-3">
                {lang === 'id' ? 'Telepon / WhatsApp' : 'Phone / WhatsApp'}: <a href="tel:+6281210015224" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-gold transition-colors">0812 1001 5224</a>
              </span>
            </address>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">
            {lang === 'id' ? 'Cara Memverifikasi Keaslian Produk' : 'How to Verify Product Authenticity'}
          </p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8 space-y-4">
            <p className="text-[14px] leading-8 text-varindo-600">
              {lang === 'id'
                ? 'Sebelum melakukan pembelian, Anda dapat memverifikasi keaslian produk Lamitak dengan beberapa cara berikut:'
                : 'Before making a purchase, you can verify the authenticity of a Lamitak product in the following ways:'}
            </p>
            <ul className="space-y-3">
              {verifyItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[13px] leading-7 text-varindo-600">
                  <div className="w-4 h-[1.5px] bg-varindo-gold shrink-0 mt-3" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">
            {lang === 'id' ? 'Risiko Membeli dari Penjual Tidak Resmi' : 'Risks of Buying from Unofficial Sellers'}
          </p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8 space-y-4">
            <p className="text-[14px] leading-8 text-varindo-600">
              {lang === 'id'
                ? 'Membeli HPL dari penjual yang tidak memiliki hubungan resmi dengan jalur distribusi Lamitak dapat menimbulkan beberapa risiko, di antaranya:'
                : "Buying HPL from a seller with no official relationship to Lamitak's distribution channel can carry several risks, including:"}
            </p>
            <ul className="space-y-3">
              {riskItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[13px] leading-7 text-varindo-600">
                  <div className="w-4 h-[1.5px] bg-varindo-gold shrink-0 mt-3" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[13px] leading-7 text-varindo-500">
              {lang === 'id'
                ? 'Untuk menghindari risiko tersebut, kami menyarankan Anda selalu memastikan pembelian HPL Lamitak melalui dealer resmi seperti Varindo, atau memverifikasi langsung ke PT. TAK Products and Services.'
                : 'To avoid these risks, we recommend always purchasing HPL Lamitak through an official dealer like Varindo, or verifying directly with PT. TAK Products and Services.'}
            </p>
          </div>
        </section>

        <section className="border border-varindo-line bg-varindo-50 px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display text-2xl font-light text-varindo-ink mb-2">
              {lang === 'id' ? 'Ingin memastikan keaslian produk?' : 'Want to confirm product authenticity?'}
            </p>
            <p className="text-[13px] text-varindo-600 max-w-lg">
              {lang === 'id'
                ? 'Hubungi tim Varindo untuk verifikasi kode produk atau pertanyaan lain seputar keaslian HPL Lamitak.'
                : 'Contact the Varindo team to verify a product code or ask other questions about HPL Lamitak authenticity.'}
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
