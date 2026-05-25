# Varindo Online Catalog

A responsive Node.js / Next.js catalog for Varindo's Lamitak-focused public product browsing experience.

## Design direction

- Global font: Inter via `next/font/google`
- Premium interior-product visual style
- Responsive mobile, tablet, and desktop layouts
- Clean product cards: product image, exact product name, and price only
- WhatsApp-first enquiry flow instead of cart checkout
- Cloudinary image pattern for Lamitak product images
- Optional live Zoho Books product source

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

By default, the catalog falls back to starter product data in:

```text
src/data/lamitak-products.ts
```

When Zoho environment variables are filled in, the website fetches active Lamitak items from Zoho Books instead.

The integration uses:

```text
GET /books/v3/items
```

with `organization_id`, `status=active`, and `name_contains=LAMITAK`.

## Environment variables

Copy `.env.example` to `.env.local` for local testing:

```bash
cp .env.example .env.local
```

Required for live Zoho products:

```text
ZOHO_BOOKS_ORGANIZATION_ID=
ZOHO_CLIENT_ID=
ZOHO_CLIENT_SECRET=
ZOHO_REFRESH_TOKEN=
```

Optional:

```text
ZOHO_ACCOUNTS_BASE_URL=https://accounts.zoho.com
ZOHO_BOOKS_BASE_URL=https://www.zohoapis.com/books/v3
ZOHO_LAMITAK_SEARCH_TERM=LAMITAK
ZOHO_PRODUCTS_CACHE_TTL_MS=600000
```

## How the Zoho item is mapped

- Product name: Zoho item `name`
- Price: Zoho item `rate`
- Active status: Zoho item `status`
- Code: extracted from SKU or item name, e.g. `DXO 5338D`, `MTA 9310XL`
- Image: generated from the code using Varindo's Cloudinary naming pattern
- Optional details: collection, finish, size, thickness, and color family are read from matching Zoho custom fields when available

## Important before publishing

Confirm the Zoho item names, rates, and custom fields are correct before going public. Prices shown on the public catalog should always come from Varindo's official product data source.


## Product data source rule

Zoho Books is the source of truth for public catalog items, item names, active status, and prices. The Lamitak product database is used only to enrich Zoho items with display attributes such as design, size, thickness, finish, category, and collection. It must not be used as the source list of items.

Zoho Books item rates are maintained excluding PPN. The website displays prices including PPN using `NEXT_PUBLIC_PPN_RATE=0.11`.


## Promo Items Collection

The `/collections/promo-items` page is generated automatically from Zoho Books items where `stockOnHand >= ZOHO_PROMO_MIN_STOCK_ON_HAND` (default: 10). Zoho Books remains the source of items, prices, and stock data.


## Typography

This version uses Manrope as the primary website font for a modern, premium interior-product catalog feel.
