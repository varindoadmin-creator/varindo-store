import type { Metadata } from 'next';
import { RequestCatalogueForm } from './RequestCatalogueForm';

export const metadata: Metadata = {
  title: 'Request Catalogue',
  description: 'Request a Lamitak product catalogue from Varindo.'
};

export default function RequestCataloguePage() {
  return (
    <div>
      <div className="bg-varindo-ink text-white border-b border-varindo-800">
        <div className="shell py-14 sm:py-20">
          <p className="label text-varindo-400 mb-4">Catalogue Request</p>
          <h1 className="display text-white text-5xl sm:text-6xl lg:text-7xl">
            Request a<br />Lamitak Catalogue
          </h1>
          <p className="mt-5 text-[14px] leading-7 text-varindo-400 max-w-lg">
            Fill in your details and our team will arrange the Lamitak product catalogue for you.
          </p>
        </div>
      </div>

      <div className="shell py-12 sm:py-16 max-w-3xl">
        <RequestCatalogueForm />
      </div>
    </div>
  );
}
