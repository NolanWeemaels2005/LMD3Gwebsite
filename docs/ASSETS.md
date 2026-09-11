# Reference and asset mapping

All 8 reference screenshots and all 22 photographs in `images.zip` were inspected.
The only homepage reference is a 578 × 1576 PNG with a 516px-wide artboard inside
an editor frame. The frame, selection outline and editor handles are not page content.
The five review screenshots are content references. The two Lando screenshots and
https://landonorris.com/ were studied for the fan composition; no source code or
Lando imagery was copied.

| Source | Content / implementation |
| --- | --- |
| Hero-home.JPG | Exact hero: villa, pool and oleander |
| Caroussel0.JPG | Poolside loungers; closest available replacement for reference table close-up |
| Caroussel1.HEIC | Mediterranean garden |
| Caroussel2.HEIC | Garden path |
| Caroussel3.JPG | Pétanque court |
| Caroussel4.JPG | Pool at dusk |
| Caroussel5.JPG | Outdoor dining table / pool |
| Caroussel6.JPG | Reference summer kitchen |
| Caroussel7.HEIC | Walk-in shower / mirror |
| Caroussel8.HEIC | Reference green double bedroom |
| Caroussel9.HEIC | Second double bedroom |
| Caroussel10.HEIC | Bunk bedroom; different viewpoint from reference |
| Caroussel11.HEIC | Twin bedroom |
| Caroussel12.HEIC | Living room; gallery |
| Caroussel13.jpg | Second bathroom |
| BottomP1.HEIC | Lavender field; outer-left fan |
| BottomP2.HEIC | Waterfalls; left fan |
| BottomP3.HEIC | Foliage beside turquoise water; right fan |
| BottomP4.JPG | Stone windmill; inner-right fan |
| BottomP5.JPG | Villa facade; central fan anchor |
| BottomP6.heic | Bowl of figs; inner-left fan card |
| BottomP7.HEIC | Turquoise water and cliffs; outer-right fan |

The attached `LogoLMD3G.svg`, `MapFrance.svg` and `ReliIcon.svg` are used directly,
byte-for-byte unchanged, from `src/assets/logo/`. The supplied map already contains
its marker, so no separate CSS marker is added. The brand SVG is used in both logo
positions and as the favicon. The former `logo.webp` and `france-map.webp`
screenshot extracts were removed entirely from the website source and rebuilt output.

Instagram, Facebook and WhatsApp use the canonical SVG paths from Simple Icons
16.30.0 (https://github.com/simple-icons/simple-icons), obtained from its npm release.
Only the three SVGs are included; no runtime icon dependency was added. Their fill
is the site's beige. The CC0 license is included in `src/assets/icons/LICENSE.md`.
These platform icons are the explicit exception requested to the supplied-assets
rule. No external photography, generated imagery or reference-screen extracts are
used. Footer icon order: Instagram, Facebook, WhatsApp, Reli.

Poppins is self-hosted through @fontsource/poppins, with 400/500/600/700.
`asset-provenance.json` records original file hashes and optimized WebP hashes.
All WebPs were verified byte-for-byte against fresh in-memory conversions of the
original supplied photographs, using the documented optimization settings.

The reference's exact poolside table close-up, chandelier-room image, architectural
arch and hillside-village photograph could not be found in the ZIP. Supplied
photography replaces those slots. No photographs have been invented or sourced
from other websites. All displayed photography is WebP, at 480/960 widths, with
960/1920/2404 variants for the hero. No source photos are upscaled.

Regeneration: install Pillow and pillow-heif in a virtual environment, extract the
ZIP, and run `python scripts/optimize-assets.py /path/to/images`.

Gallery selection is an explicit allowlist of `caroussel0` through `caroussel13`,
in ascending numeric order, using each photo’s 480px/960px WebP variants.
The fan now uses BottomP6 instead of Caroussel12, as requested.

Latest gallery selection: Caroussel7 is omitted at the user’s request. The gallery
contains thirteen photos in numeric order: 0–6, then 8–13.
