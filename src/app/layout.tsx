import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { LangProvider } from '@/lib/LangContext';
import { AiChatLoader } from '@/components/AiChatLoader';
import { GoogleAdsTag } from '@/components/GoogleAdsTag';
import { buildOrganizationJsonLd, buildLocalBusinessJsonLd } from '@/lib/structured-data';

// SF Pro is used where it exists (Apple hardware); Inter is the stand-in
// everywhere else so the type keeps the same proportions and tracking.
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: {
    default: 'Dealer Resmi HPL Lamitak Indonesia - Katalog & Harga 800 Produk | Varindo',
    template: '%s | Varindo'
  },
  description:
    'Dealer resmi Lamitak di Indonesia. 800 produk, harga transparan termasuk PPN, sampel gratis, gudang Tangerang & Bandung. Cek katalog & harga sekarang.',
  metadataBase: new URL('https://varindo.co.id'),
  manifest: '/manifest.webmanifest',
  applicationName: 'Varindo Lamitak',
  appleWebApp: {
    capable: true,
    title: 'Varindo Lamitak',
    // 'default' keeps dark status bar text; 'black-translucent' would draw it
    // white over the site's white canvas.
    statusBarStyle: 'default'
  },
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
  },
  icons: {
    icon: [
      { url: '/icons/varindo-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/varindo-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: '/icons/varindo-192.png'
  }
};

// Browser and PWA chrome follows the page canvas — white bar, dark icons.
export const viewport: Viewport = {
  themeColor: '#ffffff'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans antialiased">
        <GoogleAdsTag />
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
