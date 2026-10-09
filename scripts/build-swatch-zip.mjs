// Builds the downloadable zip of every Lamitak swatch and publishes it beside
// the swatches, at gs://varindo-product-images/downloads/lamitak-swatches.zip —
// the "Lamitak Swatches (ZIP)" link in the footer's Resources.
//
// One image per design, as the site keeps them: a 4'x8' code and its 4'x10'
// twin are the same design and share one swatch. Each file is named so a
// customer can find it without the site, "WY 5217D, WY 15217D - HERMES
// MARCELLO WALNUT.webp", rather than by the bucket's design slug.
//
// The catalogue (public/data/lamitak-products.csv) decides what goes in, so a
// swatch left in the bucket for a design no longer sold is not shipped, and a
// design whose swatch is missing is reported rather than failing the zip.
//
// Run after swatches are added or replaced: npm run zip:swatches
// Needs gcloud signed in with write access to the bucket; the swatches
// themselves are read over their public URLs.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const csvPath = path.join(process.cwd(), 'public', 'data', 'lamitak-products.csv');
const SWATCH_BASE = 'https://storage.googleapis.com/varindo-product-images/swatches';
const DESTINATION = 'gs://varindo-product-images/downloads/lamitak-swatches.zip';
const FOLDER = 'Lamitak Swatches';

function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') { cell += '"'; index += 1; }
      else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(cell); cell = ''; }
    else if (char === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; }
    else cell += char;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const headers = rows.shift().map((header) => header.replace(/^﻿/, ''));
  return rows.filter((values) => values.some(Boolean)).map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] || '']))
  );
}

// The same naming as src/lib/productImages.ts toSwatchSlug — the bucket's
// files are keyed by it.
function toSwatchSlug(design) {
  return design
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[®™]/g, '')
    .replace(/['’]/g, '')
    .replace(/dri-matt/gi, 'drimatt')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Safe on Windows and macOS: no slashes, colons or the like in a file name.
const fileSafe = (name) => name.replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim();

const records = parseCsv(fs.readFileSync(csvPath, 'utf8'));
const designs = new Map(); // slug -> { design, codes:Set }
for (const record of records) {
  const design = (record['Design Name'] || '').trim();
  const code = (record['Code'] || '').trim();
  if (!design || !code) continue;
  const slug = toSwatchSlug(design);
  if (!slug) continue;
  if (!designs.has(slug)) designs.set(slug, { design, codes: new Set() });
  designs.get(slug).codes.add(code);
}

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'lamitak-swatches-'));
const folder = path.join(work, FOLDER);
fs.mkdirSync(folder);
const missing = [];
let written = 0;
let bytes = 0;

const entries = [...designs.entries()].sort(([, a], [, b]) => a.design.localeCompare(b.design));
for (const [slug, { design, codes }] of entries) {
  const response = await fetch(`${SWATCH_BASE}/${slug}.webp`, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) {
    missing.push(`${design} (${[...codes].join(', ')})`);
    continue;
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const name = fileSafe(`${[...codes].sort().join(', ')} - ${design}`) + '.webp';
  fs.writeFileSync(path.join(folder, name), buffer);
  written += 1;
  bytes += buffer.length;
}

const zipPath = path.join(work, 'lamitak-swatches.zip');
// -X leaves out macOS extra attributes; the images are already compressed, so
// storing them (-0) makes the same size zip much faster.
const zipped = spawnSync('zip', ['-q', '-r', '-X', '-0', zipPath, FOLDER], { cwd: work, stdio: 'inherit' });
if (zipped.status !== 0) throw new Error('zip failed');
const zipBytes = fs.statSync(zipPath).size;

const upload = spawnSync('gcloud', [
  'storage', 'cp', zipPath, DESTINATION,
  '--content-type=application/zip',
  '--content-disposition=attachment; filename="Lamitak-Swatches.zip"',
  // Rebuilt in place, so a browser or edge cache must not keep an old one long.
  '--cache-control=public, max-age=3600',
], { stdio: 'inherit' });
if (upload.status !== 0) throw new Error('upload failed');

fs.rmSync(work, { recursive: true, force: true });
const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(`Published ${DESTINATION}: ${written} swatches, ${mb(zipBytes)} MB (${mb(bytes)} MB of images).`);
if (missing.length) {
  console.log(`No swatch in the bucket for ${missing.length} design(s), left out:`);
  for (const line of missing) console.log(`  ${line}`);
}
