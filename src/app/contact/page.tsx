import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  return (
    <div>
      {/* Page header */}
      <div className="bg-varindo-ink text-white border-b border-varindo-800">
        <div className="shell py-14 sm:py-20">
          <p className="label text-varindo-400 mb-4">Get in Touch</p>
          <h1 className="display text-white text-5xl sm:text-6xl lg:text-7xl">
            Contact Us
          </h1>
        </div>
      </div>

      <div className="shell py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">

          {/* Left — company info */}
          <div>
            <p className="text-[14px] leading-7 text-varindo-500 max-w-lg mb-10">
              If you have any questions regarding our products and services, please do not hesitate to contact us. Our team will be more than happy to assist you.
            </p>

            <div className="border border-varindo-line bg-white">
              {/* Company name */}
              <div className="border-b border-varindo-line px-6 py-5 bg-varindo-50">
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-varindo-500">Company</p>
                <p className="mt-1 text-[15px] font-semibold text-varindo-ink">CV. Varindo Forma Hutama</p>
              </div>

              {/* Offices */}
              <div className="grid sm:grid-cols-2 gap-px bg-varindo-line">
                <div className="bg-white px-6 py-6">
                  <p className="label text-varindo-gold mb-3">Head Office</p>
                  <address className="not-italic text-[13px] leading-7 text-varindo-600">
                    Branz BSD Tower A Unit 3310<br />
                    Jl. BSD Boulevard Parcel 55-F<br />
                    Tangerang 15339<br />
                    Banten, Indonesia<br />
                    <span className="font-medium text-varindo-ink">T. 0812 8888 5224</span>
                  </address>
                </div>
                <div className="bg-white px-6 py-6">
                  <p className="label text-varindo-gold mb-3">Registered Office</p>
                  <address className="not-italic text-[13px] leading-7 text-varindo-600">
                    Ruko Pasar Modern Batununggal<br />
                    Blok RA/06, Kel. Mengger<br />
                    Kec. Bandung Kidul<br />
                    Bandung 40267, Jawa Barat<br />
                    <span className="font-medium text-varindo-ink">T. 0812 1001 5224</span>
                  </address>
                </div>
              </div>

              {/* Hours + email */}
              <div className="grid sm:grid-cols-2 gap-px bg-varindo-line border-t border-varindo-line">
                <div className="bg-white px-6 py-5">
                  <p className="label text-varindo-gold mb-2">Opening Hours</p>
                  <p className="text-[13px] text-varindo-700">Monday – Friday<br />09.00 – 17.00 WIB</p>
                </div>
                <div className="bg-white px-6 py-5">
                  <p className="label text-varindo-gold mb-2">Email</p>
                  <a href="mailto:contact@varindo.co.id" className="text-[13px] text-varindo-ink underline underline-offset-2 hover:text-varindo-gold transition-colors">
                    contact@varindo.co.id
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right — CTA card */}
          <aside className="border border-varindo-line bg-white p-8">
            <p className="label text-varindo-gold mb-4">WhatsApp</p>
            <h2 className="display text-varindo-ink text-3xl sm:text-4xl mb-5">
              Need assistance?
            </h2>
            <p className="text-[14px] leading-7 text-varindo-500 mb-8">
              Chat with our team for product enquiries, pricing, stock checks, samples, catalog information, and delivery guidance.
            </p>

            <a
              href="https://wa.me/6281288885224"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ink w-full justify-center mb-3"
            >
              Chat with Us → 0812 8888 5224
            </a>
            <a
              href="https://wa.me/6281210015224"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full justify-center"
            >
              Chat → 0812 1001 5224
            </a>

            <div className="mt-8 pt-6 border-t border-varindo-line">
              <p className="label text-varindo-500 mb-3">Browse Catalog</p>
              <Link href="/products" className="text-[13px] font-medium text-varindo-ink hover:text-varindo-gold transition-colors">
                View all Lamitak products →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
