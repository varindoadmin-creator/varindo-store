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
  { label: 'Woods',       href: '/collections/woods' },
  { label: 'Patterns',    href: '/collections/patterns' },
  { label: 'Solids',      href: '/collections/solids' },
  { label: 'Promo Items', href: '/collections/promo-items' }
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
    title: 'Promo Items',
    href: '/collections/promo-items',
    description: 'Selected Lamitak items with special promotional pricing — available while stocks last.'
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
    <div>

      {/* ─── HERO ───────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-varindo-ink min-h-[calc(100vh-100px)] flex items-center">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/portfolio.webp')" }}
        />
        <div className="absolute inset-0 -z-10 bg-varindo-ink/55" />
        <div className="absolute inset-y-0 left-0 -z-10 w-3/4 bg-gradient-to-r from-varindo-ink/75 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-varindo-ink/60 to-transparent" />

        <div className="shell w-full grid lg:grid-cols-2 gap-12 py-20 lg:py-28 items-center">

          {/* Left — headline */}
          <div className="animate-fade-up">
            <p className="label text-varindo-300 mb-5">Authorized Lamitak Dealer</p>
            <h1 className="display text-white text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-6 leading-[1.0]">
              Surface Materials<br />
              <em className="text-varindo-300 not-italic">Curated for</em><br />
              Professionals
            </h1>
            <p className="text-[14px] leading-7 text-white/65 max-w-md mb-8">
              Browse Lamitak HPL products by code, design name, collection, sub collection, size, thickness, and price through Varindo's online catalogue.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/products" className="btn-ghost-white">
                Browse Products
              </Link>
            </div>
          </div>

          {/* Right — search card */}
          <div className="animate-fade-up delay-200">
            <div className="bg-white border border-varindo-line p-6 sm:p-8 shadow-luxury">
              <div className="mb-6">
                <p className="label text-varindo-gold mb-1">Quick Search</p>
                <p className="font-display text-2xl font-light text-varindo-ink">Search Products</p>
              </div>

              <form action="/products" className="relative mb-5">
                <input
                  type="search"
                  name="search"
                  aria-label="Search products"
                  placeholder='Try "DXO 5338D", "Walnut", or "Grey Marble"'
                  className="field pr-12"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-0 top-0 h-11 w-11 bg-varindo-ink flex items-center justify-center text-white hover:bg-varindo-800 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </form>

              <div className="grid grid-cols-2 gap-px bg-varindo-line border border-varindo-line">
                {quickSearch.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="bg-white p-4 hover:bg-varindo-50 transition-colors group"
                  >
                    <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-varindo-ink group-hover:text-varindo-gold transition-colors">
                      {item.label}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-varindo-line">
                <p className="text-[11px] text-varindo-400">
                  <span className="font-semibold text-varindo-ink">{allProducts.length.toLocaleString()}</span> active products in the catalogue
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10">
          <div className="shell py-4 flex items-center gap-8 overflow-x-auto">
            {['Authorized Dealer', 'Free Shipping · Java & Bali'].map((item) => (
              <span key={item} className="text-[10px] tracking-[0.2em] uppercase text-white/40 shrink-0">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MATERIAL LIBRARY ───────────────────────────────────────── */}
      <section className="border-b border-varindo-line">
        <div className="shell py-14 sm:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="label mb-3">Collections</p>
              <h2 className="display text-varindo-ink text-4xl sm:text-5xl">
                Material Library
              </h2>
            </div>
            <Link href="/products" className="hidden sm:block text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-500 hover:text-varindo-ink transition-colors">
              All Products →
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-varindo-line border border-varindo-line">
            {materialLibrary.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white p-6 hover:bg-varindo-50 transition-colors group"
              >
                <div className="w-6 h-[1.5px] bg-varindo-line group-hover:bg-varindo-gold transition-colors mb-4" />
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-ink group-hover:text-varindo-gold transition-colors mb-3">
                  {item.title}
                </p>
                <p className="text-[12px] leading-6 text-varindo-400">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEW ARRIVALS ───────────────────────────────────────────── */}
      {newProducts.length > 0 ? (
        <section className="border-b border-varindo-line">
          <div className="shell py-14 sm:py-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="label mb-3">New Arrivals</p>
                <h2 className="display text-varindo-ink text-4xl sm:text-5xl">
                  New Arrivals
                </h2>
                <p className="mt-3 text-[13px] leading-7 text-varindo-500 max-w-lg">
                  Fresh Lamitak designs — modern textures and refined finishes for contemporary interior projects.
                </p>
              </div>
              <Link href="/collections/new-arrivals" className="hidden sm:block text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-500 hover:text-varindo-ink transition-colors shrink-0 ml-6">
                View All →
              </Link>
            </div>
            <ProductGrid products={newProducts} />
          </div>
        </section>
      ) : null}

      {/* ─── BEST SELLERS ───────────────────────────────────────────── */}
      {bestSellers.length > 0 ? (
        <section className="border-b border-varindo-line bg-varindo-50">
          <div className="shell py-14 sm:py-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="label mb-3">Popular</p>
                <h2 className="display text-varindo-ink text-4xl sm:text-5xl">
                  Best Sellers
                </h2>
                <p className="mt-3 text-[13px] leading-7 text-varindo-500 max-w-lg">
                  Frequently specified Lamitak designs trusted for diverse interior applications.
                </p>
              </div>
              <Link href="/collections/best-sellers" className="hidden sm:block text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-500 hover:text-varindo-ink transition-colors shrink-0 ml-6">
                View All →
              </Link>
            </div>
            <ProductGrid products={bestSellers} />
          </div>
        </section>
      ) : null}

      {/* ─── PROMO ──────────────────────────────────────────────────── */}
      {promoProducts.length > 0 ? (
        <section className="border-b border-varindo-line">
          <div className="shell py-14 sm:py-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="label mb-3">Special Pricing</p>
                <h2 className="display text-varindo-ink text-4xl sm:text-5xl">
                  Promo Items
                </h2>
                <p className="mt-3 text-[13px] leading-7 text-varindo-500 max-w-lg">
                  Selected Lamitak items with special promotional pricing — available while stocks last.
                </p>
              </div>
              <Link href="/collections/promo-items" className="hidden sm:block text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-500 hover:text-varindo-ink transition-colors shrink-0 ml-6">
                View All →
              </Link>
            </div>
            <ProductGrid products={promoProducts} showPromoPricing />
          </div>
        </section>
      ) : null}

      {/* ─── DIGITAL PORTFOLIO CTA ──────────────────────────────────── */}
      <section>
        <div className="grid lg:grid-cols-2 min-h-[420px]">
          <div className="bg-varindo-ink text-white flex flex-col justify-center px-8 py-14 sm:px-12 sm:py-16 lg:px-16">
            <p className="label text-varindo-400 mb-5">Digital Portfolio</p>
            <h2 className="display text-white text-4xl sm:text-5xl mb-6">
              Lamitak Portfolio<br />
              <em className="text-varindo-300 not-italic">2026 / 2027</em>
            </h2>
            <p className="text-[14px] leading-7 text-varindo-400 max-w-sm mb-8">
              Explore the complete Lamitak design portfolio — textures, finishes, and surface families for every interior project.
            </p>
            <div className="flex gap-4">
              <a
                href="https://online.flippingbook.com/view/842367758/4-5/"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost-white"
              >
                View Portfolio
              </a>
            </div>
          </div>
          <div
            className="relative min-h-[280px] bg-cover bg-center"
            style={{ backgroundImage: "url('/banner.webp')" }}
            aria-label="Lamitak portfolio"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-varindo-ink/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* ─── WHY VARINDO ────────────────────────────────────────────── */}
      <section className="border-t border-varindo-line bg-varindo-50">
        <div className="shell py-14 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="label mb-4">Why Varindo</p>
              <h2 className="display text-varindo-ink text-4xl sm:text-5xl mb-5">
                Built on Trust.<br />Driven by Service.
              </h2>
              <p className="text-[14px] leading-7 text-varindo-500 max-w-md">
                As an authorized Lamitak dealer in Indonesia, we deliver a transparent, professional, and dependable procurement experience for every project.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-px bg-varindo-line border border-varindo-line">
              {whyShop.map((item) => (
                <div key={item.title} className="bg-white p-6">
                  <div className="w-6 h-[1.5px] bg-varindo-gold mb-4" />
                  <h3 className="text-[13px] font-semibold text-varindo-ink mb-2">{item.title}</h3>
                  <p className="text-[12px] leading-6 text-varindo-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
