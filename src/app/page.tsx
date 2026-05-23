import Link from 'next/link';
import { ProductGrid } from '@/components/ProductGrid';
import { getBestSellerProducts, getNewCollectionProducts } from '@/lib/products';

export const revalidate = 600;

const collectionCards = [
  {
    title: 'Woods',
    href: '/collections/woods',
    description: 'Warm woodgrain laminates for cabinetry, wall panels, wardrobes, and furniture surfaces.'
  },
  {
    title: 'Patterns',
    href: '/collections/patterns',
    description: 'Textile-inspired and decorative patterns for refined residential and commercial interiors.'
  },
  {
    title: 'Solids',
    href: '/collections/solids',
    description: 'Clean solid, stone, and slate-inspired finishes for modern, minimalist spaces.'
  }
];

export default async function HomePage() {
  const newCollectionProducts = (await getNewCollectionProducts()).slice(0, 4);
  const bestSellerProducts = (await getBestSellerProducts()).slice(0, 4);

  return (
    <div>
      <section className="relative isolate overflow-hidden bg-stone-100 text-stone-950">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/banner.webp')" }}
        />
        <div className="absolute inset-0 -z-10 bg-white/62" />
        <div className="absolute inset-y-0 left-0 -z-10 w-[58%] bg-gradient-to-r from-white/90 via-white/72 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-white/55 to-transparent" />

        <div className="section-shell grid min-h-[calc(100vh-74px)] items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.03fr_0.97fr] lg:py-24">
          <div>
            <p className="eyebrow text-amber-700">Welcome</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.045em] text-stone-950 sm:text-6xl lg:text-7xl">
              Varindo | Built on Trust. Driven by Service.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-700 sm:text-lg">
              Varindo supports contractors, interior businesses, and projects across Indonesia with reliable laminate supply and responsive service. As an authorized dealer, we provide trusted products, responsive support, and dependable service.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="dark-button">
                Browse Collection
              </Link>
            </div>
          </div>

          <div className="soft-card overflow-hidden !border-white/10 !bg-white/10 p-4 shadow-luxury">
            <div className="rounded-[1.5rem] bg-white p-5 text-stone-950 sm:p-6">
              <div className="rounded-[1.25rem] bg-stone-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Search Products</p>
                <div className="mt-4 rounded-full border border-stone-200 bg-white px-5 py-4 text-sm font-medium text-stone-400">
                  Try “DXO 5338D”, “Walnut”, “Stoffa”, or “Grey”
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {collectionCards.map((card) => (
                  <Link key={card.href} href={card.href} className="rounded-2xl border border-stone-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-sm">
                    <p className="text-sm font-black text-stone-950">{card.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-14 sm:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Featured Product</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.035em] text-stone-950 sm:text-4xl">New Collections</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
              Discover fresh Lamitak designs, modern textures, and refined finishes for contemporary interior projects.
            </p>
          </div>
          <Link href="/products" className="text-sm font-black text-stone-950 hover:underline">View All</Link>
        </div>
        <ProductGrid products={newCollectionProducts} />
      </section>

      <section className="bg-white/70 py-14 sm:py-20">
        <div className="section-shell">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Featured Product</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.035em] text-stone-950 sm:text-4xl">Best Sellers</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
                Explore popular Lamitak designs trusted for versatile styles and wide interior applications.
              </p>
            </div>
            <Link href="/products" className="text-sm font-black text-stone-950 hover:underline">View All</Link>
          </div>
          <ProductGrid products={bestSellerProducts} />
        </div>
      </section>

      <section className="section-shell py-14 sm:py-20">
        <div className="soft-card overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="bg-stone-950 p-8 text-white sm:p-10 lg:p-12">
              <p className="eyebrow text-amber-300">Digital Portfolio</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-white sm:text-4xl">
                Lamitak Digital Portfolio 26/27
              </h2>
              <p className="mt-5 text-sm leading-7 text-stone-300 sm:text-base">
                Explore the Lamitak Digital Portfolio to discover a wide range of designs, textures, and finishes for your interior projects. Browse the latest collection conveniently in one place for inspiration and product selection.
              </p>
              <a
                href="https://online.flippingbook.com/view/842367758/4-5/"
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-black text-stone-950 transition hover:bg-stone-100"
              >
                Explore
              </a>
            </div>
            <div
              className="relative min-h-[320px] bg-cover bg-center lg:min-h-full"
              style={{ backgroundImage: "url('/portfolio.webp')" }}
              aria-label="Lamitak portfolio"
            >
              <div className="absolute inset-0 bg-gradient-to-l from-black/5 via-transparent to-black/15" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
