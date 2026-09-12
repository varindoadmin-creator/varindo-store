'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

export type ProductOption = { code: string; name: string; design?: string; collection?: string };

type Props = {
  products: ProductOption[];
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  inputClassName?: string;
};

const MAX_RESULTS = 8;

function normalize(s: string) { return s.toLowerCase().replace(/[\s\-_]+/g, ''); }

function score(p: ProductOption, q: string) {
  const nq = normalize(q), nc = normalize(p.code), nd = normalize(p.design || ''), nn = normalize(p.name);
  if (nc.startsWith(nq)) return 3;
  if (nc.includes(nq)) return 2;
  if (nd.startsWith(nq)) return 1.5;
  if (nd.includes(nq) || nn.includes(nq)) return 1;
  return 0;
}

export function ProductCodeInput({ products, value, onChange, placeholder, inputClassName }: Props) {
  const { lang } = useLang();
  const [query, setQuery]   = useState('');
  const [open, setOpen]     = useState(false);
  const [cursor, setCursor] = useState(0);
  const listRef      = useRef<HTMLUListElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return products
      .map((p) => ({ p, s: score(p, q) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s || a.p.code.localeCompare(b.p.code))
      .slice(0, MAX_RESULTS)
      .map(({ p }) => p);
  }, [products, query]);

  useEffect(() => { setCursor(0); }, [results]);
  useEffect(() => {
    const el = listRef.current?.children[cursor] as HTMLLIElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function commit(p: ProductOption) { onChange(p.code); setQuery(''); setOpen(false); }
  function clear() { onChange(''); setQuery(''); setTimeout(() => inputRef.current?.focus(), 0); }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) { if (e.key === 'Escape') { setOpen(false); setQuery(''); } return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); commit(results[cursor]); }
    else if (e.key === 'Escape') { setOpen(false); setQuery(''); }
    else if (e.key === 'Tab') setOpen(false);
  }

  if (value) {
    return (
      <div className={`flex items-center gap-2 h-10 px-3 bg-varindo-50 ${inputClassName ?? ''}`}>
        <span className="text-[14px] font-semibold text-varindo-ink truncate flex-1">{value}</span>
        <button type="button" onClick={clear} aria-label="Hapus"
          className="shrink-0 w-5 h-5 flex items-center justify-center text-varindo-mid hover:text-varindo-ink transition-colors">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    );
  }

  const ph = placeholder ?? t('autocomplete', 'placeholder', lang);

  return (
    <div ref={containerRef} className="relative w-full">
      <input ref={inputRef} type="text" value={query} autoComplete="off" spellCheck={false}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => { if (query) setOpen(true); }}
        onKeyDown={handleKeyDown}
        placeholder={ph}
        className={`w-full h-10 px-3 text-[14px] text-varindo-ink bg-transparent outline-none placeholder:text-varindo-mid ${inputClassName ?? ''}`}
      />

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl2 bg-white shadow-luxury">
          <ul ref={listRef} role="listbox" className="max-h-[260px] overflow-y-auto divide-y divide-varindo-line/40">
            {results.map((p, i) => (
              <li key={p.code} role="option" aria-selected={i === cursor}
                onMouseDown={(e) => { e.preventDefault(); commit(p); }}
                onMouseEnter={() => setCursor(i)}
                className={`flex items-baseline gap-3 px-4 py-2.5 cursor-pointer transition-colors ${i === cursor ? 'bg-varindo-canvas' : 'hover:bg-varindo-canvas/60'}`}>
                <span className="text-[14px] font-semibold text-varindo-ink shrink-0">{p.code}</span>
                <span className="text-[12px] text-varindo-mid truncate">{p.design || p.name}</span>
                {p.collection && (
                  <span className="ml-auto text-[12px] tracking-[-0.016em] text-varindo-mid shrink-0">{p.collection}</span>
                )}
              </li>
            ))}
          </ul>
          <div className="px-4 py-2 border-t border-varindo-line/40 bg-varindo-canvas">
            <p className="text-[12px] text-varindo-mid">
              {t('autocomplete', 'hint', lang, { n: results.length, s: results.length !== 1 ? 's' : '' })}
            </p>
          </div>
        </div>
      )}

      {open && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl2 bg-white shadow-luxury px-4 py-3">
          <p className="text-[14px] text-varindo-mid">
            {t('autocomplete', 'noResults', lang)} <span className="font-medium text-varindo-ink">"{query}"</span>
          </p>
          <p className="text-[12px] text-varindo-mid mt-0.5">{t('autocomplete', 'noResultsHint', lang)}</p>
        </div>
      )}
    </div>
  );
}
