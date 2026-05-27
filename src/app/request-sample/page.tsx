import type { Metadata } from 'next';
import { buildSampleRequestMessage, buildWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Request Lamitak Sample',
  description: 'Request up to 5 Lamitak sample pieces from Varindo.'
};

export default function RequestSamplePage() {
  const whatsappUrl = buildWhatsAppUrl(buildSampleRequestMessage());

  return (
    <div>
      <div className="bg-varindo-ink text-white border-b border-varindo-800">
        <div className="shell py-14 sm:py-20">
          <p className="label text-varindo-400 mb-4">Sample Request</p>
          <h1 className="display text-white text-5xl sm:text-6xl lg:text-7xl">
            Request<br />Lamitak Samples
          </h1>
        </div>
      </div>

      <div className="shell py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start max-w-5xl">
          <div>
            <p className="text-[14px] leading-8 text-varindo-500 max-w-md">
              Customers may request up to 5 sample pieces per request. Please prepare product codes or design names so Admin Varindo can follow up accurately.
            </p>
          </div>
          <div className="border border-varindo-line bg-white">
            <div className="border-b border-varindo-line px-6 py-4 bg-varindo-50">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-700">Information to Prepare</p>
            </div>
            <div className="p-6 grid gap-px bg-varindo-line border border-varindo-line sm:grid-cols-2 mb-6">
              {[
                'Product code or design name',
                'Maximum 5 sample pieces',
                'Name or company name',
                'Delivery city in Indonesia'
              ].map((item) => (
                <div key={item} className="bg-white p-4">
                  <div className="w-4 h-[1.5px] bg-varindo-gold mb-2" />
                  <p className="text-[12px] font-medium text-varindo-700">{item}</p>
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
