import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope'
});

export const metadata: Metadata = {
  title: {
    default: 'Varindo Online Catalog | Lamitak Indonesia',
    template: '%s | Varindo'
  },
  description:
    'Browse Lamitak HPL products from Varindo, an authorized dealer in Indonesia. Search product codes, view prices, and enquire by WhatsApp.',
  metadataBase: new URL('https://varindo.co.id'),
  openGraph: {
    title: 'Varindo Online Catalog',
    description: 'Browse Lamitak HPL products from Varindo in Indonesia.',
    url: 'https://varindo.co.id',
    siteName: 'Varindo',
    locale: 'en_ID',
    type: 'website'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="min-h-screen font-sans antialiased" className={manrope.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
