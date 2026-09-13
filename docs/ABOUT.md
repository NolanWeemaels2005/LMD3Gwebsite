# Over ons

Route: /over-ons (including the existing GitHub Pages entry point).
Shared Header, book navigation, Hero, BookingButton, BookingCTASection and Footer; the fan component was not changed.

All page-specific photos originate from `images aboutpage.zip`:

| Role | ZIP source | WebP prefix |
| --- | --- | --- |
| Hero | about_hero.JPG | about-hero |
| Story | idea.jpg | about-story |
| Living room before | woonkamer_before.jpg | about-living-before |
| Living room after | woonkamer_after.jpg | about-living-after |
| Terrace before | terras_before.jpg | about-terrace-before |
| Terrace after | terras_after.jpg | about-terrace-after |
| Three sons | who_are_we.HEIC | about-family |

Optimized assets in src/assets/images. EXIF orientation applied, WebP quality 83 without upscaling. Hero widths 960/1920, other photos 480/960/1440. Below-fold photos lazy load; hero loads eagerly.

BeforeAfterSlider clips the before photograph over the after photograph at an initial 50%. Pointer capture supports mouse and touch, while touch-action pan-y allows normal vertical page scrolling. ArrowLeft/ArrowRight adjust by 2%, Home/End select the extremes; translated slider labels and values are announced to assistive technology.

Static copy and image descriptions use existing NL/FR/EN translation files. Story CTA links to /activiteiten; name CTA links to /reserveren. All paths use the shared GitHub Pages base URL helper.

QA: tests/about.spec.ts covers six requested viewports, loaded ZIP assets, viewport hero height, overflow, both sliders, mouse/keyboard, actual touch input, language controls, link targets, active menu and fixed fan layers.
