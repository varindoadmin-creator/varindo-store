export type CityFaq = { question: string; answer: string };

export type CityContent = {
  slug: string;
  cityName: string;
  /** true only for the city where Varindo's Head Office genuinely is (Tangerang) — controls whether the copy may mention a real office presence. */
  hasLocalOffice: boolean;
  intro: string[];
  areaLayanan: string;
  faq: CityFaq[];
};

export const CITY_CONTENT: Record<string, CityContent> = {
  jakarta: {
    slug: 'jakarta',
    cityName: 'Jakarta',
    hasLocalOffice: false,
    intro: [
      'Jakarta sebagai pusat bisnis dan properti terbesar di Indonesia memiliki permintaan tinggi untuk material interior berkualitas, termasuk HPL Lamitak untuk proyek perkantoran, apartemen, hingga retail. Varindo, sebagai dealer resmi HPL Lamitak, melayani kebutuhan pemesanan HPL Lamitak untuk pelanggan di Jakarta melalui katalog online ini — mulai dari motif kayu, pola dekoratif, hingga warna solid dengan lebih dari 800 pilihan kode produk.',
      'Anda dapat menjelajahi katalog lengkap, membandingkan harga per kode yang sudah termasuk PPN, dan langsung menghubungi tim kami untuk proses pemesanan. Baik untuk kebutuhan proyek desainer interior, kontraktor, maupun pemilik hunian pribadi di Jakarta, seluruh proses konsultasi produk dan penawaran harga dilakukan melalui WhatsApp agar lebih cepat dan personal.'
    ],
    areaLayanan:
      'Varindo melayani pemesanan HPL Lamitak untuk wilayah Jakarta dan sekitarnya (Jabodetabek). Proses pemesanan dimulai dari katalog online ini — pilih kode produk yang Anda butuhkan, lalu hubungi tim kami via WhatsApp untuk konfirmasi ketersediaan, harga, dan detail pengiriman. Seluruh detail pengiriman, termasuk metode dan estimasi waktu, akan didiskusikan langsung dengan tim kami sesuai lokasi dan kebutuhan proyek Anda.',
    faq: [
      {
        question: 'Apakah stok HPL Lamitak ready untuk pengiriman ke Jakarta?',
        answer: 'Sebagian besar kode produk dalam katalog berstatus ready stock. Untuk memastikan ketersediaan kode tertentu sebelum pemesanan ke Jakarta, silakan hubungi tim kami via WhatsApp.'
      },
      {
        question: 'Bagaimana cara memesan HPL Lamitak untuk proyek di Jakarta?',
        answer: 'Pilih kode produk di katalog online ini, lalu hubungi tim kami via WhatsApp atau isi formulir Permintaan Penawaran. Tim kami akan membantu proses pemesanan hingga pengiriman.'
      },
      {
        question: 'Apakah saya bisa mengambil sendiri produk di gudang Varindo?',
        answer: 'Pengambilan langsung dapat didiskusikan dengan tim kami melalui WhatsApp, tergantung ketersediaan dan kesepakatan bersama.'
      },
      {
        question: 'Bagaimana informasi pengiriman ke Jakarta?',
        answer: 'Detail pengiriman, termasuk metode dan estimasi waktu, akan disampaikan langsung oleh tim kami melalui WhatsApp setelah mengetahui kebutuhan dan lokasi pengiriman Anda.'
      }
    ]
  },

  tangerang: {
    slug: 'tangerang',
    cityName: 'Tangerang',
    hasLocalOffice: true,
    intro: [
      'Tangerang adalah lokasi Kantor Utama CV. Varindo Forma Hutama, menjadikan kami mitra yang dekat dan mudah dihubungi bagi pelanggan HPL Lamitak di wilayah ini. Sebagai dealer resmi HPL Lamitak, kami melayani kebutuhan interior untuk proyek residensial, komersial, maupun industri di Tangerang dan sekitarnya, mulai dari kitchen set, furnitur, hingga panel dekoratif.',
      'Dengan lebih dari 800 pilihan motif dalam katalog online ini, Anda dapat mencari kode produk yang sesuai kebutuhan, membandingkan harga yang sudah termasuk PPN, dan langsung berkoordinasi dengan tim kami. Kedekatan lokasi kantor kami dengan wilayah Tangerang memudahkan proses konsultasi maupun koordinasi kebutuhan proyek Anda secara lebih personal.'
    ],
    areaLayanan:
      'Varindo melayani pemesanan HPL Lamitak untuk wilayah Tangerang dan sekitarnya, dengan Kantor Utama yang berlokasi di Branz BSD Tower A, Tangerang. Anda dapat menjelajahi katalog online ini untuk memilih kode produk, lalu menghubungi tim kami via WhatsApp untuk konfirmasi harga dan ketersediaan. Detail pengiriman maupun kemungkinan pengambilan langsung akan didiskusikan sesuai kebutuhan dan kesepakatan dengan tim kami.',
    faq: [
      {
        question: 'Apakah stok HPL Lamitak ready di Tangerang?',
        answer: 'Sebagian besar produk dalam katalog berstatus ready stock. Untuk kode produk tertentu, silakan konfirmasi langsung ke tim kami via WhatsApp.'
      },
      {
        question: 'Bagaimana cara order HPL Lamitak jika saya berada di Tangerang?',
        answer: 'Anda dapat memilih kode produk dari katalog online ini, lalu menghubungi tim kami via WhatsApp. Karena Kantor Utama kami berlokasi di Tangerang, koordinasi kebutuhan Anda dapat dilakukan lebih cepat.'
      },
      {
        question: 'Apakah saya bisa mengambil langsung di kantor Varindo?',
        answer: 'Pengambilan langsung dapat didiskusikan dengan tim kami melalui WhatsApp, tergantung ketersediaan dan kesepakatan bersama.'
      },
      {
        question: 'Bagaimana informasi pengiriman untuk wilayah Tangerang?',
        answer: 'Detail pengiriman akan disampaikan langsung oleh tim kami melalui WhatsApp setelah mengetahui kebutuhan dan lokasi Anda.'
      }
    ]
  },

  bandung: {
    slug: 'bandung',
    cityName: 'Bandung',
    hasLocalOffice: false,
    intro: [
      'Bandung dikenal sebagai salah satu kota dengan pertumbuhan industri interior dan furnitur yang aktif di Indonesia, mulai dari kebutuhan proyek residensial, kafe, hingga ritel. Varindo, sebagai dealer resmi HPL Lamitak, melayani kebutuhan pemesanan HPL Lamitak untuk pelanggan di Bandung melalui katalog online ini, dengan lebih dari 800 pilihan motif kayu, pola dekoratif, dan warna solid.',
      'Anda dapat menjelajahi katalog, membandingkan harga per kode produk yang sudah termasuk PPN, dan menghubungi tim kami untuk proses pemesanan maupun konsultasi kebutuhan proyek. Baik untuk kebutuhan desainer interior, kontraktor, maupun pemilik usaha di Bandung, seluruh proses penawaran dan koordinasi pengiriman dilakukan melalui WhatsApp.'
    ],
    areaLayanan:
      'Varindo melayani pemesanan HPL Lamitak untuk wilayah Bandung dan sekitarnya. Pilih kode produk yang Anda butuhkan dari katalog online ini, lalu hubungi tim kami via WhatsApp untuk konfirmasi harga dan ketersediaan stok. Detail pengiriman ke Bandung, termasuk metode dan estimasi waktu, akan didiskusikan langsung sesuai kebutuhan dan volume pemesanan Anda.',
    faq: [
      {
        question: 'Apakah stok HPL Lamitak ready untuk pengiriman ke Bandung?',
        answer: 'Sebagian besar kode produk dalam katalog berstatus ready stock. Untuk memastikan ketersediaan kode tertentu sebelum pemesanan ke Bandung, silakan hubungi tim kami via WhatsApp.'
      },
      {
        question: 'Bagaimana cara memesan HPL Lamitak untuk proyek di Bandung?',
        answer: 'Pilih kode produk di katalog online ini, lalu hubungi tim kami via WhatsApp atau isi formulir Permintaan Penawaran. Tim kami akan membantu proses pemesanan hingga pengiriman.'
      },
      {
        question: 'Apakah saya bisa mengambil sendiri produk di gudang Varindo?',
        answer: 'Pengambilan langsung dapat didiskusikan dengan tim kami melalui WhatsApp, tergantung ketersediaan dan kesepakatan bersama.'
      },
      {
        question: 'Bagaimana informasi pengiriman ke Bandung?',
        answer: 'Detail pengiriman, termasuk metode dan estimasi waktu, akan disampaikan langsung oleh tim kami melalui WhatsApp setelah mengetahui kebutuhan dan lokasi pengiriman Anda.'
      }
    ]
  },

  surabaya: {
    slug: 'surabaya',
    cityName: 'Surabaya',
    hasLocalOffice: false,
    intro: [
      'Meskipun Varindo tidak memiliki kantor maupun gudang fisik di Surabaya, kami tetap melayani pengiriman HPL Lamitak untuk pelanggan di Surabaya dan sekitarnya melalui katalog online ini. Dengan lebih dari 800 pilihan motif — mulai dari kayu, pola dekoratif, hingga warna solid — Anda dapat mencari kode produk yang sesuai kebutuhan proyek interior Anda.',
      'Anda dapat membandingkan harga yang sudah termasuk PPN, lalu menghubungi tim kami untuk proses pemesanan. Sebagai dealer resmi HPL Lamitak, kami berkomitmen memberikan harga yang transparan dan produk yang terjamin keasliannya, meski proses pemesanan dan pengiriman untuk wilayah Surabaya dikoordinasikan sepenuhnya melalui WhatsApp.'
    ],
    areaLayanan:
      'Varindo melayani pengiriman HPL Lamitak ke Surabaya dan sekitarnya berdasarkan pemesanan melalui katalog online ini. Pilih kode produk yang Anda butuhkan, lalu hubungi tim kami via WhatsApp untuk konfirmasi harga, ketersediaan, dan metode pengiriman yang sesuai. Karena kami tidak memiliki gudang fisik di Surabaya, seluruh detail pengiriman — termasuk estimasi waktu — akan disampaikan langsung oleh tim kami sesuai lokasi dan kebutuhan Anda.',
    faq: [
      {
        question: 'Apakah stok HPL Lamitak ready untuk dikirim ke Surabaya?',
        answer: 'Sebagian besar produk dalam katalog berstatus ready stock di pusat distribusi kami. Untuk memastikan ketersediaan kode tertentu sebelum pemesanan ke Surabaya, silakan hubungi tim kami via WhatsApp.'
      },
      {
        question: 'Bagaimana cara order HPL Lamitak untuk dikirim ke Surabaya?',
        answer: 'Pilih kode produk dari katalog online ini, lalu hubungi tim kami via WhatsApp. Tim kami akan membantu proses pemesanan hingga koordinasi pengiriman ke Surabaya.'
      },
      {
        question: 'Apakah Varindo memiliki gudang di Surabaya?',
        answer: 'Saat ini kami tidak memiliki kantor maupun gudang fisik di Surabaya. Seluruh pemesanan dari Surabaya dilayani melalui pengiriman yang dikoordinasikan lewat WhatsApp.'
      },
      {
        question: 'Bagaimana informasi pengiriman ke Surabaya?',
        answer: 'Detail pengiriman, termasuk metode dan estimasi waktu, akan disampaikan langsung oleh tim kami melalui WhatsApp setelah mengetahui kebutuhan dan lokasi pengiriman Anda.'
      }
    ]
  }
};

export const CITY_SLUGS = Object.keys(CITY_CONTENT);
