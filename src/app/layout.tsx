import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant'
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans'
});

export const metadata: Metadata = {
  title: {
    default: 'Varindo — Lamitak HPL Catalog',
    template: '%s | Varindo'
  },
  description:
    'Browse Lamitak HPL products from Varindo, an authorized dealer in Indonesia. Search product codes, view prices, and enquire by WhatsApp.',
  metadataBase: new URL('https://varindo.co.id'),
  openGraph: {
    title: 'Varindo — Lamitak HPL Catalog',
    description: 'Browse Lamitak HPL products from Varindo in Indonesia.',
    url: 'https://varindo.co.id',
    siteName: 'Varindo',
    locale: 'en_ID',
    type: 'website'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
