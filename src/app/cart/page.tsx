import type { Metadata } from 'next';
import { CartPageClient } from './CartPageClient';

export const metadata: Metadata = {
  title: 'Keranjang',
  robots: { index: false }
};

export default function Page() {
  return <CartPageClient />;
}
