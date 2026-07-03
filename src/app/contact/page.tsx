'use client';

import Link from 'next/link';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

export default function ContactPage() {
  const { lang } = useLang();

  return (
    <div>
      <div className="bg-varindo-ink text-white border-b border-varindo-800">
        <div className="shell py-14 sm:py-20">
          <p className="label text-varindo-400 mb-4">{t('contact', 'badge', lang)}</p>
          <h1 className="display text-white text-5xl sm:text-6xl lg:text-7xl">{t('contact', 'title', lang)}</h1>
        </div>
      </div>

      <div className="shell py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-[14px] leading-7 text-varindo-500 max-w-lg mb-10">{t('contact', 'intro', lang)}</p>
            <div className="border border-varindo-line bg-white">
              <div className="border-b border-varindo-line px-6 py-5 bg-varindo-50">
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-varindo-500">{t('contact', 'companyLabel', lang)}</p>
                <p className="mt-1 text-[15px] font-semibold text-varindo-ink">CV. Varindo Forma Hutama</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-varindo-line">
                <div className="bg-white px-6 py-6">
                  <p className="label text-varindo-gold mb-3">{t('contact', 'headOffice', lang)}</p>
                  <address className="not-italic text-[13px] leading-7 text-varindo-600">
                    Branz BSD Tower A Unit 3310<br />
                    Jl. BSD Boulevard Parcel 55-F<br />
                    Tangerang 15339<br />
                    Banten, Indonesia<br />
                    <span className="font-medium text-varindo-ink">T. 0812 8888 5224</span>
                  </address>
                </div>
                <div className="bg-white px-6 py-6">
                  <p className="label text-varindo-gold mb-3">{t('contact', 'regOffice', lang)}</p>
                  <address className="not-italic text-[13px] leading-7 text-varindo-600">
                    Ruko Pasar Modern Batununggal<br />
                    Blok RA/06, Kel. Mengger<br />
                    Kec. Bandung Kidul<br />
                    Bandung 40267, Jawa Barat<br />
                    <span className="font-medium text-varindo-ink">T. 0812 1001 5224</span>
                  </address>
                </div>
                <div className="bg-white px-6 py-6">
                  <p className="label text-varindo-gold mb-3">{t('contact', 'medanHub', lang)}</p>
                  <address className="not-italic text-[13px] leading-7 text-varindo-600">
                    House of HPL<br />
                    Jl. S. Parman No.28, Petisah Tengah<br />
                    Kec. Medan Petisah<br />
                    Kota Medan 20112, Sumatera Utara<br />
                    <span className="font-medium text-varindo-ink">T. 0811 611 805</span>
                  </address>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-px bg-varindo-line border-t border-varindo-line">
                <div className="bg-white px-6 py-5">
                  <p className="label text-varindo-gold mb-2">{t('contact', 'hours', lang)}</p>
                  <p className="text-[13px] text-varindo-700 whitespace-pre-line">{t('contact', 'hoursValue', lang)}</p>
                </div>
                <div className="bg-white px-6 py-5">
                  <p className="label text-varindo-gold mb-2">{t('contact', 'email', lang)}</p>
                  <a href="mailto:contact@varindo.co.id" className="text-[13px] text-varindo-ink underline underline-offset-2 hover:text-varindo-gold transition-colors">
                    contact@varindo.co.id
                  </a>
                </div>
              </div>
            </div>
          </div>

          <aside className="border border-varindo-line bg-white p-8">
            <p className="label text-varindo-gold mb-4">WhatsApp</p>
            <h2 className="display text-varindo-ink text-3xl sm:text-4xl mb-5">{t('contact', 'waTitle', lang)}</h2>
            <p className="text-[14px] leading-7 text-varindo-500 mb-8">{t('contact', 'waBody', lang)}</p>
            <a href="https://wa.me/6281288885224" target="_blank" rel="noopener noreferrer"
              className="btn-ink w-full justify-center mb-3">
              Chat → 0812 8888 5224
            </a>
            <a href="https://wa.me/6281210015224" target="_blank" rel="noopener noreferrer"
              className="btn-ghost w-full justify-center mb-3">
              Chat → 0812 1001 5224
            </a>
            <a href="https://wa.me/62811611805" target="_blank" rel="noopener noreferrer"
              className="btn-ghost w-full justify-center">
              Chat → 0811 611 805
            </a>
            <div className="mt-8 pt-6 border-t border-varindo-line">
              <p className="label text-varindo-500 mb-3">{t('contact', 'browseCatalog', lang)}</p>
              <Link href="/products" className="text-[13px] font-medium text-varindo-ink hover:text-varindo-gold transition-colors">
                {t('contact', 'browseLink', lang)}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
