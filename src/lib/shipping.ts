// Delivery is free across Java and Bali — the promise the whole site makes —
// so those are the provinces online checkout delivers to. Anywhere else the
// freight has to be quoted first, which still goes through WhatsApp.
export const SHIPPING_PROVINCES = [
  'Banten',
  'DKI Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur',
  'Bali'
] as const;

export type ShippingProvince = (typeof SHIPPING_PROVINCES)[number];

export function isShippingProvince(value: string): value is ShippingProvince {
  return (SHIPPING_PROVINCES as readonly string[]).includes(value);
}
