'use client';

import Link from 'next/link';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

export function PriceListDownloadPage({ granted }: { granted: boolean }) {
  const { lang } = useLang();

  return (
    <div className="bg-varindo-paper">
      <div className="shell py-16 sm:py-24 max-w-3xl">
        <div className="rounded-card bg-varindo-canvas">
          <div className="px-8 py-14 flex flex-col items-center text-center gap-6">

            <div className="w-16 h-16 border-2 border-varindo-gold flex items-center justify-center">
              {granted ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3v12m0 0l-5-5m5 5l5-5M4 20h16"
                    stroke="#a8763e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 7v6m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
                    stroke="#a8763e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>

            <div>
              <p className="label mb-3">
                {granted ? t('forms', 'priceListReadyLabel', lang) : t('forms', 'priceListBadge', lang)}
              </p>
              <h1 className="display text-varindo-ink text-[32px] sm:text-[40px] mb-4">
                {granted ? t('forms', 'priceListReadyTitle', lang) : t('forms', 'priceListExpiredTitle', lang)}
              </h1>
              <p className="text-[16px] leading-7 text-varindo-mid max-w-md mx-auto">
                {granted ? t('forms', 'priceListReadyBody', lang) : t('forms', 'priceListExpiredBody', lang)}
              </p>
            </div>

            {granted ? (
              <>
                {/* A plain link, not fetch(): the cookie rides along on its own
                    and the browser saves the file the way it saves any other. */}
                <a href="/api/price-list" className="btn-ink justify-center min-w-[240px]" download>
                  <svg width="13" height="13" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M10 2.5v11m0 0l-4-4m4 4l4-4M3 16.5h14"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t('forms', 'priceListDownloadBtn', lang)}
                </a>
                <p className="text-[12px] text-varindo-mid leading-6 max-w-sm">
                  {t('forms', 'priceListNote', lang)}
                </p>
                <p className="text-[14px] text-varindo-mid">
                  {t('forms', 'priceListQuoteNudge', lang)}{' '}
                  <Link href="/request-quote" className="text-varindo-link underline underline-offset-4">
                    {t('forms', 'priceListQuoteLink', lang)}
                  </Link>
                </p>
              </>
            ) : (
              <Link href="/request-price-list" className="btn-ink justify-center min-w-[240px]">
                {t('forms', 'priceListRequestAgain', lang)}
              </Link>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
