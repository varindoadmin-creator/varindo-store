'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '@/types/product';

const STORAGE_KEY = 'varindo-cart';
export const MAX_CART_QTY = 500;

/**
 * A cart line keeps what the cart page needs to draw itself without fetching
 * the catalogue. Its price is for display only: checkout prices every line
 * again on the server.
 */
export type CartItem = {
  slug: string;
  code: string;
  name: string;
  size?: string;
  imageUrl?: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  /** False until the saved cart has been read, so pages don't flash "empty". */
  ready: boolean;
  count: number;
  subtotal: number;
  add: (product: Product, quantity: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType>({
  items: [],
  ready: false,
  count: 0,
  subtotal: 0,
  add: () => {},
  setQuantity: () => {},
  remove: () => {},
  clear: () => {}
});

function clampQty(quantity: number) {
  return Math.min(MAX_CART_QTY, Math.max(1, Math.floor(quantity) || 1));
}

function readCart(): CartItem[] {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(stored)
      ? stored.filter((i): i is CartItem => typeof i?.slug === 'string' && typeof i?.price === 'number' && i.quantity > 0)
      : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setReady(true);
    // Another tab changed the cart.
    const sync = (e: StorageEvent) => { if (e.key === STORAGE_KEY) setItems(readCart()); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const update = useCallback((fn: (prev: CartItem[]) => CartItem[]) => {
    setItems((prev) => {
      const next = fn(prev);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* private mode: cart lasts the visit */ }
      return next;
    });
  }, []);

  const add = useCallback((product: Product, quantity: number) => {
    if (typeof product.price !== 'number') return;
    update((prev) => {
      const existing = prev.find((i) => i.slug === product.slug);
      if (existing) {
        return prev.map((i) => i.slug === product.slug ? { ...i, price: product.price as number, quantity: clampQty(i.quantity + quantity) } : i);
      }
      return [...prev, {
        slug: product.slug,
        code: product.code,
        name: product.name,
        size: product.size,
        imageUrl: product.imageUrl,
        price: product.price as number,
        quantity: clampQty(quantity)
      }];
    });
  }, [update]);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    update((prev) => prev.map((i) => i.slug === slug ? { ...i, quantity: clampQty(quantity) } : i));
  }, [update]);

  const remove = useCallback((slug: string) => {
    update((prev) => prev.filter((i) => i.slug !== slug));
  }, [update]);

  const clear = useCallback(() => update(() => []), [update]);

  const value = useMemo(() => ({
    items,
    ready,
    count: items.reduce((n, i) => n + i.quantity, 0),
    subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    add,
    setQuantity,
    remove,
    clear
  }), [items, ready, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
