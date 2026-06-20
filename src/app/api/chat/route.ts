import { NextRequest, NextResponse } from 'next/server';
import { getPublicProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 1024;
const MAX_PRODUCTS_IN_CONTEXT = 800;

function buildSystemPrompt(lang: 'id' | 'en', products: any[]): string {
  const productSummary = products
    .slice(0, MAX_PRODUCTS_IN_CONTEXT)
    .map(p =>
      `${p.code} | ${p.name} | ${p.collection || ''} | ${p.category || ''} | ${p.finish || ''} | ${p.size || ''} | ${p.thickness || ''} | Rp${p.price?.toLocaleString('id-ID') || '?'} | ${p.isPromoItem ? 'PROMO' : ''}`
    )
    .join('\n');

  if (lang === 'id') {
    return `Kamu adalah asisten virtual untuk Varindo, dealer resmi Lamitak HPL di Indonesia.

TENTANG VARINDO:
- Dealer resmi Lamitak High Pressure Laminates (HPL) di Indonesia
- Kantor utama: Branz BSD Tower A Unit 3310, Tangerang
- Kantor terdaftar: Ruko Pasar Modern Batununggal, Bandung
- Telepon: 0812 8888 5224 dan 0812 1001 5224
- Email: contact@varindo.co.id
- Jam operasional: Senin–Jumat, 09.00–17.00 WIB
- Website: varindo.co.id

PRODUK LAMITAK:
Koleksi tersedia: Woods (motif kayu), Patterns (dekoratif), Solids (warna solid), Protak, Protak Core, Solid Core
Ukuran standar: 4'x8' (1220x2440mm) dan 4'x10' (1220x3050mm)
Ketebalan: 0.7mm, 0.8mm, 1.0mm, dll
Harga sudah termasuk pajak (PPN 11%)

DATABASE PRODUK (format: Kode | Nama | Koleksi | Kategori | Finishing | Ukuran | Ketebalan | Harga | Status):
${productSummary}

PANDUAN MENJAWAB:
- Jawab dalam Bahasa Indonesia yang profesional dan ramah
- Bantu pengguna menemukan produk berdasarkan kebutuhan mereka
- Jika ditanya kode spesifik, cari di database dan berikan informasi lengkap
- Untuk pemesanan, penawaran harga resmi, atau pengecekan stok real-time → arahkan ke WhatsApp 0812 8888 5224
- Untuk permintaan sampel → arahkan ke halaman /request-sample
- Untuk permintaan penawaran → arahkan ke halaman /request-quote
- Untuk katalog → arahkan ke halaman /request-catalogue
- Jangan membuat klaim yang tidak ada di database
- Jika produk tidak ditemukan, jujur dan sarankan menghubungi tim
- Jawaban singkat dan jelas, maksimal 3-4 paragraf
- Gunakan format yang mudah dibaca, bisa gunakan list jika perlu`;
  }

  return `You are a virtual assistant for Varindo, an authorized Lamitak HPL dealer in Indonesia.

ABOUT VARINDO:
- Authorized dealer of Lamitak High Pressure Laminates (HPL) in Indonesia
- Head office: Branz BSD Tower A Unit 3310, Tangerang
- Registered office: Ruko Pasar Modern Batununggal, Bandung
- Phone: 0812 8888 5224 and 0812 1001 5224
- Email: contact@varindo.co.id
- Operating hours: Monday–Friday, 09:00–17:00 WIB
- Website: varindo.co.id

LAMITAK PRODUCTS:
Collections: Woods (woodgrain), Patterns (decorative), Solids (solid colours), Protak, Protak Core, Solid Core
Standard sizes: 4'x8' (1220x2440mm) and 4'x10' (1220x3050mm)
Thickness: 0.7mm, 0.8mm, 1.0mm, etc.
All prices include tax (PPN 11%)

PRODUCT DATABASE (format: Code | Name | Collection | Category | Finish | Size | Thickness | Price | Status):
${productSummary}

RESPONSE GUIDELINES:
- Respond in professional, friendly English
- Help users find products based on their needs
- If asked about a specific code, look it up in the database and provide full details
- For orders, formal quotes, or real-time stock checks → direct to WhatsApp 0812 8888 5224
- For sample requests → direct to /request-sample page
- For quote requests → direct to /request-quote page
- For catalogue requests → direct to /request-catalogue page
- Don't make claims not supported by the database
- If a product isn't found, be honest and suggest contacting the team
- Keep answers concise and clear, max 3-4 paragraphs
- Use lists where helpful for readability`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, lang = 'id' } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
    }

    // Fetch products for context
    const products = await getPublicProducts();
    const systemPrompt = buildSystemPrompt(lang as 'id' | 'en', products);

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: messages.slice(-10), // last 10 messages for context
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[chat] Anthropic error:', err);
      return NextResponse.json({ error: 'AI service error' }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? '';

    return NextResponse.json({ reply: text });

  } catch (err) {
    console.error('[chat] Error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
