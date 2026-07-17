'use client';

import Link from 'next/link';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export function ApaItuLaminateClient() {
  const { lang } = useLang();
  const waUrl = buildWhatsAppUrl('Halo Admin Varindo, saya ingin bertanya seputar spesifikasi produk HPL Lamitak.');

  const careDonts = lang === 'id'
    ? [
        'Jangan memotong, mengiris, atau memukul langsung permukaan laminate.',
        'Jangan gunakan benda tajam seperti pisau atau cutter pada permukaan laminate.',
        'Jangan meletakkan panci atau alat masak panas langsung di atas permukaan laminate.',
        'Jangan biarkan laminate terpapar suhu di atas 60°C dalam waktu lama, karena dapat menyebabkan laminate terlepas dari substrat.',
        'Jangan membiarkan air menggenang atau merembes pada sambungan, karena dapat menyebabkan substrat mengembang.'
      ]
    : [
        'Do not chop, slice, or hammer directly on the laminate surface.',
        'Do not use sharp objects such as knives or box-cutters on the laminate surface.',
        'Do not place hot cookware directly on the laminate surface.',
        'Do not expose the laminate to temperatures above 60°C for prolonged periods — this may cause the laminate to separate from the substrate.',
        'Do not let water pool or seep into joints, as this may cause the substrate to expand.'
      ];

  const cleaningSteps = lang === 'id'
    ? [
        'Gunakan air hangat dan kain bersih yang tidak abrasif untuk menghilangkan sebagian besar noda.',
        'Gunakan pembersih atau deterjen rumah tangga ringan bila diperlukan, lalu bilas dengan air bersih.',
        'Keringkan permukaan dengan kain bersih yang tidak abrasif.'
      ]
    : [
        'Use warm water and a clean, non-abrasive cloth to remove most stains.',
        'Use a mild household cleaner or detergent if necessary, then rinse with clean water.',
        'Dry the surface with a clean, non-abrasive cloth.'
      ];

  const finishLegend: Array<{ code: string; id: string; en: string }> = [
    { code: 'D, DC',   id: 'Dri-Matt®',   en: 'Dri-Matt®' },
    { code: 'XM',      id: 'Supermatt',   en: 'Supermatt' },
    { code: 'MT',      id: 'Mirage',      en: 'Mirage' },
    { code: 'BS',      id: 'Brushstrokes',en: 'Brushstrokes' },
    { code: 'MD',      id: 'Microdots',   en: 'Microdots' },
    { code: 'XL',      id: 'Brushed',     en: 'Brushed' },
    { code: 'C, E, K, X', id: 'Bertekstur', en: 'Textured' },
    { code: 'G',       id: 'High Glossie',en: 'High Glossie' },
    { code: 'B',       id: 'Leather',     en: 'Leather' },
    { code: 'M',       id: 'Matt',        en: 'Matt' },
    { code: 'S',       id: 'Suede',       en: 'Suede' },
    { code: 'LU',      id: 'Lustre',      en: 'Lustre' },
    { code: 'VU',      id: 'Velour',      en: 'Velour' },
    { code: 'AC',      id: 'Acadia',      en: 'Acadia' },
    { code: 'NC',      id: 'Dune',        en: 'Dune' },
  ];

  const certifications = lang === 'id'
    ? [
        { title: 'Green Label Singapore', body: 'Sertifikasi emisi dan toksisitas rendah untuk produk laminate.' },
        { title: 'GREENGUARD', body: 'Sertifikasi kualitas udara dalam ruangan (indoor air quality) untuk laminate dan edging Lamitak.' },
        { title: 'TÜV SÜD — ISO 4586', body: 'Kesesuaian terhadap standar internasional ISO 4586-1 dan ISO 4586-2 untuk HPL.' },
        { title: "Class '0' Fire Rating", body: 'Sertifikasi tahan api Class 0 oleh TÜV SÜD PSB sesuai standar BS476 Part 6 & 7.' },
        { title: 'Singapore Green Building Product', body: 'Sertifikat produk bangunan hijau dari Singapore Green Building Council (SGBC).' },
        { title: 'FSC® Chain of Custody', body: 'Sertifikasi rantai pengawasan Forest Stewardship Council untuk sumber material yang bertanggung jawab.' },
      ]
    : [
        { title: 'Green Label Singapore', body: 'Certification for low emissions and low toxicity in laminate products.' },
        { title: 'GREENGUARD', body: 'Indoor air quality certification covering Lamitak laminates and edging.' },
        { title: 'TÜV SÜD — ISO 4586', body: 'Conformance to the international ISO 4586-1 and ISO 4586-2 standards for HPL.' },
        { title: "Class '0' Fire Rating", body: 'Class 0 fire rating certified by TÜV SÜD PSB under BS476 Part 6 & 7 standards.' },
        { title: 'Singapore Green Building Product', body: 'Green building product certificate from the Singapore Green Building Council (SGBC).' },
        { title: 'FSC® Chain of Custody', body: "Forest Stewardship Council chain-of-custody certification for responsible material sourcing." },
      ];

  const specs = lang === 'id'
    ? [
        { label: 'Standar', value: 'Umumnya sesuai dengan persyaratan ISO 4586.' },
        { label: 'Ukuran Lembar', value: '4.0ft × 8.0ft (1220mm × 2440mm) [+/- 10%], tersedia secara selektif dalam 4.0ft × 10.0ft (1220mm × 3050mm) [+/- 10%].' },
        { label: 'Ketebalan', value: '0.7mm [+/- 0.1mm] untuk finishing non-glossy, dan 1.0mm [+/- 0.1mm] untuk finishing high gloss.' },
        { label: 'Postforming Grade', value: 'Tersedia berdasarkan pemesanan indent.' },
      ]
    : [
        { label: 'Standard', value: 'Typically conforms to the requirements of ISO 4586.' },
        { label: 'Sheet Size', value: '4.0ft × 8.0ft (1220mm × 2440mm) [+/- 10%], and selectively available in 4.0ft × 10.0ft (1220mm × 3050mm) [+/- 10%].' },
        { label: 'Thickness', value: '0.7mm [+/- 0.1mm] for non-gloss finishes, and 1.0mm [+/- 0.1mm] for high gloss finish.' },
        { label: 'Postforming Grade', value: 'Available on an indent basis only.' },
      ];

  return (
    <div>
      <div className="bg-varindo-ink text-white border-b border-varindo-800">
        <div className="shell py-14 sm:py-20">
          <p className="label text-varindo-400 mb-4">
            {lang === 'id' ? 'Edukasi Produk' : 'Product Education'}
          </p>
          <h1 className="display text-white text-4xl sm:text-5xl lg:text-6xl mb-5">
            {lang === 'id' ? 'Apa Itu Laminate HPL?' : 'What Are Laminates?'}
          </h1>
          <p className="text-[14px] leading-7 text-varindo-400 max-w-2xl">
            {lang === 'id'
              ? 'Panduan Varindo seputar High-Pressure Laminate (HPL) Lamitak — mulai dari material, cara perawatan, kode finishing, hingga sertifikasi dan standar yang berlaku.'
              : "Varindo's guide to Lamitak High-Pressure Laminate (HPL) — the material, care instructions, finish codes, and the certifications and standards behind every sheet."}
          </p>
        </div>
      </div>

      <div className="shell py-12 sm:py-16 max-w-3xl space-y-12">

        <section>
          <p className="label text-varindo-gold mb-4">
            {lang === 'id' ? 'High-Pressure Laminate (HPL)' : 'High-Pressure Laminates'}
          </p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8">
            <p className="text-[14px] leading-8 text-varindo-600">
              {lang === 'id'
                ? 'High-Pressure Laminate (HPL) adalah material komposit yang umum digunakan dalam desain interior dan konstruksi. HPL terdiri dari beberapa lapisan kertas kraft yang direndam resin, satu lapisan dekoratif, dan satu lapisan pelindung bening. Lapisan-lapisan ini direkatkan bersama di bawah tekanan dan suhu tinggi hingga membentuk material akhir yang kuat dan tahan lama.'
                : 'High-Pressure Laminate (HPL) is a composite material widely used in interior design and construction. It is made up of multiple layers of kraft paper saturated with resin, a decorative layer, and a clear protective layer. These layers are bonded together under high pressure and temperature to form a strong, durable final product.'}
            </p>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">
            {lang === 'id' ? 'Fitur Anti-Bakteri' : 'Anti-Bacterial Protection'}
          </p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8">
            <p className="text-[14px] leading-8 text-varindo-600">
              {lang === 'id'
                ? 'Laminate dan edging Lamitak dilengkapi fitur anti-mikroba yang memberikan perlindungan berkelanjutan dengan menghambat pertumbuhan mikroba pada permukaannya — mikroorganisme yang terlalu kecil untuk dilihat dengan mata telanjang.'
                : 'Lamitak laminates and edging solutions come with anti-microbial features that provide continuous protection by inhibiting the growth of microbes on the surface — microorganisms too small to see with the naked eye.'}
            </p>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">
            {lang === 'id' ? 'Panduan Penggunaan & Perawatan' : 'Use & Care Guide'}
          </p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8 space-y-4">
            <p className="text-[14px] leading-8 text-varindo-600">
              {lang === 'id'
                ? 'Laminate Lamitak tahan lama, tahan gesekan, dan tahan benturan dalam penggunaan normal. Agar laminate Anda lebih awet:'
                : 'Lamitak laminates are durable, abrasion resistant, and impact resistant under normal use. To better care for your laminate:'}
            </p>
            <ul className="space-y-3">
              {careDonts.map((item) => (
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
            {lang === 'id' ? 'Cara Membersihkan' : 'Cleaning'}
          </p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8 space-y-4">
            <ul className="space-y-3">
              {cleaningSteps.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[13px] leading-7 text-varindo-600">
                  <div className="w-4 h-[1.5px] bg-varindo-gold shrink-0 mt-3" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[13px] leading-7 text-varindo-500">
              {lang === 'id'
                ? 'Untuk noda membandel, gunakan sedikit thinner pada kain bersih tidak abrasif untuk mengangkat noda secara perlahan, lalu bilas dengan kain lembap bersih. Hindari bahan pembersih yang mengandung asam, alkali, atau sodium hipoklorit karena dapat mengikis, memudarkan, atau merusak permukaan laminate.'
                : 'For stubborn stains, apply a small amount of thinner on a clean, non-abrasive cloth to gently lift the stain, then rinse with another clean, damp cloth. Avoid cleaning agents containing acid, alkali, or sodium hypochlorite, as they may corrode, discolour, or damage the laminate surface.'}
            </p>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">
            {lang === 'id' ? 'Panduan Kode Finishing' : 'Finish Legend'}
          </p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8">
            <p className="text-[14px] leading-8 text-varindo-600 mb-6">
              {lang === 'id'
                ? 'Kode finishing pada akhir setiap kode produk Lamitak menunjukkan jenis tekstur atau kilap permukaannya:'
                : "The finish code at the end of every Lamitak product code indicates the surface's texture or sheen:"}
            </p>
            <div className="grid gap-px bg-varindo-line border border-varindo-line sm:grid-cols-2 lg:grid-cols-3">
              {finishLegend.map((item) => (
                <div key={item.code} className="bg-white p-4">
                  <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-varindo-gold mb-1">{item.code}</p>
                  <p className="text-[13px] text-varindo-ink">{item[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">
            {lang === 'id' ? 'Sertifikasi & Standar' : 'Certifications & Standards'}
          </p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8 space-y-5">
            <p className="text-[14px] leading-8 text-varindo-600">
              {lang === 'id'
                ? 'Produk Lamitak diproduksi dengan berbagai sertifikasi internasional yang menjamin kualitas, keamanan, dan tanggung jawab lingkungan:'
                : 'Lamitak products are manufactured against a range of international certifications covering quality, safety, and environmental responsibility:'}
            </p>
            <div className="grid gap-px bg-varindo-line border border-varindo-line sm:grid-cols-2">
              {certifications.map((cert) => (
                <div key={cert.title} className="bg-white p-5">
                  <p className="text-[13px] font-semibold text-varindo-ink mb-1.5">{cert.title}</p>
                  <p className="text-[12px] leading-6 text-varindo-500">{cert.body}</p>
                </div>
              ))}
            </div>
            <p className="text-[12px] leading-6 text-varindo-500">
              {lang === 'id'
                ? 'Salinan sertifikat tersedia atas permintaan — hubungi tim Varindo untuk informasi lebih lanjut.'
                : 'Certificate copies are available on request — contact the Varindo team for more information.'}
            </p>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">
            {lang === 'id' ? 'Spesifikasi Standar' : 'Standard Specifications'}
          </p>
          <div className="border border-varindo-line divide-y divide-varindo-line bg-white">
            {specs.map((spec) => (
              <div key={spec.label} className="grid sm:grid-cols-[0.3fr_0.7fr] gap-2 sm:gap-6 px-6 py-5 sm:px-8">
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-varindo-ink">{spec.label}</p>
                <p className="text-[13px] leading-7 text-varindo-600">{spec.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">
            {lang === 'id' ? 'Jaminan Pembeli & Garansi' : 'Buyer Safeguard & Warranty'}
          </p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8 space-y-4">
            <p className="text-[14px] leading-8 text-varindo-600">
              {lang === 'id'
                ? 'Setiap desain laminate Lamitak dirancang dan disempurnakan hingga detail terkecil. Pastikan Anda mendapatkan produk asli — cocokkan hasil akhir dengan sampel pada portofolio Lamitak, atau minta contoh chip laminate melalui Varindo sebagai dealer resmi.'
                : "Every Lamitak laminate design is crafted and fine-tuned down to the smallest detail. Make sure you're getting the genuine product — check your finished result against the samples in the Lamitak portfolio, or request sample laminate chips through Varindo as an official dealer."}
            </p>
            <p className="text-[13px] leading-7 text-varindo-500">
              {lang === 'id'
                ? 'Mohon periksa seluruh produk sebelum pemasangan. Garansi berlaku bagi pembeli asli terhadap cacat material sesuai ketentuan ISO 4586 – Part 1 & 2, dalam penggunaan yang normal dan wajar, terbatas pada nilai produk saja, untuk jangka waktu 3 tahun sejak tanggal penjualan.'
                : 'Please inspect all products prior to installation. Warranty coverage applies to the original buyer against material defects under ISO 4586 – Part 1 & 2 guidelines, under normal and proper use, limited to the value of the product only, for a period of 3 years from the date of sale.'}
            </p>
            <p className="text-[13px] leading-7 text-varindo-500">
              {lang === 'id' ? 'Pelajari lebih lanjut cara memverifikasi keaslian produk di ' : 'Learn more about verifying product authenticity on our '}
              <Link href="/otorisasi" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-gold transition-colors">
                {lang === 'id' ? 'halaman Dealer Resmi' : 'Authorized Dealer page'}
              </Link>
              {lang === 'id' ? '.' : '.'}
            </p>
          </div>
        </section>

        <section className="border border-varindo-line bg-varindo-50 px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display text-2xl font-light text-varindo-ink mb-2">
              {lang === 'id' ? 'Butuh sampel fisik untuk cek langsung?' : 'Need a physical sample to check firsthand?'}
            </p>
            <p className="text-[13px] text-varindo-600 max-w-lg">
              {lang === 'id'
                ? 'Ajukan permintaan sampel laminate atau tanyakan spesifikasi produk kepada tim Varindo.'
                : 'Request a laminate sample or ask the Varindo team about product specifications.'}
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
