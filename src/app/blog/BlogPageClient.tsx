'use client';

import Link from 'next/link';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';
import type { BlogPost } from '@/data/blog-posts';
import { Reveal } from '@/components/Reveal';

function formatDate(iso: string, lang: 'id' | 'en') {
  return new Date(iso).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function BlogPageClient({ posts }: { posts: BlogPost[] }) {
  const { lang } = useLang();

  return (
    <div>
      <div className="bg-white">
        <div className="shell py-14 sm:py-20">
          <p className="label mb-4">{t('blog', 'badge', lang)}</p>
          <h1 className="display text-varindo-ink text-[36px] sm:text-[48px] lg:text-[56px] mb-5">
            {t('blog', 'title', lang)}
          </h1>
          <p className="text-[17px] leading-7 text-varindo-mid max-w-2xl">
            {t('blog', 'subtitle', lang)}
          </p>
        </div>
      </div>

      <div className="shell py-12 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 80}>
              <Link
                href={post.href ?? `/blog/${post.slug}`}
                className="group flex h-full flex-col rounded-card bg-varindo-canvas p-6 sm:p-8 transition-all duration-300 hover:border-varindo-ink hover:shadow-luxury"
              >
                {post.coverImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element -- covers are already sized, cached Cloud Storage objects
                  <img
                    src={post.coverImageUrl}
                    alt=""
                    loading="lazy"
                    className="mb-5 aspect-[16/9] w-full rounded-xl object-cover"
                  />
                )}
                <p className="label mb-4">{post.category[lang]}</p>
                <h2 className="display text-[28px] leading-snug text-varindo-ink mb-3 group-hover:text-varindo-link transition-colors">
                  {post.title[lang]}
                </h2>
                <p className="text-[14px] leading-7 text-varindo-mid mb-6 flex-1">
                  {post.excerpt[lang]}
                </p>
                <div className="flex items-center justify-between text-[12px] text-varindo-mid">
                  <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
                  <span className="font-semibold tracking-[-0.016em] text-varindo-ink group-hover:text-varindo-link transition-colors">
                    {t('blog', 'readMore', lang)}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
