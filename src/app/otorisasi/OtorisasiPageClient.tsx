'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export function OtorisasiPageClient() {
  const { lang } = useLang();
  const waUrl = buildWhatsAppUrl('Halo Admin Varindo, saya ingin memverifikasi apakah produk Lamitak yang saya lihat adalah produk resmi.');

  const buyerSafeguardItems = [
    { title: t('home', 'safeguard1Title', lang), body: t('home', 'safeguard1Body', lang) },
    { title: t('home', 'safeguard2Title', lang), body: t('home', 'safeguard2Body', lang) },
    { title: t('home', 'safeguard3Title', lang), body: t('home', 'safeguard3Body', lang) },
    { title: t('home', 'safeguard4Title', lang), body: t('home', 'safeguard4Body', lang) },
  ];

  const verifyItems = lang === 'id'
    ? [
        'Cocokkan kode produk dan nama desain yang Anda lihat dengan katalog resmi di situs ini (varindo.co.id).',
        'Pastikan penjual dapat menunjukkan asal produk dan menyebutkan bahwa produk berasal dari jalur distribusi resmi Lamitak.',
        'Hubungi tim Varindo langsung via WhatsApp untuk menanyakan ketersediaan kode produk tertentu sebelum membeli dari pihak lain.',
        'Jika ragu, Anda juga dapat menghubungi PT. TAK Products and Services secara langsung untuk konfirmasi status dealer kami.'
      ]
    : [
        'Match the product code and design name you see against the official catalogue on this site (varindo.co.id).',
        "Make sure the seller can show the product's origin and confirm it comes from Lamitak's official distribution channel.",
        'Contact the Varindo team directly via WhatsApp to check the availability of a specific product code before buying elsewhere.',
        'If in doubt, you may also contact PT. TAK Products and Services directly to confirm our dealer status.'
      ];

  const safeguardItems = lang === 'id'
    ? [
        { title: 'Inskripsi Laser', desc: 'Setiap lembar HPL Lamitak diverifikasi dengan cetakan laser hitam pada bagian belakang.' },
        { title: 'Inspeksi Multi-titik', desc: 'Seluruh HPL Lamitak diperiksa oleh tim Warehouse dan Operations Lamitak yang terlatih.' },
        { title: 'Verifikasi', desc: 'Setiap inskripsi laser mencantumkan merek dan Kode Artikel untuk memastikan Anda menerima produk yang sesuai pesanan.' },
        { title: 'Jaminan Keaslian', desc: 'Waspadai produk substitusi berkualitas rendah dan harga yang tidak masuk akal.' },
      ]
    : [
        { title: 'Laser Inscription', desc: 'Each Lamitak laminate is verified with a black laser print on the backing.' },
        { title: 'Multi-point Inspection', desc: "All Lamitak laminates are inspected by Lamitak's trained Warehouse and Operations staff." },
        { title: 'Verification', desc: "Each laser inscription includes the brand and Article Code to ensure you'll get exactly what you ordered." },
        { title: 'Authenticity Guaranteed', desc: 'Look out for inferior substitutions and laminates sold at unbelievably low prices.' },
      ];

  const certifications = [
    {
      key: 'greenguard',
      logo: '/certifications/cert-ul-greenguard-gold.png',
      name: 'UL GREENGUARD & GREENGUARD Gold',
      attribute: lang === 'id' ? 'Kualitas Udara Dalam Ruangan (VOC Rendah)' : 'Indoor Air Quality (Low VOCs)',
      benefit: lang === 'id'
        ? 'Udara yang lebih sehat untuk dihirup: Produk diuji terhadap lebih dari 10.000 bahan kimia dan disertifikasi memiliki emisi VOC (Volatile Organic Compounds) yang rendah — udara lebih bersih dan aman di rumah atau kantor Anda, terutama penting bagi anak-anak, lansia, atau mereka yang sensitif terhadap alergi.'
        : 'Healthier air to breathe: the product is tested for over 10,000 chemicals and certified to emit low levels of Volatile Organic Compounds (VOCs) — cleaner, safer air in your home or office, especially important for children, the elderly, or those with allergies/sensitivities.',
    },
    {
      key: 'green-label',
      logo: '/certifications/cert-green-label-singapore.png',
      name: 'Singapore Green Label',
      attribute: lang === 'id' ? 'Keberlanjutan Lingkungan dan Kesehatan' : 'Environmental and Health Sustainability',
      benefit: lang === 'id'
        ? 'Pilihan yang bertanggung jawab dan bebas racun: Diverifikasi pihak ketiga independen sebagai produk yang diproduksi dengan pendekatan komprehensif untuk mengurangi dampak lingkungan sepanjang siklus hidupnya, serta bebas dari logam berat dan bahan kimia berbahaya. Produk bersertifikat Green Label turut berkontribusi pada poin BCA Green Mark.'
        : 'A responsible, non-toxic choice: independently verified to be manufactured with a comprehensive approach to reducing environmental impact across its lifecycle, and free from harmful heavy metals and chemicals. Green Label certified products contribute to BCA Green Mark credits.',
    },
    {
      key: 'sgbp',
      logo: '/certifications/cert-sgbp-leader.png',
      name: 'Singapore Green Building Product (SGBP) — Leader Rating (4 Ticks)',
      attribute: lang === 'id' ? 'Kinerja Lingkungan Superior' : 'Superior Environmental Performance',
      benefit: lang === 'id'
        ? 'Ruang berkualitas tinggi yang berfokus pada kesehatan: sebagai peringkat tertinggi, produk ini terbukti rendah kandungan racun dan emisi VOC — penting bagi kesehatan penghuni, terutama keluarga dengan anak kecil.'
        : "A high-quality, health-focused space: as the highest-tier rating, the product is certified to be low in toxic content and VOC emissions — crucial for the health of end users, especially families with young children.",
    },
    {
      key: 'fire-rating',
      logo: null,
      name: 'TUV SUD PSB Fire Rating: Class 0',
      attribute: lang === 'id' ? 'Keamanan Kebakaran' : 'Fire Safety',
      benefit: lang === 'id'
        ? 'Keamanan dan ketenangan pikiran yang lebih baik: produk memiliki laju rambat api permukaan yang sangat rendah dan tidak mudah terbakar, membantu menahan dan memperlambat penyebaran api serta menjaga struktur bangunan — memberi lebih banyak waktu evakuasi dan melindungi jiwa serta harta benda.'
        : 'Enhanced safety and peace of mind: the product has a very low surface spread of flame and is non-combustible, helping to contain and slow the spread of fire and maintain structural integrity — giving more time to evacuate and protecting life and property.',
    },
    {
      key: 'antimicrobial',
      logo: null,
      name: 'TUV SUD PSB Antimicrobial Activity',
      attribute: lang === 'id' ? 'Higienitas Permukaan' : 'Surface Hygiene',
      benefit: lang === 'id'
        ? 'Lingkungan yang lebih higienis: permukaan terbukti secara aktif mencegah pertumbuhan bakteri, dengan tingkat antibakteri tinggi (≥99,9%) terhadap strain umum seperti E. coli — menjadikan permukaan lebih aman dan sehat, terutama di area rawan kuman seperti dapur dan fasilitas kesehatan.'
        : 'A more hygienic environment: the surface is proven to actively prevent bacterial growth, with a high antibacterial rate (≥99.9%) against common strains like E. coli — safer, healthier surfaces, especially in germ-prone areas like kitchens and healthcare spaces.',
    },
  ];

  const lamitakBenefits = lang === 'id'
    ? [
        { title: 'Akurasi Desain', desc: 'Warna, motif, dan finishing yang Anda pilih, terkirim sesuai harapan.' },
        { title: 'Performa yang Dapat Diandalkan', desc: 'Dibuat untuk fabrikasi berkualitas dan pemakaian jangka panjang.' },
        { title: 'Jaminan Garansi 3 Tahun', desc: 'Permukaan Lamitak asli didukung oleh cakupan garansi resmi.' },
        { title: 'Perlindungan Antibakteri', desc: 'Kepercayaan diri tambahan pada permukaan yang Anda sentuh setiap hari.' },
        { title: 'Ketenangan Pikiran', desc: 'Keyakinan bahwa apa yang dispesifikasikan adalah apa yang dipasang.' },
      ]
    : [
        { title: 'Design Accuracy', desc: 'The colour, pattern, and finish you selected, delivered as intended.' },
        { title: 'Reliable Performance', desc: 'Made for quality fabrication and long-term use.' },
        { title: '3-Year Warranty Assurance', desc: 'Original Lamitak surfaces are supported by warranty coverage.' },
        { title: 'Anti-bacterial Protection', desc: 'Added confidence in the surfaces you touch every day.' },
        { title: 'Peace of Mind', desc: 'Confidence that what was specified is what was installed.' },
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
      <div className="bg-varindo-paper">
        <div className="shell py-14 sm:py-20">
          <p className="label mb-4">
            {lang === 'id' ? 'Dealer Resmi' : 'Authorized Dealer'}
          </p>
          <h1 className="display text-varindo-ink text-[36px] sm:text-[48px] lg:text-[56px] mb-5">
            {lang === 'id' ? 'Verifikasi Keaslian Produk Lamitak' : 'Verify Lamitak Product Authenticity'}
          </h1>
          <p className="text-[16px] leading-7 text-varindo-mid max-w-2xl">
            {lang === 'id'
              ? 'Halaman ini menjelaskan status resmi Varindo sebagai dealer HPL Lamitak di Indonesia, serta cara memastikan produk yang Anda beli adalah produk asli dari sumber resmi.'
              : "This page explains Varindo's official status as an HPL Lamitak dealer in Indonesia, and how to make sure the product you're buying is genuine and from an official source."}
          </p>
        </div>
      </div>

      <div className="shell py-12 sm:py-16 max-w-3xl space-y-16">

        {/* Group: Varindo as Authorized Dealer */}
        <div className="space-y-12">
          <div>
            <h2 className="display text-[28px] sm:text-[32px] font-semibold text-varindo-ink mb-2">
              {lang === 'id' ? 'Varindo sebagai Dealer Resmi' : 'Varindo as Authorized Dealer'}
            </h2>
            <p className="text-[14px] leading-7 text-varindo-mid max-w-xl">
              {lang === 'id'
                ? 'Informasi mengenai status resmi Varindo, cara memverifikasi pembelian Anda, dan risiko membeli dari penjual tidak resmi.'
                : "Information about Varindo's official status, how to verify your purchase, and the risks of buying from unofficial sellers."}
            </p>
          </div>

          <section>
            <p className="label mb-4">
              {lang === 'id' ? 'Status Resmi' : 'Official Status'}
            </p>
            <div className="rounded-card bg-varindo-canvas p-6 sm:p-8">
              <p className="text-[16px] leading-8 text-varindo-mid">
                {lang === 'id'
                  ? <>CV. Varindo Forma Hutama adalah Authorized Dealer HPL Lamitak, produk dari PT. TAK Products and Services, yang beroperasi dan melayani kebutuhan HPL Lamitak di berbagai wilayah Indonesia. Status ini berarti seluruh produk yang tercantum di katalog online kami bersumber langsung dari jalur distribusi resmi Lamitak, dengan harga dan ketersediaan yang transparan.</>
                  : <>CV. Varindo Forma Hutama is an Authorized Dealer of HPL Lamitak, a product of PT. TAK Products and Services, operating and serving HPL Lamitak needs across various regions of Indonesia. This status means every product listed in our online catalogue is sourced directly through Lamitak&apos;s official distribution channel, with transparent pricing and availability.</>}
              </p>
            </div>
          </section>

          <section>
            <p className="label mb-4">
              {lang === 'id' ? 'Alamat & Kontak Resmi' : 'Official Address & Contact'}
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <address className="not-italic text-[16px] leading-8 text-varindo-mid rounded-card bg-varindo-canvas p-6 sm:p-8">
                <span className="font-semibold text-varindo-ink block mb-1">
                  CV. Varindo Forma Hutama — {t('contact', 'headOffice', lang)}
                </span>
                Branz BSD Tower A Unit 3310<br />
                Jl. BSD Boulevard Parcel 55-F<br />
                Tangerang 15339, Banten, Indonesia<br />
                <span className="block mt-3">
                  {lang === 'id' ? 'Telepon' : 'Phone'}: <a href="tel:+6281288885224" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-link transition-colors">0812 8888 5224</a><br />
                  Email: <a href="mailto:contact@varindo.co.id" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-link transition-colors">contact@varindo.co.id</a>
                </span>
              </address>
              <address className="not-italic text-[16px] leading-8 text-varindo-mid rounded-card bg-varindo-canvas p-6 sm:p-8">
                <span className="font-semibold text-varindo-ink block mb-1">
                  CV. Varindo Forma Hutama — {t('contact', 'regOffice', lang)}
                </span>
                Ruko Pasar Modern Batununggal<br />
                Blok RA/06, Kel. Mengger<br />
                Kec. Bandung Kidul, Bandung 40267, Jawa Barat, Indonesia<br />
                <span className="block mt-3">
                  {lang === 'id' ? 'Telepon / WhatsApp' : 'Phone / WhatsApp'}: <a href="tel:+6281210015224" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-link transition-colors">0812 1001 5224</a>
                </span>
              </address>
            </div>
          </section>

          <section>
            <p className="label mb-4">
              {lang === 'id' ? 'Cara Memverifikasi Keaslian Produk' : 'How to Verify Product Authenticity'}
            </p>
            <div className="rounded-card bg-varindo-canvas p-6 sm:p-8 space-y-4">
              <p className="text-[16px] leading-8 text-varindo-mid">
                {lang === 'id'
                  ? 'Sebelum melakukan pembelian, Anda dapat memverifikasi keaslian produk Lamitak dengan beberapa cara berikut:'
                  : 'Before making a purchase, you can verify the authenticity of a Lamitak product in the following ways:'}
              </p>
              <ul className="space-y-3">
                {verifyItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[14px] leading-7 text-varindo-mid">
                    <div className="w-4 h-[1.5px] bg-varindo-link shrink-0 mt-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <p className="label mb-4">
              {lang === 'id' ? 'Risiko Membeli dari Penjual Tidak Resmi' : 'Risks of Buying from Unofficial Sellers'}
            </p>
            <div className="rounded-card bg-varindo-canvas p-6 sm:p-8 space-y-4">
              <p className="text-[16px] leading-8 text-varindo-mid">
                {lang === 'id'
                  ? 'Membeli HPL dari penjual yang tidak memiliki hubungan resmi dengan jalur distribusi Lamitak dapat menimbulkan beberapa risiko, di antaranya:'
                  : "Buying HPL from a seller with no official relationship to Lamitak's distribution channel can carry several risks, including:"}
              </p>
              <ul className="space-y-3">
                {riskItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[14px] leading-7 text-varindo-mid">
                    <div className="w-4 h-[1.5px] bg-varindo-link shrink-0 mt-3" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[14px] leading-7 text-varindo-mid">
                {lang === 'id'
                  ? 'Untuk menghindari risiko tersebut, kami menyarankan Anda selalu memastikan pembelian HPL Lamitak melalui dealer resmi seperti Varindo, atau memverifikasi langsung ke PT. TAK Products and Services.'
                  : 'To avoid these risks, we recommend always purchasing HPL Lamitak through an official dealer like Varindo, or verifying directly with PT. TAK Products and Services.'}
              </p>
            </div>
          </section>
        </div>

        <div className="border-t border-varindo-line/50" />

        {/* Group: About Lamitak */}
        <div className="space-y-12">
          <div>
            <h2 className="display text-[28px] sm:text-[32px] font-semibold text-varindo-ink mb-2">
              {lang === 'id' ? 'Tentang Lamitak' : 'About Lamitak'}
            </h2>
            <p className="text-[14px] leading-7 text-varindo-mid max-w-xl">
              {lang === 'id'
                ? 'Informasi mengenai keaslian, sertifikasi, dan keunggulan produk HPL Lamitak itu sendiri.'
                : 'Information about the authenticity, certifications, and benefits of the HPL Lamitak product itself.'}
            </p>
          </div>

          <section>
            <p className="label mb-4">
              {t('home', 'safeguardTitle', lang)}
            </p>
            <div className="rounded-card bg-varindo-canvas p-6 sm:p-8">
              <div className="grid sm:grid-cols-2 gap-8 items-center">
                <div
                  role="img"
                  aria-label={t('home', 'safeguardImageAlt', lang)}
                  className="aspect-[4/5] w-full rounded-card bg-varindo-canvas bg-cover bg-center"
                  style={{ backgroundImage: "url('/lamitak-buyer-safeguard.jpg')" }}
                />
                <div>
                  <div className="space-y-4 mb-6">
                    <p className="text-[16px] leading-7 text-varindo-mid">{t('home', 'safeguardBody1', lang)}</p>
                    <p className="text-[16px] leading-7 text-varindo-mid">{t('home', 'safeguardBody2', lang)}</p>
                    <p className="text-[16px] leading-7 text-varindo-mid">{t('home', 'safeguardBody3', lang)}</p>
                  </div>
                  <ul className="space-y-4">
                    {buyerSafeguardItems.map((item) => (
                      <li key={item.title} className="flex gap-3">
                        <span className="w-4 h-[1.5px] bg-varindo-link shrink-0 mt-3" />
                        <div>
                          <p className="text-[14px] font-semibold text-varindo-ink mb-1">{item.title}</p>
                          <p className="text-[14px] leading-7 text-varindo-mid">{item.body}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Link href="/blog/buyer-safeguard" className="inline-block mt-6 text-[21px] font-semibold tracking-[-0.01em] text-varindo-ink hover:text-varindo-link transition-colors">
                    {t('blog', 'readMore', lang)}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section>
            <p className="label mb-4">
              {lang === 'id' ? 'Pastikan Keaslian' : 'Insist on Original'}
            </p>
            <div className="rounded-card bg-varindo-canvas p-6 sm:p-10">
              <p className="display text-[28px] sm:text-[32px] font-semibold text-varindo-ink mb-1">
                Insist on the Original Lamitak
              </p>
              <p className="text-[14px] text-varindo-link mb-5">
                {lang === 'id' ? 'Karena setiap detail penting.' : 'Because every detail matters.'}
              </p>
              <p className="text-[16px] leading-8 text-varindo-mid max-w-xl mb-8">
                {lang === 'id'
                  ? 'Setiap laminate Lamitak dilengkapi Mark of Authenticity, yang membantu Anda memverifikasi keaslian permukaan yang Anda pilih — dengan akurasi desain, kualitas, dan jaminan yang Anda harapkan.'
                  : 'Every Lamitak laminate carries a Mark of Authenticity, helping you verify the original surface you selected — with the design accuracy, quality, and assurance you expect.'}
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {safeguardItems.map((item) => (
                  <div key={item.title}>
                    <p className="text-[14px] font-semibold text-varindo-ink mb-1.5">
                      {item.title}
                    </p>
                    <p className="text-[14px] leading-7 text-varindo-mid">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-[14px] leading-7 text-varindo-mid mt-8 pt-6 border-t border-white/10">
                {lang === 'id'
                  ? 'Belilah HPL Lamitak melalui mitra resmi seperti Varindo untuk memastikan keaslian 100% dan cakupan garansi.'
                  : 'Purchase from an official partner like Varindo, or direct from Lamitak, to ensure 100% authenticity and warranty coverage.'}
              </p>
            </div>
          </section>

          <section>
            <p className="label mb-4">
              {lang === 'id' ? 'Sertifikasi Lamitak' : 'Lamitak Certifications'}
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              {certifications.map((cert, idx) => (
                <div
                  key={cert.key}
                  className={`rounded-card bg-varindo-canvas p-6 sm:p-8 flex flex-col ${
                    idx === certifications.length - 1 && certifications.length % 2 === 1 ? 'sm:col-span-2' : ''
                  }`}
                >
                  <div className="h-14 mb-4 flex items-center">
                    {cert.logo ? (
                      <Image src={cert.logo} alt={cert.name} width={180} height={56} className="h-full w-auto object-contain" />
                    ) : (
                      <p className="text-[12px] text-varindo-mid italic">
                        {lang === 'id' ? 'Logo sertifikasi menyusul' : 'Certification logo pending'}
                      </p>
                    )}
                  </div>
                  <p className="text-[14px] font-semibold text-varindo-ink mb-1">{cert.name}</p>
                  <p className="text-[12px] text-varindo-link mb-3">{cert.attribute}</p>
                  <p className="text-[14px] leading-7 text-varindo-mid">{cert.benefit}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="label mb-4">
              {lang === 'id' ? 'Keunggulan Memilih Lamitak' : 'Benefits of Choosing Lamitak'}
            </p>
            <div className="rounded-card bg-varindo-canvas p-6 sm:p-8">
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                {lamitakBenefits.map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <div className="w-4 h-[1.5px] bg-varindo-link shrink-0 mt-3" />
                    <div>
                      <p className="text-[14px] font-semibold text-varindo-ink mb-0.5">{item.title}</p>
                      <p className="text-[14px] leading-7 text-varindo-mid">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <section className="rounded-card bg-varindo-canvas px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="display text-[28px] text-varindo-ink mb-2">
              {lang === 'id' ? 'Ingin memastikan keaslian produk?' : 'Want to confirm product authenticity?'}
            </p>
            <p className="text-[14px] text-varindo-mid max-w-lg">
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
