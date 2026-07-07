'use client';

import Link from 'next/link';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

const FLIPPINGBOOK_URL = 'https://online.flippingbook.com/view/842367758/4-5/';

export function PortfolioPageClient() {
  const { lang } = useLang();

  return (
    <div>
      <div className="bg-varindo-ink text-white border-b border-varindo-800">
        <div className="shell py-14 sm:py-20">
          <p className="label text-varindo-400 mb-4">{t('home', 'portfolioLabel', lang)}</p>
          <h1 className="display text-white text-4xl sm:text-5xl lg:text-6xl mb-5">
            {t('home', 'portfolioTitle1', lang)}{' '}
            <em className="text-varindo-300 not-italic">{t('home', 'portfolioTitle2', lang)}</em>
          </h1>
          <p className="text-[14px] leading-7 text-varindo-400 max-w-lg mb-6">{t('home', 'portfolioBody', lang)}</p>
          <a href={FLIPPINGBOOK_URL} target="_blank" rel="noreferrer"
            className="text-[11px] font-semibold tracking-[0.14em] uppercase text-varindo-300 hover:text-white transition-colors">
            {t('home', 'portfolioOpenExternal', lang)}
          </a>
        </div>
      </div>

      <div className="shell py-10 sm:py-14">
        <div className="border border-varindo-line bg-varindo-50 aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden">
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
          <Link href="/" className="text-[11px] font-medium tracking-[0.12em] uppercase text-varindo-500 hover:text-varindo-ink transition-colors">
            {t('home', 'portfolioBack', lang)}
          </Link>
        </div>
      </div>
    </div>
  );
}
