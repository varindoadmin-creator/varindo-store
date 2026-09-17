'use client';

import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

export function AboutPageClient() {
  const { lang } = useLang();

  return (
    <div>
      <div className="bg-white">
        <div className="shell py-14 sm:py-20">
          <p className="label mb-4">{t('about', 'badge', lang)}</p>
          <h1 className="display text-varindo-ink text-[40px] sm:text-[64px]">{t('about', 'title', lang)}</h1>
        </div>
      </div>

      <div className="shell py-12 sm:py-16 max-w-5xl">
        <section className="rounded-card bg-varindo-canvas mb-8">
          <div className="grid lg:grid-cols-[0.4fr_0.6fr]">
            <div className="flex flex-col justify-center bg-varindo-canvas px-8 py-10">
              <p className="label mb-4">{t('about', 'missionLabel', lang)}</p>
              <h2 className="display text-varindo-ink text-[40px]">
                {t('about', 'missionTitle1', lang)}<br />{t('about', 'missionTitle2', lang)}
              </h2>
            </div>
            <div className="px-8 py-10 space-y-5 text-[16px] leading-8 text-varindo-mid">
              <p>{t('about', 'mission1', lang)}</p>
              <p>{t('about', 'mission2', lang)}</p>
              <p>{t('about', 'mission3', lang)}</p>
            </div>
          </div>
        </section>

        <section className="rounded-card bg-varindo-canvas mb-8 px-8 py-10">
          <p className="label mb-4">{t('about', 'visionLabel', lang)}</p>
          <h2 className="display text-varindo-ink text-[40px] mb-5">{t('about', 'visionTitle', lang)}</h2>
          <div className="text-[16px] leading-8 text-varindo-mid max-w-2xl space-y-4">
            <p>{t('about', 'vision1', lang)}</p>
            <p>{t('about', 'vision2', lang)}</p>
          </div>
        </section>

        <section>
          <p className="label mb-6">{t('about', 'valuesLabel', lang)}</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {[1,2,3,4].map((n) => (
              <div key={n} className="rounded-card bg-varindo-canvas p-7">
                <div className="w-6 h-[1.5px] bg-varindo-link mb-4" />
                <h3 className="text-[16px] font-normal text-varindo-ink mb-2">{t('about', `val${n}Title`, lang)}</h3>
                <p className="text-[16px] leading-7 text-varindo-mid">{t('about', `val${n}Body`, lang)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
