'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

export function ProductImageZoom({ src, alt, imageUrls = [] }: {
  src: string; alt: string; imageUrls?: string[];
}) {
  const { lang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const candidates = useMemo(() => Array.from(new Set([src, ...imageUrls].filter(Boolean))), [src, imageUrls]);
  const [index, setIndex] = useState(0);
  const currentSrc = candidates[index];

  if (!currentSrc || index >= candidates.length) {
    return (
      <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-card bg-varindo-canvas p-8 text-center">
        <div className="h-16 w-16 rounded-xl2 bg-varindo-line/60" />
        <p className="text-[12px] tracking-[-0.016em] text-varindo-400">
          {t('imagePlaceholder', 'label', lang)}
        </p>
      </div>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}
        className="group relative aspect-[4/3] w-full overflow-hidden rounded-card bg-varindo-canvas text-left"
        aria-label={t('imageZoom', 'zoomLabel', lang)}>
        <Image key={currentSrc} src={currentSrc} alt={alt} fill priority
          sizes="(min-width: 1024px) 48vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          onError={() => setIndex((i) => i + 1)} />
        <span className="absolute bottom-4 right-4 rounded-pill bg-white/90 px-4 py-1.5 text-[14px] tracking-[-0.016em] text-varindo-ink opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          {t('imageZoom', 'zoomLabel', lang)}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-varindo-ink/80 p-4 backdrop-blur-sm animate-fade-in"
          role="dialog" aria-modal="true" onClick={() => setIsOpen(false)}>
          <div className="w-full max-w-5xl rounded-card bg-white p-5 shadow-luxury" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-2 py-2 mb-2">
              <p className="line-clamp-1 text-[14px] tracking-[-0.016em] text-varindo-mid">{alt}</p>
              <button type="button" onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-pill bg-varindo-canvas text-varindo-ink transition-colors hover:bg-varindo-wash"
                aria-label={t('imageZoom', 'closeLabel', lang)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl2 bg-varindo-canvas">
              <Image src={currentSrc} alt={alt} fill sizes="100vw" className="object-contain" />
            </div>
            <div className="flex items-center justify-between px-2 py-2 mt-2">
              <p className="text-[12px] text-varindo-mid">{t('imageZoom', 'colourNote', lang)}</p>
              <a href={currentSrc} download target="_blank" rel="noreferrer"
                className="link-quiet text-[14px] tracking-[-0.016em]">
                {t('imageZoom', 'download', lang)}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
