# La Maison Des Trois Garçons

Responsive homepage built with React, TypeScript and Vite from the supplied
homepage artboard. Includes local Poppins, optimized WebP photography, and complete
Dutch, French and English translations.

## Development

```sh
npm install
npm run dev
```

Vite prints the available local preview URL. `npm run build` checks TypeScript and
creates the production build in `dist`. `npm run preview` serves that build.

## Important files

- `src/App.tsx` — homepage section composition.
- `src/components/` — header, hero, gallery, location, reviews, booking fan and footer.
- `src/styles/global.css` — reference proportions, exact brand colours, responsive layouts.
- `src/i18n/index.ts` and `src/i18n/locales/` — detection, saved manual choice, NL/FR/EN copy.
- `src/data/images.ts` and `src/data/reviews.ts` — image order and typed review data.
- `src/assets/` — responsive WebP photographs and original supplied SVG logo/map/Reli and canonical platform icons.
- `tests/homepage.spec.ts` — viewport, animation, language and touch checks.
- `docs/ASSETS.md` — complete photo mapping and limitations of supplied artwork.

## Behaviours

Desktop gallery pinning uses GSAP ScrollTrigger with a short scrub, reversible
vertical-to-horizontal progress, and clean unmount/media-query cleanup. It starts
at 1100px on fine-pointer, hover-capable devices. The requested 1024px tablet case,
all touch devices and reduced-motion users get native horizontal scrolling,
scroll snapping and previous/next buttons. Desktop keyboard users can use the
arrow keys, Home and End while the gallery is focused.

Reviews loop in two identical groups. Hovering any card or focusing a review
pauses the track at its current position. An explicit pause button supports touch
and users who want more reading time. Reduced motion replaces the loop with a
scrollable single group. Review bodies and dates are omitted.

The seven-card fan continuously spreads with scroll progress. Five cards remain
on mobile. On hover-capable fine-pointer desktops from 1100px, the active geometry
is 15% wider and taller, anchored at the bottom. `src/utils/fanGeometry.ts` resolves
the rotated footprint and opens two rigid groups around it. Every card on a side
gets the same X offset, preserving that group's overlap and inactive dimensions.
Controlled edge overlap accommodates the triangular corners of rotated cards.
The complete silhouette is centred with a shared translation. The outer CSS
transform combines scroll spread and the GSAP hover displacement channel; the
inner wrapper owns active sizing. Transitions take 400ms with power3.out easing.
Direct card transitions and gaps retain selection; leaving the entire fan resets
it. Touch/tablet and reduced-motion layouts do not apply hover enlargement.

Language priority is `siteLanguage` manual preference, then the first supported
browser language, then Dutch. Regional language tags are normalized. Browser
detection does not create a saved preference. Selection updates `<html lang>` and
the description metadata. Storage errors do not block the page.

Homepage section links work. Future booking, legal, social and other-page links
are intentionally inert placeholders; no destination pages are fabricated.

## Browser QA

```sh
npm run test:qa
```

Uses installed Google Chrome through Playwright in a separate headless profile.
Tests all requested sizes: 1440×900, 1920×1080, 1024×1366, 768×1024, 390×844 and
375×812. Screenshots are written to `test-results/`. The tests also cover touch
swiping, seamless review-loop boundaries, exact pause/resume, language persistence,
Dutch fallback, reduced motion, loaded images and horizontal overflow.

The sole supplied layout is desktop; tablet/mobile layouts are inferred from the
written requirements. The supplied logo, France map and Reli SVGs are used unchanged. Screenshot
extracts have been removed. Per the confirmed design preference, the reference's pale brand-on-brand text is preserved; it does
not meet WCAG AA contrast in every combination. Replace the pale foregrounds with
`--color-ink` if AA contrast takes priority over matching the artboard.

Fan layering is permanently fixed at `[1, 3, 5, 7, 6, 4, 2]` from left to right.
These values are applied to sibling outer positioning wrappers. Neither hover
nor animation callbacks change them, including on the selected card.

## Book navigation

`NavigationMenu.tsx` coordinates a reversible GSAP book-page timeline. The existing
header controls remain the only controls above the dimming layer. Root content is
inert while open; body locking preserves its offset and scrollbar space. Focus is
trapped across the shared controls and panel, returning to the hamburger on close.
`hooks/useRoute.ts` supplies a small History API route adapter; route transitions
occur only after reverse completion. Future destination pages show a translated
in-preparation message. Existing homepage content is unchanged.
