'use client';

import Link from 'next/link';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

const FLIPPINGBOOK_URL = 'https://online.flippingbook.com/view/842367758/4-5/';

export function PortfolioPageClient() {
  const { lang } = useLang();

  return (
    <div>
      <div className="bg-white">
        <div className="shell py-14 sm:py-20">
          <p className="label mb-4">{t('home', 'portfolioLabel', lang)}</p>
          <h1 className="display text-varindo-ink text-[40px] lg:text-[64px] mb-5">
            {t('home', 'portfolioTitle1', lang)}{' '}
            <em className="text-varindo-mid not-italic">{t('home', 'portfolioTitle2', lang)}</em>
          </h1>
          <p className="text-[16px] leading-7 text-varindo-mid max-w-lg mb-6">{t('home', 'portfolioBody', lang)}</p>
          <a href={FLIPPINGBOOK_URL} target="_blank" rel="noreferrer"
            className="text-[12px] font-normal tracking-[-0.01em] text-varindo-mid hover:text-varindo-ink transition-colors">
            {t('home', 'portfolioOpenExternal', lang)}
          </a>
        </div>
      </div>

      <div className="shell py-10 sm:py-14">
        <div className="rounded-card bg-varindo-canvas aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden">
          <iframe
            src={FLIPPINGBOOK_URL}
            title="Lamitak Portfolio"
            className="w-full h-full"
            loading="lazy"
            allow="fullscreen"
            allowFullScreen
          />
        </div>

        <div className="mt-6">
          <Link href="/" className="text-[12px] font-normal tracking-[-0.01em] text-varindo-mid hover:text-varindo-ink transition-colors">
            {t('home', 'portfolioBack', lang)}
          </Link>
        </div>
      </div>
    </div>
  );
}
