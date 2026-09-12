# syntax=docker/dockerfile:1

# Next.js on Cloud Run. Debian slim rather than Alpine: next/image runs through
# sharp, and sharp's prebuilt binaries are glibc — on musl it either needs a
# separate build or falls back to compiling from source.

# ── deps ──────────────────────────────────────────────────────────────
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── build ─────────────────────────────────────────────────────────────
FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# No secrets needed here: the catalogue is compiled in from
# src/data/lamitak-products-from-csv.ts, and both NEXT_PUBLIC_* values have
# in-code defaults. Pass them as build args only if they ever diverge —
# NEXT_PUBLIC_* is inlined at build time, not read at runtime.
RUN npm run build

# ── runtime ───────────────────────────────────────────────────────────
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=8080 \
    HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs

# public/ carries .well-known/assetlinks.json — the Android app's domain
# verification depends on it being served from the site root.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 8080

# server.js is the standalone entrypoint; it honours PORT and HOSTNAME.
CMD ["node", "server.js"]
