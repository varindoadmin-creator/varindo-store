# Deploying to Cloud Run

## The store vs. the live site

This repo is the Varindo store, `https://store.varindo.co.id`, on its own Cloud
Run service `varindo-store`. The live site, `https://varindo.co.id`, is service
`varindo-catalog`, deployed from the varindo-catalog repo. Both live in the same
project and region and share its secrets; nothing here should ever deploy to
`varindo-catalog` or touch the `varindo.co.id` domain mapping.

The rest of this file was written for the live site. Read every command with
`SERVICE=varindo-store` and `store.varindo.co.id`.

One-time store setup, not yet done:

```bash
# 1. First deploy: creates the service with the same config as the live site
gcloud run deploy varindo-store \
  --source . --region asia-southeast1 --project via-production-504006 \
  --allow-unauthenticated \
  --memory 1Gi --cpu 1 --min-instances 0 --max-instances 10 \
  --set-env-vars "SMTP_HOST=smtp.gmail.com,SMTP_PORT=587,SMTP_USER=contact@varindo.co.id,VIABOOKS_API_URL=https://viabooks-601025884976.asia-southeast2.run.app,VIABOOKS_ORGANIZATION_ID=cmtn75jst0001w12y30bcrr6h" \
  --set-secrets "ANTHROPIC_API_KEY=ANTHROPIC_API_KEY:latest,SMTP_PASS=SMTP_PASS:latest,VOYAGE_API_KEY=VOYAGE_API_KEY:latest,PRICE_LIST_TOKEN_SECRET=PRICE_LIST_TOKEN_SECRET:latest"

# 2. Deploy on push to main
gcloud builds repositories create varindo-store --region asia-southeast2 --project via-production-504006 \
  --connection viabooks-github --remote-uri https://github.com/varindoadmin-creator/varindo-store.git
gcloud builds triggers create github --name varindo-store-deploy-main \
  --region asia-southeast2 --project via-production-504006 \
  --repository projects/via-production-504006/locations/asia-southeast2/connections/viabooks-github/repositories/varindo-store \
  --branch-pattern '^main$' --build-config cloudbuild.yaml --ignored-files 'android/**' \
  --service-account projects/via-production-504006/serviceAccounts/601025884976-compute@developer.gserviceaccount.com

# 3. Subdomain
gcloud beta run domain-mappings create --service varindo-store --domain store.varindo.co.id \
  --region asia-southeast1 --project via-production-504006
# then add the CNAME it prints (store -> ghs.googlehosted.com.) to Cloud DNS zone varindo-co-id
```

Surface Match's upload bucket is left off the store for now, so store uploads
are not mixed in with the live site's. Request forms still land in the same
VIABooks organisation and `contact@varindo.co.id` inbox as the live site's.

## The live site (reference)

The site is a Next.js server (App Router, API routes, ISR), so it runs as a
container rather than as static files. `next.config.mjs` emits a standalone
build; the `Dockerfile` packages it.

Live since 12 Sep 2026: `https://varindo.co.id`, served by Cloud Run, with DNS
in Cloud DNS. Hostinger no longer serves the site.

```bash
PROJECT=via-production-504006
REGION=asia-southeast1          # Singapore — see "Why Singapore" below
SERVICE=varindo-store          # never varindo-catalog: that is the live site
```

## Why Singapore, not Jakarta

VIABooks runs in `asia-southeast2` (Jakarta) and that was the obvious home for
this too, but **Cloud Run domain mappings are not available in
`asia-southeast2`** — `domain-mappings create` there returns
`501 UNIMPLEMENTED`. `asia-southeast1` supports them. The service sits ~10–25ms
further from Indonesian visitors, and its calls to VIABooks now cross regions,
which only affects form submissions.

The alternative, if you ever want the service back in Jakarta, is a global
external Application Load Balancer in front of it — that supports apex domains
anywhere and adds a CDN, at the cost of a fixed monthly charge.

## Deploying a change

**Push to `main`.** Cloud Build trigger `varindo-catalog-deploy-main` builds
the `Dockerfile` from the pushed commit and deploys it (`cloudbuild.yaml`).
Pushes that only touch `android/` are ignored. Watch a build with:

```bash
gcloud builds list --region asia-southeast2 --project $PROJECT --limit 5
```

The trigger lives in `asia-southeast2` because that is where the GitHub
connection (`viabooks-github`, shared with VIABooks) is; it deploys to the
service in `$REGION`. It runs as the Compute Engine default service account,
like the VIABooks trigger.

A manual deploy still works, e.g. for a change you don't want to push yet:

```bash
gcloud run deploy $SERVICE --source . --region $REGION --project $PROJECT
```

`--source .` hands the working tree to Cloud Build, which uses the `Dockerfile`.
Environment variables and secrets persist across deploys; they only need the
flags below on a fresh service. Never add `--set-env-vars`/`--set-secrets` to
`cloudbuild.yaml` — they replace the whole set; use `--update-*` by hand.

