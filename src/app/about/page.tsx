import Link from 'next/link';

export const revalidate = 600;

const values = [
  {
    title: 'Clear product information',
    description: 'We organise Lamitak products by code, design, size, collection, sub collection, and thickness so customers can find the right surface faster.'
  },
  {
    title: 'Project-focused support',
    description: 'Varindo supports contractors, interior businesses, and project teams with practical product guidance and ordering assistance.'
  },
  {
    title: 'Reliable fulfilment',
    description: 'Our team helps coordinate product enquiries, availability checks, order confirmation, and delivery information for customers across Indonesia.'
  }
];

export default function AboutPage() {
  return (
    <main className="bg-[#f8f6f1] text-varindo-ink">
      <section className="border-b border-varindo-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-24">
          <div>
            <p className="eyebrow text-varindo-gold">About</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.055em] text-varindo-ink sm:text-6xl">
              Your trusted Lamitak partner.
            </h1>
          </div>

          <div className="max-w-2xl lg:pt-9">
            <p className="text-base leading-8 text-varindo-600 sm:text-lg">
              Varindo is an authorized dealer focused on making Lamitak HPL product discovery and ordering simpler for interior contractors, interior businesses, retailers, and project teams.
            </p>
            <p className="mt-5 text-base leading-8 text-varindo-600 sm:text-lg">
              Through varindo.co.id, customers can browse products by code, design, collection, size, sub collection, and price information in a cleaner online catalogue experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary">Browse Products</Link>
              <Link href="/contact" className="btn-ghost">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((item) => (
            <article key={item.title} className="border border-varindo-line bg-white p-7">
              <h2 className="text-xl font-black tracking-[-0.03em] text-varindo-ink">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-varindo-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-varindo-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
          <div>
            <p className="eyebrow text-varindo-gold">What We Do</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] text-varindo-ink sm:text-5xl">
              Built for clearer product selection.
            </h2>
          </div>

          <div className="grid gap-4 text-sm leading-7 text-varindo-600 sm:text-base">
            <p>Varindo helps customers explore Lamitak decorative surfaces through a structured product catalogue, practical product categorisation, and direct order enquiry support.</p>
            <p>We aim to reduce confusion in product selection by presenting item codes, design names, sizes, collections, sub collections, and price information clearly.</p>
            <p>For customers who need assistance, our team can help check product details, availability, delivery guidance, and ordering next steps.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
        <div className="border border-varindo-line bg-varindo-ink p-8 text-white sm:p-10 lg:p-12">
          <p className="eyebrow text-varindo-gold">Varindo</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-[-0.045em] sm:text-5xl">
            A practical online destination for Lamitak HPL.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
            Explore our catalogue and contact our team for product enquiries, project needs, and order assistance.
          </p>
          <div className="mt-8">
            <Link href="/products" className="inline-flex border border-white bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-varindo-ink transition hover:bg-transparent hover:text-white">
              Explore Catalogue
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
