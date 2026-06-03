'use client';

import { useState } from 'react';
import { ProductCodeInput, type ProductOption } from '@/components/ProductCodeInput';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

const ROWS = 10;

type Row    = { code: string; qty: string };
type Status = 'idle' | 'submitting' | 'success' | 'error';

const emptyRows = (): Row[] => Array.from({ length: ROWS }, () => ({ code: '', qty: '' }));

function isValidQty(qty: string) {
  const n = Number(qty.trim());
  return Number.isFinite(n) && n > 0;
}
function rowHasError(row: Row) {
  return row.code.trim() !== '' && !isValidQty(row.qty);
}

export function RequestQuoteForm({ products }: { products: ProductOption[] }) {
  const { lang } = useLang();

  const [name,    setName]    = useState('');
  const [address, setAddress] = useState('');
  const [phone,   setPhone]   = useState('');
  const [rows,    setRows]    = useState<Row[]>(emptyRows());
  const [status,  setStatus]  = useState<Status>('idle');
  const [errMsg,  setErrMsg]  = useState('');

  const updateCode = (i: number, code: string) =>
    setRows((p) => p.map((r, idx) => idx === i ? { ...r, code } : r));
  const updateQty = (i: number, qty: string) =>
    setRows((p) => p.map((r, idx) => idx === i ? { ...r, qty } : r));

  const filledRows   = rows.filter((r) => r.code.trim());
  const filledCount  = filledRows.length;
  const hasQtyErrors = rows.some(rowHasError);
  const canSubmit    = Boolean(
    name.trim() && address.trim() && phone.trim() &&
    filledCount > 0 && !hasQtyErrors && status !== 'submitting'
  );

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setStatus('submitting');
    setErrMsg('');
    try {
      const res  = await fetch('/api/submit-request', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          type: 'quote', name: name.trim(), address: address.trim(), phone: phone.trim(),
          items: filledRows.map((r) => ({ code: r.code.trim(), qty: r.qty.trim() })),
        }),
      });
      const data = await res.json();
      data.success ? setStatus('success') : (setStatus('error'), setErrMsg(data.error || t('forms', 'serverError', lang)));
    } catch {
      setStatus('error');
      setErrMsg(t('forms', 'networkError', lang));
    }
  };

  const reset = () => { setName(''); setAddress(''); setPhone(''); setRows(emptyRows()); setStatus('idle'); setErrMsg(''); };

  /* ── Success ─────────────────────────────────────────────── */
  if (status === 'success') {
    return (
      <div className="border border-varindo-line bg-white">
        <div className="px-8 py-14 flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 border-2 border-varindo-gold flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M4 12.5L9 17.5L20 7" stroke="#a8763e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="label text-varindo-gold mb-3">{t('forms', 'successLabel', lang)}</p>
            <h2 className="display text-varindo-ink text-3xl sm:text-4xl mb-4">
              {t('forms', 'quoteSuccessTitle', lang)}
            </h2>
            <p className="text-[14px] leading-7 text-varindo-500 max-w-sm mx-auto">
              {t('forms', 'quoteSuccessBody', lang, { phone })}
            </p>
          </div>
          <div className="w-full max-w-sm border border-varindo-line bg-varindo-50 text-left">
            <div className="border-b border-varindo-line px-5 py-3 bg-white">
              <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-varindo-700">
                {t('forms', 'requestSummary', lang)}
              </p>
            </div>
            <div className="divide-y divide-varindo-line/60">
              {([
                [lang === 'id' ? 'Nama'    : 'Name',     name],
                [lang === 'id' ? 'Telepon' : 'Phone',    phone],
                [lang === 'id' ? 'Produk'  : 'Products', `${filledCount} ${t('forms', 'summaryProducts', lang)}`],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="flex items-baseline gap-3 px-5 py-3">
                  <span className="text-[10px] tracking-[0.14em] uppercase text-varindo-400 w-16 shrink-0">{label}</span>
                  <span className="text-[13px] font-medium text-varindo-ink">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <button type="button" onClick={reset} className="btn-ghost mt-2">
            {t('forms', 'submitAnother', lang)}
          </button>
        </div>
      </div>
    );
  }

  /* ── Form ────────────────────────────────────────────────── */
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-start">

      {/* Left — contact details */}
      <div className="border border-varindo-line bg-white">
        <div className="border-b border-varindo-line px-6 py-4 bg-varindo-50">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-700">
            {t('forms', 'yourDetails', lang)}
          </p>
        </div>
        <div className="p-6 space-y-5">
          <label className="block">
            <span className="label text-varindo-600 mb-2 block">
              {t('forms', 'nameLabel', lang)} <span className="text-varindo-gold">*</span>
            </span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder={t('forms', 'namePlaceholder', lang)} className="field w-full" autoComplete="organization" />
          </label>
          <label className="block">
            <span className="label text-varindo-600 mb-2 block">
              {t('forms', 'addressLabel', lang)} <span className="text-varindo-gold">*</span>
            </span>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)}
              placeholder={t('forms', 'addressPlaceholder', lang)} rows={3} className="field w-full resize-none py-3" />
          </label>
          <label className="block">
            <span className="label text-varindo-600 mb-2 block">
              {t('forms', 'phoneLabel', lang)} <span className="text-varindo-gold">*</span>
            </span>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder={t('forms', 'phonePlaceholder', lang)} className="field w-full" autoComplete="tel" />
          </label>
          <div className="pt-2 border-t border-varindo-line/60">
            <p className="text-[11px] text-varindo-400 leading-5">{t('forms', 'contactNote', lang)}</p>
          </div>
        </div>
      </div>

      {/* Right — product table */}
      <div className="border border-varindo-line bg-white">
        <div className="border-b border-varindo-line px-6 py-4 bg-varindo-50 flex items-center justify-between gap-4">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-700">
            {t('forms', 'productListTitle', lang)}
          </p>
          {filledCount > 0 && (
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-varindo-gold">
              {t('forms', 'itemsAdded', lang, { n: filledCount })}
            </span>
          )}
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[2rem_1fr_5.5rem] bg-varindo-50 border-b border-varindo-line text-[10px] font-semibold tracking-[0.16em] uppercase text-varindo-500">
          <div className="px-3 py-3 text-center">#</div>
          <div className="px-4 py-3 border-l border-varindo-line/50">{t('forms', 'codeColumnHeader', lang)}</div>
          <div className="px-3 py-3 border-l border-varindo-line/50 text-center">{t('forms', 'qtyColumnHeader', lang)}</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-varindo-line/50">
          {rows.map((row, i) => (
            <div key={i} className={`grid grid-cols-[2rem_1fr_5.5rem] transition-colors ${rowHasError(row) ? 'bg-red-50/40' : ''}`}>
              <div className="flex items-center justify-center border-r border-varindo-line/40">
                <span className="text-[11px] text-varindo-400 font-medium">{i + 1}</span>
              </div>
              <div className="border-r border-varindo-line/40 relative">
                <ProductCodeInput
                  products={products} value={row.code} onChange={(code) => updateCode(i, code)}
                  placeholder={i === 0 ? t('forms', 'codePlaceholder', lang) : ''}
                />
              </div>
              <div>
                <input
                  type="number" min="1" step="1" value={row.qty}
                  onChange={(e) => updateQty(i, e.target.value)}
                  placeholder={i === 0 ? t('forms', 'qtyPlaceholder', lang) : ''}
                  className={`w-full h-10 px-3 text-[13px] bg-transparent outline-none placeholder:text-varindo-300 focus:bg-varindo-50 transition-colors text-center ${
                    rowHasError(row) ? 'text-red-600' : 'text-varindo-ink'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        {status === 'error' && (
          <div className="border-t border-red-200 bg-red-50 px-6 py-3">
            <p className="text-[12px] font-medium text-red-700">{errMsg}</p>
          </div>
        )}

        <div className="px-6 py-5 border-t border-varindo-line bg-varindo-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[11px] text-varindo-400">
            {hasQtyErrors
              ? t('forms', 'qtyError', lang)
              : filledCount === 0
              ? t('forms', 'fillProduct', lang)
              : t('forms', 'readyQuote', lang, { n: filledCount })}
          </p>
          <button
            type="button" onClick={handleSubmit} disabled={!canSubmit}
            className="btn-ink disabled:opacity-40 disabled:cursor-not-allowed shrink-0 min-w-[160px] justify-center"
          >
            {status === 'submitting' ? (
              <>
                <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t('forms', 'submitting', lang)}
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M17.5 2.5L9.167 10.833M17.5 2.5L12.5 17.5l-3.333-6.667L2.5 7.5l15-5z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t('forms', 'submitBtn', lang)}
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
