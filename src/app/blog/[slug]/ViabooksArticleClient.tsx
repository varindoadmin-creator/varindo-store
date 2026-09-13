'use client';

import Link from 'next/link';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { ArticleMarkdown } from '@/components/ArticleMarkdown';
import type { ViabooksArticle } from '@/lib/viabooksArticles';

function formatDate(iso: string, lang: 'id' | 'en') {
  return new Date(iso).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// The article page: header with category, title, excerpt and date; the cover
// and body; and the WhatsApp call to action. The body comes from VIABooks as
// Markdown in each language.
export function ViabooksArticleClient({ article }: { article: ViabooksArticle }) {
  const { lang } = useLang();
  const waUrl = buildWhatsAppUrl(`Halo Admin Varindo, saya membaca artikel "${article.title.id}" dan ingin bertanya.`);

  return (
    <div>
      <div className="bg-white">
        <div className="shell py-14 sm:py-20">
          <Link href="/blog" className="text-[12px] font-semibold tracking-[-0.016em] text-varindo-mid hover:text-varindo-ink transition-colors">
            {t('blog', 'backToBlog', lang)}
          </Link>
          <p className="label mt-6 mb-4">{article.category[lang]}</p>
          <h1 className="display text-varindo-ink text-[36px] sm:text-[48px] lg:text-[56px] mb-5 max-w-3xl">
            {article.title[lang]}
          </h1>
          <p className="text-[17px] leading-7 text-varindo-mid max-w-2xl mb-4">
            {article.excerpt[lang]}
          </p>
          <p className="text-[12px] text-varindo-mid">
            {t('blog', 'publishedOn', lang)} <time dateTime={article.date}>{formatDate(article.date, lang)}</time>
          </p>
        </div>
      </div>

      <div className="shell py-12 sm:py-16 max-w-3xl space-y-12">
        {article.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- covers are already sized, cached Cloud Storage objects
          <img src={article.coverImageUrl} alt="" className="aspect-[16/9] w-full rounded-card object-cover" />
        )}

        <ArticleMarkdown source={article.body[lang]} />

        <section className="rounded-card bg-varindo-canvas px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="display text-[28px] text-varindo-ink mb-2">
              {lang === 'id' ? 'Ada pertanyaan seputar HPL?' : 'Questions about laminates?'}
            </p>
            <p className="text-[14px] text-varindo-mid max-w-lg">
              {lang === 'id'
                ? 'Tim Varindo siap membantu Anda memilih produk yang tepat untuk proyek Anda.'
                : 'The Varindo team is ready to help you choose the right product for your project.'}
            </p>
          </div>
          <a href={waUrl} target="_blank" rel="noreferrer" className="btn-ink shrink-0 justify-center">
            {lang === 'id' ? 'Tanya via WhatsApp' : 'Ask via WhatsApp'}
          </a>
        </section>
      </div>
    </div>
  );
}
