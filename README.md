# Varindo Online Catalog

A responsive Node.js / Next.js catalog for Varindo's Lamitak-focused public product browsing experience.

## Design direction

- Near-monochrome, Apple-leaning canvas: white and #f5f5f7 bands, SF Pro
  with Inter as the fallback, 28px card radii, pill buttons, centred hero
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

## Deploying

Pushing to `main` deploys to Cloud Run automatically. See `DEPLOY.md`.

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
for request forms, Anthropic for chat, and Voyage plus Anthropic for Surface
Match (search by photo).
See `.env.example` for the complete list.

## Important before publishing

Confirm the generated catalogue and its prices match Varindo's approved CSV before publishing.


## Product data source rule

The generated CSV module is the website's runtime source for catalogue items and
base prices. `src/lib/products.ts` adds 11% PPN for display.


## Promo Items Collection

Promo and badge collections come from the corresponding columns in the catalogue CSV.

