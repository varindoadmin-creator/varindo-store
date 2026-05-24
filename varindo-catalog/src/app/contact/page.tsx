import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  return (
    <main className="bg-[#f8f5ee]">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5 md:p-12 lg:p-16">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#9a5b2c]">
            Contact
          </p>

          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-black md:text-6xl">
                Get in Touch
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-700 md:text-lg">
                If you have any questions regarding our products and services,
                please do not hesitate to contact us. Our team will be more than
                happy to assist you.
              </p>

              <div className="mt-10 space-y-8 text-sm leading-7 text-neutral-700">
                <div>
                  <h2 className="text-lg font-black text-black">
                    CV. VARINDO FORMA HUTAMA
                  </h2>
                </div>

                <div>
                  <h3 className="font-black text-black">Head Office</h3>
                  <p>
                    Branz BSD Tower A Unit 3310
                    <br />
                    Jl. BSD Boulevard Parcel 55-F
                    <br />
                    Tangerang 15339 Banten Indonesia
                    <br />
                    T. 0812 8888 5224
                  </p>
                </div>

                <div>
                  <h3 className="font-black text-black">Registered Office</h3>
                  <p>
                    Ruko Pasar Modern Batununggal Blok RA/06
                    <br />
                    Kel. Mengger, Kec. Bandung Kidul
                    <br />
                    Bandung 40267 Jawa Barat Indonesia
                    <br />
                    T. 0812 1001 5224
                  </p>
                </div>

                <div>
                  <h3 className="font-black text-black">Opening Hours</h3>
                  <p>Mon - Fri 09.00 - 17.00</p>
                </div>

                <div>
                  <p>
                    <a
                      href="mailto:contact@varindo.co.id"
                      className="font-semibold text-black underline underline-offset-4"
                    >
                      contact@varindo.co.id
                    </a>{" "}
                    |{" "}
                    <Link
                      href="/"
                      className="font-semibold text-black underline underline-offset-4"
                    >
                      varindo.co.id
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <aside className="rounded-[1.5rem] bg-[#f8f5ee] p-6 ring-1 ring-black/5 md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#9a5b2c]">
                Contact
              </p>
              <h2 className="mt-4 text-2xl font-black text-black">
                Need assistance?
              </h2>
              <p className="mt-4 text-sm leading-7 text-neutral-700">
                Chat with our team for product enquiries, pricing, stock checks,
                samples, catalog information, and delivery guidance.
              </p>

              <a
                href="https://wa.me/6281288885224"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
              >
                Chat with Us
              </a>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
