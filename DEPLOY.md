# Deploying to Cloud Run

The site is a Next.js server (App Router, API routes, ISR), so it runs as a
container rather than as static files. `next.config.mjs` emits a standalone
build; the `Dockerfile` packages it.

Target: project `via-production-504006`, region `asia-southeast2` (Jakarta) —
the same project and region as VIABooks, which the request forms call.

```bash
PROJECT=via-production-504006
REGION=asia-southeast2
SERVICE=varindo-catalog
```

## 1. One-time project setup

```bash
gcloud config set project $PROJECT
gcloud services enable run.googleapis.com cloudbuild.googleapis.com \
    artifactregistry.googleapis.com secretmanager.googleapis.com
```

## 2. Secrets

Six values are credentials and belong in Secret Manager, never in the image or
in `--set-env-vars`. Create each one and paste the value at the prompt
(`--data-file=-` reads stdin, so nothing lands in your shell history):

```bash
for S in ZOHO_CLIENT_ID ZOHO_CLIENT_SECRET ZOHO_REFRESH_TOKEN \
         ANTHROPIC_API_KEY SUPABASE_SERVICE_ROLE_KEY SMTP_PASS; do
  gcloud secrets create $S --replication-policy=automatic
  echo "Paste value for $S then press Ctrl-D:"
  gcloud secrets versions add $S --data-file=-
done
```

Grant the service's runtime identity read access (default compute service
account unless you make a dedicated one):

```bash
SA=$(gcloud projects describe $PROJECT --format='value(projectNumber)')-compute@developer.gserviceaccount.com
for S in ZOHO_CLIENT_ID ZOHO_CLIENT_SECRET ZOHO_REFRESH_TOKEN \
         ANTHROPIC_API_KEY SUPABASE_SERVICE_ROLE_KEY SMTP_PASS; do
  gcloud secrets add-iam-policy-binding $S \
      --member="serviceAccount:$SA" --role=roles/secretmanager.secretAccessor
done
```

## 3. Deploy

`--source .` hands the repo to Cloud Build, which uses the `Dockerfile`:

```bash
gcloud run deploy $SERVICE \
  --source . \
  --region $REGION \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 10 \
  --set-env-vars "SMTP_HOST=smtp.gmail.com,SMTP_PORT=587,SMTP_USER=contact@varindo.co.id,SUPABASE_URL=https://ktvqrtbbgeztjxevjswm.supabase.co,VIABOOKS_API_URL=https://viabooks-601025884976.asia-southeast2.run.app,VIABOOKS_ORGANIZATION_ID=cmts823pu000jt761mx48ltsq,ZOHO_ACCOUNTS_BASE_URL=https://accounts.zoho.com,ZOHO_BOOKS_BASE_URL=https://www.zohoapis.com/books/v3,ZOHO_LAMITAK_SEARCH_TERM=LAMITAK,ZOHO_FETCH_ALL_ACTIVE_ITEMS=true,ZOHO_MAX_PAGES=20,ZOHO_PRODUCTS_CACHE_TTL_MS=86400000,ZOHO_PROMO_MIN_STOCK_ON_HAND=10" \
  --set-secrets "ZOHO_CLIENT_ID=ZOHO_CLIENT_ID:latest,ZOHO_CLIENT_SECRET=ZOHO_CLIENT_SECRET:latest,ZOHO_REFRESH_TOKEN=ZOHO_REFRESH_TOKEN:latest,ANTHROPIC_API_KEY=ANTHROPIC_API_KEY:latest,SUPABASE_SERVICE_ROLE_KEY=SUPABASE_SERVICE_ROLE_KEY:latest,SMTP_PASS=SMTP_PASS:latest"
```

Add `ZOHO_BOOKS_ORGANIZATION_ID=<id>` to `--set-env-vars` if the Zoho catalogue
sync is in use.

Why these flags:

- **`--memory 1Gi`** — `next/image` runs through sharp, and Cloud Run's
  filesystem is in-memory, so the ISR cache counts against this too. 512Mi is
  too tight.
- **`--min-instances 1`** — a cold Next.js start is a second or two. This is the
  main recurring cost; drop it to 0 if you would rather pay nothing while idle
  and accept the first-visit delay.

`NEXT_PUBLIC_*` values are inlined at build time, not read at runtime. Both have
in-code defaults matching production (WhatsApp `6281288885224`, PPN `0.11`), so
they need no build args unless those change.

## 4. Verify on the .run.app URL first

Before touching DNS, open the service URL Cloud Run prints and check:

- [ ] `/.well-known/assetlinks.json` returns JSON — **the Android app's domain
      verification depends on it.** If this 404s or is served as anything but
      JSON, the TWA loses verification and users see a Chrome URL bar over the
      site.
- [ ] Product pages and images load (`/_next/image` exercises sharp).
- [ ] **Send a test enquiry.** SMTP egress is the likeliest thing to break on
      Cloud Run: port 25 is blocked outright by Google Cloud, and 587 to
      `smtp.gmail.com` is the part to prove works here. If it fails, switch
      `src/lib/mailer.ts` to an email API instead of raw SMTP.
- [ ] AI chat replies (`/api/chat` → Anthropic).
- [ ] Sample and Catalogue requests reach VIABooks.

## 5. Domain

```bash
gcloud beta run domain-mappings create --service $SERVICE \
    --domain varindo.co.id --region $REGION
```

It prints the DNS records to add at your registrar and issues a managed
certificate. Domain mapping is not available in every region — if
`asia-southeast2` refuses, put a global external Application Load Balancer or
Firebase Hosting in front of the service instead, which also gets you a CDN.

Lower the DNS TTL a day before cutover, and leave Hostinger running until the
new records have propagated.

## Notes

- **Build architecture.** Cloud Build produces linux/amd64, which is what
  sharp's native binary needs. Building the image on an Apple Silicon Mac
  requires `docker build --platform linux/amd64`.
- **ISR cache.** Pages with `revalidate = 600` cache to the instance
  filesystem, which on Cloud Run is per-instance and in-memory. Instances
  revalidate independently and lose the cache when they scale down. Fine here —
  the catalogue is compiled into the build — but there is no shared cache.
- **Dead config.** `GOOGLE_SHEETS_WEBHOOK_URL` in `.env.example` is not read
  anywhere in `src/`. Don't carry it over.
- **`android/`** is excluded from the image by `.dockerignore`, along with every
  `.env*` file except the example.
- **Hostinger still works.** `npm run start` now prints `"next start" does not
  work with "output: standalone" configuration`, but it does still serve — pages,
  `/_next/static`, optimized images and `/.well-known/assetlinks.json` all
  verified on 15.5.20. So the current host stays a valid fallback through
  cutover. Once Cloud Run is live and Hostinger is retired, the canonical way to
  run the build outside a container is `node .next/standalone/server.js`.
