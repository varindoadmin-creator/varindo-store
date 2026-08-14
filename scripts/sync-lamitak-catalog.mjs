import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const csvPath = path.join(process.cwd(), 'public', 'data', 'lamitak-products.csv');
const officialBaseUrl = 'https://www.lamitak.com';
const appendedHeaders = ['Newedge Code 23mm', 'Newedge Code 44mm', 'Lamitak URL'];

function normalizeCode(value) {
  return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

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
  const headers = rows.shift().map((header) => header.replace(/^\uFEFF/, ''));
  return { headers, records: rows.filter((values) => values.some(Boolean)).map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] || '']))
  ) };
}

function encodeCsvCell(value) {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

async function fetchOfficialProducts() {
  const products = [];
  for (let page = 1; ; page += 1) {
    const response = await fetch(`${officialBaseUrl}/products.json?limit=250&page=${page}`, {
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) throw new Error(`Lamitak product feed failed: ${response.status}`);
    const batch = (await response.json()).products || [];
    products.push(...batch);
    if (batch.length < 250) return products;
  }
}

const officialProducts = await fetchOfficialProducts();
const officialByCode = new Map();
for (const product of officialProducts) {
  for (const variant of product.variants || []) {
    const codes = String(variant.sku || '').split(',').map((value) => value.trim()).filter(Boolean);
    const articleCodes = codes.filter((code) => !code.includes('/'));
    const edgeCodes = codes.filter((code) => code.includes('/'));
    const edge23 = edgeCodes.find((code) => /\/23/i.test(code)) || '';
    const edge44 = edgeCodes.find((code) => /\/44/i.test(code)) || '';
    for (const code of articleCodes) {
      officialByCode.set(normalizeCode(code), {
        code,
        design: variant.title,
        edge23,
        edge44,
        url: `${officialBaseUrl}/products/${product.handle}`,
      });
    }
  }
}

const { headers: originalHeaders, records } = parseCsv(fs.readFileSync(csvPath, 'utf8'));
const headers = [...originalHeaders.filter((header) => !appendedHeaders.includes(header)), ...appendedHeaders];
const retained = [];
const removed = [];
const seen = new Set();

for (const record of records) {
  const key = normalizeCode(record.Code);
  const official = officialByCode.get(key);
  if (!official || seen.has(key)) {
    removed.push({ code: record.Code, reason: official ? 'duplicate' : 'not on lamitak.com' });
    continue;
  }
  seen.add(key);
  record['Design Name'] = official.design.toUpperCase();
  const sizeLabel = record['CF.Size'].includes("4'x10'") ? "4'x10'" : "4'x8'";
  const officialName = `${record.Code.trim()} - LAMITAK HPL ${sizeLabel} | ${official.design.toUpperCase()}`;
  record['Item Name'] = officialName;
  record['Product Name'] = officialName;
  record['Newedge Code 23mm'] = official.edge23;
  record['Newedge Code 44mm'] = official.edge44;
  record['Lamitak URL'] = official.url;
  retained.push(record);
}

const missing = [...officialByCode.values()].filter((official) => !seen.has(normalizeCode(official.code)));
if (missing.length) {
  console.error('Official items missing locally; prices are required before they can be added:');
  for (const item of missing) console.error(`- ${item.code} | ${item.design} | ${item.url}`);
  process.exit(2);
}

const csv = `\uFEFF${headers.map(encodeCsvCell).join(',')}\n${retained
  .map((record) => headers.map((header) => encodeCsvCell(record[header])).join(','))
  .join('\n')}\n`;
fs.writeFileSync(csvPath, csv);

const generation = spawnSync(process.execPath, ['scripts/import-products-from-csv.mjs'], {
  cwd: process.cwd(),
  stdio: 'inherit',
});
if (generation.status !== 0) process.exit(generation.status || 1);

console.log(`Official products: ${officialProducts.length}`);
console.log(`Official article codes: ${officialByCode.size}`);
console.log(`Retained local items: ${retained.length}`);
console.log(`Removed local rows: ${removed.length}`);
for (const item of removed) console.log(`- ${item.code}: ${item.reason}`);
