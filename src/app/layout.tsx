import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { LangProvider } from '@/lib/LangContext';
import { AiChatLoader } from '@/components/AiChatLoader';
import { buildOrganizationJsonLd, buildLocalBusinessJsonLd } from '@/lib/structured-data';

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
    default: 'Dealer Resmi HPL Lamitak Indonesia - Katalog & Harga 800 Produk | Varindo',
    template: '%s | Varindo'
  },
  description:
    'Dealer resmi Lamitak di Indonesia. 800 produk, harga transparan termasuk PPN, sampel gratis, gudang Tangerang & Bandung. Cek katalog & harga sekarang.',
  metadataBase: new URL('https://varindo.co.id'),
  openGraph: {
    title: 'Dealer Resmi HPL Lamitak Indonesia - Katalog & Harga 800 Produk | Varindo',
    description:
      'Dealer resmi Lamitak di Indonesia. 800 produk, harga transparan termasuk PPN, sampel gratis, gudang Tangerang & Bandung. Cek katalog & harga sekarang.',
    url: 'https://varindo.co.id',
    siteName: 'Varindo',
    locale: 'id_ID',
    type: 'website'
  },
  verification: {
    google: '3OQ2o384S0-hyZZ7oCS2BI-aOb5Q3c6HSD8g4U-vDtk'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <JsonLd data={buildOrganizationJsonLd()} />
        <JsonLd data={buildLocalBusinessJsonLd()} />
        <LangProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <AiChatLoader />
        </LangProvider>
      </body>
    </html>
  );
}
