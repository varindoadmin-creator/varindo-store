// External resources are limited to Cloudinary product imagery/uploads, the
// embedded Lamitak catalogue, and Google Ads measurement. Everything else (chat
// widget, forms, sitemap, JSON-LD) talks to same-origin API routes.
//
// 'unsafe-eval' is added to script-src only in development: Next.js's dev-mode React
// Fast Refresh runtime evaluates code via eval(), and without it every client
// component's interactivity silently breaks in `next dev` (confirmed: onClick handlers
// stopped firing entirely under the strict policy). Production builds don't use eval
// anywhere, so the production CSP stays fully strict.
const isDev = process.env.NODE_ENV !== 'production';
const csp = [
  "default-src 'self'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://www.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net",
  "connect-src 'self' https://api.cloudinary.com https://www.google-analytics.com https://region1.google-analytics.com https://www.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net",
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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/varindo/image/upload/**'
      }
    ]
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
