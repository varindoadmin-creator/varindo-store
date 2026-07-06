import type { Metadata } from 'next';
import { getBestSellerProducts } from '@/lib/products';
import { SITE_URL } from '@/lib/seo';
import { CITY_CONTENT } from '@/lib/cityContent';
import { CityLandingPage } from '@/components/CityLandingPage';

const content = CITY_CONTENT.surabaya;

export const revalidate = 600;

export const metadata: Metadata = {
  title: { absolute: `Jual HPL Lamitak ${content.cityName} - Kirim Cepat, Stok Ready | Varindo` },
  description: `Dealer resmi HPL Lamitak melayani pengiriman untuk wilayah ${content.cityName}. 800+ motif, harga transparan termasuk PPN, order dan konsultasi via WhatsApp.`,
  alternates: { canonical: `${SITE_URL}/lamitak-${content.slug}` },
  openGraph: {
    title: `Jual HPL Lamitak ${content.cityName} - Kirim Cepat, Stok Ready | Varindo`,
    description: `Dealer resmi HPL Lamitak melayani pengiriman untuk wilayah ${content.cityName}. 800+ motif, harga transparan termasuk PPN, order dan konsultasi via WhatsApp.`,
    url: `${SITE_URL}/lamitak-${content.slug}`,
    type: 'website'
  }
};

export default async function LamitakSurabayaPage() {
  const bestSellers = (await getBestSellerProducts()).slice(0, 8);
  return <CityLandingPage content={content} bestSellers={bestSellers} />;
}
