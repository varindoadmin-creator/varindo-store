import { SHIPPING_PROVINCES, type ShippingProvince } from './shipping';

// Address search for checkout, through Google's Places API (New). Called from
// our own API routes so the key stays on the server and the browser needs no
// Google script (and no CSP exceptions for one). Restrict the key to the
// Places API in Google Cloud: these routes are public.
const KEY = () => process.env.GOOGLE_MAPS_API_KEY || '';

export function isPlacesConfigured() {
  return Boolean(KEY());
}

export type PlaceSuggestion = { placeId: string; main: string; secondary: string };

export async function autocomplete(input: string, sessionToken: string): Promise<PlaceSuggestion[]> {
  const res = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': KEY() },
    body: JSON.stringify({ input, sessionToken, includedRegionCodes: ['id'], languageCode: 'id' }),
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(`Places autocomplete ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as {
    suggestions?: { placePrediction?: { placeId: string; text?: { text: string }; structuredFormat?: { mainText?: { text: string }; secondaryText?: { text: string } } } }[];
  };
  return (data.suggestions || [])
    .map((s) => s.placePrediction)
    .filter((p): p is NonNullable<typeof p> => Boolean(p?.placeId))
    .map((p) => ({
      placeId: p.placeId,
      main: p.structuredFormat?.mainText?.text || p.text?.text || '',
      secondary: p.structuredFormat?.secondaryText?.text || ''
    }));
}

export type PlaceDetails = {
  placeId: string;
  lat: number;
  lng: number;
  formattedAddress: string;
  city?: string;
  province?: ShippingProvince;
  postalCode?: string;
};

export async function placeDetails(placeId: string, sessionToken: string): Promise<PlaceDetails> {
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=id&regionCode=id&sessionToken=${encodeURIComponent(sessionToken)}`;
  const res = await fetch(url, {
    headers: { 'X-Goog-Api-Key': KEY(), 'X-Goog-FieldMask': 'id,location,formattedAddress,addressComponents' },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(`Places details ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as {
    id: string;
    location: { latitude: number; longitude: number };
    formattedAddress: string;
    addressComponents?: { longText: string; types: string[] }[];
  };
  const part = (type: string) => data.addressComponents?.find((c) => c.types.includes(type))?.longText;
  return {
    placeId: data.id,
    lat: data.location.latitude,
    lng: data.location.longitude,
    formattedAddress: data.formattedAddress,
    city: part('administrative_area_level_2'),
    province: matchProvince(part('administrative_area_level_1')),
    postalCode: part('postal_code')
  };
}

// Google names provinces in full ("Daerah Khusus Ibukota Jakarta", "Jawa
// Barat"); checkout's list uses the short forms.
function matchProvince(name?: string): ShippingProvince | undefined {
  if (!name) return undefined;
  const n = name.toLowerCase();
  const rules: [string, ShippingProvince][] = [
    ['jakarta', 'DKI Jakarta'],
    ['yogyakarta', 'DI Yogyakarta'],
    ['jawa barat', 'Jawa Barat'],
    ['west java', 'Jawa Barat'],
    ['jawa tengah', 'Jawa Tengah'],
    ['central java', 'Jawa Tengah'],
    ['jawa timur', 'Jawa Timur'],
    ['east java', 'Jawa Timur'],
    ['banten', 'Banten'],
    ['bali', 'Bali']
  ];
  const hit = rules.find(([needle]) => n.includes(needle));
  return hit && (SHIPPING_PROVINCES as readonly string[]).includes(hit[1]) ? hit[1] : undefined;
}
