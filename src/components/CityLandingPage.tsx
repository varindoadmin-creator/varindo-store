import Link from 'next/link';
import type { Product } from '@/types/product';
import type { CityContent } from '@/lib/cityContent';
import { buildEnquiryWhatsAppUrl, buildCityEnquiryMessage } from '@/lib/whatsapp';
import { buildFaqPageJsonLd } from '@/lib/structured-data';
import { JsonLd } from '@/components/JsonLd';
import { ProductGrid } from '@/components/ProductGrid';

export function CityLandingPage({ content, bestSellers }: { content: CityContent; bestSellers: Product[] }) {
  const waUrl = buildEnquiryWhatsAppUrl(buildCityEnquiryMessage(content.cityName));

  return (
    <div>
      <JsonLd data={buildFaqPageJsonLd(content.faq)} />

      <div className="bg-varindo-paper">
        <div className="shell py-14 sm:py-20">
          <p className="label mb-4">Area Layanan</p>
          <h1 className="display text-varindo-ink text-[36px] sm:text-[48px] lg:text-[56px] mb-5">
            Jual HPL Lamitak {content.cityName} — Dealer Resmi
          </h1>
          <a href={waUrl} target="_blank" rel="noreferrer" className="btn-blue">
            Tanya via WhatsApp
          </a>
        </div>
      </div>

      <div className="shell py-12 sm:py-16 max-w-3xl">

        {/* Intro */}
        <section className="mb-12 space-y-4">
          {content.intro.map((paragraph, i) => (
            <p key={i} className="text-[16px] leading-8 text-varindo-mid">{paragraph}</p>
          ))}
        </section>

        {/* Area layanan / cara order */}
        <section className="mb-14 rounded-card bg-varindo-canvas p-6 sm:p-8">
          <p className="label mb-4">Area Layanan &amp; Cara Order</p>
          <p className="text-[16px] leading-8 text-varindo-mid">{content.areaLayanan}</p>
        </section>

        {/* FAQ */}
        <section>
          <p className="label mb-6">Pertanyaan Umum</p>
          <div className="rounded-xl2 bg-varindo-paper divide-y divide-varindo-line/60">
            {content.faq.map((entry) => (
              <div key={entry.question} className="px-6 py-5">
                <p className="text-[16px] font-semibold text-varindo-ink mb-2">{entry.question}</p>
                <p className="text-[14px] leading-7 text-varindo-mid">{entry.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Best sellers */}
      {bestSellers.length > 0 && (
        <section className="shell pb-14 sm:pb-20">
          <p className="label mb-6">8 Produk Terlaris</p>
          <ProductGrid products={bestSellers} />
        </section>
      )}

      {/* CTA */}
      <section className="shell pb-16 sm:pb-24">
        <div className="rounded-card bg-varindo-paper px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="display text-[28px] text-varindo-ink mb-2">
              Butuh HPL Lamitak untuk proyek di {content.cityName}?
            </p>
            <p className="text-[14px] text-varindo-mid max-w-lg">
              Hubungi tim kami via WhatsApp untuk konsultasi produk, harga, dan detail pengiriman.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a href={waUrl} target="_blank" rel="noreferrer" className="btn-ink justify-center">Tanya via WhatsApp</a>
            <Link href="/products" className="btn-ghost justify-center">Lihat Katalog</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
