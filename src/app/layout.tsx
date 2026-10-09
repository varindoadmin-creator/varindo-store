import type { Metadata, Viewport } from 'next';
import { Fraunces, Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { LangProvider } from '@/lib/LangContext';
import { AiChatLoader } from '@/components/AiChatLoader';
import { GoogleTag } from '@/components/GoogleTag';
import { buildOrganizationJsonLd, buildLocalBusinessJsonLd } from '@/lib/structured-data';

// Three faces, each with one job.
//   Fraunces        display headlines — a variable serif whose optical-size
//                   axis keeps the serifs crisp at 48px+ instead of clotting.
//   Instrument Sans UI and body copy.
//   JetBrains Mono  every code, price, dimension and section label. Tabular
//                   figures are what make the spec tables and price columns
//                   line up, which is the whole point of the redesign.
// next/font self-hosts all three out of /_next/static, so the strict
// `font-src 'self' data:` CSP in next.config.mjs needs no Google origins.
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
  variable: '--font-fraunces'
});

const instrument = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument'
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains'
});

export const metadata: Metadata = {
  title: {
    default: 'Varindo — Dealer Resmi HPL Lamitak, Gratis Ongkir Jawa & Bali',
    template: '%s | Varindo'
  },
  description:
    'Varindo, Authorized Dealer Lamitak dengan layanan pelanggan terbaik. Harga yang kompetitif dan gratis ongkir ke seluruh Jawa dan Bali.',
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
    title: 'Varindo — Dealer Resmi HPL Lamitak, Gratis Ongkir Jawa & Bali',
    description:
      'Varindo, Authorized Dealer Lamitak dengan layanan pelanggan terbaik. Harga yang kompetitif dan gratis ongkir ke seluruh Jawa dan Bali.',
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

// Browser and PWA chrome follows the page canvas — warm paper, dark icons.
export const viewport: Viewport = {
  themeColor: '#fbfaf8'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${fraunces.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-varindo-paper font-sans antialiased">
        <GoogleTag />
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
