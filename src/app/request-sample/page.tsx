import { getPublicProducts } from '@/lib/products';
import { RequestSamplePage } from './RequestSamplePageClient';

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
  return <RequestSamplePage products={productOptions} />;
}
