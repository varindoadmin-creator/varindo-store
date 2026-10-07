import type { Metadata } from 'next';
import { buildEnquiryWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Request Lamitak Catalog',
  description: 'Request Lamitak catalog information from Varindo.'
};

export default function RequestCatalogPage() {
  const message = [
    'Halo Admin Varindo, saya ingin request katalog Lamitak.',
    '',
    'Nama / Perusahaan:',
    'Kota:',
    'Kebutuhan produk:',
    '',
    'Terima kasih.'
  ].join('\n');

  const whatsappUrl = buildEnquiryWhatsAppUrl(message);

  return (
    <div>
      <div className="bg-varindo-paper">
        <div className="shell py-14 sm:py-20">
          <p className="label mb-4">Catalog Request</p>
          <h1 className="display text-varindo-ink text-[40px] sm:text-[56px] lg:text-[80px]">
            Request the<br />Lamitak Catalog
          </h1>
        </div>
      </div>

      <div className="shell py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start max-w-5xl">
          <div>
            <p className="text-[16px] leading-8 text-varindo-mid max-w-md">
              Request Lamitak catalog information from Varindo through WhatsApp. Admin Varindo will help provide the most relevant product information based on your needs.
            </p>
          </div>
          <div className="rounded-card bg-varindo-canvas">
            <div className="px-7 pt-7 pb-1">
              <p className="text-[21px] font-semibold tracking-[-0.01em] text-varindo-ink">Recommended Details</p>
            </div>
            <div className="p-6 grid gap-5 sm:grid-cols-2 mb-6">
              {[
                'Name or company name',
                'City / project location',
                'Product usage or project type',
                'Preferred designs or product codes, if any'
              ].map((item) => (
                <div key={item} className="rounded-xl2 bg-varindo-canvas p-5">
                  <div className="w-4 h-[1.5px] bg-varindo-link mb-2" />
                  <p className="text-[14px] font-medium text-varindo-deep">{item}</p>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-ink w-full justify-center">
                Request via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
