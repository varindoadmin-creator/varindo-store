'use client';

import { useEffect, useId, useRef, useState, useCallback, KeyboardEvent } from 'react';
import { lamitakProductsFromCsv } from '@/data/lamitak-products-from-csv';

// Build a lean search index once at module level — code + design, deduped by code
type Entry = { code: string; design: string; display: string };

const INDEX: Entry[] = (() => {
  const seen = new Set<string>();
  const entries: Entry[] = [];
  for (const p of lamitakProductsFromCsv) {
    if (!p.code || seen.has(p.code)) continue;
    seen.add(p.code);
    const design = p.design || '';
    entries.push({
      code: p.code,
      design,
      display: design ? `${p.code} — ${design}` : p.code
    });
  }
  // Sort by code
  entries.sort((a, b) => a.code.localeCompare(b.code));
  return entries;
})();

const MAX_RESULTS = 20;

function search(query: string): Entry[] {
  if (query.length < 2) return [];
  const q = query.toLowerCase().replace(/\s+/g, '');
  return INDEX.filter((e) => {
    const code   = e.code.toLowerCase().replace(/\s+/g, '');
    const design = e.design.toLowerCase();
    return code.includes(q) || design.includes(q.replace(/-/g, ' '));
  }).slice(0, MAX_RESULTS);
}

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rowIndex?: number; // for aria labels
};

export function ProductCodeCombobox({ value, onChange, placeholder, rowIndex }: Props) {
  const id = useId();
  const listboxId = `${id}-listbox`;
  const [inputValue, setInputValue] = useState(value);
  const [results, setResults]       = useState<Entry[]>([]);
  const [open, setOpen]             = useState(false);
  const [activeIdx, setActiveIdx]   = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);
  const listRef      = useRef<HTMLUListElement>(null);

  // Sync external value changes (e.g. clear form)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInput = useCallback((raw: string) => {
    setInputValue(raw);
    onChange(raw);              // propagate free-text too
    const matches = search(raw);
    setResults(matches);
    setOpen(matches.length > 0);
    setActiveIdx(-1);
  }, [onChange]);

  const select = useCallback((entry: Entry) => {
    setInputValue(entry.code);
    onChange(entry.code);
    setOpen(false);
    setResults([]);
    setActiveIdx(-1);
  }, [onChange]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      select(results[activeIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const item = listRef.current.children[activeIdx] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIdx]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const label = rowIndex !== undefined ? `Product code row ${rowIndex + 1}` : 'Product code';

  return (
    <div ref={containerRef} className="relative flex-1">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => handleInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (inputValue.length >= 2) {
            const matches = search(inputValue);
            setResults(matches);
            setOpen(matches.length > 0);
          }
        }}
        placeholder={placeholder}
        aria-label={label}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={activeIdx >= 0 ? `${id}-option-${activeIdx}` : undefined}
        autoComplete="off"
        spellCheck={false}
        className="w-full h-10 px-4 text-[13px] text-varindo-ink bg-transparent outline-none placeholder:text-varindo-300 focus:bg-varindo-50 transition-colors"
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 border border-varindo-line bg-white shadow-luxury">
          <ul
            id={listboxId}
            ref={listRef}
            role="listbox"
            className="max-h-56 overflow-y-auto divide-y divide-varindo-line/40"
          >
            {results.map((entry, i) => {
              const isActive = i === activeIdx;
              // Highlight matched portion
              return (
                <li
                  key={entry.code}
                  id={`${id}-option-${i}`}
                  role="option"
                  aria-selected={isActive}
                  onMouseDown={(e) => { e.preventDefault(); select(entry); }}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={`flex items-baseline gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                    isActive ? 'bg-varindo-50' : 'hover:bg-varindo-50/60'
                  }`}
                >
                  <span className="text-[12px] font-semibold text-varindo-ink shrink-0">{entry.code}</span>
                  {entry.design && (
                    <span className="text-[11px] text-varindo-500 truncate">{entry.design}</span>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="px-4 py-2 border-t border-varindo-line/40 bg-varindo-50/50">
            <p className="text-[10px] text-varindo-400 tracking-[0.12em]">
              {results.length === MAX_RESULTS ? `Showing top ${MAX_RESULTS} results` : `${results.length} result${results.length !== 1 ? 's' : ''}`}
              {' · '}Type to narrow
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