One-time setup, for reference (already done 17 Sep 2026):

```bash
gcloud builds repositories create varindo-catalog --region asia-southeast2 --project $PROJECT \
  --connection viabooks-github --remote-uri https://github.com/varindoadmin-creator/varindo-catalog.git
gcloud builds triggers create github --name varindo-catalog-deploy-main \
  --region asia-southeast2 --project $PROJECT \
  --repository projects/$PROJECT/locations/asia-southeast2/connections/viabooks-github/repositories/varindo-catalog \
  --branch-pattern '^main$' --build-config cloudbuild.yaml --ignored-files 'android/**' \
  --service-account projects/$PROJECT/serviceAccounts/601025884976-compute@developer.gserviceaccount.com
```

## Service configuration

```bash
gcloud run deploy $SERVICE \
  --source . --region $REGION --project $PROJECT \
  --allow-unauthenticated \
  --memory 1Gi --cpu 1 --min-instances 0 --max-instances 10 \
  --set-env-vars "SMTP_HOST=smtp.gmail.com,SMTP_PORT=587,SMTP_USER=contact@varindo.co.id,VIABOOKS_API_URL=https://viabooks-601025884976.asia-southeast2.run.app,VIABOOKS_ORGANIZATION_ID=cmtn75jst0001w12y30bcrr6h,SURFACE_MATCH_UPLOAD_BUCKET=varindo-surface-match-uploads" \
  --set-secrets "ANTHROPIC_API_KEY=ANTHROPIC_API_KEY:latest,SMTP_PASS=SMTP_PASS:latest,VOYAGE_API_KEY=VOYAGE_API_KEY:latest,PRICE_LIST_TOKEN_SECRET=PRICE_LIST_TOKEN_SECRET:latest"
```

- **`--memory 1Gi`** — `next/image` runs through sharp, and Cloud Run's
  filesystem is in-memory, so the ISR cache counts against this too.
- **`--min-instances 0`** — scales to zero when idle, so an idle site costs
  almost nothing (switched from 1 on 13 Sep 2026). The trade-off is a cold
  start: the first request after a quiet spell waits a second or two, which
  can land on an ad click or the Android app's first launch. Set it back to 1
  with `gcloud run services update $SERVICE --min-instances 1` if that
  matters more than the idle cost.

`ANTHROPIC_API_KEY` and `SMTP_PASS` already exist in the project and are shared
with the `via` and `viabooks` services; `VOYAGE_API_KEY` and
`PRICE_LIST_TOKEN_SECRET` are this service's own (see Surface Match and Price
List below). `NEXT_PUBLIC_*` values are inlined at build time and have in-code
defaults matching production, so they need no build args.

## Price list (`PRICE_LIST_TOKEN_SECRET`)

The Lamitak price list is committed at `private/price-list/`, outside `public/`,
and is served only by `/api/price-list` to a browser carrying a token that
submitting `/request-price-list` minted. The tokens are signed with this
secret and stored nowhere, so any instance can verify what another minted —
which is what makes the gate work on a service that scales to several
containers.

There is no fallback value: without the secret the form refuses to submit and
says so, rather than releasing the file to everyone. **It must exist before the
website deploys**, or the feature is broken from its first request:

```bash
SA=$(gcloud run services describe $SERVICE --region $REGION --project $PROJECT \
  --format='value(spec.template.spec.serviceAccountName)')

openssl rand -base64 48 | tr -d '\n' \
  | gcloud secrets create PRICE_LIST_TOKEN_SECRET --project $PROJECT --data-file=-
gcloud secrets add-iam-policy-binding PRICE_LIST_TOKEN_SECRET --project $PROJECT \
  --member="serviceAccount:$SA" --role=roles/secretmanager.secretAccessor

gcloud run services update $SERVICE --region $REGION --project $PROJECT \
  --update-secrets PRICE_LIST_TOKEN_SECRET=PRICE_LIST_TOKEN_SECRET:latest
```

Rotating it is safe and costs nothing but the tokens in flight: add a new
secret version, redeploy, and anyone mid-download fills the short form in
again.

Replacing the PDF is a commit to `private/price-list/` — the filename is read
by `src/app/api/price-list/route.ts`, and `next.config.mjs` copies the folder
into the standalone build through `outputFileTracingIncludes`. Nothing traces
a file nobody imports, so a new folder there needs that entry updated too or
the container ships without it.

## Surface Match (search by photo)

`/surface-match` sends a photo to `/api/surface-match`, which reads any printed
code with Claude and otherwise compares the photo against an embedding of every
swatch. Two Cloud Storage objects are involved:

- **The index** — `gs://varindo-product-images/embeddings/voyage-multimodal-3.5.json`,
  public like the swatches beside it. The service fetches it at runtime and
  refreshes hourly, so rebuilding it needs no deploy. Rebuild whenever swatches
  change; the script prints the publish command:

  ```bash
  npm run embed:swatches
  ```

