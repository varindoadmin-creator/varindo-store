'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';
import { RequestSampleForm } from './RequestSampleForm';
import type { ProductOption } from '@/components/ProductCodeInput';

export default function RequestSamplePage() {
  const { lang } = useLang();
  const [products, setProducts] = useState<ProductOption[]>([]);

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(data => {
      setProducts((data.products || []).map((p: any) => ({ code: p.code, name: p.name, design: p.design, collection: p.collection })));
    });
  }, []);

  return (
    <div>
      <div className="bg-varindo-ink text-white border-b border-varindo-800">
        <div className="shell py-14 sm:py-20">
          <p className="label text-varindo-400 mb-4">{t('forms', 'sampleBadge', lang)}</p>
          <h1 className="display text-white text-5xl sm:text-6xl lg:text-7xl whitespace-pre-line">{t('forms', 'sampleTitle', lang)}</h1>
          <p className="mt-5 text-[14px] leading-7 text-varindo-400 max-w-lg">{t('forms', 'sampleSubtitle', lang)}</p>
        </div>
      </div>
      <div className="shell py-12 sm:py-16 max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-start">
          <div className="border border-varindo-line bg-white">
            <div className="border-b border-varindo-line px-6 py-4 bg-varindo-50">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-700">{t('forms', 'sampleInfoTitle', lang)}</p>
            </div>
            <div className="divide-y divide-varindo-line/50">
              {(lang === 'id'
                ? ['Kode produk atau nama desain', 'Nama / perusahaan', 'Alamat pengiriman', 'Nomor telepon']
                : ['Product code or design name', 'Name or company name', 'Delivery address', 'Phone number']
              ).map((item) => (
                <div key={item} className="flex items-center gap-3 px-6 py-4">
                  <div className="w-4 h-[1.5px] bg-varindo-gold shrink-0" />
                  <p className="text-[13px] font-medium text-varindo-700">{item}</p>
                </div>
              ))}
            </div>
            <div className="px-6 py-5 border-t border-varindo-line bg-varindo-50/50">
              <p className="text-[11px] text-varindo-400 leading-6">{t('forms', 'sampleMaxNote', lang)}</p>
            </div>
          </div>
          <RequestSampleForm products={products} />
        </div>
      </div>
    </div>
  );
}
