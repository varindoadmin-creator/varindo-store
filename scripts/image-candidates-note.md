# Lamitak Image Matching Logic

V44 image matching uses the numeric design code as the main image family key and prioritizes DXP ####G before DXP ####XM.

Example:
- DXP 1358G
- DXP 1358XM
- ATP 11358M
- ATP 1358M
- CATP 1358M

These all share the base number `1358`, so the website tries shared 1358 Cloudinary image filenames across common prefixes and suffixes.

Since the available image for this family is often saved as `lamitak-dxp-1358g.jpg`, that pattern is now tried before `lamitak-dxp-1358xm.jpg`.
