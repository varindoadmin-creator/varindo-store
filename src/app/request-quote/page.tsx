import { getPublicProducts } from '@/lib/products';
import { RequestQuotePage } from './RequestQuotePageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 600;

export default async function Page() {
  const products = await getPublicProducts();
  const productOptions = products.map((p) => ({
    code:       p.code       ?? '',
    name:       p.name       ?? '',
    design:     p.design     ?? '',
    collection: p.collection ?? '',
  }));
  return <RequestQuotePage products={productOptions} />;
}
