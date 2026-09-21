import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PRICE_LIST_COOKIE, verifyPriceListToken } from '@/lib/priceListToken';
import { PriceListDownloadPage } from './PriceListDownloadPageClient';

export const dynamic = 'force-dynamic';

// Reached only by submitting the form, and only for as long as the token
// lasts, so there is nothing here for a search engine to keep.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function Page() {
  // Checked here as well as in /api/price-list, not instead of it: this decides
  // which page the customer sees, while the route is what actually withholds
  // the file. A page that offered a button the download would refuse would be
  // the worse of the two failures.
  const granted = verifyPriceListToken((await cookies()).get(PRICE_LIST_COOKIE)?.value);
  return <PriceListDownloadPage granted={granted} />;
}
