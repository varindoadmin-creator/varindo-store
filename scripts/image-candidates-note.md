# Lamitak Image Candidate Logic

Product images are generated from the product code.

The website first tries the exact code image, for example:

`SCA 1104D` → `lamitak-sca-1104d.jpg`

If the exact image is missing, it then tries shared 4-digit design-family variants.

Example family:

- `SCA 1104D`
- `SCA 11104D`
- `TSA 1104`
- `TSW 11104`

These share the base design number `1104`, so the website can try fallback image URLs from the same family before showing the fallback placeholder.
