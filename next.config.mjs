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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/varindo-product-images/**'
      }
    ]
  },
  // Price List downloads were removed from the site; the path was in the
  // sitemap, so send any remaining links and crawlers to the nearest
  // equivalent rather than a 404.
  async redirects() {
    return [
      { source: '/price-list', destination: '/request-catalogue', permanent: true }
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
