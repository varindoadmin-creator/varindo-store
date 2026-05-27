import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-varindo-ink text-varindo-200">

      {/* Main footer grid */}
      <div className="shell pt-14 pb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">

        {/* Brand column */}
        <div>
          <img
            src="/varindo-logo-transparent.png"
            alt="Varindo"
            style={{ width: '80px', filter: 'brightness(0) invert(1)' }}
            className="h-auto object-contain opacity-80 mb-6"
          />
          <p className="text-[13px] leading-7 text-varindo-400 max-w-xs">
            Authorized dealer of Lamitak High Pressure Laminates in Indonesia. Professional supply for interior designers, architects, and contractors.
          </p>
          <div className="mt-6 flex gap-4">
          </div>
        </div>

        {/* Catalog */}
        <div>
          <p className="label text-varindo-500 mb-5">Catalog</p>
          <ul className="space-y-3">
            {[
              { href: '/collections/new-arrivals', label: 'New Arrivals' },
              { href: '/collections/best-sellers', label: 'Best Sellers' },
              { href: '/collections/promo-items', label: 'Promo Items' },
              { href: '/collections/woods', label: 'Woods' },
              { href: '/collections/patterns', label: 'Patterns' },
              { href: '/collections/solids', label: 'Solids' }
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-[13px] text-varindo-400 hover:text-white transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="label text-varindo-500 mb-5">Company</p>
          <ul className="space-y-3">
            {[
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Contact' },
              { href: '/request-catalog', label: 'Request Catalog' },
              { href: '/request-sample', label: 'Request Sample' }
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-[13px] text-varindo-400 hover:text-white transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="label text-varindo-500 mb-5">Contact</p>
          <address className="not-italic space-y-3">
            <p className="text-[13px] text-varindo-400">
              <span className="block text-varindo-500 text-[10px] tracking-[0.16em] uppercase mb-1">Phone</span>
              0812 8888 5224<br />0812 1001 5224
            </p>
            <p className="text-[13px] text-varindo-400">
              <span className="block text-varindo-500 text-[10px] tracking-[0.16em] uppercase mb-1">Email</span>
              contact@varindo.co.id
            </p>
          </address>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.07]">
        <div className="shell py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-[11px] text-varindo-600">
            © {new Date().getFullYear()} CV. Varindo Forma Hutama. All rights reserved.
          </p>
          <p className="text-[11px] text-varindo-700">
            Authorized Lamitak Dealer · Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
