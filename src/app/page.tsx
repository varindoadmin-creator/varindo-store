import Link from 'next/link';
import { ProductGrid } from '@/components/ProductGrid';
import { getBestSellerProducts, getNewCollectionProducts, getPromoItemProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 600;

const materialCategories = [
  {
    title: 'Woods',
    href: '/collections/woods',
    description: 'Woodgrain surfaces for cabinetry, wardrobes & wall panels'
  },
  {
    title: 'Patterns',
    href: '/collections/patterns',
    description: 'Textile-inspired & decorative laminates'
  },
  {
    title: 'Solids',
    href: '/collections/solids',
    description: 'Stone, slate & clean solid finishes'
  },
  {
    title: 'Promo Items',
    href: '/collections/promo-items',
    description: 'Selected products at special pricing'
  }
];

export default async function HomePage() {
  const newCollectionProducts = (await getNewCollectionProducts()).slice(0, 4);
  const bestSellerProducts = (await getBestSellerProducts()).slice(0, 4);
  const promoProducts = (await getPromoItemProducts()).slice(0, 4);

  return (
    <div>

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-varindo-ink min-h-[calc(100vh-100px)] flex items-center">
        {/* Background image */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/portfolio.webp')" }}
        />
        {/* Gradient overlays */}
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
              Browse Lamitak HPL surfaces — from woodgrain finishes to solid laminates — for your interior projects across Indonesia.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/products" className="btn-ghost-white">
                Explore Catalog
              </Link>
              <a
                href="https://wa.me/6281288885224"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 text-[11px] font-semibold tracking-[0.18em] uppercase hover:bg-white/20 transition-all"
              >
                Chat with Us
              </a>
            </div>
          </div>

          {/* Right — search card */}
          <div className="animate-fade-up delay-200">
            <div className="bg-white border border-varindo-line p-6 sm:p-8 shadow-luxury">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="label text-varindo-gold mb-1">Quick Search</p>
                  <p className="font-display text-2xl font-light text-varindo-ink">Find your material</p>
                </div>
                <div className="w-px h-10 bg-varindo-line mx-2 self-start mt-1" />
              </div>

              {/* Search form */}
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

              {/* Collection quick links */}
              <div className="grid grid-cols-2 gap-px bg-varindo-line border border-varindo-line">
                {materialCategories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="bg-white p-4 hover:bg-varindo-50 transition-colors group"
                  >
                    <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-varindo-ink group-hover:text-varindo-gold transition-colors">
                      {cat.title}
                    </p>
                    <p className="text-[11px] text-varindo-400 mt-1 leading-relaxed">{cat.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom info strip */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10">
          <div className="shell py-4 flex items-center gap-8 overflow-x-auto">
            {['HPL Laminates', 'Authorized Dealer', 'Free Shipping · Java & Bali', 'Professional Supply'].map((item) => (
              <span key={item} className="text-[10px] tracking-[0.2em] uppercase text-white/40 shrink-0">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COLLECTIONS OVERVIEW ─────────────────────────────────── */}
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-varindo-line border border-varindo-line">
            {[
              { href: '/collections/new-collections', label: 'New\nCollections' },
              { href: '/collections/best-sellers', label: 'Best\nSellers' },
              { href: '/collections/promo-items', label: 'Promo\nItems' },
              { href: '/collections/woods', label: 'Woods' },
              { href: '/collections/patterns', label: 'Patterns' },
              { href: '/collections/solids', label: 'Solids' }
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="bg-white hover:bg-varindo-50 transition-colors py-6 px-4 text-center group"
              >
                <div className="w-8 h-[1.5px] bg-varindo-line group-hover:bg-varindo-gold transition-colors mx-auto mb-4" />
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-600 group-hover:text-varindo-ink transition-colors whitespace-pre-line leading-5">
                  {label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEW COLLECTIONS ──────────────────────────────────────── */}
      <section className="border-b border-varindo-line">
        <div className="shell py-14 sm:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="label mb-3">Featured</p>
              <h2 className="display text-varindo-ink text-4xl sm:text-5xl">
                New Collections
              </h2>
              <p className="mt-3 text-[13px] leading-7 text-varindo-500 max-w-lg">
                Fresh Lamitak designs — modern textures and refined finishes for contemporary interior projects.
              </p>
            </div>
            <Link href="/collections/new-collections" className="hidden sm:block text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-500 hover:text-varindo-ink transition-colors shrink-0 ml-6">
              View All →
            </Link>
          </div>

          <ProductGrid products={newCollectionProducts} />

          <div className="mt-6 sm:hidden">
            <Link href="/collections/new-collections" className="btn-ghost w-full justify-center">
              View All →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── BEST SELLERS ─────────────────────────────────────────── */}
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

          <ProductGrid products={bestSellerProducts} />
        </div>
      </section>

      {/* ─── PROMO ────────────────────────────────────────────────── */}
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

      {/* ─── DIGITAL PORTFOLIO CTA ────────────────────────────────── */}
      <section>
        <div className="grid lg:grid-cols-2 min-h-[420px]">
          {/* Text */}
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

          {/* Image */}
          <div
            className="relative min-h-[280px] bg-cover bg-center"
            style={{ backgroundImage: "url('/banner.webp')" }}
            aria-label="Lamitak portfolio"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-varindo-ink/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* ─── WHY VARINDO ──────────────────────────────────────────── */}
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

            <div className="grid sm:grid-cols-2 gap-px bg-varindo-line border border-varindo-line">
              {[
                { title: 'Authorized Dealer', body: 'Direct authorized distribution of Lamitak HPL in Indonesia — genuine products guaranteed.' },
                { title: 'Professional Supply', body: 'Structured processes from quotation to delivery for contractors, designers, and project owners.' },
                { title: 'Responsive Service', body: 'Quick replies via WhatsApp for product enquiries, stock checks, and purchase coordination.' },
                { title: 'Transparent Pricing', body: 'Clear, consistent pricing with no hidden costs. Tax-inclusive pricing visible on every product.' }
              ].map((item) => (
                <div key={item.title} className="bg-white p-6">
                  <div className="w-6 h-[1.5px] bg-varindo-gold mb-4" />
                  <h3 className="text-[13px] font-semibold text-varindo-ink mb-2">{item.title}</h3>
                  <p className="text-[12px] leading-6 text-varindo-500">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
