import type { ReactNode } from 'react';

/* The serial-chapter motif: a solid black numbered badge sitting on the
   same line as a 40px heading. Every primary home section opens with one. */
export function ChapterHeading({ n, children, className = '' }: { n: number; children: ReactNode; className?: string }) {
  return (
    <h2 className={`display flex items-start gap-3 text-[24px] text-varindo-ink sm:gap-4 sm:text-[40px] ${className}`}>
      <span className="chapter-badge -mt-[3px] sm:mt-[6px]" aria-hidden="true">{n}</span>
      <span>{children}</span>
    </h2>
  );
}
