'use client';

import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';
import { RequestQuoteForm } from './RequestQuoteForm';
import type { ProductOption } from '@/components/ProductCodeInput';

export function RequestQuotePage({ products, initialCode }: { products: ProductOption[]; initialCode?: string }) {
  const { lang } = useLang();

  const infoItems = lang === 'id'
    ? ['Kode produk atau nama desain', 'Jumlah per produk (lembar)', 'Nama / perusahaan', 'Alamat proyek', 'Nomor telepon']
    : ['Product code or design name',  'Quantity per product (sheets)', 'Name or company name', 'Project address', 'Phone number'];

  return (
    <div>
      <div className="bg-varindo-paper">
        <div className="shell py-14 sm:py-20">
          <p className="label mb-4">{t('forms', 'quoteBadge', lang)}</p>
          <h1 className="display text-varindo-ink text-[40px] sm:text-[56px] lg:text-[80px] whitespace-pre-line">
            {t('forms', 'quoteTitle', lang)}
          </h1>
          <p className="mt-5 text-[16px] leading-7 text-varindo-mid max-w-lg">
            {t('forms', 'quoteSubtitle', lang)}
          </p>
        </div>
      </div>

      <div className="shell py-12 sm:py-16 max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-start">

          {/* Left — info panel */}
          <div className="rounded-card bg-varindo-canvas">
            <div className="px-7 pt-7 pb-1">
              <p className="text-[21px] font-semibold tracking-[-0.01em] text-varindo-ink">
                {t('forms', 'quoteInfoTitle', lang)}
              </p>
            </div>
            <div className="divide-y divide-varindo-line/60">
              {infoItems.map((item) => (
                <div key={item} className="flex items-center gap-3 px-6 py-4">
                  <div className="w-4 h-[1.5px] bg-varindo-link shrink-0" />
                  <p className="text-[14px] font-medium text-varindo-deep">{item}</p>
                </div>
              ))}
            </div>
            <div className="px-6 py-5 border-t border-varindo-line/50 bg-varindo-50/50">
              <p className="text-[12px] text-varindo-mid leading-6">
                {t('forms', 'quoteMaxNote', lang)}
              </p>
            </div>
          </div>

          {/* Right — form */}
          <RequestQuoteForm products={products} initialCode={initialCode} />
        </div>
      </div>
    </div>
  );
}
