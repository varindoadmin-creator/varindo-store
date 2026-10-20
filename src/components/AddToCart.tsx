'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Product } from '@/types/product';
import { useCart } from '@/lib/CartContext';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';
import { QuantityStepper } from './QuantityStepper';

export function AddToCart({ product }: { product: Product }) {
  const { lang } = useLang();
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 4000);
    return () => clearTimeout(timer);
  }, [added]);

  // A product with no price yet can only be enquired about.
  if (typeof product.price !== 'number') return null;

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper value={quantity} onChange={setQuantity} />
        <button
          type="button"
          onClick={() => { add(product, quantity); setAdded(true); setQuantity(1); }}
          className="btn-blue flex-1 justify-center sm:flex-none sm:min-w-[200px]"
        >
          {t('shop', 'addToCart', lang)}
        </button>
      </div>
      <p className="mt-2 min-h-[20px] text-[13px]" role="status" aria-live="polite">
        {added && (
          <span className="text-varindo-deep">
            {t('shop', 'added', lang)} ·{' '}
            <Link href="/cart" className="font-medium text-varindo-link hover:underline">{t('shop', 'viewCart', lang)} →</Link>
          </span>
        )}
      </p>
    </div>
  );
}
