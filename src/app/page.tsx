import {
  getBestSellerProducts,
  getNewCollectionProducts
} from '@/lib/products';
import { HomeClient } from './HomeClient';

export const revalidate = 600;

export default async function HomePage() {
  const [newProducts, bestSellers] = await Promise.all([
    getNewCollectionProducts(),
    getBestSellerProducts()
  ]);

  return (
    <HomeClient
      newProducts={newProducts.slice(0, 8)}
      bestSellers={bestSellers.slice(0, 8)}
    />
  );
}
