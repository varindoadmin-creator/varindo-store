import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/products';

export const revalidate = 600;

export async function GET() {
  const products = await getAllProducts();

  return NextResponse.json({
    success: true,
    count: products.length,
    products
  });
}
