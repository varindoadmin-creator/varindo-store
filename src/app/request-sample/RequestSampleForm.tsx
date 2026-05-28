'use client';

import { useState } from 'react';
import { ProductCodeInput, type ProductOption } from '@/components/ProductCodeInput';

const WA_NUMBER = process.env.NEXT_PUBLIC_VARINDO_WHATSAPP || '6281288885224';
const MAX_SAMPLES = 5;

function buildMessage(samples: string[], name: string, address: string, phone: string) {
  const lines = [
    'Saya ingin mengajukan permintaan sample Lamitak dengan detail sebagai berikut:',
    '',
  ];
  for (let i = 0; i < MAX_SAMPLES; i++) {
    lines.push(`${i + 1}. ${samples[i]?.trim() || ''}`);
  }
  lines.push(
    '',
    `Nama / Perusahaan: ${name}`,
    `Alamat pengiriman: ${address}`,
    `Telepon: ${phone}`,
    '',
    'Terima kasih.'
  );
  return lines.join('\n');
}

type Props = { products: ProductOption[] };

export function RequestSampleForm({ products }: Props) {
  const [samples, setSamples] = useState<string[]>(Array(MAX_SAMPLES).fill(''));
  const [name, setName]       = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone]     = useState('');

  const updateSample = (i: number, code: string) =>
    setSamples((prev) => prev.map((s, idx) => (idx === i ? code : s)));

  const filledCount = samples.filter((s) => s.trim()).length;
  const canSubmit   = name.trim() && address.trim() && phone.trim() && filledCount > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const msg = buildMessage(samples, name.trim(), address.trim(), phone.trim());
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noreferrer');
  };

  return (
    <div className="border border-varindo-line bg-white">
      <div className="border-b border-varindo-line px-6 py-4 bg-varindo-50 flex items-center justify-between gap-4">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-700">Sample Request Form</p>
        {filledCount > 0 && (
          <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-varindo-gold">
            {filledCount} / {MAX_SAMPLES} items
          </span>
        )}
      </div>

      <div className="p-6 space-y-5">

        {/* Sample slots */}
        <div>
          <span className="label text-varindo-600 mb-3 block">
            Product Codes or Design Names <span className="text-varindo-gold">*</span>
          </span>

          <div className="border border-varindo-line divide-y divide-varindo-line/50">
            {samples.map((val, i) => (
              <div key={i} className="flex items-center">
                {/* Slot number */}
                <span className="w-10 text-center text-[11px] font-medium text-varindo-400 shrink-0 border-r border-varindo-line/50 py-3">
                  {i + 1}
                </span>
                {/* Autocomplete */}
                <div className="flex-1 relative">
                  <ProductCodeInput
                    products={products}
                    value={val}
                    onChange={(code) => updateSample(i, code)}
                    placeholder={i === 0 ? 'Search code or design name…' : i === 1 ? 'e.g. MTA 9310XL' : ''}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-varindo-400">
            Maximum {MAX_SAMPLES} sample pieces per request.
          </p>
        </div>

        <div className="border-t border-varindo-line" />

        {/* Contact fields */}
        <label className="block">
          <span className="label text-varindo-600 mb-2 block">Name or Company Name <span className="text-varindo-gold">*</span></span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g. PT. Maju Jaya Interior"
            className="field w-full" autoComplete="organization" />
        </label>

        <label className="block">
          <span className="label text-varindo-600 mb-2 block">Delivery Address <span className="text-varindo-gold">*</span></span>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)}
            placeholder="Street, city, province" rows={3}
            className="field w-full resize-none py-3" />
        </label>

        <label className="block">
          <span className="label text-varindo-600 mb-2 block">Phone Number <span className="text-varindo-gold">*</span></span>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 0812 3456 7890"
            className="field w-full" autoComplete="tel" />
        </label>
      </div>

      {/* Submit */}
      <div className="px-6 py-5 border-t border-varindo-line bg-varindo-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-[11px] text-varindo-400">
          {!canSubmit
            ? 'Fill in at least one product and your contact details.'
            : `Ready — ${filledCount} sample${filledCount !== 1 ? 's' : ''} with your details.`}
        </p>
        <button type="button" onClick={handleSubmit} disabled={!canSubmit}
          className="btn-ink disabled:opacity-40 disabled:cursor-not-allowed shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.19 1.6 6L0 24l6.19-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.85 0-3.66-.5-5.23-1.43l-.37-.22-3.87 1.02 1.03-3.77-.24-.38A9.93 9.93 0 0 1 2 12C2 6.49 6.49 2 12 2s10 4.49 10 10-4.49 10-10 10z"/>
          </svg>
          Send via WhatsApp
        </button>
      </div>
    </div>
  );
}
