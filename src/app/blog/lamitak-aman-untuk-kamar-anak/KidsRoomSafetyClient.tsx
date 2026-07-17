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

export function KidsRoomSafetyClient({ post }: { post: BlogPost }) {
  const { lang } = useLang();
  const waUrl = buildWhatsAppUrl('Halo Admin Varindo, saya ingin bertanya seputar keamanan dan sertifikasi emisi HPL Lamitak untuk kamar anak.');

  const checklist = lang === 'id'
    ? [
        'Minta tim penjual menunjukkan sertifikat GREENGUARD Gold untuk kode produk yang akan Anda pakai, bukan hanya klaim umum "ramah lingkungan".',
        'Cocokkan kode produk pada sertifikat dengan kode yang tertera pada penawaran atau invoice Anda.',
        'Pastikan lembar HPL memiliki inskripsi laser pada bagian belakang sebagai tanda produk asli Lamitak.',
        'Beli hanya melalui dealer resmi seperti Varindo, karena produk substitusi yang beredar di pasaran umumnya tidak melalui pengujian emisi yang sama.'
      ]
    : [
        'Ask the seller to show the GREENGUARD Gold certificate for the specific product code you plan to use, not just a general "eco-friendly" claim.',
        'Match the product code on the certificate against the code on your quotation or invoice.',
        "Check that the sheet carries a laser inscription on the backing as a mark of genuine Lamitak product.",
        'Buy only through an authorized dealer like Varindo — substitute products sold elsewhere are generally not backed by the same emissions testing.'
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
                ? 'Saat memilih material untuk kamar tidur anak, kualitas udara dalam ruangan sama pentingnya dengan tampilan dan daya tahan. Anak-anak bernapas lebih cepat relatif terhadap berat badannya, menghabiskan sebagian besar waktu di dalam rumah, dan tubuhnya masih berkembang — sehingga lebih sensitif terhadap paparan senyawa kimia dalam ruangan dibanding orang dewasa. Artikel ini menjelaskan apa yang sebenarnya perlu Anda ketahui tentang emisi formaldehida pada HPL, dan bagaimana sertifikasi resmi Lamitak menjawab kekhawatiran tersebut.'
                : "When choosing materials for a child's bedroom, indoor air quality matters just as much as looks and durability. Children breathe faster relative to their body weight, spend most of their time indoors, and have bodies that are still developing — making them more sensitive to indoor chemical exposure than adults. This article explains what you actually need to know about formaldehyde emissions in HPL, and how Lamitak's official certifications address that concern."}
            </p>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">
            {lang === 'id' ? 'Formaldehida pada Material Furnitur: Faktanya' : 'Formaldehyde in Furniture Materials: The Facts'}
          </p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8 space-y-4">
            <p className="text-[14px] leading-8 text-varindo-600">
              {lang === 'id'
                ? 'Resin berbasis melamin dan fenol memang lazim digunakan dalam industri HPL untuk merekatkan lapisan kertas kraft, lapisan dekoratif, dan lapisan pelindung menjadi satu material yang kokoh. Ini berlaku di seluruh industri, bukan hanya pada satu merek. Yang membedakan kualitas satu produk dari produk lain bukanlah ada-tidaknya resin tersebut, melainkan seberapa rendah kadar emisi formaldehida dan senyawa organik volatil (VOC) lain yang dilepaskan oleh lembar jadi setelah melalui proses pengepresan bertekanan dan suhu tinggi.'
                : "Melamine- and phenolic-based resins are standard across the HPL industry, used to bond the kraft paper, decorative layer, and protective overlay into one solid material — this is true industry-wide, not specific to any one brand. What separates a well-made product from a poorly made one isn't whether these resins are used, but how low the formaldehyde and other volatile organic compound (VOC) emissions are once the finished sheet has been through high-pressure, high-temperature curing."}
            </p>
            <p className="text-[14px] leading-8 text-varindo-600">
              {lang === 'id'
                ? 'Karena itu, klaim "bebas formaldehida" pada material berbasis resin sulit dipertanggungjawabkan secara ilmiah. Indikator yang lebih dapat diandalkan adalah hasil pengujian emisi independen dari lembaga sertifikasi pihak ketiga — dan inilah yang dimiliki HPL Lamitak.'
                : 'For this reason, blanket "formaldehyde-free" claims on resin-based materials are difficult to substantiate scientifically. A more reliable indicator is independent emissions testing from a recognized third-party certification body — and this is exactly what Lamitak HPL has behind it.'}
            </p>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">
            {lang === 'id' ? 'GREENGUARD Gold: Standar yang Dirancang untuk Ruang Anak' : "GREENGUARD Gold: The Standard Built for Children's Spaces"}
          </p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8 space-y-4">
            <p className="text-[14px] leading-8 text-varindo-600">
              {lang === 'id'
                ? 'GREENGUARD Gold pada mulanya dikembangkan sebagai program sertifikasi khusus untuk sekolah dan fasilitas anak, sebelum diperluas menjadi standar untuk produk konsumen secara umum. Sertifikasi ini menguji lebih dari 360 senyawa organik volatil, dengan batas emisi formaldehida sebesar 7,3 ppb (part per billion) — jauh lebih ketat dibanding batas 50 ppb pada sertifikasi GREENGUARD standar. Batas ini secara khusus dikalibrasi untuk ruang di mana anak-anak dan populasi sensitif lain menghabiskan banyak waktu.'
                : "GREENGUARD Gold began as a certification program specifically for schools and children's facilities, before being expanded into a broader consumer-product standard. It screens for more than 360 volatile organic compounds, with a formaldehyde emission limit of 7.3 ppb (parts per billion) — far stricter than the 50 ppb limit under standard GREENGUARD certification. That limit is specifically calibrated for spaces where children and other sensitive groups spend extended time."}
            </p>
            <p className="text-[14px] leading-8 text-varindo-600">
              {lang === 'id'
                ? 'HPL Lamitak, edging Newedge, dan HPL Artak telah meraih sertifikasi GREENGUARD Gold untuk kualitas udara dalam ruangan. Anda dapat memeriksa sendiri sertifikat resminya:'
                : 'Lamitak HPL, Newedge edging, and Artak laminates have all achieved GREENGUARD Gold certification for indoor air quality. You can check the official certificates yourself:'}
            </p>
            <ul className="space-y-1.5">
              <li>
                <a href="https://cdn.shopify.com/s/files/1/0870/9242/9076/files/Lamitak_Greenguard_Gold_130338-420_valid_till_16_Dec_2026.pdf?v=1765428238"
                  target="_blank" rel="noreferrer"
                  className="text-[12px] text-varindo-ink underline underline-offset-2 hover:text-varindo-gold transition-colors">
                  GREENGUARD Gold Certification for Lamitak Laminates (PDF) ↗
                </a>
              </li>
            </ul>
            <p className="text-[13px] leading-7 text-varindo-500">
              {lang === 'id' ? 'Lihat seluruh sertifikat GREENGUARD, termasuk untuk Newedge dan Artak, di halaman ' : 'See every GREENGUARD certificate, including Newedge and Artak, on our '}
              <Link href="/apa-itu-laminate" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-gold transition-colors">
                {lang === 'id' ? 'Apa Itu HPL?' : 'What Are Laminates?'}
              </Link>
              {lang === 'id' ? ' pada bagian Sertifikasi & Standar.' : ' page, under Certifications & Standards.'}
            </p>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">
            {lang === 'id' ? 'Green Label Singapore: Lapisan Jaminan Tambahan' : 'Green Label Singapore: An Additional Layer of Assurance'}
          </p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8">
            <p className="text-[14px] leading-8 text-varindo-600">
              {lang === 'id'
                ? 'Selain GREENGUARD Gold, HPL Lamitak juga memegang sertifikasi Green Label Singapore, yang secara khusus menilai tingkat emisi dan toksisitas rendah pada material permukaan. Kombinasi kedua sertifikasi ini — satu dari Amerika Serikat (UL Solutions) dan satu dari Singapura — memberikan verifikasi independen yang saling melengkapi terhadap keamanan emisi produk.'
                : "Alongside GREENGUARD Gold, Lamitak HPL also holds Green Label Singapore certification, which specifically evaluates low emissions and low toxicity in surface materials. Having both certifications — one from the United States (UL Solutions) and one from Singapore — provides independent, complementary verification of the product's emission safety."}
            </p>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">
            {lang === 'id' ? 'Lebih dari Kualitas Udara: Higienitas & Sumber Material' : 'Beyond Air Quality: Hygiene & Sourcing'}
          </p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8 space-y-4">
            <p className="text-[14px] leading-8 text-varindo-600">
              {lang === 'id'
                ? 'Kamar anak adalah ruang dengan intensitas sentuhan tangan yang tinggi — dari permukaan lemari, meja belajar, hingga dinding panel. HPL dan edging Lamitak dilengkapi fitur anti-mikroba yang menghambat pertumbuhan mikroorganisme pada permukaannya, memberikan perlindungan tambahan untuk ruang yang sering disentuh anak.'
                : "A child's room sees heavy hand contact — wardrobe surfaces, study desks, wall panels. Lamitak's laminates and edging come with anti-microbial features that inhibit the growth of microorganisms on the surface, adding a layer of protection for spaces children touch constantly."}
            </p>
            <p className="text-[14px] leading-8 text-varindo-600">
              {lang === 'id'
                ? 'Bagi orang tua yang juga mempertimbangkan aspek keberlanjutan, produk pilihan Lamitak tersedia dengan sertifikasi FSC® Chain of Custody, yang menjamin material bersumber dari pengelolaan hutan yang bertanggung jawab.'
                : "For parents also weighing sustainability, selected Lamitak products carry FSC® Chain of Custody certification, verifying that the material is sourced from responsibly managed forests."}
            </p>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">
            {lang === 'id' ? 'Cara Memilih dengan Aman' : 'How to Choose Safely'}
          </p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8 space-y-4">
            <p className="text-[14px] leading-8 text-varindo-600">
              {lang === 'id'
                ? 'Sertifikasi hanya bernilai jika produk yang sampai ke rumah Anda benar-benar produk yang sama dengan yang diuji dan disertifikasi. Berikut langkah praktis sebelum Anda memutuskan:'
                : "A certification only means something if the product that reaches your home is genuinely the same product that was tested and certified. Here are practical steps before you decide:"}
            </p>
            <ul className="space-y-3">
              {checklist.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[13px] leading-7 text-varindo-600">
                  <div className="w-4 h-[1.5px] bg-varindo-gold shrink-0 mt-3" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[13px] leading-7 text-varindo-500">
              {lang === 'id' ? 'Baca juga: ' : 'Related reading: '}
              <Link href="/blog/buyer-safeguard" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-gold transition-colors">
                {lang === 'id' ? 'Jaminan Pembeli Lamitak' : 'Lamitak Buyer Safeguard'}
              </Link>
              {lang === 'id' ? ' dan ' : ' and '}
              <Link href="/otorisasi" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-gold transition-colors">
                {lang === 'id' ? 'Verifikasi Keaslian Produk Lamitak' : 'Verify Lamitak Product Authenticity'}
              </Link>
            </p>
          </div>
        </section>

        <section className="border border-varindo-line bg-varindo-50 px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display text-2xl font-light text-varindo-ink mb-2">
              {lang === 'id' ? 'Sedang merancang kamar anak?' : "Designing a child's room?"}
            </p>
            <p className="text-[13px] text-varindo-600 max-w-lg">
              {lang === 'id'
                ? 'Minta sampel fisik atau tanyakan kode produk dengan sertifikasi GREENGUARD Gold kepada tim Varindo.'
                : 'Request a physical sample or ask the Varindo team for product codes backed by GREENGUARD Gold certification.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/request-sample" className="btn-ink justify-center">
              {t('footer', 'sampleLink', lang)}
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
