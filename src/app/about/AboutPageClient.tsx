'use client';

import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

export function AboutPageClient() {
  const { lang } = useLang();

  return (
    <div>
      <div className="bg-varindo-ink text-white border-b border-varindo-800">
        <div className="shell py-14 sm:py-20">
          <p className="label text-varindo-400 mb-4">{t('about', 'badge', lang)}</p>
          <h1 className="display text-white text-5xl sm:text-6xl lg:text-7xl">{t('about', 'title', lang)}</h1>
        </div>
      </div>

      <div className="shell py-12 sm:py-16 max-w-5xl">
        <section className="border border-varindo-line bg-white mb-8">
          <div className="grid lg:grid-cols-[0.4fr_0.6fr]">
            <div className="border-b lg:border-b-0 lg:border-r border-varindo-line bg-varindo-50 px-8 py-10 flex flex-col justify-center">
              <p className="label text-varindo-gold mb-4">{t('about', 'missionLabel', lang)}</p>
              <h2 className="display text-varindo-ink text-3xl sm:text-4xl">
                {t('about', 'missionTitle1', lang)}<br />{t('about', 'missionTitle2', lang)}
              </h2>
            </div>
            <div className="px-8 py-10 space-y-5 text-[14px] leading-8 text-varindo-600">
              <p>{t('about', 'mission1', lang)}</p>
              <p>{t('about', 'mission2', lang)}</p>
              <p>{t('about', 'mission3', lang)}</p>
            </div>
          </div>
        </section>

        <section className="border border-varindo-line bg-varindo-ink text-white mb-8 px-8 py-10">
          <p className="label text-varindo-400 mb-4">{t('about', 'visionLabel', lang)}</p>
          <h2 className="display text-white text-3xl sm:text-4xl mb-5">{t('about', 'visionTitle', lang)}</h2>
          <div className="text-[14px] leading-8 text-varindo-400 max-w-2xl space-y-4">
            <p>{t('about', 'vision1', lang)}</p>
            <p>{t('about', 'vision2', lang)}</p>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-6">{t('about', 'valuesLabel', lang)}</p>
          <div className="grid gap-px bg-varindo-line border border-varindo-line sm:grid-cols-2">
            {[1,2,3,4].map((n) => (
              <div key={n} className="bg-white p-7">
                <div className="w-6 h-[1.5px] bg-varindo-gold mb-4" />
                <h3 className="text-[14px] font-semibold text-varindo-ink mb-2">{t('about', `val${n}Title`, lang)}</h3>
                <p className="text-[13px] leading-7 text-varindo-500">{t('about', `val${n}Body`, lang)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
