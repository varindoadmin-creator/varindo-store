# Varindo Online Catalog

A responsive Node.js / Next.js catalog for Varindo's Lamitak-focused public product browsing experience.

## Design direction

- System font stacks for deterministic, network-independent builds
- Premium interior-product visual style
- Responsive mobile, tablet, and desktop layouts
- Clean product cards: product image, exact product name, and price only
- WhatsApp-first enquiry flow instead of cart checkout
- Cloudinary image pattern for Lamitak product images
- Generated CSV-backed product catalogue

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build for production

```bash
npm run build
npm run start
```

## Hostinger Node.js Web App settings

Recommended settings:

```text
Install command: npm install
Build command: npm run build
Start command: npm run start
Node.js version: 20.x or 22.x
```

## Product database

The public catalogue reads the generated module at
`src/data/lamitak-products-from-csv.ts`. Its source file is
`public/data/lamitak-products.csv`; regenerate the module with
`npm run import:products` after deliberately updating that CSV.

## Environment variables

Copy `.env.example` to `.env.local` for local testing:

```bash
cp .env.example .env.local
```

Configure only the services used by the feature being tested: Supabase and SMTP
for request forms and Anthropic for chat.
See `.env.example` for the complete list.

## Important before publishing

Confirm the generated catalogue and its prices match Varindo's approved CSV before publishing.


## Product data source rule

The generated CSV module is the website's runtime source for catalogue items and
base prices. `src/lib/products.ts` adds 11% PPN for display.


## Promo Items Collection

Promo and badge collections come from the corresponding columns in the catalogue CSV.


## Typography

This version uses Manrope as the primary website font for a modern, premium interior-product catalog feel.
