import Link from 'next/link';
import type { ReactNode } from 'react';

// Renders the Markdown subset VIABooks' article generator writes — ## and ###
// headings, paragraphs, - and 1. lists, **bold**, *italic*, [links](url) — in
// the site's article typography. Builds React elements, never HTML strings, so
// article text can't inject markup. VIABooks' editor preview follows the same
// rules (client/src/utils/markdown.jsx in the via-corporate repo).

type Block =
  | { type: 'h2' | 'h3' | 'p'; text: string }
  | { type: 'ul' | 'ol'; items: string[] };

const INLINE = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={key} className="font-normal text-varindo-ink">{part.slice(2, -2)}</strong>;
    if (/^\*[^*\s][^*]*\*$/.test(part)) return <em key={key}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href] = link;
      const className = 'text-varindo-ink underline underline-offset-2 hover:text-varindo-link transition-colors';
      if (href.startsWith('/')) return <Link key={key} href={href} className={className}>{label}</Link>;
      if (/^https?:\/\//.test(href)) return <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={className}>{label}</a>;
      return label;
    }
    return part;
  });
}

function parseBlocks(source: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: 'p', text: paragraph.join(' ') });
    paragraph = [];
  };
  const flushList = () => {
    if (list) blocks.push(list);
    list = null;
  };

  for (const rawLine of source.split('\n')) {
    const line = rawLine.trim();
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    const bullet = line.match(/^[-*]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);

    if (!line) {
      flushParagraph();
      flushList();
    } else if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: heading[1].length === 3 ? 'h3' : 'h2', text: heading[2] });
    } else if (bullet || numbered) {
      flushParagraph();
      const type = bullet ? 'ul' : 'ol';
      if (!list || list.type !== type) {
        flushList();
        list = { type, items: [] };
      }
      list.items.push((bullet || numbered)![1]);
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

export function ArticleMarkdown({ source }: { source: string }) {
  return (
    <div className="space-y-6">
      {parseBlocks(source).map((block, i) => {
        const key = String(i);
        switch (block.type) {
          case 'h2':
            return <h2 key={key} className="display text-varindo-ink text-[24px] sm:text-[40px] leading-snug pt-6">{renderInline(block.text, key)}</h2>;
          case 'h3':
            return <h3 key={key} className="text-[24px] font-normal text-varindo-ink pt-2">{renderInline(block.text, key)}</h3>;
          case 'ul':
          case 'ol': {
            const ListTag = block.type;
            return (
              <ListTag key={key} className={`${block.type === 'ul' ? 'list-disc' : 'list-decimal'} pl-6 space-y-2 text-[16px] leading-8 text-varindo-mid`}>
                {block.items.map((item, j) => <li key={j}>{renderInline(item, `${key}-${j}`)}</li>)}
              </ListTag>
            );
          }
          default:
            return <p key={key} className="text-[16px] leading-8 text-varindo-mid">{renderInline(block.text, key)}</p>;
        }
      })}
    </div>
  );
}
