'use client';

import { useState } from 'react';

const WA_NUMBER = process.env.NEXT_PUBLIC_VARINDO_WHATSAPP || '6281288885224';

const ROWS = 10;

type Row = { code: string; qty: string };
const emptyRows = (): Row[] => Array.from({ length: ROWS }, () => ({ code: '', qty: '' }));

function buildMessage(name: string, address: string, phone: string, rows: Row[]) {
  const filledRows = rows.filter((r) => r.code.trim());

  const lines = [
    'Halo Admin Varindo, saya ingin mengajukan permintaan penawaran harga (quote) Lamitak dengan detail sebagai berikut:',
    '',
    'Nama / Perusahaan : ' + name,
    'Alamat pengiriman : ' + address,
    'Telepon           : ' + phone,
    '',
    'Produk yang diminta:',
    '',
  ];

  filledRows.forEach((r, i) => {
    lines.push(`${i + 1}. ${r.code.trim()}${r.qty.trim() ? '  |  Qty: ' + r.qty.trim() : ''}`);
  });

  lines.push('', 'Terima kasih.');
  return lines.join('\n');
}

export function RequestQuoteForm() {
  const [name, setName]       = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone]     = useState('');
  const [rows, setRows]       = useState<Row[]>(emptyRows());

  const updateRow = (i: number, field: 'code' | 'qty', value: string) => {
    setRows((prev) => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  };

  const filledCount = rows.filter((r) => r.code.trim()).length;
  const canSubmit   = name.trim() && address.trim() && phone.trim() && filledCount > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const msg = buildMessage(name.trim(), address.trim(), phone.trim(), rows);
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noreferrer');
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-start">

      {/* Left — contact details */}
      <div className="border border-varindo-line bg-white">
        <div className="border-b border-varindo-line px-6 py-4 bg-varindo-50">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-700">Your Details</p>
        </div>
        <div className="p-6 space-y-5">

          <label className="block">
            <span className="label text-varindo-600 mb-2 block">Name or Company Name <span className="text-varindo-gold">*</span></span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. PT. Maju Jaya Interior"
              className="field w-full"
              autoComplete="organization"
            />
          </label>

          <label className="block">
            <span className="label text-varindo-600 mb-2 block">Delivery Address <span className="text-varindo-gold">*</span></span>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, city, province"
              rows={3}
              className="field w-full resize-none py-3"
            />
          </label>

          <label className="block">
            <span className="label text-varindo-600 mb-2 block">Phone Number <span className="text-varindo-gold">*</span></span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0812 3456 7890"
              className="field w-full"
              autoComplete="tel"
            />
          </label>

          <div className="pt-2 border-t border-varindo-line/60">
            <p className="text-[11px] text-varindo-400 leading-5">
              Your request will open WhatsApp with a pre-filled message ready to send to our team.
            </p>
          </div>
        </div>
      </div>

      {/* Right — product table */}
      <div className="border border-varindo-line bg-white">
        <div className="border-b border-varindo-line px-6 py-4 bg-varindo-50 flex items-center justify-between gap-4">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-varindo-700">Product List</p>
          {filledCount > 0 && (
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-varindo-gold">
              {filledCount} item{filledCount !== 1 ? 's' : ''} added
            </span>
          )}
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[2rem_1fr_6rem] gap-px bg-varindo-line border-b border-varindo-line text-[10px] font-semibold tracking-[0.16em] uppercase text-varindo-500">
          <div className="bg-varindo-50 px-3 py-3 text-center">#</div>
          <div className="bg-varindo-50 px-4 py-3">Code or Design Name</div>
          <div className="bg-varindo-50 px-4 py-3 text-center">Qty</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-varindo-line/50">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-[2rem_1fr_6rem] gap-px bg-varindo-line">
              {/* Row number */}
              <div className="bg-white flex items-center justify-center">
                <span className="text-[11px] text-varindo-400 font-medium">{i + 1}</span>
              </div>
              {/* Code */}
              <div className="bg-white">
                <input
                  type="text"
                  value={row.code}
                  onChange={(e) => updateRow(i, 'code', e.target.value)}
                  placeholder={i === 0 ? 'e.g. DXO 5338D or Walnut Oak' : ''}
                  className="w-full h-10 px-4 text-[13px] text-varindo-ink bg-transparent outline-none placeholder:text-varindo-300 focus:bg-varindo-50 transition-colors"
                />
              </div>
              {/* Qty */}
              <div className="bg-white">
                <input
                  type="text"
                  value={row.qty}
                  onChange={(e) => updateRow(i, 'qty', e.target.value)}
                  placeholder={i === 0 ? 'e.g. 10' : ''}
                  className="w-full h-10 px-4 text-[13px] text-varindo-ink bg-transparent outline-none placeholder:text-varindo-300 focus:bg-varindo-50 transition-colors text-center"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="px-6 py-5 border-t border-varindo-line bg-varindo-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[11px] text-varindo-400">
            {!canSubmit
              ? 'Fill in your details and at least one product to continue.'
              : `Ready — ${filledCount} product${filledCount !== 1 ? 's' : ''} with your details.`}
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="btn-ink disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.19 1.6 6L0 24l6.19-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.85 0-3.66-.5-5.23-1.43l-.37-.22-3.87 1.02 1.03-3.77-.24-.38A9.93 9.93 0 0 1 2 12C2 6.49 6.49 2 12 2s10 4.49 10 10-4.49 10-10 10z"/>
            </svg>
            Send via WhatsApp
          </button>
        </div>
      </div>

    </div>
  );
}
