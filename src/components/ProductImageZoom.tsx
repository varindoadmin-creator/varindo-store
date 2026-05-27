'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

export function ProductImageZoom({
  src,
  alt,
  imageUrls = []
}: {
  src: string;
  alt: string;
  imageUrls?: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  const candidates = useMemo(() => {
    return Array.from(new Set([src, ...imageUrls].filter(Boolean)));
  }, [src, imageUrls]);

  const [index, setIndex] = useState(0);
  const currentSrc = candidates[index];

  if (!currentSrc || index >= candidates.length) {
    return (
      <div className="flex aspect-[4/3] w-full flex-col items-center justify-center border border-varindo-line bg-varindo-50 p-8 text-center gap-3">
        <div className="w-16 h-16 bg-varindo-line/60" />
        <p className="text-[11px] tracking-[0.16em] uppercase text-varindo-400">Image coming soon</p>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative aspect-[4/3] w-full overflow-hidden border border-varindo-line bg-varindo-50 text-left"
        aria-label="Click to zoom image"
      >
        <Image
          key={currentSrc}
          src={currentSrc}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 48vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          onError={() => setIndex((i) => i + 1)}
        />
        <span className="absolute bottom-4 right-4 bg-white/90 border border-varindo-line px-3 py-1.5 text-[10px] font-medium tracking-[0.16em] uppercase text-varindo-ink backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Zoom
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-varindo-ink/80 p-4 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-5xl bg-white p-3 shadow-luxury"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-2 py-2 mb-2">
              <p className="text-[11px] tracking-[0.16em] uppercase text-varindo-500 line-clamp-1">{alt}</p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center border border-varindo-line text-varindo-ink hover:bg-varindo-50 transition-colors"
                aria-label="Close image zoom"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-varindo-50">
              <Image src={currentSrc} alt={alt} fill sizes="100vw" className="object-contain" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-2 py-2 mt-2">
              <p className="text-[11px] text-varindo-400">
                Actual colours may vary from digital display.
              </p>
              <a
                href={currentSrc}
                download
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-medium tracking-[0.12em] uppercase text-varindo-ink hover:text-varindo-gold transition-colors"
              >
                Download →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
