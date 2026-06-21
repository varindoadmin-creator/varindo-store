// ─────────────────────────────────────────────────────────────────
//  Varindo i18n — Bahasa Indonesia (default) + English
//
//  Rules:
//  • Product names, codes, design names: NEVER translated
//  • Collection names (Woods, Patterns, Solids): kept as-is (they
//    are Lamitak's own product category names, not UI labels)
//  • UI chrome, navigation, labels, CTAs: translated
// ─────────────────────────────────────────────────────────────────

export type Lang = 'id' | 'en';

export const translations = {
  // ── Header / Nav ──────────────────────────────────────────────
  nav: {
    home:         { id: 'Beranda',    en: 'Home' },
    collections:  { id: 'Koleksi',   en: 'Collections' },
    allProducts:  { id: 'Semua Produk', en: 'All Products' },
    about:        { id: 'Tentang',   en: 'About' },
    contact:      { id: 'Kontak',    en: 'Contact' },
    chatWithUs:   { id: 'Hubungi Kami', en: 'Chat with Us' },
    searchPlaceholder: {
      id: 'Cari kode, desain, finishing...',
      en: 'Search by code, design, finish...'
    },
    announcementBar: {
      id: 'Dealer Resmi Lamitak · Indonesia',
      en: 'Authorized Lamitak Dealer · Indonesia'
    }
  },

  // ── Homepage ──────────────────────────────────────────────────
  home: {
    heroBadge:    { id: 'Dealer Resmi Lamitak', en: 'Authorized Lamitak Dealer' },
    heroLine1:    { id: 'Material Terbaik', en: 'Surface Materials' },
    heroLine2:    { id: 'Pilihan Para', en: 'Curated for' },
    heroLine3:    { id: 'Profesional', en: 'Professionals' },
    heroBody:     {
      id: 'Jelajahi produk HPL Lamitak berdasarkan kode, nama desain, koleksi, sub koleksi, ukuran, ketebalan, dan harga melalui katalog online Varindo.',
      en: "Browse Lamitak HPL products by code, design name, collection, sub collection, size, thickness, and price through Varindo's online catalogue."
    },
    browseCta:    { id: 'Lihat Produk', en: 'Browse Products' },
    quickSearchLabel:   { id: 'Pencarian Cepat', en: 'Quick Search' },
    quickSearchTitle:   { id: 'Cari Produk', en: 'Search Products' },
    searchPlaceholder:  {
      id: 'Coba "DXO 5338D", "Walnut", atau "Grey Marble"',
      en: 'Try "DXO 5338D", "Walnut", or "Grey Marble"'
    },
    productCount: { id: 'produk aktif dalam katalog', en: 'active products in the catalogue' },
    stripDealer:  { id: 'Dealer Resmi', en: 'Authorized Dealer' },

    collectionsSectionLabel: { id: 'Koleksi', en: 'Collections' },
    collectionsSectionTitle: { id: 'Perpustakaan Material', en: 'Material Library' },
    collectionsViewAll:      { id: 'Semua Produk →', en: 'All Products →' },

    woodsDesc:    {
      id: 'Laminat motif kayu untuk kabinet, dinding, furnitur, dan detail interior.',
      en: 'Warm woodgrain laminates for cabinetry, walls, furniture, and refined interior details.'
    },
    patternsDesc: {
      id: 'Motif dekoratif, Saville, dan desain Bookmatched untuk permukaan feature dan area statement.',
      en: 'Decorative patterns, Saville, and Bookmatched designs for feature surfaces and statement areas.'
    },
    solidsDesc:   {
      id: 'Warna solid, Solid Core, Protak, dan Protak Core untuk berbagai kebutuhan aplikasi.',
      en: 'Clean solid colours, Solid Core, Protak, and Protak Core options for versatile applications.'
    },
      id: 'Produk Lamitak pilihan dengan harga promo khusus — tersedia selama stok masih ada.',
      en: 'Selected Lamitak items with special promotional pricing — available while stocks last.'
    },

    newArrivalsLabel: { id: 'Produk Terbaru', en: 'New Arrivals' },
    newArrivalsTitle: { id: 'Produk Terbaru', en: 'New Arrivals' },
    newArrivalsBody:  {
      id: 'Desain Lamitak terkini — tekstur modern dan finishing premium untuk proyek interior kontemporer.',
      en: 'Fresh Lamitak designs — modern textures and refined finishes for contemporary interior projects.'
    },
    viewAll: { id: 'Lihat Semua →', en: 'View All →' },

    bestSellersLabel: { id: 'Terlaris', en: 'Popular' },
    bestSellersTitle: { id: 'Produk Terlaris', en: 'Best Sellers' },
    bestSellersBody:  {
      id: 'Desain Lamitak yang paling banyak dipilih untuk berbagai kebutuhan interior.',
      en: 'Frequently specified Lamitak designs trusted for diverse interior applications.'
    },

    portfolioLabel: { id: 'Portofolio Digital', en: 'Digital Portfolio' },
    portfolioTitle1:{ id: 'Lamitak Portfolio', en: 'Lamitak Portfolio' },
    portfolioTitle2:{ id: '2026 / 2027', en: '2026 / 2027' },
    portfolioBody:  {
      id: 'Jelajahi portofolio desain Lamitak secara lengkap — tekstur, finishing, dan rangkaian permukaan untuk setiap proyek interior.',
      en: 'Explore the complete Lamitak design portfolio — textures, finishes, and surface families for every interior project.'
    },
    portfolioCta:   { id: 'Lihat Portofolio', en: 'View Portfolio' },

    whyLabel: { id: 'Mengapa Varindo', en: 'Why Varindo' },
    whyTitle1:{ id: 'Built on Trust.', en: 'Built on Trust.' },
    whyTitle2:{ id: 'Driven by Service.', en: 'Driven by Service.' },
    whyBody:  {
      id: 'Sebagai dealer resmi Lamitak di Indonesia, kami memberikan pengalaman pengadaan yang transparan, profesional, dan terpercaya untuk setiap proyek.',
      en: 'As an authorized Lamitak dealer in Indonesia, we deliver a transparent, professional, and dependable procurement experience for every project.'
    },
    why1Title:{ id: 'Pencarian Produk Terstruktur', en: 'Structured Product Search' },
    why1Body: {
      id: 'Temukan produk berdasarkan kode, nama desain, koleksi, sub koleksi, ukuran, dan ketebalan.',
      en: 'Find products by code, design name, collection, sub collection, size, and thickness.'
    },
    why2Title:{ id: 'Harga Transparan', en: 'Clear Pricing' },
    why2Body: {
      id: 'Lihat harga produk secara jelas dengan pajak sudah termasuk untuk kemudahan perencanaan.',
      en: 'Browse product pricing clearly with tax included for easier comparison and planning.'
    },
    why3Title:{ id: 'Dukungan Proyek', en: 'Project Support' },
    why3Body: {
      id: 'Hubungi tim kami untuk pertanyaan produk, detail pesanan, pengecekan stok, dan panduan pengiriman.',
      en: 'Contact our team for product enquiries, order details, availability checks, and delivery guidance.'
    }
  },

  // ── Products listing page ─────────────────────────────────────
  products: {
    badge:        { id: 'Lamitak HPL', en: 'Lamitak HPL' },
    title:        { id: 'Katalog Produk', en: 'Product Catalog' },
    subtitle:     {
      id: 'Cari berdasarkan kode produk, nama desain, koleksi, finishing, atau kategori warna.',
      en: 'Search by product code, design name, collection, finish, or colour family.'
    },
    loading:      { id: 'Memuat katalog…', en: 'Loading catalogue…' }
  },

  // ── Product Explorer (filter/search bar) ─────────────────────
  explorer: {
    filterTitle:    { id: 'Filter & Cari', en: 'Filter & Search' },
    clearAll:       { id: 'Hapus Semua', en: 'Clear All' },
    searchLabel:    { id: 'Cari', en: 'Search' },
    searchPlaceholder: {
      id: 'Kode, nama desain, koleksi, ukuran...',
      en: 'Search code, design name, collection, size...'
    },
    collectionLabel:  { id: 'Koleksi', en: 'Collection' },
    allCollections:   { id: 'Semua koleksi', en: 'All collections' },
    categoryLabel:    { id: 'Kategori', en: 'Category' },
    allCategories:    { id: 'Semua kategori', en: 'All categories' },
    sizeLabel:        { id: 'Ukuran', en: 'Size' },
    allSizes:         { id: 'Semua ukuran', en: 'All sizes' },
    productsFound:    { id: 'produk ditemukan', en: 'products found' },
    productFound:     { id: 'produk ditemukan', en: 'product found' },
    showing:          { id: 'Menampilkan', en: 'Showing' },
    previous:         { id: '← Sebelumnya', en: '← Previous' },
    next:             { id: 'Berikutnya →', en: 'Next →' },
    page:             { id: 'Halaman', en: 'Page' },
    of:               { id: 'dari', en: 'of' },
    tabAll:           { id: 'Semua Produk', en: 'All Products' },
    tabNewArrivals:   { id: 'Produk Terbaru', en: 'New Arrivals' },
    tabBestSellers:   { id: 'Terlaris', en: 'Best Sellers' },
    noResults:        { id: 'Tidak Ada Hasil', en: 'No Results' },
    noResultsTitle:   { id: 'Produk tidak ditemukan', en: 'No products found' },
    noResultsBody:    {
      id: 'Coba cari dengan kode produk, nama, koleksi, atau finishing lain.',
      en: 'Try searching with another product code, name, collection, or finish.'
    }
  },

  // ── Product Card ──────────────────────────────────────────────
  card: {
    inclTax:    { id: 'sudah termasuk pajak', en: 'incl. tax' }
  },

  // ── Product Detail page ───────────────────────────────────────
  detail: {
    breadcrumbCatalog: { id: 'Katalog', en: 'Catalog' },
    colourNote:        {
      id: 'Catatan: Warna aktual dapat berbeda dari tampilan digital. Kami menyarankan untuk melihat sampel fisik sebelum spesifikasi final.',
      en: 'Note: Actual colours may vary from digital display. We recommend viewing a physical sample prior to specification.'
    },
    inclTax:           { id: 'Sudah termasuk pajak', en: 'Tax included' },
    enquireCta:        { id: 'Tanya via WhatsApp', en: 'Enquire via WhatsApp' },
    backCatalog:       { id: '← Kembali ke Katalog', en: '← Back to Catalog' },
    specsTitle:        { id: 'Spesifikasi Produk', en: 'Product Specifications' },
    specCode:          { id: 'Kode', en: 'Code' },
    specBrand:         { id: 'Merek', en: 'Brand' },
    specDesign:        { id: 'Desain', en: 'Design' },
    specCollection:    { id: 'Koleksi', en: 'Collection' },
    specSubCollection: { id: 'Sub Koleksi', en: 'Sub Collection' },
    specSize:          { id: 'Ukuran', en: 'Size' },
    specThickness:     { id: 'Ketebalan', en: 'Thickness' },
    specColourFamily:  { id: 'Famili Warna', en: 'Colour Family' }
  },

  // ── Collections page ─────────────────────────────────────────
  collections: {
    breadcrumbCatalog: { id: 'Katalog', en: 'Catalog' },
    products:          { id: 'Produk', en: 'Products' },
    newArrivalsAccent: { id: 'Terbaru', en: 'New' },
    newArrivalsTitle:  { id: 'Produk Terbaru', en: 'New Arrivals' },
    newArrivalsDesc:   {
      id: 'Desain Lamitak yang baru ditambahkan, dipilih dari rangkaian kode produk terkini.',
      en: 'Browse newly introduced Lamitak designs selected from the latest product code families.'
    },
    bestSellersAccent: { id: 'Terlaris', en: 'Popular' },
    bestSellersTitle:  { id: 'Produk Terlaris', en: 'Best Sellers' },
    bestSellersDesc:   {
      id: 'Jelajahi desain Lamitak yang paling sering dipilih untuk interior hunian, ritel, dan komersial.',
      en: 'Explore frequently selected Lamitak surfaces for residential, retail, and commercial interiors.'
    },
    woodsTitle:        { id: 'Woods', en: 'Woods' },
    woodsDesc:         {
      id: 'Jelajahi desain kayu Lamitak untuk kabinet, panel dinding, furnitur, dan detail interior.',
      en: 'Explore Lamitak wood designs for cabinetry, wall panels, furniture, and interior detailing.'
    },
    patternsTitle:     { id: 'Patterns', en: 'Patterns' },
    patternsDesc:      {
      id: 'Temukan desain Lamitak yang ekspresif untuk dinding feature, furnitur, counter, dan elemen proyek unggulan.',
      en: 'Browse expressive Lamitak designs for feature walls, furniture, counters, and project highlights.'
    },
    solidsTitle:       { id: 'Solids', en: 'Solids' },
    solidsDesc:        {
      id: 'Jelajahi warna solid, solid core, Protak, dan Protak Core untuk berbagai aplikasi interior.',
      en: 'Explore solid colours, solid core, Protak, and Protak Core options for versatile interior applications.'
    }
  },

  // ── About page ───────────────────────────────────────────────
  about: {
    badge:        { id: 'Perusahaan', en: 'Company' },
    title:        { id: 'Tentang Varindo', en: 'About Varindo' },
    missionLabel: { id: 'Misi', en: 'Mission' },
    missionTitle1:{ id: 'Built on Trust.', en: 'Built on Trust.' },
    missionTitle2:{ id: 'Driven by Service.', en: 'Driven by Service.' },
    mission1:     {
      id: 'Varindo adalah dealer resmi Lamitak High Pressure Laminates (HPL) di Indonesia. Kami berkomitmen memberikan pengalaman pembelian yang transparan, profesional, dan terpercaya bagi seluruh pelanggan.',
      en: 'Varindo is an authorized dealer of Lamitak High Pressure Laminates (HPL) in Indonesia. We are committed to delivering a transparent, professional, and dependable purchasing experience for all our customers.'
    },
    mission2:     {
      id: 'Dengan pendekatan yang terstruktur dan sistem yang terorganisir, kami memastikan setiap proses — dari penawaran hingga pengiriman — ditangani dengan jelas, responsif, dan konsisten.',
      en: 'With a structured approach and well-organized systems, we ensure that every process — from quotation to delivery — is handled clearly, responsively, and consistently.'
    },
    mission3:     {
      id: 'Kami melayani kebutuhan HPL Lamitak di berbagai segmen pasar di Indonesia, dengan fokus kuat pada kepercayaan jangka panjang dan layanan yang bertanggung jawab.',
      en: 'We serve Lamitak HPL needs across various market segments in Indonesia, with a strong focus on long-term trust and responsible service.'
    },
    visionLabel:  { id: 'Visi', en: 'Vision' },
    visionTitle:  {
      id: 'Distribusi Lamitak yang andal di seluruh Indonesia.',
      en: 'Reliable Lamitak distribution across Indonesia.'
    },
    vision1:      {
      id: 'Membangun jaringan distribusi Lamitak yang andal dan terpercaya di seluruh Indonesia, dengan standar profesionalisme dan konsistensi yang tinggi.',
      en: 'To build a reliable and trusted Lamitak distribution network across Indonesia, with high standards of professionalism and consistency.'
    },
    vision2:      {
      id: 'Memberikan pengalaman pembelian Lamitak HPL yang jelas, transparan, dan terpercaya melalui koordinasi yang disiplin, layanan responsif, dan sistem distribusi yang terus berkembang.',
      en: 'To provide a clear, transparent, and trustworthy purchasing experience for Lamitak HPL through disciplined coordination, responsive service, and a continuously developing distribution system.'
    },
    valuesLabel:  { id: 'Nilai-Nilai Kami', en: 'Our Values' },
    val1Title:    { id: 'Integritas', en: 'Integrity' },
    val1Body:     {
      id: 'Berkomitmen pada kejujuran, transparansi harga, dan komunikasi terbuka di setiap tahap.',
      en: 'Committed to honesty, pricing transparency, and open communication at every stage.'
    },
    val2Title:    { id: 'Keunggulan Operasional', en: 'Operational Excellence' },
    val2Body:     {
      id: 'Proses yang disiplin untuk memastikan konsistensi dan akurasi dalam setiap transaksi.',
      en: 'Disciplined processes that ensure consistency and accuracy in every transaction.'
    },
    val3Title:    { id: 'Kemitraan Jangka Panjang', en: 'Long-Term Partnership' },
    val3Body:     {
      id: 'Membangun hubungan yang saling menguntungkan dan berkelanjutan dengan setiap klien.',
      en: 'Building mutually beneficial and lasting relationships with every client.'
    },
    val4Title:    { id: 'Perbaikan Berkelanjutan', en: 'Continuous Improvement' },
    val4Body:     {
      id: 'Terus meningkatkan sistem dan proses agar semakin efisien dan profesional.',
      en: 'Continuously improving systems and processes to become more efficient and professional.'
    }
  },

  // ── Contact page ─────────────────────────────────────────────
  contact: {
    badge:        { id: 'Hubungi Kami', en: 'Get in Touch' },
    title:        { id: 'Kontak', en: 'Contact Us' },
    intro:        {
      id: 'Jika Anda memiliki pertanyaan mengenai produk dan layanan kami, jangan ragu untuk menghubungi kami. Tim kami siap membantu Anda.',
      en: 'If you have any questions regarding our products and services, please do not hesitate to contact us. Our team will be more than happy to assist you.'
    },
    companyLabel: { id: 'Perusahaan', en: 'Company' },
    headOffice:   { id: 'Kantor Utama', en: 'Head Office' },
    regOffice:    { id: 'Kantor Terdaftar', en: 'Registered Office' },
    hours:        { id: 'Jam Operasional', en: 'Opening Hours' },
    hoursValue:   { id: 'Senin – Jumat\n09.00 – 17.00 WIB', en: 'Monday – Friday\n09.00 – 17.00 WIB' },
    email:        { id: 'Email', en: 'Email' },
    waTitle:      { id: 'Butuh Bantuan?', en: 'Need assistance?' },
    waBody:       {
      id: 'Hubungi tim kami untuk pertanyaan produk, harga, pengecekan stok, sampel, informasi katalog, dan panduan pengiriman.',
      en: 'Chat with our team for product enquiries, pricing, stock checks, samples, catalog information, and delivery guidance.'
    },
    browseCatalog:{ id: 'Lihat Katalog', en: 'Browse Catalog' },
    browseLink:   { id: 'Lihat semua produk Lamitak →', en: 'View all Lamitak products →' }
  },

  // ── Footer ───────────────────────────────────────────────────
  footer: {
    tagline:      {
      id: 'Dealer resmi Lamitak High Pressure Laminates di Indonesia. Melayani desainer interior, arsitek, dan kontraktor secara profesional.',
      en: 'Authorized dealer of Lamitak High Pressure Laminates in Indonesia. Professional supply for interior designers, architects, and contractors.'
    },
    collections:  { id: 'Koleksi', en: 'Collections' },
    company:      { id: 'Perusahaan', en: 'Company' },
    contact:      { id: 'Kontak', en: 'Contact' },
    phone:        { id: 'Telepon', en: 'Phone' },
    aboutLink:    { id: 'Tentang Varindo', en: 'About Varindo' },
    contactLink:  { id: 'Kontak', en: 'Contact' },
    catalogueLink:{ id: 'Permintaan Katalog', en: 'Request Catalogue' },
    quoteLink:    { id: 'Permintaan Penawaran', en: 'Request Quote' },
    sampleLink:   { id: 'Permintaan Sampel', en: 'Request Sample' },
    copyright:    { id: '© {year} CV. Varindo Forma Hutama. Hak cipta dilindungi.', en: '© {year} CV. Varindo Forma Hutama. All rights reserved.' },
    dealerBadge:  { id: 'Dealer Resmi Lamitak · Indonesia', en: 'Authorized Lamitak Dealer · Indonesia' }
  },

  // ── Request forms ─────────────────────────────────────────────
  forms: {
    nameLabel:        { id: 'Nama / Perusahaan', en: 'Name or Company Name' },
    namePlaceholder:  { id: 'cth. PT. Maju Jaya Interior', en: 'e.g. PT. Maju Jaya Interior' },
    addressLabel:     { id: 'Alamat Pengiriman', en: 'Delivery Address' },
    addressPlaceholder:{ id: 'Jalan, kota, provinsi', en: 'Street, city, province' },
    phoneLabel:       { id: 'Nomor Telepon', en: 'Phone Number' },
    phonePlaceholder: { id: 'cth. 0812 3456 7890', en: 'e.g. 0812 3456 7890' },
    required:         { id: 'wajib', en: 'required' },
    submitBtn:        { id: 'Kirim Permintaan', en: 'Submit Request' },
    submitting:       { id: 'Mengirim…', en: 'Submitting…' },
    yourDetails:      { id: 'Data Anda', en: 'Your Details' },
    successLabel:     { id: 'Permintaan Diterima', en: 'Request Received' },
    submitAnother:    { id: 'Kirim permintaan lain', en: 'Submit another request' },
    networkError:     {
      id: 'Koneksi bermasalah. Periksa jaringan Anda dan coba lagi.',
      en: 'Network error. Please check your connection and try again.'
    },
    serverError:      {
      id: 'Terjadi kesalahan. Silakan coba lagi.',
      en: 'Something went wrong. Please try again.'
    },
    readyMsg:         { id: 'Siap — klik Kirim untuk mengirim permintaan.', en: 'Ready — click Submit to send your request.' },
    fillAllMsg:       { id: 'Mohon isi semua kolom yang wajib diisi.', en: 'Please fill in all fields to continue.' },
    contactNote:      {
      id: 'Permintaan akan dicatat dan tim kami akan menghubungi Anda dalam 1 hari kerja.',
      en: 'Your request will be logged and our team will contact you within 1 business day.'
    },

    // Catalogue form
    catalogueBadge:   { id: 'Permintaan Katalog', en: 'Catalogue Request' },
    catalogueTitle:   { id: 'Permintaan Katalog\nLamitak', en: 'Request a\nLamitak Catalogue' },
    catalogueSubtitle:{ id: 'Isi data Anda dan tim kami akan mengatur katalog produk Lamitak untuk Anda.', en: 'Fill in your details and our team will arrange the Lamitak product catalogue for you.' },
    catalogueSuccess: {
      id: 'Terima kasih, {name}. Tim kami akan mengatur katalog dan menghubungi Anda di {phone} dalam 1 hari kerja.',
      en: 'Thank you, {name}. Our team will arrange the catalogue and contact you at {phone} within 1 business day.'
    },
    catalogueSuccessTitle: { id: 'Permintaan katalog terkirim.', en: 'Catalogue request submitted.' },

    // Quote form
    quoteBadge:       { id: 'Permintaan Penawaran', en: 'Quote Request' },
    quoteTitle:       { id: 'Permintaan Penawaran', en: 'Request a Quote' },
    quoteSubtitle:    {
      id: 'Isi data Anda dan cari kode atau nama desain yang dibutuhkan. Permintaan akan dikirim langsung ke tim kami.',
      en: 'Fill in your details and search for the product codes or design names you need. Your request will be sent directly to our team.'
    },
    quoteSuccessTitle:{ id: 'Permintaan penawaran terkirim.', en: 'Quote request submitted.' },
    quoteSuccessBody: {
      id: 'Permintaan Anda telah dicatat. Tim kami akan meninjau pesanan dan menghubungi Anda di {phone} dalam 1 hari kerja.',
      en: 'Your request has been recorded. Our team will review your order and contact you at {phone} within 1 business day.'
    },
    productListTitle: { id: 'Daftar Produk', en: 'Product List' },
    itemsAdded:       { id: '{n} item ditambahkan', en: '{n} items added' },
    codeColumnHeader: { id: 'Kode atau Nama Desain', en: 'Code or Design Name' },
    qtyColumnHeader:  { id: 'Jml', en: 'Qty' },
    codePlaceholder:  { id: 'Cari kode atau desain…', en: 'Search code or design…' },
    qtyPlaceholder:   { id: 'cth. 10', en: 'e.g. 10' },
    readyQuote:       { id: 'Siap — {n} produk dengan data Anda.', en: 'Ready — {n} products with your details.' },
    fillProduct:      { id: 'Isi data dan minimal satu produk untuk melanjutkan.', en: 'Fill in your details and at least one product to continue.' },
    qtyError:         { id: 'Mohon isi jumlah yang valid untuk semua baris yang terisi.', en: 'Please enter a valid quantity for all filled rows.' },
    summaryProducts:  { id: 'produk', en: 'products' },
    requestSummary:   { id: 'Ringkasan Permintaan', en: 'Request Summary' },

    // Sample form
    sampleBadge:      { id: 'Permintaan Sampel', en: 'Sample Request' },
    sampleTitle:      { id: 'Permintaan\nSampel Lamitak', en: 'Request\nLamitak Samples' },
    sampleSubtitle:   {
      id: 'Pelanggan dapat meminta hingga 5 sampel Lamitak per permintaan. Siapkan kode produk atau nama desain agar tim kami dapat menindaklanjuti dengan tepat.',
      en: 'Customers may request up to 5 Lamitak sample pieces per request. Please prepare product codes or design names so our team can follow up accurately.'
    },
    sampleInfoTitle:  { id: 'Informasi yang Perlu Disiapkan', en: 'Information to Prepare' },
    sampleInfo:       {
      id: ['Kode produk atau nama desain', 'Nama / perusahaan', 'Alamat pengiriman', 'Nomor telepon'],
      en: ['Product code or design name', 'Name or company name', 'Delivery address', 'Phone number']
    },
    sampleMaxNote:    {
      id: 'Maksimal 5 sampel per permintaan. Permintaan akan membuka WhatsApp dengan pesan yang sudah terisi.',
      en: 'Maximum 5 sample pieces per request. Your request will open WhatsApp with a pre-filled message.'
    },
    sampleFormTitle:  { id: 'Form Permintaan Sampel', en: 'Sample Request Form' },
    sampleSlotLabel:  { id: 'Kode Produk atau Nama Desain', en: 'Product Codes or Design Names' },
    sampleSlotPlaceholder: { id: 'Cari kode atau nama desain…', en: 'Search code or design name…' },
    sampleMaxLabel:   { id: 'Maksimal {n} sampel per permintaan.', en: 'Maximum {n} sample pieces per request.' },
    sampleSuccessTitle: { id: 'Permintaan sampel terkirim.', en: 'Sample request submitted.' },
    sampleSuccessBody: {
      id: 'Permintaan {n} sampel Anda telah dicatat. Tim kami akan menghubungi Anda di {phone} dalam 1 hari kerja.',
      en: 'Your request for {n} samples has been recorded. Our team will contact you at {phone} within 1 business day.'
    },
    samplesRequested: { id: 'Sampel yang Diminta', en: 'Samples Requested' },
    readySample:      { id: 'Siap — {n} sampel dengan data Anda.', en: 'Ready — {n} samples with your details.' },
    fillSample:       { id: 'Isi minimal satu produk dan data kontak.', en: 'Fill in at least one product and your contact details.' },
    itemsOf:          { id: '{n} / {max} item', en: '{n} / {max} items' }
  },

  // ── Product search autocomplete ───────────────────────────────
  autocomplete: {
    placeholder:  { id: 'Ketik kode atau nama desain…', en: 'Type code or design name…' },
    noResults:    { id: 'Produk tidak ditemukan untuk', en: 'No products found for' },
    noResultsHint:{ id: 'Anda tetap bisa ketik kode secara manual.', en: 'You can still type a custom code manually.' },
    hint:         {
      id: '{n} hasil · ↑↓ navigasi · Enter untuk pilih · Esc untuk tutup',
      en: '{n} result{s} · ↑↓ navigate · Enter to select · Esc to close'
    }
  },

  // ── Image zoom ────────────────────────────────────────────────
  imageZoom: {
    zoomLabel:    { id: 'Perbesar', en: 'Zoom' },
    closeLabel:   { id: 'Tutup', en: 'Close' },
    colourNote:   {
      id: 'Warna aktual dapat berbeda dari tampilan digital.',
      en: 'Actual colours may vary from digital display.'
    },
    download:     { id: 'Unduh →', en: 'Download →' }
  },

  // ── Product image placeholder ─────────────────────────────────
  imagePlaceholder: {
    label: { id: 'Gambar segera hadir', en: 'Image coming soon' }
  }
} as const;

export type TranslationKey = keyof typeof translations;

/** Get a translated string. Interpolates {key} placeholders. */
export function t(
  section: keyof typeof translations,
  key: string,
  lang: Lang,
  vars?: Record<string, string | number>
): string {
  const sectionObj = translations[section] as Record<string, { id: string; en: string } | { id: string[]; en: string[] }>;
  const entry = sectionObj?.[key];
  if (!entry) return key;

  const value = entry[lang] ?? entry['id'];
  const str = Array.isArray(value) ? value.join(', ') : String(value);

  if (!vars) return str;
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
    str
  );
}
