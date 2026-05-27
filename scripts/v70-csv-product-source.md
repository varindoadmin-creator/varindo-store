# V70 CSV Product Source

Changes:
- Removed Zoho Books as product source for website catalog.
- Website product data now comes from `src/data/lamitak-products-from-csv.ts`.
- Static CSV is included at `public/data/lamitak-products.csv`.
- Product filters/search/product page now use CSV fields:
  - Code
  - Design Name
  - Item Name
  - CF.Size
  - CF.Sub Collection
  - CF.Collection
  - CF.Thickness
  - New Arrivals
  - Best Sellers
  - Promo Items
- Product images are linked to Cloudinary via existing product code/number matching logic in `src/lib/cloudinary.ts`.