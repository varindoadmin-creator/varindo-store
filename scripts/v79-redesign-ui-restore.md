# v79 — Redesign UI Restore

Restored premium UI design system on top of v78 logic.

## What changed vs v78

- `src/app/page.tsx` — v78 logic kept; ChatGPT UI replaced with premium design system
- `src/components/Header.tsx` — restored WhatsApp CTA, mobile close button, new-arrivals slug
- `src/components/Footer.tsx` — restored WhatsApp button, Request Catalog / Request Sample links
- `src/app/about/page.tsx` — fully redesigned (was broken in both v73 and v78)
- `src/app/request-catalog/page.tsx` — redesigned with premium UI (restored from v73 logic)
- `src/app/request-sample/page.tsx` — redesigned with premium UI (restored from v73 logic)
- `tailwind.config.ts` — premium font/color system (Cormorant + DM Sans)
- All other UI files — taken from v73 which had correct premium design

## Design system

- Fonts: Cormorant Garamond (display) + DM Sans (body)
- Colors: varindo-ink, varindo-paper, varindo-line, varindo-gold
- Utilities: .shell, .label, .display, .rule, .btn-ink, .btn-ghost, .btn-ghost-white, .field
- Architecture: sharp edges, gap-px grids, editorial spacing
