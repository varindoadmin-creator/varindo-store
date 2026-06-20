import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LangProvider } from '@/lib/LangContext';
import { AiChat } from '@/components/AiChat';

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
    default: 'Varindo — Katalog HPL Lamitak',
    template: '%s | Varindo'
  },
  description:
    'Jelajahi produk HPL Lamitak dari Varindo, dealer resmi di Indonesia. Cari kode produk, lihat harga, dan hubungi kami via WhatsApp.',
  metadataBase: new URL('https://varindo.co.id'),
  openGraph: {
    title: 'Varindo — Katalog HPL Lamitak',
    description: 'Jelajahi produk HPL Lamitak dari Varindo di Indonesia.',
    url: 'https://varindo.co.id',
    siteName: 'Varindo',
    locale: 'id_ID',
    type: 'website'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <LangProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <AiChat />
        </LangProvider>
      </body>
    </html>
  );
}
