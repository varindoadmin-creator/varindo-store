'use client';

import Link from 'next/link';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

export function ContactPageClient() {
  const { lang } = useLang();

  return (
    <div>
      <div className="bg-white">
        <div className="shell py-14 sm:py-20">
          <p className="label mb-4">{t('contact', 'badge', lang)}</p>
          <h1 className="display text-varindo-ink text-[40px] sm:text-[64px]">{t('contact', 'title', lang)}</h1>
        </div>
      </div>

      <div className="shell py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-[16px] leading-7 text-varindo-mid max-w-lg mb-10">{t('contact', 'intro', lang)}</p>
            <div>
              <div className="mb-5">
                <p className="label">{t('contact', 'companyLabel', lang)}</p>
                <p className="mt-1 text-[24px] font-normal tracking-[-0.01em] text-varindo-ink">CV. Varindo Forma Hutama</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="rounded-card bg-varindo-canvas p-6">
                  <p className="label mb-3">{t('contact', 'headOffice', lang)}</p>
                  <address className="not-italic text-[16px] leading-7 text-varindo-mid">
                    Branz BSD Tower A Unit 3310<br />
                    Jl. BSD Boulevard Parcel 55-F<br />
                    Tangerang 15339<br />
                    Banten, Indonesia<br />
                    <span className="font-normal text-varindo-ink">T. 0812 8888 5224</span>
                  </address>
                </div>
                <div className="rounded-card bg-varindo-canvas p-6">
                  <p className="label mb-3">{t('contact', 'regOffice', lang)}</p>
                  <address className="not-italic text-[16px] leading-7 text-varindo-mid">
                    Ruko Pasar Modern Batununggal<br />
                    Blok RA/06, Kel. Mengger<br />
                    Kec. Bandung Kidul<br />
                    Bandung 40267, Jawa Barat<br />
                    <span className="font-normal text-varindo-ink">T. 0812 1001 5224</span>
                  </address>
                </div>
                <div className="rounded-card bg-varindo-canvas p-6">
                  <p className="label mb-3">{t('contact', 'medanHub', lang)}</p>
                  <address className="not-italic text-[16px] leading-7 text-varindo-mid">
                    HOUSE OF HPL<br />
                    Jl. S. Parman No.28, Petisah Tengah<br />
                    Kec. Medan Petisah<br />
                    Kota Medan 20112, Sumatera Utara<br />
                    <span className="font-normal text-varindo-ink">T. 0852 1020 9968 / 0852 0076 9968</span>
                  </address>
                </div>
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="rounded-card bg-varindo-canvas p-6">
                  <p className="label mb-2">{t('contact', 'hours', lang)}</p>
                  <p className="whitespace-pre-line text-[16px] tracking-[-0.01em] text-varindo-deep">{t('contact', 'hoursValue', lang)}</p>
                </div>
                <div className="rounded-card bg-varindo-canvas p-6">
                  <p className="label mb-2">{t('contact', 'email', lang)}</p>
                  <a href="mailto:contact@varindo.co.id" className="link-quiet text-[16px] tracking-[-0.01em]">
                    contact@varindo.co.id
                  </a>
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-card bg-varindo-canvas p-8">
            <p className="label mb-4">WhatsApp</p>
            <h2 className="display text-varindo-ink text-[40px] mb-5">{t('contact', 'waTitle', lang)}</h2>
            <p className="text-[16px] leading-7 text-varindo-mid mb-8">{t('contact', 'waBody', lang)}</p>
            <a href="https://wa.me/6281288885224" target="_blank" rel="noopener noreferrer"
              className="btn-blue mb-3 w-full justify-center">
              Chat → 0812 8888 5224
            </a>
            <a href="https://wa.me/6281210015224" target="_blank" rel="noopener noreferrer"
              className="btn-ghost w-full justify-center">
              Chat → 0812 1001 5224
            </a>
            <div className="mt-8 pt-6 border-t border-varindo-line/50">
              <p className="label mb-3">{t('contact', 'browseCatalog', lang)}</p>
              <Link href="/products" className="link-arrow">
                {t('contact', 'browseLink', lang)}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
