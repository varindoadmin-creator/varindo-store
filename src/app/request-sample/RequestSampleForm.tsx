'use client';

import { useState } from 'react';
import { ProductCodeInput, type ProductOption } from '@/components/ProductCodeInput';
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

const MAX_SAMPLES = 5;
type Status = 'idle' | 'submitting' | 'success' | 'error';
type Props  = { products: ProductOption[] };

export function RequestSampleForm({ products }: Props) {
  const { lang } = useLang();
  const [samples, setSamples] = useState<string[]>(Array(MAX_SAMPLES).fill(''));
  const [name, setName]       = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone]     = useState('');
  const [status, setStatus]   = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const updateSample = (i: number, code: string) => setSamples(prev => prev.map((s, idx) => idx===i ? code : s));
  const filledSamples = samples.filter(s => s.trim());
  const filledCount   = filledSamples.length;
  const canSubmit     = name.trim() && address.trim() && phone.trim() && filledCount > 0 && status !== 'submitting';

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setStatus('submitting'); setErrorMsg('');
    try {
      const res  = await fetch('/api/submit-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'sample', name: name.trim(), address: address.trim(), phone: phone.trim(), samples: filledSamples.map(s=>s.trim()) }) });
      const data = await res.json();
      if (data.success) { setStatus('success'); } else { setStatus('error'); setErrorMsg(data.error || t('forms','serverError',lang)); }
    } catch { setStatus('error'); setErrorMsg(t('forms','networkError',lang)); }
  };

  const handleReset = () => { setSamples(Array(MAX_SAMPLES).fill('')); setName(''); setAddress(''); setPhone(''); setStatus('idle'); setErrorMsg(''); };

  if (status === 'success') {
    return (
      <div className="border border-varindo-line bg-white">
        <div className="px-8 py-14 flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 border-2 border-varindo-gold flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M4 12.5L9 17.5L20 7" stroke="#a8763e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div>
            <p className="label text-varindo-gold mb-3">{t('forms','successLabel',lang)}</p>
            <h2 className="display text-varindo-ink text-3xl sm:text-4xl mb-4">{t('forms','sampleSuccessTitle',lang)}</h2>
            <p className="text-[14px] leading-7 text-varindo-500 max-w-sm mx-auto">{t('forms','sampleSuccessBody',lang,{n:filledCount,phone})}</p>
          </div>
          <div className="w-full max-w-sm border border-varindo-line bg-varindo-50 text-left">
            <div className="border-b border-varindo-line px-5 py-3 bg-white">
              <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-varindo-700">{t('forms','samplesRequested',lang)}</p>
            </div>
            <div className="divide-y divide-varindo-line/60">
              {filledSamples.map((s,i)=>(
                <div key={i} className="flex items-baseline gap-3 px-5 py-3">
                  <span className="text-[10px] tracking-[0.14em] uppercase text-varindo-400 w-4 shrink-0">{i+1}</span>
                  <span className="text-[13px] font-medium text-varindo-ink">{s}</span>
                </div>
              ))}
            </div>
          </div>
          <button type="button" onClick={handleReset} className="btn-ghost mt-2">{t('forms','submitAnother',lang)}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-varindo-line bg-white">
      <div className="border-b border-varindo-line px-6 py-4 bg-varindo-50 flex items-center justify-between gap-4">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-700">{t('forms','sampleFormTitle',lang)}</p>
        {filledCount > 0 && <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-varindo-gold">{t('forms','itemsOf',lang,{n:filledCount,max:MAX_SAMPLES})}</span>}
      </div>
      <div className="p-6 space-y-5">
        <div>
          <span className="label text-varindo-600 mb-3 block">{t('forms','sampleSlotLabel',lang)} <span className="text-varindo-gold">*</span></span>
          <div className="border border-varindo-line divide-y divide-varindo-line/50">
            {samples.map((val,i)=>(
              <div key={i} className="flex items-center">
                <span className="w-10 text-center text-[11px] font-medium text-varindo-400 shrink-0 border-r border-varindo-line/50 py-3">{i+1}</span>
                <div className="flex-1 relative">
                  <ProductCodeInput products={products} value={val} onChange={code=>updateSample(i,code)} placeholder={i===0 ? t('forms','sampleSlotPlaceholder',lang) : ''} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-varindo-400">{t('forms','sampleMaxLabel',lang,{n:MAX_SAMPLES})}</p>
        </div>
        <div className="border-t border-varindo-line" />
        <label className="block">
          <span className="label text-varindo-600 mb-2 block">{t('forms','nameLabel',lang)} <span className="text-varindo-gold">*</span></span>
          <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder={t('forms','namePlaceholder',lang)} className="field w-full" autoComplete="organization" />
        </label>
        <label className="block">
          <span className="label text-varindo-600 mb-2 block">{t('forms','addressLabel',lang)} <span className="text-varindo-gold">*</span></span>
          <textarea value={address} onChange={e=>setAddress(e.target.value)} placeholder={t('forms','addressPlaceholder',lang)} rows={3} className="field w-full resize-none py-3" />
        </label>
        <label className="block">
          <span className="label text-varindo-600 mb-2 block">{t('forms','phoneLabel',lang)} <span className="text-varindo-gold">*</span></span>
          <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder={t('forms','phonePlaceholder',lang)} className="field w-full" autoComplete="tel" />
        </label>
      </div>
      {status==='error' && <div className="border-t border-red-200 bg-red-50 px-6 py-3"><p className="text-[12px] font-medium text-red-700">{errorMsg}</p></div>}
      <div className="px-6 py-5 border-t border-varindo-line bg-varindo-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-[11px] text-varindo-400">{!canSubmit ? t('forms','fillSample',lang) : t('forms','readySample',lang,{n:filledCount})}</p>
        <button type="button" onClick={handleSubmit} disabled={!canSubmit} className="btn-ink disabled:opacity-40 disabled:cursor-not-allowed shrink-0 min-w-[160px] justify-center">
          {status==='submitting' ? <><span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t('forms','submitting',lang)}</> : <><svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M17.5 2.5L9.167 10.833M17.5 2.5L12.5 17.5l-3.333-6.667L2.5 7.5l15-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>{t('forms','submitBtn',lang)}</>}
        </button>
      </div>
    </div>
  );
}
