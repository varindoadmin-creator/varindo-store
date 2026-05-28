import type { Metadata } from 'next';
import { getPublicProducts } from '@/lib/products';
import { RequestQuoteForm } from './RequestQuoteForm';

export const metadata: Metadata = {
  title: 'Request Quote',
  description: 'Request a product quote from Varindo. Fill in your details and product codes — we will follow up via WhatsApp.'
};

export default async function RequestQuotePage() {
  const products = await getPublicProducts();

  // Pass only the fields the autocomplete needs — keeps the client bundle lean
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
          <p className="label text-varindo-400 mb-4">Quote Request</p>
          <h1 className="display text-white text-5xl sm:text-6xl lg:text-7xl">
            Request a Quote
          </h1>
          <p className="mt-5 text-[14px] leading-7 text-varindo-400 max-w-lg">
            Fill in your details and search for the product codes or design names you need. Your request will be sent directly to our team via WhatsApp.
          </p>
        </div>
      </div>

      <div className="shell py-12 sm:py-16 max-w-5xl">
        <RequestQuoteForm products={productOptions} />
      </div>
    </div>
  );
}
