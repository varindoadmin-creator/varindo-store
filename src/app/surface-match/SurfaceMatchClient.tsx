'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { ProductImage } from '@/components/ProductImage';
import { useLang } from '@/lib/LangContext';
import { t, type Lang } from '@/lib/i18n';
import type { SurfaceMatch, SurfaceMatchGroup, SurfaceMatchResponse } from '@/types/surfaceMatch';

type Phase = 'idle' | 'searching' | 'results' | 'error';

// Phone photos run 4–8MB. Shrinking before upload keeps the request quick on
// mobile data; the server normalises to a smaller size regardless.
const UPLOAD_MAX_EDGE = 2000;

const ERROR_KEYS: Record<number, string> = {
  413: 'errorTooLarge',
  415: 'errorUnsupported',
  429: 'errorRateLimited',
  503: 'errorUnavailable',
};

async function prepareImage(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const scale = Math.min(1, UPLOAD_MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext('2d');
    if (!context) return file;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.88));
    return blob ?? file;
  } catch {
    // Formats this browser can't decode (HEIC on most Android browsers) go up
    // as they are and the server decides.
    return file;
  }
}

export function SurfaceMatchClient() {
  const { lang } = useLang();
  const [phase, setPhase] = useState<Phase>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<SurfaceMatchResponse | null>(null);
  const [errorKey, setErrorKey] = useState('errorGeneric');

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const search = useCallback(async (file: File) => {
    if (file.type && !file.type.startsWith('image/')) {
      setErrorKey('errorUnsupported');
      setPhase('error');
      return;
    }

    setPreview(URL.createObjectURL(file));
    setResult(null);
    setPhase('searching');

    try {
      const body = new FormData();
      body.append('file', await prepareImage(file), 'photo.jpg');
      const res = await fetch('/api/surface-match', { method: 'POST', body });

      if (!res.ok) {
        setErrorKey(ERROR_KEYS[res.status] || 'errorGeneric');
        setPhase('error');
        return;
      }

      setResult(await res.json());
      setPhase('results');
    } catch {
      setErrorKey('errorGeneric');
      setPhase('error');
    }
  }, []);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) search(file);
  };

  const reset = () => {
    setPhase('idle');
    setPreview(null);
    setResult(null);
  };

  const totalMatches = result?.groups.reduce((sum, group) => sum + group.matches.length, 0) ?? 0;
  const hasVisualMatches = result?.groups.some((group) => group.matches.some((match) => match.matchType === 'visual')) ?? false;

  return (
    <div>
      <div className="bg-white">
        <div className="shell py-14 sm:py-20">
          <p className="label mb-4">{t('surfaceMatch', 'heroLabel', lang)}</p>
          <h1 className="display text-varindo-ink text-[40px] sm:text-[56px] lg:text-[80px]">
            {t('surfaceMatch', 'heroTitle', lang)}
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-7 text-varindo-mid">
            {t('surfaceMatch', 'heroSub', lang)}
          </p>

          {phase === 'idle' && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <label className="btn-blue cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-varindo-accent">
                {t('surfaceMatch', 'takePhoto', lang)}
                <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={onFileChange} />
              </label>
              <label className="btn-ghost cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-varindo-accent">
                {t('surfaceMatch', 'chooseGallery', lang)}
                <input type="file" accept="image/*" className="sr-only" onChange={onFileChange} />
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="shell py-12 sm:py-16">
        {phase === 'idle' && <HowItWorks lang={lang} />}

        {phase !== 'idle' && (
          <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              {preview && (
                <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-varindo-canvas">
                  <Image src={preview} alt={t('surfaceMatch', 'yourPhoto', lang)} fill unoptimized className="object-cover" />
                </div>
              )}
              {phase !== 'searching' && (
                <button type="button" onClick={reset} className="btn-soft mt-4 w-full">
                  {t('surfaceMatch', 'newSearch', lang)}
                </button>
              )}
            </div>

            <div aria-live="polite">
              {phase === 'searching' && (
                <div className="flex items-start gap-4 py-2">
                  <div className="mt-1 h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-varindo-line border-t-varindo-ink" />
                  <div>
                    <p className="section-title text-[24px] sm:text-[24px]">{t('surfaceMatch', 'searching', lang)}</p>
                    <p className="copy mt-1">{t('surfaceMatch', 'searchingSub', lang)}</p>
                  </div>
                </div>
              )}

              {phase === 'error' && (
                <div className="rounded-card bg-varindo-canvas p-7">
                  <p className="section-title text-[24px] sm:text-[24px]">{t(`surfaceMatch`, errorKey, lang)}</p>
                </div>
              )}

              {phase === 'results' && result && totalMatches === 0 && (
                <div className="rounded-card bg-varindo-canvas p-7">
                  <p className="section-title text-[24px] sm:text-[24px]">{t('surfaceMatch', 'noMatchesTitle', lang)}</p>
                  <DetectedCodeNote group={result.groups[0]} lang={lang} />
                  <p className="copy mt-2">{t('surfaceMatch', 'noMatchesSub', lang)}</p>
                </div>
              )}

              {phase === 'results' && result && totalMatches > 0 && (
                <>
                  <div className="mb-8">
                    <h2 className="section-title">{t('surfaceMatch', 'suggestedDesigns', lang)}</h2>
                    {hasVisualMatches && <p className="copy mt-2">{t('surfaceMatch', 'visualNote', lang)}</p>}
                  </div>
                  {result.mode === 'multiple' ? (
                    result.groups.map((group, i) => <GroupSection key={i} group={group} index={i} lang={lang} />)
                  ) : (
                    <>
                      <DetectedCodeNote group={result.groups[0]} lang={lang} />
                      <MatchGrid matches={result.groups[0].matches} lang={lang} />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HowItWorks({ lang }: { lang: Lang }) {
  const steps = [1, 2, 3].map((n) => ({
    title: t('surfaceMatch', `step${n}Title`, lang),
    desc: t('surfaceMatch', `step${n}Desc`, lang),
  }));
  const tips = [1, 2, 3].map((n) => t('surfaceMatch', `tip${n}`, lang));

  return (
    <div className="space-y-10">
      <div>
        <h2 className="section-title mb-6">{t('surfaceMatch', 'howItWorks', lang)}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="rounded-card bg-varindo-canvas p-7">
              <p className="label">{i + 1}</p>
              <p className="mt-2 section-title text-[24px] sm:text-[24px]">{step.title}</p>
              <p className="copy mt-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-xl">
        <p className="section-title text-[24px] sm:text-[24px]">{t('surfaceMatch', 'tipsHeading', lang)}</p>
        <ul className="mt-3 space-y-2">
          {tips.map((tip) => (
            <li key={tip} className="copy flex items-start gap-3">
              <div className="mt-3 h-[1.5px] w-4 shrink-0 bg-varindo-link" />
              {tip}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[14px] tracking-normal text-varindo-mid">
          {t('surfaceMatch', 'privacyNote', lang)}{' '}
          <Link href="/privacy" className="link-quiet">{t('surfaceMatch', 'privacyLink', lang)}</Link>
        </p>
      </div>
    </div>
  );
}

function DetectedCodeNote({ group, lang }: { group?: SurfaceMatchGroup; lang: Lang }) {
  if (!group?.detectedCode || group.matches[0]?.matchType === 'code') return null;
  return (
    <p className="mb-6 text-[14px] tracking-normal text-varindo-mid">
      {t('surfaceMatch', 'codeDetectedNotFound', lang, { code: group.detectedCode })}
    </p>
  );
}

function GroupSection({ group, index, lang }: { group: SurfaceMatchGroup; index: number; lang: Lang }) {
  return (
    <section className="mb-14 last:mb-0">
      <div className="mb-6 flex items-center gap-3">
        {group.thumbnail ? (
          <Image src={group.thumbnail} alt="" width={48} height={48} unoptimized className="h-12 w-12 rounded-[10px] object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-varindo-canvas text-[14px] text-varindo-mid">
            {index + 1}
          </div>
        )}
        <p className="section-title text-[24px] sm:text-[24px]">
          {t('surfaceMatch', 'itemLabel', lang, { n: index + 1 })}
        </p>
      </div>
      <DetectedCodeNote group={group} lang={lang} />
      {group.matches.length > 0 ? (
        <MatchGrid matches={group.matches} lang={lang} />
      ) : (
        <p className="copy">{t('surfaceMatch', 'noMatchForItem', lang)}</p>
      )}
    </section>
  );
}

function MatchGrid({ matches, lang }: { matches: SurfaceMatch[]; lang: Lang }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
      {matches.map((match) => (
        <MatchCard key={match.swatch} match={match} lang={lang} />
      ))}
    </div>
  );
}

function MatchCard({ match, lang }: { match: SurfaceMatch; lang: Lang }) {
  const href = `/products/${match.products[0].slug}`;

  return (
    <article className="group">
      <Link href={href} aria-label={match.design} className="block">
        <div className="relative aspect-square overflow-hidden rounded-card bg-varindo-canvas">
          <ProductImage src={match.imageUrl} alt={match.design} />
          {match.matchType === 'code' && (
            <span className="absolute left-3 top-3 rounded-pill bg-white/90 px-2.5 py-1 text-[12px] tracking-normal text-varindo-ink">
              {t('surfaceMatch', 'codeMatchBadge', lang)}
            </span>
          )}
        </div>
      </Link>
      <div className="px-1 pt-4">
        <Link href={href}
          className="block text-[16px] font-semibold leading-[1.3] tracking-normal text-varindo-ink transition-colors group-hover:opacity-60">
          {match.design}
        </Link>
        <ul className="mt-1.5 space-y-1">
          {match.products.map((product) => (
            <li key={product.slug}>
              <Link href={`/products/${product.slug}`}
                className="text-[14px] tracking-normal text-varindo-mid transition-colors hover:text-varindo-ink">
                {product.code}{product.size ? ` · ${product.size}` : ''}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
