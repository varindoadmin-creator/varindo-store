'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

type Status = 'idle' | 'submitting' | 'error';

export function RequestPriceListForm() {
  const { lang }  = useLang();
  const router    = useRouter();
  const [name,    setName]    = useState('');
  const [address, setAddress] = useState('');
  const [phone,   setPhone]   = useState('');
  const [status,  setStatus]  = useState<Status>('idle');
  const [errMsg,  setErrMsg]  = useState('');

  const canSubmit = Boolean(name.trim() && address.trim() && phone.trim() && status !== 'submitting');

  // No success panel here, unlike the other three forms: what this one is for
  // is the file, so a submission that worked ends on the download page rather
  // than on a message saying somebody will be in touch. The submission sets
  // the cookie that opens that page, so the navigation has to come after it.
  const handleSubmit = async () => {
    if (!canSubmit) return;
    setStatus('submitting');
    setErrMsg('');
    try {
      const res  = await fetch('/api/submit-request', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ type: 'price-list', name: name.trim(), address: address.trim(), phone: phone.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/request-price-list/download');
      } else {
        setStatus('error');
        setErrMsg(data.error || t('forms', 'serverError', lang));
      }
    } catch {
      setStatus('error');
      setErrMsg(t('forms', 'networkError', lang));
    }
  };

  return (
    <div className="rounded-card bg-varindo-canvas">
      <div className="px-7 pt-7 pb-1">
        <p className="text-[21px] font-semibold tracking-[-0.01em] text-varindo-ink">
          {t('forms', 'yourDetails', lang)}
        </p>
      </div>

      <div className="p-6 space-y-5">
        <label className="block">
          <span className="label mb-2 block">
            {t('forms', 'nameLabel', lang)} <span className="text-varindo-ember">*</span>
          </span>
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder={t('forms', 'namePlaceholder', lang)}
            className="field w-full" autoComplete="organization"
          />
        </label>

        <label className="block">
          <span className="label mb-2 block">
            {t('forms', 'addressLabel', lang)} <span className="text-varindo-ember">*</span>
          </span>
          <textarea
            value={address} onChange={(e) => setAddress(e.target.value)}
            placeholder={t('forms', 'addressPlaceholder', lang)}
            rows={3} className="field h-auto w-full resize-none py-3"
          />
        </label>

        <label className="block">
          <span className="label mb-2 block">
            {t('forms', 'phoneLabel', lang)} <span className="text-varindo-ember">*</span>
          </span>
          <input
            type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder={t('forms', 'phonePlaceholder', lang)}
            className="field w-full" autoComplete="tel"
          />
        </label>
      </div>

      {status === 'error' && (
        <div className="border-t border-red-200 bg-red-50 px-6 py-3">
          <p className="text-[14px] font-medium text-red-700">{errMsg}</p>
        </div>
      )}

      <div className="px-6 py-5 border-t border-varindo-line/50 bg-varindo-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-[12px] text-varindo-mid">
          {canSubmit ? t('forms', 'readyMsg', lang) : t('forms', 'fillAllMsg', lang)}
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
                <path d="M10 2.5v11m0 0l-4-4m4 4l4-4M3 16.5h14"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('forms', 'priceListSubmitBtn', lang)}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
