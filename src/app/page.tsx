import Link from 'next/link';
import {
  getBestSellerProducts,
  getNewCollectionProducts,
  getPromoItemProducts,
  getPublicProducts
} from '@/lib/products';
import { ProductGrid } from '@/components/ProductGrid';

export const revalidate = 600;

const quickSearch = [
  { label: 'Woods', href: '/collections/woods' },
  { label: 'Patterns', href: '/collections/patterns' },
  { label: 'Solids', href: '/collections/solids' },
  { label: 'New Arrivals', href: '/collections/new-arrivals' }
];

const materialLibrary = [
  {
    title: 'Woods',
    href: '/collections/woods',
    description: 'Warm woodgrain laminates for cabinetry, walls, furniture, and refined interior details.'
  },
  {
    title: 'Patterns',
    href: '/collections/patterns',
    description: 'Decorative patterns, Saville, and Bookmatched designs for feature surfaces and statement areas.'
  },
  {
    title: 'Solids',
    href: '/collections/solids',
    description: 'Clean solid colours, Solid Core, Protak, and Protak Core options for versatile applications.'
  },
  {
    title: 'New Arrivals',
    href: '/collections/new-arrivals',
    description: 'Recently added Lamitak designs and product options from the latest product code families.'
  }
];

const whyShop = [
  {
    title: 'Structured Product Search',
    description: 'Find products by code, design name, collection, sub collection, size, and thickness.'
  },
  {
    title: 'Clear Pricing',
    description: 'Browse product pricing clearly with tax included for easier comparison and planning.'
  },
  {
    title: 'Project Support',
    description: 'Contact our team for product enquiries, order details, availability checks, and delivery guidance.'
  }
];

export default async function HomePage() {
  const allProducts = await getPublicProducts();
  const newProducts = (await getNewCollectionProducts()).slice(0, 8);
  const bestSellers = (await getBestSellerProducts()).slice(0, 8);
  const promoProducts = (await getPromoItemProducts()).slice(0, 4);

  return (
    <main className="bg-[#f8f6f1] text-varindo-ink">
      <section className="relative isolate overflow-hidden bg-varindo-ink">
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="h-full w-full bg-[linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,.18)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-120px)] max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
          <div>
            <p className="eyebrow text-varindo-gold">Varindo × Lamitak</p>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.07em] text-white sm:text-7xl lg:text-8xl">
              Your trusted Lamitak partner.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Browse Lamitak HPL products by code, design name, collection, sub collection, size, thickness, and price through Varindo’s online catalogue.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary">
                Browse Products
              </Link>
              <Link href="/about" className="btn-ghost border-white/25 text-white hover:bg-white hover:text-varindo-ink">
                About
              </Link>
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur">
            <p className="eyebrow text-varindo-gold">Search Product</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] text-white sm:text-4xl">
              Find by material category.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/65">
              Start with the main material groups or go directly to the full product catalogue.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {quickSearch.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border border-white/12 bg-white/[0.06] px-5 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:border-varindo-gold hover:text-varindo-gold"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-7 border-t border-white/10 pt-5 text-sm text-white/60">
              {allProducts.length} active products available in the catalogue.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-varindo-gold">Material Library</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-varindo-ink sm:text-5xl">
              Explore by collection.
            </h2>
          </div>
          <Link href="/products" className="btn-ghost">
            View All Products
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {materialLibrary.map((item) => (
            <Link key={item.href} href={item.href} className="group border border-varindo-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-card">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-varindo-gold">{item.title}</p>
              <p className="mt-4 text-sm leading-7 text-varindo-600">{item.description}</p>
              <span className="mt-6 inline-flex text-xs font-black uppercase tracking-[0.18em] text-varindo-ink group-hover:text-varindo-gold">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {newProducts.length > 0 ? (
        <section className="border-y border-varindo-line bg-white py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow text-varindo-gold">New Arrivals</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-varindo-ink sm:text-5xl">
                  Recently added products.
                </h2>
              </div>
              <Link href="/collections/new-arrivals" className="btn-ghost">
                View New Arrivals
              </Link>
            </div>
            <ProductGrid products={newProducts} />
          </div>
        </section>
      ) : null}

      {bestSellers.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow text-varindo-gold">Best Sellers</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-varindo-ink sm:text-5xl">
                Frequently selected designs.
              </h2>
            </div>
            <Link href="/collections/best-sellers" className="btn-ghost">
              View Best Sellers
            </Link>
          </div>
          <ProductGrid products={bestSellers} />
        </section>
      ) : null}

      {promoProducts.length > 0 ? (
        <section className="border-y border-varindo-line bg-white py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow text-varindo-gold">Promo</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-varindo-ink sm:text-5xl">
                  Selected promotional products.
                </h2>
              </div>
              <Link href="/collections/promo-items" className="btn-ghost">
                View Promo
              </Link>
            </div>
            <ProductGrid products={promoProducts} showPromoPricing />
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {whyShop.map((item) => (
            <article key={item.title} className="border border-varindo-line bg-white p-7">
              <h3 className="text-xl font-black tracking-[-0.03em] text-varindo-ink">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-varindo-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