- **Uploads** — kept for 30 days in a private bucket so match quality can be
  reviewed against real photos. The privacy policy states the 30 days, so the
  lifecycle rule must stay in step with it. One-time setup:

  ```bash
  gcloud storage buckets create gs://varindo-surface-match-uploads \
    --project $PROJECT --location $REGION --uniform-bucket-level-access --public-access-prevention
  echo '{"rule":[{"action":{"type":"Delete"},"condition":{"age":30}}]}' > /tmp/lifecycle.json
  gcloud storage buckets update gs://varindo-surface-match-uploads --lifecycle-file=/tmp/lifecycle.json

  SA=$(gcloud run services describe $SERVICE --region $REGION --project $PROJECT \
    --format='value(spec.template.spec.serviceAccountName)')
  gcloud storage buckets add-iam-policy-binding gs://varindo-surface-match-uploads \
    --member="serviceAccount:$SA" --role=roles/storage.objectCreator

  printf '%s' "$VOYAGE_API_KEY" | gcloud secrets create VOYAGE_API_KEY --project $PROJECT --data-file=-
  gcloud secrets add-iam-policy-binding VOYAGE_API_KEY --project $PROJECT \
    --member="serviceAccount:$SA" --role=roles/secretmanager.secretAccessor
  ```

  If `SA` comes back empty the service runs as the Compute Engine default
  account, `<project-number>-compute@developer.gserviceaccount.com`.

## DNS

`varindo.co.id` is served by Cloud DNS zone `varindo-co-id` in the same project.
The registrar (Hostinger) delegates to:

```
ns-cloud-e1.googledomains.com    ns-cloud-e3.googledomains.com
ns-cloud-e2.googledomains.com    ns-cloud-e4.googledomains.com
```

`scripts/cloud-dns-import.sh` is the record set as migrated, for reference.
The apex is A/AAAA records from the domain mapping — Cloud DNS has no ALIAS
type, which is what Hostinger used. Records still pointing at Hostinger
(`ftp`, `via`, `autodiscover`, `autoconfig`, and the Hostinger include in SPF)
can be dropped once that account is closed.

Email is unaffected by any of this: MX points at Google Workspace
(`smtp.google.com`) and always did.

## Certificates — the one real trap

Google issues the managed certificate only once DNS points at the mapping, and
**its first attempt fires within minutes of the mapping being created**. If DNS
hasn't propagated by then the challenge fails, and the retry timer is long —
an hour passed with no second attempt during the migration.

The fix is to delete and recreate the mapping once DNS is confirmed propagated,
which forces a fresh challenge:

```bash
gcloud beta run domain-mappings delete --domain varindo.co.id --region $REGION --project $PROJECT
gcloud beta run domain-mappings create --service $SERVICE --domain varindo.co.id --region $REGION --project $PROJECT
```

That took the apex from stuck to issued in ~13 minutes. Watch with:

```bash
gcloud beta run domain-mappings describe --domain varindo.co.id --region $REGION --project $PROJECT \
    --format="yaml(status.conditions)"
```

`Certificate issuance pending.` on its own means the challenge passed and it is
issuing. The same message with *"challenge data was not visible through the
public internet"* means DNS was not yet visible and it is waiting to retry.

After the certificate reports active, the edge still takes a few minutes to
serve it — a TLS handshake failure in that window is expected.

## Verifying a deploy

```bash
for p in / /products /contact /.well-known/assetlinks.json; do
  curl -s -o /dev/null -w "$p %{http_code}\n" https://varindo.co.id$p
done
```

- [ ] `/.well-known/assetlinks.json` returns JSON — **the Android app's domain
      verification depends on it.** If it 404s or is served as anything but
      JSON, the TWA loses verification and users get a Chrome URL bar over the
      site.
- [ ] Product pages and images load (`/_next/image` exercises sharp).
- [ ] A test enquiry sends. SMTP egress from Cloud Run was the main open risk in
      this migration and it **works** — `smtp.gmail.com:587` as
      `contact@varindo.co.id`, verified end to end on the live domain.
- [ ] AI chat replies (`/api/chat` → Anthropic).
- [ ] Surface Match returns matches for a swatch photo, and the upload appears
      in `gs://varindo-surface-match-uploads/uploads/`.
- [ ] Sample and Catalogue requests reach VIABooks.

## Notes

- **Build architecture.** Cloud Build produces linux/amd64, which is what
  sharp's native binary needs. Building the image on an Apple Silicon Mac
  requires `docker build --platform linux/amd64`.
- **ISR cache.** Pages with `revalidate = 600` cache to the instance
  filesystem, which on Cloud Run is per-instance and in-memory. Instances
  revalidate independently and lose the cache when they scale down. Fine here —
  the catalogue is compiled into the build — but there is no shared cache.
- **`android/`** is excluded from the image by `.dockerignore`, along with every
  `.env*` file except the example.
