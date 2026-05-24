import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Varindo',
  description: 'Get in touch with Varindo for product, price, stock, sample, and service enquiries.'
};

export default function ContactPage() {
  return (
    <div className="section-shell py-12 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-stone-950 sm:text-6xl">Get in Touch</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-stone-600">
            If you have any questions regarding our products and services, please do not hesitate to contact us. Our team will be more than happy to assist you.
          </p>

          <div className="mt-8 soft-card p-6 sm:p-8">
            <h2 className="text-xl font-black tracking-[-0.02em] text-stone-950">CV. VARINDO FORMA HUTAMA</h2>

            <div className="mt-6 grid gap-6 text-sm leading-7 text-stone-700">
              <div>
                <p className="font-black uppercase tracking-[0.14em] text-stone-950">Head Office</p>
                <p className="mt-2">
                  Branz BSD Tower A Unit 3310<br />
                  Jl. BSD Boulevard Parcel 55-F<br />
                  Tangerang 15339 Banten Indonesia<br />
                  T. 0812 8888 5224
                </p>
              </div>

              <div>
                <p className="font-black uppercase tracking-[0.14em] text-stone-950">Registered Office</p>
                <p className="mt-2">
                  Ruko Pasar Modern Batununggal Blok RA/06<br />
                  Kel. Mengger, Kec. Bandung Kidul<br />
                  Bandung 40267 Jawa Barat Indonesia<br />
                  T. 0812 1001 5224
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-5 font-bold text-stone-950">
                <a href="mailto:contact@varindo.co.id" className="hover:text-amber-700">contact@varindo.co.id</a>
                <span className="px-2 text-stone-400">|</span>
                <a href="https://varindo.co.id" target="_blank" rel="noreferrer" className="hover:text-amber-700">varindo.co.id</a>
              </div>
            </div>
          </div>
        </div>

        <div className="soft-card p-6 sm:p-8">
          <p className="eyebrow">Enquiry Form</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-stone-950 sm:text-3xl">Send us your details</h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            Leave your contact information and our team will follow up with you.
          </p>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}
