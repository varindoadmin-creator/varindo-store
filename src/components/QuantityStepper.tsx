'use client';

import { useEffect, useState } from 'react';
import { MAX_CART_QTY } from '@/lib/CartContext';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

/* Minus, a typed number, plus. The field keeps whatever is typed while it has
   focus, so a buyer can clear it and type "12"; it settles to a valid
   quantity on blur. */
export function QuantityStepper({ value, onChange, size = 'md' }: { value: number; onChange: (n: number) => void; size?: 'sm' | 'md' }) {
  const { lang } = useLang();
  const [draft, setDraft] = useState(String(value));
  useEffect(() => { setDraft(String(value)); }, [value]);

  const set = (n: number) => onChange(Math.min(MAX_CART_QTY, Math.max(1, Math.floor(n) || 1)));
  const h = size === 'sm' ? 'h-9' : 'h-11';
  const btn = `flex ${h} w-9 items-center justify-center text-varindo-deep transition-colors hover:text-varindo-ink disabled:opacity-30`;

  return (
    <div className={`inline-flex ${h} items-stretch overflow-hidden rounded-ctl border border-varindo-line bg-varindo-paper`}>
      <button type="button" onClick={() => set(value - 1)} disabled={value <= 1} aria-label={t('shop', 'decrease', lang)} className={btn}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </button>
      <input
        type="number" inputMode="numeric" min={1} max={MAX_CART_QTY} step={1}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => { set(Number(draft)); setDraft(String(Math.min(MAX_CART_QTY, Math.max(1, Math.floor(Number(draft)) || 1)))); }}
        aria-label={t('shop', 'quantity', lang)}
        className="mono w-12 border-x border-varindo-line bg-transparent text-center text-[14px] text-varindo-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button type="button" onClick={() => set(value + 1)} disabled={value >= MAX_CART_QTY} aria-label={t('shop', 'increase', lang)} className={btn}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </button>
    </div>
  );
}
