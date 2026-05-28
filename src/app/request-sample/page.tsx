import type { Metadata } from 'next';
import { getPublicProducts } from '@/lib/products';
import { RequestSampleForm } from './RequestSampleForm';

export const metadata: Metadata = {
  title: 'Request Lamitak Sample',
  description: 'Request up to 5 Lamitak sample pieces from Varindo.'
};

export default async function RequestSamplePage() {
  const products = await getPublicProducts();

  const productOptions = products.map((p) => ({
    code:       p.code,
    name:       p.name,
    design:     p.design,
    collection: p.collection
  }));

  return (
    <div>
      <div className="bg-varindo-ink text-white border-b border-varindo-800">
        <div className="shell py-14 sm:py-20">
          <p className="label text-varindo-400 mb-4">Sample Request</p>
          <h1 className="display text-white text-5xl sm:text-6xl lg:text-7xl">
            Request<br />Lamitak Samples
          </h1>
          <p className="mt-5 text-[14px] leading-7 text-varindo-400 max-w-lg">
            Customers may request up to 5 Lamitak sample pieces per request. Please prepare product codes or design names so our team can follow up accurately.
          </p>
        </div>
      </div>

      <div className="shell py-12 sm:py-16 max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-start">

          {/* Left — info panel */}
          <div className="border border-varindo-line bg-white">
            <div className="border-b border-varindo-line px-6 py-4 bg-varindo-50">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-700">Information to Prepare</p>
            </div>
            <div className="divide-y divide-varindo-line/50">
              {[
                'Product code or design name',
                'Name or company name',
                'Delivery address',
                'Phone number'
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 px-6 py-4">
                  <div className="w-4 h-[1.5px] bg-varindo-gold shrink-0" />
                  <p className="text-[13px] font-medium text-varindo-700">{item}</p>
                </div>
              ))}
            </div>
            <div className="px-6 py-5 border-t border-varindo-line bg-varindo-50/50">
              <p className="text-[11px] text-varindo-400 leading-6">
                Maximum 5 sample pieces per request. Your request will open WhatsApp with a pre-filled message ready to send to our team.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <RequestSampleForm products={productOptions} />
        </div>
      </div>
    </div>
  );
}
