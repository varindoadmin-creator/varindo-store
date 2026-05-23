export type ProductBrand = 'LAMITAK';
export type ProductBadge = 'NEW' | 'BESTSELLER';

export type Product = {
  slug: string;
  code: string;
  name: string;
  brand: ProductBrand;
  collection?: string;
  category?: string;
  design?: string;
  finish?: string;
  size?: string;
  thickness?: string;
  colorFamily?: string;
  /** Price shown publicly on website, including PPN. */
  price?: number | null;
  /** Zoho Books item rate, excluding PPN. Kept internally for future admin logic only. */
  priceExcludingTax?: number | null;
  taxIncluded?: boolean;
  currency: 'IDR';
  active: boolean;
  imageUrl?: string;
  description?: string;
  badges?: ProductBadge[];
};
