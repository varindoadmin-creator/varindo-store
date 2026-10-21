'use client';

import { useLang } from '@/lib/LangContext';

export function PrivacyPageClient() {
  const { lang } = useLang();

  return (
    <div>
      <div className="bg-varindo-paper">
        <div className="shell py-14 sm:py-20">
          <p className="label mb-4">
            {lang === 'id' ? 'Legal' : 'Legal'}
          </p>
          <h1 className="display text-varindo-ink text-[40px] sm:text-[56px]">
            {lang === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy'}
          </h1>
          <p className="mt-4 text-[14px] text-varindo-mid">
            {lang === 'id'
              ? 'Terakhir diperbarui: September 2026'
              : 'Last updated: September 2026'}
          </p>
        </div>
      </div>

      <div className="shell py-12 sm:py-16 max-w-3xl">
        <div className="prose-varindo space-y-8 text-[16px] leading-8 text-varindo-mid">

          {lang === 'id' ? (
            <>
              <section>
                <h2 className="display text-[28px] text-varindo-ink mb-4">Tentang Kebijakan Ini</h2>
                <p>
                  CV. Varindo Forma Hutama ("Varindo", "kami") mengoperasikan situs web varindo.co.id dan aplikasi Android Varindo Catalog. Kebijakan privasi ini menjelaskan bagaimana kami menangani informasi saat Anda menggunakan layanan kami.
                </p>
              </section>

              <section>
                <h2 className="display text-[28px] text-varindo-ink mb-4">Informasi yang Kami Kumpulkan</h2>
                <p>
                  Kami hanya mengumpulkan informasi yang Anda berikan secara sukarela melalui formulir permintaan di situs web kami, yaitu:
                </p>
                <ul className="mt-3 space-y-2 list-none pl-0">
                  {['Nama atau nama perusahaan', 'Alamat pengiriman', 'Nomor telepon'].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="w-4 h-[1.5px] bg-varindo-link shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  Informasi ini dikumpulkan hanya melalui formulir Permintaan Penawaran, Permintaan Sampel, dan Permintaan Katalog, dan digunakan semata-mata untuk menindaklanjuti permintaan Anda.
                </p>
              </section>

              <section>
                <h2 className="display text-[28px] text-varindo-ink mb-4">Cara Kami Menggunakan Informasi Anda</h2>
                <p>Informasi yang Anda berikan digunakan untuk:</p>
                <ul className="mt-3 space-y-2 list-none pl-0">
                  {[
                    'Memproses dan menindaklanjuti permintaan penawaran, sampel, atau katalog',
                    'Menghubungi Anda mengenai permintaan yang telah diajukan',
                    'Mengirimkan produk atau katalog ke alamat yang Anda berikan'
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-4 h-[1.5px] bg-varindo-link shrink-0 mt-4" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="display text-[28px] text-varindo-ink mb-4">Penyimpanan Data</h2>
                <p>
                  Data yang Anda kirimkan melalui formulir disimpan secara aman di database cloud kami (Supabase) yang hanya dapat diakses oleh tim internal Varindo. Kami tidak menjual, memperdagangkan, atau menyerahkan informasi pribadi Anda kepada pihak ketiga manapun.
                </p>
              </section>

              <section>
                <h2 className="display text-[28px] text-varindo-ink mb-4">Cookie dan Pelacakan</h2>
                <p>
                  Situs web kami menggunakan Google Ads untuk mengukur kunjungan dan tindakan yang berasal dari iklan, sehingga Google dapat menempatkan atau membaca cookie dan teknologi serupa sesuai kebijakannya. Data ini digunakan untuk pengukuran performa iklan dan tidak kami gunakan untuk mengidentifikasi Anda secara langsung.
                </p>
              </section>

              <section>
                <h2 className="display text-[28px] text-varindo-ink mb-4">Aplikasi Android</h2>
                <p>
                  Aplikasi Android Varindo Catalog adalah Trusted Web Activity (TWA) yang menampilkan situs web varindo.co.id. Aplikasi ini tidak mengumpulkan, menyimpan, atau mengirimkan data apapun secara independen dari situs web.
                </p>
              </section>

              <section>
                <h2 className="display text-[28px] text-varindo-ink mb-4">Hak Anda</h2>
                <p>
                  Anda berhak meminta penghapusan data pribadi Anda yang telah kami simpan. Untuk melakukan hal ini, hubungi kami melalui email di bawah ini.
                </p>
              </section>

              <section>
                <h2 className="display text-[28px] text-varindo-ink mb-4">Hubungi Kami</h2>
                <p>Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini, silakan hubungi kami:</p>
                <div className="mt-4 rounded-card bg-varindo-canvas p-5 space-y-2">
                  <p><span className="font-medium text-varindo-ink">CV. Varindo Forma Hutama</span></p>
                  <p>Email: <a href="mailto:contact@varindo.co.id" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-link transition-colors">contact@varindo.co.id</a></p>
                  <p>WhatsApp: 0812 8888 5224</p>
                  <p>Website: <a href="https://varindo.co.id" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-link transition-colors">varindo.co.id</a></p>
                </div>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="display text-[28px] text-varindo-ink mb-4">About This Policy</h2>
                <p>
                  CV. Varindo Forma Hutama ("Varindo", "we", "us") operates the website varindo.co.id and the Varindo Catalog Android application. This privacy policy explains how we handle information when you use our services.
                </p>
              </section>

              <section>
                <h2 className="display text-[28px] text-varindo-ink mb-4">Information We Collect</h2>
                <p>
                  We only collect information you voluntarily provide through the request forms on our website:
                </p>
                <ul className="mt-3 space-y-2 list-none pl-0">
                  {['Name or company name', 'Delivery address', 'Phone number'].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="w-4 h-[1.5px] bg-varindo-link shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  This information is collected only through the Sample Request and Catalogue Request forms, and is used solely to follow up on your request.
                </p>
              </section>

              <section>
                <h2 className="display text-[28px] text-varindo-ink mb-4">How We Use Your Information</h2>
                <p>Information you provide is used to:</p>
                <ul className="mt-3 space-y-2 list-none pl-0">
                  {[
                    'Process and follow up on sample or catalogue requests',
                    'Contact you regarding your submitted request',
                    'Deliver products or catalogues to your provided address'
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-4 h-[1.5px] bg-varindo-link shrink-0 mt-4" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="display text-[28px] text-varindo-ink mb-4">Data Storage</h2>
                <p>
                  Data submitted through our forms is stored securely in our cloud database (Supabase), accessible only by Varindo's internal team. We do not sell, trade, or transfer your personal information to any third parties.
                </p>
              </section>

              <section>
                <h2 className="display text-[28px] text-varindo-ink mb-4">Cookies and Tracking</h2>
                <p>
                  Our website uses Google Ads to measure visits and actions originating from advertisements. Google may place or read cookies and similar technologies under its own policies. We use this data for advertising performance measurement and do not use it to identify you directly.
                </p>
              </section>

              <section>
                <h2 className="display text-[28px] text-varindo-ink mb-4">Android Application</h2>
                <p>
                  The Varindo Catalog Android app is a Trusted Web Activity (TWA) that displays the varindo.co.id website. The app does not independently collect, store, or transmit any data beyond what the website does.
                </p>
              </section>

              <section>
                <h2 className="display text-[28px] text-varindo-ink mb-4">Your Rights</h2>
                <p>
                  You may request deletion of any personal data we have stored. To do so, contact us via the email below.
                </p>
              </section>

              <section>
                <h2 className="display text-[28px] text-varindo-ink mb-4">Contact Us</h2>
                <p>If you have any questions about this privacy policy, please contact us:</p>
                <div className="mt-4 rounded-card bg-varindo-canvas p-5 space-y-2">
                  <p><span className="font-medium text-varindo-ink">CV. Varindo Forma Hutama</span></p>
                  <p>Email: <a href="mailto:contact@varindo.co.id" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-link transition-colors">contact@varindo.co.id</a></p>
                  <p>WhatsApp: 0812 8888 5224</p>
                  <p>Website: <a href="https://varindo.co.id" className="text-varindo-ink underline underline-offset-2 hover:text-varindo-link transition-colors">varindo.co.id</a></p>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
