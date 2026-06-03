import {
  getBestSellerProducts,
  getNewCollectionProducts,
  getPromoItemProducts,
  getPublicProducts
} from '@/lib/products';
import { HomeClient } from './HomeClient';

export const revalidate = 600;

export default async function HomePage() {
  const [allProducts, newProducts, bestSellers, promoProducts] = await Promise.all([
    getPublicProducts(),
    getNewCollectionProducts(),
    getBestSellerProducts(),
    getPromoItemProducts()
  ]);

  return (
    <HomeClient
      allCount={allProducts.length}
      newProducts={newProducts.slice(0, 8)}
      bestSellers={bestSellers.slice(0, 8)}
      promoProducts={promoProducts.slice(0, 4)}
    />
  );
}
