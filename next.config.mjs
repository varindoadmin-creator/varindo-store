// External resources are limited to product swatches in Cloud Storage, the
// embedded Lamitak catalogue, and Google Ads measurement. Everything else (chat
// widget, forms, sitemap, JSON-LD) talks to same-origin API routes.
//
// 'unsafe-eval' is added to script-src only in development: Next.js's dev-mode React
// Fast Refresh runtime evaluates code via eval(), and without it every client
// component's interactivity silently breaks in `next dev` (confirmed: onClick handlers
// stopped firing entirely under the strict policy). Production builds don't use eval
// anywhere, so the production CSP stays fully strict.
import { fileURLToPath } from 'node:url';

const isDev = process.env.NODE_ENV !== 'production';
const csp = [
  "default-src 'self'",
  "img-src 'self' data: blob: https://storage.googleapis.com https://www.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "frame-src https://online.flippingbook.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests'
].join('; ');

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: csp }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloud Run runs this as a container: 'standalone' emits .next/standalone
  // with a self-contained server.js and only the traced dependencies, so the
  // runtime image doesn't carry the full node_modules tree.
  output: 'standalone',
  // Pin the file-tracing root to this project. Without it Next walks up
  // looking for a workspace root, finds the stray package.json in
  // ~/Documents, and nests the standalone build under .next/standalone/
  // varindo-tak/ — which puts server.js somewhere the container's CMD
  // isn't looking.
  outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
  // The price list PDF is deliberately not in public/ — it is released by
  // /api/price-list and only to a browser holding a token the form minted.
  // Nothing imports it, so tracing would never find it on its own and the
  // standalone build would ship without it: working locally, 500ing in
  // production. Naming it here is what puts it in the container.
  outputFileTracingIncludes: {
    '/api/price-list': ['./private/price-list/**']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/varindo-product-images/**'
      }
    ]
  },
  // /price-list was the old download URL, retired when the feature was, and
  // pointed at the catalogue form as the nearest thing left. There is a price
  // list again, so it points at the real one — along with the English spelling
  // and the bare Indonesian word, both of which people type.
  async redirects() {
    return [
      { source: '/price-list', destination: '/request-price-list', permanent: true },
      { source: '/request-price-lists', destination: '/request-price-list', permanent: true },
      { source: '/daftar-harga', destination: '/request-price-list', permanent: true }
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ];
  }
};

export default nextConfig;
