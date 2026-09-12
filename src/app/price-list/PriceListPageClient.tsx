'use client';

import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';
import { PriceListForm } from './PriceListForm';

export function PriceListPage() {
  const { lang } = useLang();
  return (
    <div>
      <div className="bg-white">
        <div className="shell py-14 sm:py-20">
          <p className="label mb-4">{t('forms', 'priceListBadge', lang)}</p>
          <h1 className="display text-varindo-ink text-[40px] sm:text-[56px] lg:text-[80px] whitespace-pre-line">
            {t('forms', 'priceListTitle', lang)}
          </h1>
          <p className="mt-5 text-[17px] leading-7 text-varindo-mid max-w-lg">
            {t('forms', 'priceListSubtitle', lang)}
          </p>
        </div>
      </div>
      <div className="shell py-12 sm:py-16 max-w-3xl">
        <PriceListForm />
      </div>
    </div>
  );
}
