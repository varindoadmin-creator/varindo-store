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
        'Jangan memotong, mengiris, atau memukul langsung permukaan HPL.',
        'Jangan gunakan benda tajam seperti pisau atau cutter pada permukaan HPL.',
        'Jangan meletakkan panci atau alat masak panas langsung di atas permukaan HPL.',
        'Jangan biarkan HPL terpapar suhu di atas 60°C dalam waktu lama, karena dapat menyebabkan HPL terlepas dari substrat.',
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

  // Certificate PDF links sourced from lamitak.com/pages/what-are-laminates
  const certifications: Array<{
    title: string;
    body: string;
    links: Array<{ label: string; href: string }>;
  }> = [
    {
      title: 'Green Label Singapore',
      body: lang === 'id'
        ? 'Sertifikasi emisi dan toksisitas rendah untuk produk HPL.'
        : 'Certification for low emissions and low toxicity in laminate products.',
      links: [
        { label: 'GreenLabel Certification for Lamitak Laminates', href: 'https://cdn.shopify.com/s/files/1/0870/9242/9076/files/Lamitak_Green_Label_Certificate_Valid_till_26_July_2028.pdf?v=1776059928' }
      ]
    },
    {
      title: 'GREENGUARD',
      body: lang === 'id'
        ? 'Sertifikasi kualitas udara dalam ruangan (indoor air quality) untuk HPL dan edging Lamitak.'
        : 'Indoor air quality certification covering Lamitak laminates and edging.',
      links: [
        { label: 'GREENGUARD Gold Certification for Lamitak Laminates', href: 'https://cdn.shopify.com/s/files/1/0870/9242/9076/files/Lamitak_Greenguard_Gold_130338-420_valid_till_16_Dec_2026.pdf?v=1765428238' },
        { label: 'GREENGUARD Certification for Lamitak Laminates', href: 'https://cdn.shopify.com/s/files/1/0870/9242/9076/files/Lamitak_Greenguard_130338-410_valid_till_16_Dec_2026.pdf?v=1765428236' },
        { label: 'GREENGUARD Gold Certification for Newedge Edging', href: 'https://cdn.shopify.com/s/files/1/0870/9242/9076/files/Newedge_GREENGUARD_Gold_Certification_28_Sep_2026.pdf?v=1759481631' },
        { label: 'GREENGUARD Certification for Newedge Edging', href: 'https://cdn.shopify.com/s/files/1/0870/9242/9076/files/Newedge_GREENGUARD_Certification_28_Sep_2026.pdf?v=1759481632' },
        { label: 'GREENGUARD Gold Certification for Artak Laminates', href: 'https://cdn.shopify.com/s/files/1/0870/9242/9076/files/Artak_GREENGUARD_Gold_Certification_28_Dec_2026.pdf?v=1767666044' },
        { label: 'GREENGUARD Certification for Artak Laminates', href: 'https://cdn.shopify.com/s/files/1/0870/9242/9076/files/Artak_GREENGUARD_Certification_28_Dec_2026.pdf?v=1767666044' }
      ]
    },
    {
      title: 'TÜV SÜD — ISO 4586',
      body: lang === 'id'
        ? 'Kesesuaian terhadap standar internasional ISO 4586-1 dan ISO 4586-2 untuk HPL.'
        : 'Conformance to the international ISO 4586-1 and ISO 4586-2 standards for HPL.',
      links: []
    },
    {
      title: "Class '0' Fire Rating",
      body: lang === 'id'
        ? 'Sertifikasi tahan api Class 0 oleh TÜV SÜD PSB sesuai standar BS476 Part 6 & 7.'
        : 'Class 0 fire rating certified by TÜV SÜD PSB under BS476 Part 6 & 7 standards.',
      links: [
        { label: "TUV SUD PSB Certificate of Conformity (Class '0' Fire Rating) for Lamitak Laminate", href: 'https://cdn.shopify.com/s/files/1/0870/9242/9076/files/Lamitak_Class_0_Certificate_valid_till_12_Feb_2029.pdf?v=1751684980' }
      ]
    },
    {
      title: 'Singapore Green Building Product',
      body: lang === 'id'
        ? 'Sertifikat produk bangunan hijau dari Singapore Green Building Council (SGBC).'
        : 'Green building product certificate from the Singapore Green Building Council (SGBC).',
      links: [
        { label: 'SGBP Certificate for Lamitak Laminate (5104)', href: 'https://cdn.shopify.com/s/files/1/0870/9242/9076/files/SGBP_5104_TAK_Products_Services_Pte_Ltd_valid_until_01_June_2027.pdf?v=1751683954' },
        { label: 'SGBP Certificate for Lamitak Laminate (4813)', href: 'https://cdn.shopify.com/s/files/1/0870/9242/9076/files/SGBP_4813_TAK_Products_Services_Pte_Ltd_valid_until_20_Aug_2026.pdf?v=1754027829' },
        { label: 'SGBP Certificate for Lamitak Laminate (5020)', href: 'https://cdn.shopify.com/s/files/1/0870/9242/9076/files/SGBP_5020_TAK_Products_Services_Pte_Ltd__Valid_27_Feb_2027.pdf?v=1754027828' },
        { label: 'SGBP Certificate for Lamitak Laminate (5021)', href: 'https://cdn.shopify.com/s/files/1/0870/9242/9076/files/Lamitak_SGBP_5021_TAK_Products_Services_Pte_Ltd__Valid_27_Feb_2027_updated_02_Sep_2025.pdf?v=1757381832' },
        { label: 'SGBP Certificate for Lamitak Laminate (6043)', href: 'https://cdn.shopify.com/s/files/1/0870/9242/9076/files/Lamitak_SGBP_6043_TAK_Products_Services_Pte_Ltd__Valid_01_Sep_2027.pdf?v=1757381831' }
      ]
    },
    {
      title: 'FSC® Chain of Custody',
      body: lang === 'id'
        ? 'Sertifikasi rantai pengawasan Forest Stewardship Council untuk sumber material yang bertanggung jawab.'
        : 'Forest Stewardship Council chain-of-custody certification for responsible material sourcing.',
      links: [
        { label: 'FSC Chain of Custody Certificate (COC-003256)', href: 'https://cdn.shopify.com/s/files/1/0870/9242/9076/files/FSC_Cert_-_DNV-COC-003256-20260129-20260129.pdf?v=1779243657' }
      ]
    }
  ];

  const antiBacterialCerts = [
    { label: lang === 'id' ? 'Sertifikat Anti-Bakteri — Lamitak Laminates' : 'Anti-bacterial Certification — Lamitak Laminates', href: 'https://cdn.shopify.com/s/files/1/0870/9242/9076/files/Lamitak_Anti-bacteria_Certificate_till_4_Jan_2028.pdf?v=1767666532' },
    { label: lang === 'id' ? 'Sertifikat Anti-Bakteri — Newedge' : 'Anti-bacterial Certification — Newedge', href: 'https://cdn.shopify.com/s/files/1/0870/9242/9076/files/Newedge_Anti-bacterial_Certificate_TTCN_080891_0014_Rev._00_Valid_till_08_Sep_2027.pdf?v=1757638723' }
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
            {lang === 'id' ? 'Apa Itu HPL?' : 'What Are Laminates?'}
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
          <div className="border border-varindo-line bg-white p-6 sm:p-8 space-y-4">
            <p className="text-[14px] leading-8 text-varindo-600">
              {lang === 'id'
                ? 'HPL dan edging Lamitak dilengkapi fitur anti-mikroba yang memberikan perlindungan berkelanjutan dengan menghambat pertumbuhan mikroba pada permukaannya — mikroorganisme yang terlalu kecil untuk dilihat dengan mata telanjang.'
                : 'Lamitak laminates and edging solutions come with anti-microbial features that provide continuous protection by inhibiting the growth of microbes on the surface — microorganisms too small to see with the naked eye.'}
            </p>
            <ul className="space-y-1.5">
              {antiBacterialCerts.map((cert) => (
                <li key={cert.href}>
                  <a href={cert.href} target="_blank" rel="noreferrer"
                    className="text-[12px] text-varindo-ink underline underline-offset-2 hover:text-varindo-gold transition-colors">
                    {cert.label} (PDF) ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">
            {lang === 'id' ? 'Panduan Penggunaan & Perawatan' : 'Use & Care Guide'}
          </p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8 space-y-4">
            <p className="text-[14px] leading-8 text-varindo-600">
              {lang === 'id'
                ? 'HPL Lamitak tahan lama, tahan gesekan, dan tahan benturan dalam penggunaan normal. Agar HPL Anda lebih awet:'
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
                ? 'Untuk noda membandel, gunakan sedikit thinner pada kain bersih tidak abrasif untuk mengangkat noda secara perlahan, lalu bilas dengan kain lembap bersih. Hindari bahan pembersih yang mengandung asam, alkali, atau sodium hipoklorit karena dapat mengikis, memudarkan, atau merusak permukaan HPL.'
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
                  <p className="text-[12px] leading-6 text-varindo-500 mb-3">{cert.body}</p>
                  {cert.links.length > 0 && (
                    <ul className="space-y-1">
                      {cert.links.map((link) => (
                        <li key={link.href}>
                          <a href={link.href} target="_blank" rel="noreferrer"
                            className="text-[11px] leading-5 text-varindo-ink underline underline-offset-2 hover:text-varindo-gold transition-colors">
                            {link.label} (PDF) ↗
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
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

        <section className="border border-varindo-line bg-varindo-50 px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display text-2xl font-light text-varindo-ink mb-2">
              {lang === 'id' ? 'Butuh sampel fisik untuk cek langsung?' : 'Need a physical sample to check firsthand?'}
            </p>
            <p className="text-[13px] text-varindo-600 max-w-lg">
              {lang === 'id'
                ? 'Ajukan permintaan sampel HPL atau tanyakan spesifikasi produk kepada tim Varindo.'
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
