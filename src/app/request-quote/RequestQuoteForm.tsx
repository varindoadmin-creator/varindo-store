'use client';

import { useState } from 'react';
import { ProductCodeInput, type ProductOption } from '@/components/ProductCodeInput';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

const MAX = 10;
type Row    = { code: string; qty: string };
type Status = 'idle' | 'submitting' | 'success' | 'error';

const emptyRows = (): Row[] => Array.from({ length: MAX }, () => ({ code: '', qty: '' }));

function isValidQty(qty: string) {
  const n = Number(qty.trim());
  return Number.isInteger(n) && n > 0;
}
// A quantity only has to be there once a code is — an empty row is just an
// unused slot, not a mistake.
function rowHasError(row: Row) {
  return row.code.trim() !== '' && !isValidQty(row.qty);
}

export function RequestQuoteForm({ products, initialCode }: { products: ProductOption[]; initialCode?: string }) {
  const { lang } = useLang();

  const [rows,    setRows]    = useState<Row[]>(() => {
    const slots = emptyRows();
    if (initialCode) slots[0] = { code: initialCode, qty: '' };
    return slots;
  });
  const [name,    setName]    = useState('');
  const [address, setAddress] = useState('');
  const [phone,   setPhone]   = useState('');
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

  const reset = () => { setRows(emptyRows()); setName(''); setAddress(''); setPhone(''); setStatus('idle'); setErrMsg(''); };

  /* ── Success ─────────────────────────────────────────────── */
  if (status === 'success') {
    return (
      <div className="rounded-card bg-varindo-canvas">
        <div className="px-8 py-14 flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 border-2 border-varindo-gold flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M4 12.5L9 17.5L20 7" stroke="#a8763e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="label mb-3">{t('forms', 'successLabel', lang)}</p>
            <h2 className="display text-varindo-ink text-[32px] sm:text-[40px] mb-4">
              {t('forms', 'quoteSuccessTitle', lang)}
            </h2>
            <p className="text-[16px] leading-7 text-varindo-mid max-w-sm mx-auto">
              {t('forms', 'quoteSuccessBody', lang, { phone })}
            </p>
          </div>
          <div className="w-full max-w-sm rounded-card bg-varindo-canvas text-left">
            <div className="px-6 pt-6 pb-1">
              <p className="text-[21px] font-semibold tracking-[-0.01em] text-varindo-ink">
                {t('forms', 'requestSummary', lang)}
              </p>
            </div>
            <div className="divide-y divide-varindo-line/60">
              {filledRows.map((r, i) => (
                <div key={i} className="flex items-baseline gap-3 px-5 py-3">
                  <span className="text-[12px] text-varindo-mid w-4 shrink-0">{i + 1}</span>
                  <span className="text-[14px] font-medium text-varindo-ink flex-1">{r.code}</span>
                  <span className="mono text-[12px] text-varindo-mid shrink-0">×{r.qty}</span>
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
    <div className="rounded-card bg-varindo-canvas">
      <div className="px-7 pt-7 pb-1 flex items-center justify-between gap-4">
        <p className="text-[21px] font-semibold tracking-[-0.01em] text-varindo-ink">
          {t('forms', 'productListTitle', lang)}
        </p>
        {filledCount > 0 && (
          <span className="text-[12px] font-semibold text-varindo-link">
            {t('forms', 'itemsOf', lang, { n: filledCount, max: MAX })}
          </span>
        )}
      </div>

      <div className="p-6 space-y-5">
        {/* Product rows — code and how many of it to price */}
        <div>
          <div className="overflow-hidden rounded-xl2 bg-varindo-paper">
            <div className="grid grid-cols-[2.5rem_1fr_5.5rem] border-b border-varindo-line/60">
              <span className="label px-2 py-2.5 text-center">#</span>
              <span className="label px-3 py-2.5 border-l border-varindo-line/40">
                {t('forms', 'codeColumnHeader', lang)} <span className="text-varindo-ember">*</span>
              </span>
              <span className="label px-2 py-2.5 border-l border-varindo-line/40 text-center">
                {t('forms', 'qtyColumnHeader', lang)} <span className="text-varindo-ember">*</span>
              </span>
            </div>
            <div className="divide-y divide-varindo-line/60">
              {rows.map((row, i) => (
                <div key={i} className={`grid grid-cols-[2.5rem_1fr_5.5rem] transition-colors ${rowHasError(row) ? 'bg-red-50/50' : ''}`}>
                  <span className="flex items-center justify-center border-r border-varindo-line/40 text-[12px] font-medium text-varindo-mid">
                    {i + 1}
                  </span>
                  <div className="relative border-r border-varindo-line/40">
                    <ProductCodeInput
                      products={products} value={row.code} onChange={(code) => updateCode(i, code)}
                      placeholder={i === 0 ? t('forms', 'codePlaceholder', lang) : ''}
                    />
                  </div>
                  <input
                    type="number" min="1" step="1" inputMode="numeric" value={row.qty}
                    onChange={(e) => updateQty(i, e.target.value)}
                    placeholder={i === 0 ? t('forms', 'qtyPlaceholder', lang) : ''}
                    aria-label={t('forms', 'qtyColumnHeader', lang)}
                    aria-invalid={rowHasError(row)}
                    className={`h-10 w-full bg-transparent px-2 text-center text-[14px] outline-none transition-colors placeholder:text-varindo-mid ${
                      rowHasError(row) ? 'text-red-600' : 'text-varindo-ink'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
          <p className="mt-2 text-[12px] text-varindo-mid">
            {t('forms', 'quoteMaxLabel', lang, { n: MAX })}
          </p>
        </div>

        <div className="border-t border-varindo-line/50" />

        <label className="block">
          <span className="label mb-2 block">
            {t('forms', 'nameLabel', lang)} <span className="text-varindo-ember">*</span>
          </span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder={t('forms', 'namePlaceholder', lang)} className="field w-full" autoComplete="organization" />
        </label>

        <label className="block">
          <span className="label mb-2 block">
            {t('forms', 'addressLabel', lang)} <span className="text-varindo-ember">*</span>
          </span>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)}
            placeholder={t('forms', 'addressPlaceholder', lang)} rows={3} className="field h-auto w-full resize-none py-3" />
        </label>

        <label className="block">
          <span className="label mb-2 block">
            {t('forms', 'phoneLabel', lang)} <span className="text-varindo-ember">*</span>
          </span>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder={t('forms', 'phonePlaceholder', lang)} className="field w-full" autoComplete="tel" />
        </label>
      </div>

      {status === 'error' && (
        <div className="border-t border-red-200 bg-red-50 px-6 py-3">
          <p className="text-[14px] font-medium text-red-700">{errMsg}</p>
        </div>
      )}

      <div className="px-6 py-5 border-t border-varindo-line/50 bg-varindo-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-[12px] text-varindo-mid">
          {hasQtyErrors
            ? t('forms', 'qtyError', lang)
            : canSubmit
            ? t('forms', 'readyQuote', lang, { n: filledCount })
            : t('forms', 'fillProduct', lang)}
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
  );
}
