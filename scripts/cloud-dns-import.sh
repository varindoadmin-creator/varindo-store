#!/usr/bin/env bash
# Populate the Cloud DNS zone for varindo.co.id.
#
# Mirrors the 11 records read out of Hostinger's zone on 2026-09-12, with two
# deliberate changes for the Cloud Run migration:
#   - apex: Hostinger's ALIAS -> varindo.co.id.cdn.hstgr.net becomes the A/AAAA
#     records from the Cloud Run domain mapping. Cloud DNS has no ALIAS type,
#     and the apex has to leave the Hostinger CDN anyway.
#   - www:  CNAME -> www.varindo.co.id.cdn.hstgr.net becomes ghs.googlehosted.com.
#
# Everything else is carried across untouched: MX (Google Workspace), all three
# TXT records, the mail autodiscovery CNAMEs, and the ftp/via subdomains that
# still point at Hostinger (46.202.138.17).
#
# Run once, then verify against the zone's own nameservers before changing the
# registrar's delegation:
#   dig @ns-cloud-e1.googledomains.com varindo.co.id ANY

set -euo pipefail

Z=varindo-co-id
P=via-production-504006
add() { gcloud dns record-sets transaction add --zone="$Z" --project="$P" "$@" >/dev/null; }

gcloud dns record-sets transaction start --zone="$Z" --project="$P"

# ── apex: Cloud Run (varindo-catalog, asia-southeast1) ────────────────
add --name="varindo.co.id." --type=A    --ttl=300 \
    216.239.32.21 216.239.34.21 216.239.36.21 216.239.38.21
add --name="varindo.co.id." --type=AAAA --ttl=300 \
    2001:4860:4802:32::15 2001:4860:4802:34::15 \
    2001:4860:4802:36::15 2001:4860:4802:38::15
add --name="www.varindo.co.id." --type=CNAME --ttl=300 "ghs.googlehosted.com."

# ── email: Google Workspace, unchanged ────────────────────────────────
add --name="varindo.co.id." --type=MX --ttl=3600 "1 smtp.google.com."
add --name="varindo.co.id." --type=TXT --ttl=300 \
    "google-site-verification=3OQ2o384S0-hyZZ7oCS2BI-aOb5Q3c6HSD8g4U-vDtk" \
    "v=spf1 include:_spf.google.com ~all" \
    "v=spf1 include:_spf.mail.hostinger.com ~all"
add --name="autodiscover.varindo.co.id." --type=CNAME --ttl=300 "autodiscover.mail.hostinger.com."
add --name="autoconfig.varindo.co.id."   --type=CNAME --ttl=300 "autoconfig.mail.hostinger.com."

# ── subdomains still served by Hostinger ──────────────────────────────
add --name="ftp.varindo.co.id." --type=A    --ttl=1800 46.202.138.17
add --name="via.varindo.co.id." --type=A    --ttl=1800 46.202.138.17
add --name="via.varindo.co.id." --type=AAAA --ttl=1800 "2a02:4780:6:1885:0:2b54:d562:4"

gcloud dns record-sets transaction execute --zone="$Z" --project="$P"
