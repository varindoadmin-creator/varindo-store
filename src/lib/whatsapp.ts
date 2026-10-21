import type { Product } from '@/types/product';
import { formatIDR } from './utils';

const DEFAULT_WA_NUMBER = '6281210015224';
// "Tanya via WhatsApp" buttons go to their own line.
const ENQUIRY_WA_NUMBER = '6281288885224';

export function getWhatsAppNumber() {
  return process.env.NEXT_PUBLIC_VARINDO_WHATSAPP || DEFAULT_WA_NUMBER;
}

export function buildWhatsAppUrl(message: string, number = getWhatsAppNumber()) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildEnquiryWhatsAppUrl(message: string) {
  return buildWhatsAppUrl(message, ENQUIRY_WA_NUMBER);
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
