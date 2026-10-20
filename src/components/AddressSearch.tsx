'use client';

import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';
import type { PlaceDetails, PlaceSuggestion } from '@/lib/googlePlaces';

function newSession() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}

/* Find the address on Google Maps, like a ride-hailing app. Choosing a
   suggestion pins the delivery on the map (what Lalamove needs) and fills in
   city, province and postal code. One session token covers the typing and the
   pick, which Google bills as a single lookup. Hidden entirely when the store
   has no Maps key: the plain address fields still work. */
export function AddressSearch({ onPick, picked }: { onPick: (place: PlaceDetails | null) => void; picked: PlaceDetails | null }) {
  const { lang } = useLang();
  const [available, setAvailable] = useState(true);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const session = useRef(newSession());
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) { setSuggestions([]); return; }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/places/autocomplete?q=${encodeURIComponent(q)}&session=${session.current}`, { signal: controller.signal });
        if (res.status === 503) { setAvailable(false); return; }
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setOpen(true);
      } catch { /* aborted or offline: keep the last list */ }
    }, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open]);

  const choose = async (s: PlaceSuggestion) => {
    setOpen(false);
    setLoading(true);
    try {
      const res = await fetch(`/api/places/details?id=${encodeURIComponent(s.placeId)}&session=${session.current}`);
      if (res.ok) {
        onPick(await res.json());
        setQuery('');
        setSuggestions([]);
      }
    } finally {
      session.current = newSession();
      setLoading(false);
    }
  };

  if (!available) return null;

  if (picked) {
    return (
      <div className="flex items-start justify-between gap-3 rounded-ctl border border-varindo-line bg-varindo-paper px-3.5 py-3">
        <div className="min-w-0">
          <p className="label mb-1">{t('shop', 'mapPinned', lang)}</p>
          <p className="text-[14px] leading-[1.45] text-varindo-ink">{picked.formattedAddress}</p>
        </div>
        <button type="button" onClick={() => onPick(null)} className="shrink-0 text-[13px] text-varindo-link hover:underline">
          {t('shop', 'mapChange', lang)}
        </button>
      </div>
    );
  }

  return (
    <div ref={boxRef} className="relative">
      <span className="label mb-2 block">{t('shop', 'mapSearchLabel', lang)}</span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => suggestions.length && setOpen(true)}
        onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
        placeholder={t('shop', 'mapSearchPlaceholder', lang)}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="address-suggestions"
        autoComplete="off"
        className="field"
      />
      <p className="mt-1.5 text-[12px] text-varindo-mid">
        {loading ? '…' : t('shop', 'mapSearchHint', lang)}
      </p>
      {open && suggestions.length > 0 && (
        <ul id="address-suggestions" role="listbox" className="absolute left-0 right-0 top-[72px] z-40 overflow-hidden rounded-ctl border border-varindo-line bg-varindo-paper shadow-[0_8px_24px_rgba(23,21,15,0.08)]">
          {suggestions.map((s) => (
            <li key={s.placeId} role="option" aria-selected={false}>
              <button type="button" onClick={() => choose(s)} className="block w-full px-3.5 py-2.5 text-left transition-colors hover:bg-varindo-canvas">
                <span className="block text-[14px] text-varindo-ink">{s.main}</span>
                {s.secondary && <span className="block text-[12px] text-varindo-mid">{s.secondary}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
