'use client';

import Link from 'next/link';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

/**
 * The app had no not-found boundary, so every `notFound()` — a mistyped
 * product slug, a dead catalogue link, an old URL out of someone's notes —
 * fell through to Next's bare default and rendered as a blank page with
 * nothing but the site footer. The 404 was only ever visible in the
 * document title.
 *
 * A dead product link is the most likely way to arrive here, so the page
 * puts the catalogue search directly in front of the visitor rather than
 * only apologising and pointing at the home page.
 */
export default function NotFound() {
  const { lang } = useLang();

  return (
    <div className="shell flex min-h-[60vh] flex-col justify-center py-16">
      <div className="max-w-xl">
        <p className="label-marked mb-5">{t('notFound', 'code', lang)}</p>
        <h1 className="display text-[36px] text-varindo-ink sm:text-[48px]">
          {t('notFound', 'title', lang)}
        </h1>
        <p className="copy mt-4">{t('notFound', 'body', lang)}</p>

        <form action="/products" className="relative mt-8 max-w-md">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-varindo-mid">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="search"
            name="search"
            aria-label={t('notFound', 'searchLabel', lang)}
            placeholder={t('home', 'searchPlaceholder', lang)}
            className="h-12 w-full rounded-ctl border border-varindo-line bg-varindo-paper pl-11 pr-4 text-[15px] text-varindo-ink outline-none transition-colors placeholder:text-varindo-mid focus:border-varindo-clay"
          />
        </form>

        <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
          <Link href="/products" className="btn-blue">{t('notFound', 'browseCta', lang)}</Link>
          <Link href="/" className="link-arrow">
            {t('notFound', 'homeCta', lang)} <span aria-hidden="true">›</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
