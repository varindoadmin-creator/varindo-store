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
    chatWithUs:   { id: 'Hubungi Kami', en: 'Chat with Us' },
    getApp:       { id: 'Aplikasi Android', en: 'Android App' },
    surfaceMatch: { id: 'Cari Desain', en: 'Find Design' },
    searchPlaceholder: {
      id: 'Cari kode, desain, finishing...',
      en: 'Search by code, design, finish...'
    },
    clearSearch:    { id: 'Hapus pencarian', en: 'Clear search' },
    recentSearches: { id: 'Pencarian Terakhir', en: 'Recent Searches' },
    clearRecent:    { id: 'Hapus semua', en: 'Clear all' },
    removeRecent:   { id: 'Hapus dari riwayat', en: 'Remove from history' },
    announcementBar: {
      id: 'Authorized Dealer of Lamitak - Indonesia',
      en: 'Authorized Dealer of Lamitak - Indonesia'
    }
  },

  // ── Surface Match (search by photo) ───────────────────────────
  surfaceMatch: {
    heroLabel:     { id: 'Cari dari Foto', en: 'Search by Photo' },
    heroTitle:     { id: 'Temukan motif dari sebuah foto.', en: 'Find a design from a photo.' },
    heroSub: {
      id: 'Foto contoh HPL, permukaan interior, atau halaman katalog. Kami cocokkan dengan seluruh desain Lamitak dan tampilkan kode produknya.',
      en: 'Photograph an HPL sample, an interior surface, or a catalogue page. We match it against every Lamitak design and show you the product codes.'
    },
    takePhoto:     { id: 'Ambil Foto', en: 'Take a Photo' },
    chooseGallery: { id: 'Pilih dari Galeri', en: 'Choose from Gallery' },
    howItWorks:    { id: 'Cara kerjanya', en: 'How it works' },
    step1Title:    { id: 'Foto atau unggah', en: 'Snap or upload' },
    step1Desc: {
      id: 'Sampel, lembaran, pintu kabinet, atau satu halaman katalog berisi beberapa motif sekaligus.',
      en: 'A sample, a sheet, a cabinet door, or a catalogue page showing several designs at once.'
    },
    step2Title:    { id: 'Kode dibaca, motif dicocokkan', en: 'Codes read, designs compared' },
    step2Desc: {
      id: 'Kode produk yang terlihat dibaca langsung. Jika tidak ada, foto dibandingkan secara visual dengan seluruh koleksi Lamitak.',
      en: 'Any visible product code is read directly. Where there is none, the photo is compared visually against the full Lamitak collection.'
    },
    step3Title:    { id: 'Lihat hasilnya', en: 'See your matches' },
    step3Desc: {
      id: 'Setiap hasil menampilkan kode dan ukuran yang tersedia, siap dipesan atau diminta sampelnya.',
      en: 'Each match shows its codes and available sizes, ready to order or request as a sample.'
    },
    tipsHeading:   { id: 'Agar hasilnya akurat', en: 'For the best results' },
    tip1:          { id: 'Gunakan cahaya yang merata — cahaya alami paling baik.', en: 'Use even lighting — daylight works best.' },
    tip2:          { id: 'Isi bingkai foto dengan permukaan materialnya.', en: 'Fill the frame with the surface itself.' },
    tip3:          { id: 'Jika sampel memiliki kode produk, ikutkan kodenya di foto — itu cara paling akurat.', en: "If the sample has a product code, include it in the photo — it's the most accurate match." },
    privacyNote:   { id: 'Foto Anda disimpan hingga 30 hari, lalu dihapus otomatis.', en: 'Your photo is kept for up to 30 days, then deleted automatically.' },
    privacyLink:   { id: 'Kebijakan Privasi', en: 'Privacy Policy' },
    yourPhoto:     { id: 'Foto Anda', en: 'Your photo' },
    searching:     { id: 'Mencocokkan foto Anda…', en: 'Matching your photo…' },
    searchingSub:  { id: 'Biasanya hanya beberapa detik.', en: 'This usually takes a few seconds.' },
    suggestedDesigns: { id: 'Hasil pencarian', en: 'Search results' },
    visualNote: {
      id: 'Motif tanpa kode terbaca diurutkan dari yang paling mirip. Pastikan dengan sampel fisik sebelum memesan.',
      en: 'Designs without a readable code are ordered by visual similarity. Confirm with a physical sample before ordering.'
    },
    newSearch:     { id: 'Cari lagi', en: 'New search' },
    noMatchesTitle:{ id: 'Belum ada motif yang cukup mirip.', en: 'No close matches found.' },
    noMatchesSub:  { id: 'Coba foto dari jarak lebih dekat dengan cahaya yang merata.', en: 'Try a closer photo in even light.' },
    itemLabel:     { id: 'Item {n}', en: 'Item {n}' },
    codeMatchBadge:{ id: 'Cocok kode', en: 'Code match' },
    codeDetectedNotFound: {
      id: 'Kode terbaca: {code} — tidak ada di katalog',
      en: 'Code read: {code} — not in the catalogue'
    },
    noMatchForItem:   { id: 'Tidak ada motif yang cukup mirip untuk item ini.', en: 'No close match for this item.' },
    errorGeneric:     { id: 'Terjadi kesalahan. Silakan coba lagi.', en: 'Something went wrong. Please try again.' },
    errorTooLarge:    { id: 'Foto terlalu besar. Maksimal 12 MB.', en: 'That photo is too large. The limit is 12 MB.' },
    errorUnsupported: { id: 'Format foto tidak didukung. Gunakan JPG atau PNG.', en: "That photo format isn't supported. Please use JPG or PNG." },
    errorRateLimited: { id: 'Terlalu banyak pencarian. Tunggu beberapa menit, lalu coba lagi.', en: 'Too many searches. Please wait a few minutes and try again.' },
    errorUnavailable: { id: 'Pencarian foto sedang tidak tersedia. Silakan coba lagi nanti.', en: 'Photo search is unavailable right now. Please try again later.' }
  },

  // ── Homepage ──────────────────────────────────────────────────
  home: {
    heroBadge:    { id: 'Dealer Resmi Lamitak', en: 'Authorized Lamitak Dealer' },
    // Varindo first, as the trusted dealer for Lamitak: promoting the brand
    // itself is the principal's job, not this site's.
    heroLine1:    { id: 'Dealer HPL Lamitak', en: 'Your Trusted' },
    heroLine2:    { id: 'yang', en: 'Lamitak HPL' },
    heroLine3:    { id: 'Terpercaya', en: 'Dealer' },
    heroBody:     {
      id: 'Kami fokus pada HPL, jadi kami lebih tanggap dan melayani Anda lebih cepat — dengan harga bersaing dan gratis ongkir ke seluruh Jawa dan Bali. Cari berdasarkan kode, nama desain, ukuran, atau ketebalan.',
      en: 'We focus on HPL alone, so we respond faster and serve you better — at competitive prices, with free shipping across Java and Bali. Search by code, design name, size or thickness.'
    },
    browseCta:    { id: 'Lihat Produk', en: 'Browse Products' },
    surfaceMatchCta: { id: 'Cari dari Foto', en: 'Search by Photo' },
    quickSearchLabel:   { id: 'Pencarian Cepat', en: 'Quick Search' },
    quickSearchTitle:   { id: 'Cari Produk', en: 'Search Products' },
    searchPlaceholder:  {
      id: 'Coba "DXO 5338D", "Walnut", atau "Grey Marble"',
      en: 'Try "DXO 5338D", "Walnut", or "Grey Marble"'
    },
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

    heroImageLabel: { id: 'Permukaan HPL Lamitak', en: 'Lamitak HPL surface' },

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
    },

    safeguardTitle: { id: 'Jaminan Pembeli', en: 'Buyer Safeguard' },
    safeguardBody1: {
      id: 'Setiap permukaan Lamitak membawa lebih dari sekadar inspirasi desain—ia membawa janji kami.',
      en: 'Every Lamitak surface carries more than design inspiration—it carries our promise.'
    },
    safeguardBody2: {
      id: 'Kode identitas kami menjamin bahwa setiap lembar adalah ciptaan eksklusif Lamitak, dikembangkan dengan saksama dan dedikasi terhadap kualitas dan orisinalitas.',
      en: 'Our signature code assures you that every piece is an exclusive Lamitak creation, meticulously developed with dedication to quality and originality.'
    },
    safeguardBody3: {
      id: 'Seluruh HPL dan solusi edging kami dilengkapi fitur antimikroba, sehingga Anda dapat menikmati ruang bergaya yang terjamin mendukung kesejahteraan Anda. Di Singapura, produk pilihan juga tersedia dengan sertifikasi FSC® Chain of Custody (FSC® C220543), mendukung komitmen kami terhadap sumber material yang bertanggung jawab dan desain berkelanjutan.',
      en: 'All our laminates and edging solutions are equipped with antimicrobial features, so you can enjoy a stylish space that is certified to support your well-being. In Singapore, selected products are also available with FSC® Chain of Custody certification (FSC® C220543), supporting our commitment to responsible sourcing and sustainable design.'
    },
    safeguardImageAlt: {
      id: 'Label Jaminan Pembeli & Keaslian Lamitak pada gulungan HPL',
      en: "Lamitak Buyer's Safeguard & Authenticity label on a laminate roll"
    },
    safeguard1Title: { id: 'Inskripsi Laser', en: 'Laser Inscription' },
    safeguard1Body:  {
      id: 'Setiap HPL Lamitak diverifikasi dengan cetakan laser hitam pada bagian belakang.',
      en: 'Each Lamitak laminate is verified with a black laser print on the backing.'
    },
    safeguard2Title: { id: 'Inspeksi Multi-Titik', en: 'Multi-point Inspection' },
    safeguard2Body:  {
      id: 'Seluruh HPL Lamitak diperiksa oleh tim gudang dan operasional terlatih.',
      en: 'All Lamitak laminates are inspected by a team of trained warehouse and operations staff.'
    },
    safeguard3Title: { id: 'Verifikasi', en: 'Verification' },
    safeguard3Body:  {
      id: 'Setiap inskripsi laser mencantumkan merek dan Kode Artikel agar Anda menerima produk yang sesuai pesanan.',
      en: "Each laser inscription includes the brand and Article Code to ensure you'll get exactly what you ordered."
    },
    safeguard4Title: { id: 'Keaslian Terjamin', en: 'Authenticity Guaranteed' },
    safeguard4Body:  {
      id: 'Pastikan pembelian dilakukan hanya melalui dealer resmi seperti Varindo untuk menghindari produk substitusi dan memastikan keaslian setiap lembar.',
      en: 'Purchase only through authorized dealers like Varindo to avoid inferior substitutions and ensure the authenticity of every sheet.'
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
    specColourFamily:  { id: 'Famili Warna', en: 'Colour Family' },
    breadcrumbHome:    { id: 'Beranda', en: 'Home' },
    relatedTitle:      { id: 'Produk Serupa', en: 'Related Products' },
    descriptionTitle:  { id: 'Deskripsi Produk', en: 'Product Description' },
    suitableFor:       { id: 'Cocok untuk', en: 'Suitable for' }
  },

  // ── Cart, checkout and order ──────────────────────────────────
  shop: {
    cart:             { id: 'Keranjang', en: 'Cart' },
    addToCart:        { id: 'Tambah ke Keranjang', en: 'Add to Cart' },
    added:            { id: 'Ditambahkan ke keranjang', en: 'Added to cart' },
    viewCart:         { id: 'Lihat Keranjang', en: 'View Cart' },
    quantity:         { id: 'Jumlah', en: 'Quantity' },
    decrease:         { id: 'Kurangi', en: 'Decrease' },
    increase:         { id: 'Tambah', en: 'Increase' },
    perSheet:         { id: 'per lembar', en: 'per sheet' },
    cartTitle:        { id: 'Keranjang Belanja', en: 'Shopping Cart' },
    cartEmpty:        { id: 'Keranjang Anda masih kosong.', en: 'Your cart is empty.' },
    browseCatalog:    { id: 'Lihat Katalog', en: 'Browse the Catalog' },
    remove:           { id: 'Hapus', en: 'Remove' },
    subtotal:         { id: 'Subtotal', en: 'Subtotal' },
    shipping:         { id: 'Ongkos kirim', en: 'Delivery' },
    shippingFree:     { id: 'Gratis (Jawa & Bali)', en: 'Free (Java & Bali)' },
    total:            { id: 'Total', en: 'Total' },
    taxIncluded:      { id: 'Semua harga sudah termasuk PPN 11%.', en: 'All prices include 11% VAT.' },
    checkout:         { id: 'Lanjut ke Pembayaran', en: 'Proceed to Checkout' },
    continueShopping: { id: '← Lanjut Belanja', en: '← Continue Shopping' },
    checkoutTitle:    { id: 'Checkout', en: 'Checkout' },
    deliveryDetails:  { id: 'Data Pengiriman', en: 'Delivery Details' },
    orderSummary:     { id: 'Ringkasan Pesanan', en: 'Order Summary' },
    emailLabel:       { id: 'Email (opsional)', en: 'Email (optional)' },
    emailPlaceholder: { id: 'untuk bukti pembayaran', en: 'for your payment receipt' },
    streetLabel:      { id: 'Alamat', en: 'Street Address' },
    streetPlaceholder:{ id: 'Jalan, nomor, RT/RW, kelurahan, kecamatan', en: 'Street, number, district' },
    cityLabel:        { id: 'Kota / Kabupaten', en: 'City / Regency' },
    provinceLabel:    { id: 'Provinsi', en: 'Province' },
    provinceChoose:   { id: 'Pilih provinsi', en: 'Choose a province' },
    provinceOther:    { id: 'Di luar Jawa & Bali', en: 'Outside Java & Bali' },
    outsideArea: {
      id: 'Pemesanan online saat ini untuk pengiriman ke Jawa dan Bali. Untuk daerah lain, hubungi kami via WhatsApp agar ongkos kirim bisa dihitung.',
      en: 'Online ordering currently delivers to Java and Bali. For other areas, contact us on WhatsApp so we can quote the delivery.'
    },
    postalLabel:      { id: 'Kode Pos', en: 'Postal Code' },
    notesLabel:       { id: 'Catatan (opsional)', en: 'Notes (optional)' },
    notesPlaceholder: { id: 'cth. patokan lokasi, jam penerimaan', en: 'e.g. landmarks, delivery hours' },
    payNow:           { id: 'Bayar Sekarang', en: 'Pay Now' },
    paying:           { id: 'Menyiapkan pembayaran…', en: 'Preparing payment…' },
    payNote: {
      id: 'Anda akan diarahkan ke halaman pembayaran Midtrans: transfer bank / virtual account, QRIS, e-wallet, atau kartu kredit.',
      en: 'You will be taken to Midtrans to pay by bank transfer / virtual account, QRIS, e-wallet, or credit card.'
    },
    unavailable: {
      id: 'Pembayaran online belum tersedia. Silakan pesan via WhatsApp.',
      en: 'Online payment is not available yet. Please order via WhatsApp.'
    },
    productUnavailable: {
      id: 'Salah satu produk di keranjang sudah tidak tersedia. Periksa keranjang Anda.',
      en: 'A product in your cart is no longer available. Please review your cart.'
    },
    orderTitle:       { id: 'Pesanan', en: 'Order' },
    orderNumber:      { id: 'Nomor pesanan', en: 'Order number' },
    statusPending:    { id: 'Menunggu Pembayaran', en: 'Awaiting Payment' },
    statusPaid:       { id: 'Pembayaran Diterima', en: 'Payment Received' },
    statusFailed:     { id: 'Pembayaran Gagal', en: 'Payment Failed' },
    statusExpired:    { id: 'Pembayaran Kedaluwarsa', en: 'Payment Expired' },
    statusRefunded:   { id: 'Dana Dikembalikan', en: 'Refunded' },
    bodyPending: {
      id: 'Selesaikan pembayaran dalam 24 jam. Halaman ini akan diperbarui setelah pembayaran kami terima.',
      en: 'Please complete payment within 24 hours. This page updates once we receive it.'
    },
    bodyPaid: {
      id: 'Terima kasih! Tim kami akan menghubungi Anda via WhatsApp untuk jadwal pengiriman.',
      en: 'Thank you! Our team will contact you on WhatsApp to arrange delivery.'
    },
    bodyFailed: {
      id: 'Pembayaran tidak berhasil. Anda bisa memesan ulang dari keranjang atau hubungi kami.',
      en: 'The payment did not go through. You can order again from the cart or contact us.'
    },
    continuePayment:  { id: 'Lanjutkan Pembayaran', en: 'Continue Payment' },
    refreshStatus:    { id: 'Perbarui Status', en: 'Refresh Status' },
    askOnWhatsApp:    { id: 'Tanya via WhatsApp', en: 'Ask on WhatsApp' },
    orderNotFound:    { id: 'Pesanan tidak ditemukan.', en: 'Order not found.' },
    mapSearchLabel:   { id: 'Cari alamat di peta', en: 'Find your address on the map' },
    mapSearchPlaceholder: { id: 'Ketik nama jalan, gedung, atau perumahan', en: 'Type a street, building, or housing estate' },
    mapSearchHint: {
      id: 'Membantu kurir menemukan lokasi Anda. Alamat lengkap tetap diisi di bawah.',
      en: 'Helps the driver find you. Still fill in the full address below.'
    },
    mapPinned:        { id: 'Lokasi di peta', en: 'Map location' },
    mapChange:        { id: 'Ganti', en: 'Change' }
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
    },

    // Longer SEO intro copy shown above the product grid (80-120 words) — DRAFT, needs review
    newArrivalsIntro: {
      id: 'Halaman Produk Terbaru menampilkan desain HPL Lamitak yang paling baru ditambahkan ke katalog Varindo, mencakup motif kayu, pola dekoratif, hingga warna solid dengan tren tekstur dan finishing terkini. Koleksi ini diperbarui secara berkala mengikuti rilis produk resmi dari Lamitak, sehingga Anda dapat menemukan pilihan motif terbaru untuk proyek interior sebelum banyak digunakan secara luas. Cocok bagi desainer interior, arsitek, maupun kontraktor yang ingin menghadirkan tampilan modern dan up-to-date pada proyek residensial maupun komersial. Semua produk tersedia dengan harga transparan termasuk PPN dan dapat diminta sampelnya secara gratis.',
      en: 'The New Arrivals page showcases the latest HPL Lamitak designs added to Varindo\'s catalogue, spanning wood grains, decorative patterns, and solid colours in current textures and finishes. The collection is updated regularly alongside Lamitak\'s official releases, so you can find the newest motifs for your interior project early. Ideal for interior designers, architects, and contractors who want a modern, up-to-date look for residential or commercial projects. All products are priced transparently including PPN, with free samples available on request.'
    },
    bestSellersIntro: {
      id: 'Halaman Produk Terlaris menampilkan motif HPL Lamitak yang paling banyak dipilih pelanggan Varindo, mulai dari motif kayu klasik, warna solid netral, hingga pola dekoratif yang populer digunakan pada berbagai proyek interior. Popularitas motif-motif ini didasarkan pada kombinasi tampilan yang serbaguna, daya tahan material, dan kemudahan perawatan dalam pemakaian sehari-hari. Koleksi ini menjadi referensi praktis bagi Anda yang ingin memilih HPL Lamitak dengan risiko lebih rendah karena sudah terbukti diminati banyak proyek sebelumnya. Semua produk tersedia dengan harga transparan termasuk PPN, ready stok, dan sampel gratis untuk memastikan kecocokan sebelum pemesanan.',
      en: 'The Best Sellers page features the HPL Lamitak motifs most frequently chosen by Varindo customers, from classic wood grains and neutral solids to decorative patterns popular across many interior projects. Their popularity comes from a combination of versatile looks, material durability, and easy day-to-day maintenance. This collection is a practical reference if you want a lower-risk HPL choice already proven across many past projects. All products are priced transparently including PPN, ready stock, with free samples available to confirm the fit before ordering.'
    },
    woodsIntro: {
      id: 'Koleksi HPL Lamitak Woods menghadirkan motif serat kayu yang hangat dan alami, dirancang untuk melengkapi berbagai gaya interior mulai dari minimalis modern hingga klasik. Setiap motif dalam koleksi ini meniru tekstur kayu asli — mulai dari oak, walnut, hingga ash — dengan detail serat yang halus dan konsisten di setiap lembar. Material HPL ini populer digunakan untuk kitchen set, lemari pakaian, panel dinding, dan berbagai furnitur interior karena daya tahannya terhadap goresan dan kelembapan, tanpa mengorbankan tampilan premium kayu asli. Cocok untuk proyek residensial maupun komersial yang mengutamakan kehangatan visual dengan perawatan yang mudah.',
      en: 'The HPL Lamitak Woods collection brings warm, natural wood grain motifs designed to suit interior styles from modern minimalist to classic. Each motif in this collection mimics authentic wood textures — from oak to walnut to ash — with fine, consistent grain detail across every sheet. This HPL material is popular for kitchen sets, wardrobes, wall panels, and interior furniture thanks to its resistance to scratches and moisture, without sacrificing the premium look of real wood. Suited to residential and commercial projects that want visual warmth with easy maintenance.'
    },
    patternsIntro: {
      id: 'Koleksi HPL Lamitak Patterns menghadirkan motif dekoratif yang ekspresif, mulai dari desain bertema marmer, tekstur kain, hingga pola geometris yang cocok dijadikan focal point ruangan. Termasuk di dalamnya varian Bookmatched dengan pola simetris presisi tinggi dan Saville dengan sentuhan motif bergaya klasik. Koleksi ini banyak dipilih untuk meja island, backsplash dapur, panel feature wall, hingga furnitur yang ingin tampil beda dari interior pada umumnya. Setiap motif diproduksi dengan detail cetak yang konsisten di setiap lembar, sehingga tetap menarik dilihat dari jarak dekat maupun sebagai elemen berskala besar pada satu bidang penuh.',
      en: 'The HPL Lamitak Patterns collection brings expressive decorative motifs, from marble-inspired designs and fabric textures to geometric patterns suited as a room\'s focal point. It includes the Bookmatched variant with precisely symmetrical patterns and Saville with a classic decorative touch. This collection is popular for kitchen islands, backsplashes, feature wall panels, and furniture that wants to stand out from typical interiors. Every motif is produced with consistent print detail across sheets, staying visually interesting up close or as a large-scale single surface.'
    },
    solidsIntro: {
      id: 'Koleksi HPL Lamitak Solids menawarkan warna polos yang bersih dan serbaguna, ideal untuk interior bergaya minimalis maupun sebagai pelengkap motif lain dalam satu ruangan. Tersedia varian Solid Core dengan warna yang konsisten hingga ke bagian dalam material, serta Protak dan Protak Core yang dirancang khusus untuk aplikasi pasca-bentuk (postforming) pada meja countertop bersudut melengkung. Koleksi ini banyak digunakan untuk laci, partisi, kabinet, dan elemen interior yang membutuhkan tampilan rapi dan konsisten pada banyak bidang. Warnanya stabil dan tidak mudah pudar, menjadikannya pilihan andal untuk kebutuhan interior jangka panjang.',
      en: 'The HPL Lamitak Solids collection offers clean, versatile plain colours, ideal for minimalist interiors or as a complement to other patterns in the same room. It includes Solid Core, with consistent colour through the material, and Protak / Protak Core, designed specifically for postforming applications on curved countertop edges. This collection is widely used for drawers, partitions, cabinets, and interior elements that need a tidy, consistent look across many surfaces. Its colour is stable and fade-resistant, making it a reliable choice for long-term interior needs.'
    }
  },

  // ── Contact page ─────────────────────────────────────────────
  contact: {
    headOffice:   { id: 'Kantor Utama', en: 'Head Office' },
    hours:        { id: 'Jam Operasional', en: 'Opening Hours' },
    hoursValue:   { id: 'Senin – Jumat\n09.00 – 17.00 WIB', en: 'Monday – Friday\n09.00 – 17.00 WIB' },
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
    otorisasiLink:{ id: 'Dealer Resmi', en: 'Authorized Dealer' },
    appTagline:   {
      id: 'Unduh Aplikasi Varindo',
      en: 'Download the Varindo App'
    },
    appLink:      { id: 'Unduh di Google Play', en: 'Get it on Google Play' },
    copyright:    { id: '© {year} CV. Varindo Forma Hutama. Hak cipta dilindungi.', en: '© {year} CV. Varindo Forma Hutama. All rights reserved.' }
  },

  // ── Request forms ─────────────────────────────────────────────
  forms: {
    nameLabel:        { id: 'Nama / Perusahaan', en: 'Name or Company Name' },
    namePlaceholder:  { id: 'cth. PT. Maju Jaya Interior', en: 'e.g. PT. Maju Jaya Interior' },
    phoneLabel:       { id: 'Nomor Telepon', en: 'Phone Number' },
    phonePlaceholder: { id: 'cth. 0812 3456 7890', en: 'e.g. 0812 3456 7890' },
    networkError:     {
      id: 'Koneksi bermasalah. Periksa jaringan Anda dan coba lagi.',
      en: 'Network error. Please check your connection and try again.'
    },
    serverError:      {
      id: 'Terjadi kesalahan. Silakan coba lagi.',
      en: 'Something went wrong. Please try again.'
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
  },

  // ── 404 ───────────────────────────────────────────────────────
  notFound: {
    code:  { id: 'Error 404', en: 'Error 404' },
    title: { id: 'Halaman tidak ditemukan', en: 'Page not found' },
    body: {
      id: 'Tautan ini sudah tidak berlaku, atau kode produknya keliru. Coba cari lagi dari katalog.',
      en: 'This link is no longer valid, or the product code is wrong. Try searching the catalogue again.'
    },
    searchLabel: { id: 'Cari produk', en: 'Search products' },
    browseCta:   { id: 'Lihat Katalog', en: 'Browse Catalogue' },
    homeCta:     { id: 'Kembali ke Beranda', en: 'Back to Home' },
    suggestionsTitle: { id: 'Mungkin yang Anda cari', en: 'Perhaps you were looking for' }
  },

} as const;

export type TranslationKey = keyof typeof translations;

/** A translated list, for the entries whose value is an array of lines. */
export function tList(section: keyof typeof translations, key: string, lang: Lang): string[] {
  const sectionObj = translations[section] as Record<string, { id: string; en: string } | { id: string[]; en: string[] }>;
  const value = sectionObj?.[key]?.[lang];
  return Array.isArray(value) ? value : [];
}

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
