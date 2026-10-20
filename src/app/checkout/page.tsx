import type { Metadata } from 'next';
import { CheckoutPageClient } from './CheckoutPageClient';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false }
};

export default function Page() {
  return <CheckoutPageClient />;
}
