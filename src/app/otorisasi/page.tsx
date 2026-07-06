import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export const revalidate = 600;

const title = 'Dealer Resmi HPL Lamitak - Cara Verifikasi Keaslian Produk | Varindo';
const description =
  'CV. Varindo Forma Hutama adalah dealer resmi HPL Lamitak (PT. TAK Products and Services) di Indonesia. Pelajari cara memverifikasi keaslian produk sebelum membeli.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${SITE_URL}/otorisasi` },
  openGraph: { title, description, url: `${SITE_URL}/otorisasi`, type: 'website' }
};

export default function OtorisasiPage() {
  const waUrl = buildWhatsAppUrl('Halo Admin Varindo, saya ingin memverifikasi apakah produk Lamitak yang saya lihat adalah produk resmi.');

  return (
    <div>
      <div className="bg-varindo-ink text-white border-b border-varindo-800">
        <div className="shell py-14 sm:py-20">
          <p className="label text-varindo-400 mb-4">Dealer Resmi</p>
          <h1 className="display text-white text-4xl sm:text-5xl lg:text-6xl mb-5">
            Verifikasi Keaslian Produk Lamitak
          </h1>
          <p className="text-[14px] leading-7 text-varindo-400 max-w-2xl">
            Halaman ini menjelaskan status resmi Varindo sebagai dealer HPL Lamitak di Indonesia,
            serta cara memastikan produk yang Anda beli adalah produk asli dari sumber resmi.
          </p>
        </div>
      </div>

      <div className="shell py-12 sm:py-16 max-w-3xl space-y-12">

        <section>
          <p className="label text-varindo-gold mb-4">Status Resmi</p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8">
            <p className="text-[14px] leading-8 text-varindo-600">
              <span className="font-semibold text-varindo-ink">CV. Varindo Forma Hutama</span> adalah{' '}
              <span className="font-semibold text-varindo-ink">Authorized Dealer HPL Lamitak</span>, produk dari{' '}
              <span className="font-semibold text-varindo-ink">PT. TAK Products and Services</span>, yang beroperasi
              dan melayani kebutuhan HPL Lamitak di berbagai wilayah Indonesia. Status ini berarti seluruh produk yang
              tercantum di katalog online kami bersumber langsung dari jalur distribusi resmi Lamitak, dengan harga
              dan ketersediaan yang transparan.
            </p>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">Alamat &amp; Kontak Resmi</p>
          <div className="border border-varindo-line grid sm:grid-cols-2 gap-px bg-varindo-line">
            <address className="not-italic text-[14px] leading-8 text-varindo-600 bg-white p-6 sm:p-8">
              <span className="font-semibold text-varindo-ink block mb-1">CV. Varindo Forma Hutama — Kantor Utama</span>
              Branz BSD Tower A Unit 3310<br />
              Jl. BSD Boulevard Parcel 55-F<br />
              Tangerang 15339, Banten, Indonesia<br />
              <span className="block mt-3">
                Telepon / WhatsApp: <a href="tel:+6281288885224" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-gold transition-colors">0812 8888 5224</a><br />
                Email: <a href="mailto:contact@varindo.co.id" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-gold transition-colors">contact@varindo.co.id</a>
              </span>
            </address>
            <address className="not-italic text-[14px] leading-8 text-varindo-600 bg-white p-6 sm:p-8">
              <span className="font-semibold text-varindo-ink block mb-1">CV. Varindo Forma Hutama — Registered Office</span>
              Ruko Pasar Modern Batununggal<br />
              Blok RA/06, Kel. Mengger<br />
              Kec. Bandung Kidul, Bandung 40267, Jawa Barat, Indonesia<br />
              <span className="block mt-3">
                Telepon / WhatsApp: <a href="tel:+6281210015224" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-gold transition-colors">0812 1001 5224</a>
              </span>
            </address>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">Cara Memverifikasi Keaslian Produk</p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8 space-y-4">
            <p className="text-[14px] leading-8 text-varindo-600">
              Sebelum melakukan pembelian, Anda dapat memverifikasi keaslian produk Lamitak dengan beberapa cara berikut:
            </p>
            <ul className="space-y-3">
              {[
                'Cocokkan kode produk dan nama desain yang Anda lihat dengan katalog resmi di situs ini (varindo.co.id).',
                'Pastikan penjual dapat menunjukkan asal produk dan menyebutkan bahwa produk berasal dari jalur distribusi resmi Lamitak.',
                'Hubungi tim Varindo langsung via WhatsApp untuk menanyakan ketersediaan kode produk tertentu sebelum membeli dari pihak lain.',
                'Jika ragu, Anda juga dapat menghubungi PT. TAK Products and Services secara langsung untuk konfirmasi status distributor resmi di wilayah Anda.'
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[13px] leading-7 text-varindo-600">
                  <div className="w-4 h-[1.5px] bg-varindo-gold shrink-0 mt-3" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-4">Risiko Membeli dari Penjual Tidak Resmi</p>
          <div className="border border-varindo-line bg-white p-6 sm:p-8 space-y-4">
            <p className="text-[14px] leading-8 text-varindo-600">
              Membeli HPL dari penjual yang tidak memiliki hubungan resmi dengan jalur distribusi Lamitak dapat
              menimbulkan beberapa risiko, di antaranya:
            </p>
            <ul className="space-y-3">
              {[
                'Ketidakpastian keaslian material — material yang dijual mungkin bukan produk Lamitak asli meskipun diberi label serupa.',
                'Tidak ada jaminan konsistensi warna dan kualitas antar lembar, karena sumber dan riwayat penyimpanan produk tidak dapat dipastikan.',
                'Tidak ada dukungan purna jual maupun kejelasan jika terjadi kendala pada produk yang diterima.',
                'Harga yang tidak transparan, tanpa kejelasan apakah sudah termasuk PPN atau sesuai harga resmi dealer.'
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[13px] leading-7 text-varindo-600">
                  <div className="w-4 h-[1.5px] bg-varindo-gold shrink-0 mt-3" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[13px] leading-7 text-varindo-500">
              Untuk menghindari risiko tersebut, kami menyarankan Anda selalu memastikan pembelian HPL Lamitak
              melalui dealer resmi seperti Varindo, atau memverifikasi langsung ke PT. TAK Products and Services.
            </p>
          </div>
        </section>

        <section className="border border-varindo-line bg-varindo-50 px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display text-2xl font-light text-varindo-ink mb-2">Ingin memastikan keaslian produk?</p>
            <p className="text-[13px] text-varindo-600 max-w-lg">Hubungi tim Varindo untuk verifikasi kode produk atau pertanyaan lain seputar keaslian HPL Lamitak.</p>
          </div>
          <a href={waUrl} target="_blank" rel="noreferrer" className="btn-ink shrink-0 justify-center">
            Tanya via WhatsApp
          </a>
        </section>

      </div>
    </div>
  );
}
