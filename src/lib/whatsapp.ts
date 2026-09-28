import type { Product } from '@/types/product';
import { formatIDR } from './utils';

const DEFAULT_WA_NUMBER = '6281210015224';

export function getWhatsAppNumber() {
  return process.env.NEXT_PUBLIC_VARINDO_WHATSAPP || DEFAULT_WA_NUMBER;
}

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(message)}`;
}

export function buildProductEnquiryMessage(product: Product) {
  const lines = [
    'Halo Admin Varindo, saya tertarik dengan produk berikut:',
    '',
    `Produk: ${product.name}`,
    `Kode: ${product.code}`,
    `Harga: ${formatIDR(product.price)} (Termasuk PPN)`
  ];

  if (product.isPromoItem && typeof product.promoPrice === 'number') {
    lines.push(`Promo: ${formatIDR(product.promoPrice)} (Termasuk PPN)`);
  }

  lines.push('', 'Terima kasih.');

  return lines.join('\n');
}

export function buildCityEnquiryMessage(cityName: string) {
  return [
    `Halo Admin Varindo, saya ingin tanya-tanya HPL Lamitak untuk kebutuhan di ${cityName}.`,
    '',
    'Terima kasih.'
  ].join('\n');
}

export function buildSampleRequestMessage(product?: Product) {
  if (!product) {
    return [
      'Halo Admin Varindo, saya ingin request sample Lamitak.',
      '',
      'Kode produk:',
      '1.',
      '2.',
      '3.',
      '',
      'Nama / Perusahaan:',
      'Kota pengiriman:',
      '',
      'Terima kasih.'
    ].join('\n');
  }

  return [
    'Halo Admin Varindo, saya ingin request sample untuk produk berikut:',
    '',
    `Produk: ${product.name}`,
    `Kode: ${product.code}`,
    '',
    'Nama / Perusahaan:',
    'Kota pengiriman:',
    '',
    'Terima kasih.'
  ].join('\n');
}
