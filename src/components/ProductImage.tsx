'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

export function ProductImage({ src, alt, priority = false, imageUrls = [] }: {
  src: string; alt: string; priority?: boolean; imageUrls?: string[];
}) {
  const { lang } = useLang();
  const candidates = useMemo(() => Array.from(new Set([src, ...imageUrls].filter(Boolean))), [src, imageUrls]);
  const [index, setIndex] = useState(0);
  const currentSrc = candidates[index];

  if (!currentSrc || index >= candidates.length) {
    return (
      <div className="flex h-full min-h-[220px] w-full flex-col items-center justify-center bg-varindo-50 p-8 text-center gap-2">
        <div className="w-12 h-12 bg-varindo-line/60 mb-2" />
        <p className="text-[11px] tracking-[0.14em] uppercase text-varindo-400">
          {t('imagePlaceholder', 'label', lang)}
        </p>
      </div>
    );
  }

  return (
    <Image key={currentSrc} src={currentSrc} alt={alt} fill priority={priority}
      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 480px) 50vw, 100vw"
      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      onError={() => setIndex((i) => i + 1)} />
  );
}
