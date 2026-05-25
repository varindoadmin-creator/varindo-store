# Lamitak Image Matching Logic

V43 image matching uses the numeric design code as the main image family key.

Example:
- DXP 1358XM
- ATP 11358M
- ATP 1358M
- CATP 1358M
- DXP 1358G

These all share the base number `1358`, so the website tries shared 1358 Cloudinary image filenames across common prefixes and suffixes before showing the fallback placeholder.

This is useful when Cloudinary has one master image for a design family but Zoho Books contains many related item-code variants.
