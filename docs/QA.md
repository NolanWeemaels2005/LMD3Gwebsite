# Homepage verification

Verified in headless Google Chrome on 10 September 2026.

- Production build: `npm run build` passes, including strict TypeScript checks.
- Complete Playwright suite: 10 original tests passed before the asset/hover update (see the update results below).
- Final desktop spacing refinement: both desktop viewport tests and reduced-motion
  checks passed again (3 targeted tests).
- All eight supplied screenshots and all 22 supplied photographs were inspected.
- Desktop screenshots were compared against the artboard after removing its editor
  frame conceptually. Hero crop, fan width/card heights, gallery clipping, review
  spacing and footer column alignment were refined through screenshot review.

| Viewport | Layout / overflow | Interactions |
| --- | --- | --- |
| 1440 × 900 | Pass | Desktop pin, reverse, release, review hover/focus, fan, menu, language |
| 1920 × 1080 | Pass | Desktop pin, reverse, release, review hover/focus, fan, menu, language |
| 1024 × 1366 | Pass | Unpinned gallery, arrows/end states, reviews, fan, menu, language |
| 768 × 1024 | Pass | Unpinned gallery, arrows/end states, reviews, fan, menu, language |
| 390 × 844 | Pass | Unpinned gallery, arrows/end states, reviews, fan, menu, language |
| 375 × 812 | Pass | Unpinned gallery, arrows/end states, reviews, fan, menu, language |

Additional checks passed: dispatched touch-event swipe in a mobile/touch browser
context; seamless review-loop boundary; review pause remains stationary and resumes;
regional browser-language detection; unsupported language defaults to Dutch; manual
selection persists after reload; browser detection does not persist automatically;
reduced motion disables pin/marquee and displays the final fan; all image elements
load; no page console errors/warnings; no accidental page horizontal overflow.

Screenshots: `test-results/hero-*.png`, `gallery-*.png`, `footer-*.png`, and
`full-desktop.png`, `full-1024.png`, `full-390.png`. Full-page screenshots use reduced
motion so the gallery's deliberate scroll runway does not obscure section proportions.
The per-viewport interaction tests use normal motion. Screenshots are ignored by Git.

Limits: only a desktop design was supplied, so smaller layouts follow the written
brief. Some exact reference photographs were absent;
see ASSETS.md. Per the user's confirmed preference, pale text colours match the
reference, although those colour combinations do not all meet WCAG AA contrast.
Touch and viewport tests are browser emulation, not physical-device testing.

## Original-SVG and fan-hover update

- All 22 ZIP photographs were re-inspected; all 43 deployed WebP variants were
  verified byte-for-byte against conversions of the supplied originals.
- The three supplied SVGs match their original SHA-256 hashes; no changes to their
  paths, viewBoxes or colours. The two former screenshot-extracted WebPs are removed.
- The original 10 homepage checks passed after the interaction/asset update.
- Six additional asset/hover checks passed: every one of the seven cards at 1440px
  and 1920px, enlargement, immediate dominant stacking, signed neighbour movement,
  unchanged base rotation, complete restoration, reverse-scroll reset, source
  provenance, footer order, and touch inactivity at 1024px, 768px and 390px.
- Normal, centre-hover and side-hover desktop screenshots were visually inspected;
  the enlarged card is not clipped, neighbours visibly move aside, and no page
  horizontal overflow is introduced. SVG footer screenshot was also inspected.
- Hover is gated to at least 1100px, hover-capable fine pointers, non-touch pointer
  events and no reduced-motion preference. It only activates after 85% fan spread.

Screenshots: `test-results/fan-normal-1440.png`, `fan-hover-3-1440.png`,
`fan-hover-1-1440.png`, corresponding 1920px captures, and `footer-svg.png`.

## Seven-reference dynamic reflow refinement

All seven additional desktop screenshots (14.14.40 through 14.15.10) were studied.
The enlarged state now uses 1.22× scale, proportional lift, width-relative signed
displacement with distance falloff, and a shared centring translation. Separate
scroll, displacement and inner scale transforms preserve the underlying fan.

Seven targeted checks passed, including every card at 1440px and 1920px. All seven
1440px and 1920px active captures were visually inspected together against the references:
the selected image dominates, neighbouring groups move apart, rotations remain,
and the composition retains its curved shape without vertical clipping.
Direct pointer transitions across all seven cards and empty fan space never reset
the selection. Expanded silhouettes remain centred within 2px. Leaving the fan
restores its layout; switching to tablet removes the interaction. Touch checks
at 1024, 768 and 390px pass.

Captures: `test-results/fan-hover-0-1440.png` through `fan-hover-6-1440.png`,
plus the corresponding seven 1920px captures.

Final regression: all 10 homepage checks passed again after this refinement,
for 17 passing checks across the two suites. The production build and strict
TypeScript checks passed after the implementation changes.

## Geometry-based group opening (supersedes the distance-falloff refinement)

The seven 14.34 screenshots were treated as rejected states and compared with
the seven earlier Lando interaction references. The distance-falloff solver was
removed. The replacement resolves active width/height and rotated bounds, moves
each side as a rigid group and preserves bottom anchors. Active size is 1.15×.
The first capture pass exposed excessive empty corners on outer cards; a second
pass refined the controlled overlap based on the active card's position.
Tests now assert unchanged relative X spacing inside both inactive groups.

Final result: all seven active states captured and visually reviewed at both
1440px and 1920px after the second pass. Both groups retain their internal overlap;
active cards grow upward without moving their bottom anchors. All 17 browser
checks and the production TypeScript/build check pass. Responsive checks include
all six requested viewport sizes. Touch behaviour remains browser-emulated.

## Permanently fixed layers and numeric gallery allowlist

The latest instruction supersedes all earlier active-card foreground behaviour.
Outer sibling wrappers now have static layers [1,3,5,7,6,4,2]. All GSAP z-index
writes and restoration callbacks were removed. Frame-by-frame checks across all
seven hovered cards and pointer leave confirm that every layer stays unchanged.
No extra per-card parent stacking context was introduced.

The ZIP contains all fourteen Caroussel0–13 originals (extensions listed in
ASSETS.md). Existing 480/960 WebP variants were confirmed present. Gallery data is
an explicit numeric allowlist, separate from the unchanged fan photo selection.
All 18 browser checks and the TypeScript production build pass, including exact
fourteen-image order, desktop pinning, tablet/mobile arrows and touch scrolling.

Gallery endpoint now refreshes when the rail width changes, including removal
of a card without reload. Endpoint alignment and the removal regression pass;
the final gallery screenshot was inspected. BottomP6 replaces the fan living room
with 480/960 WebP variants. Build and all 11 targeted/responsive checks pass.

## Book navigation and shared header controls

New menu reference inspected, with its editor frame excluded. The panel is 38.5vw
on desktop, 65vw on tablet and 96vw on mobile. Open and partial-animation captures
were inspected at 1440×900, 1920×1080, 1024×1366, 768×1024, 390×844 and 375×812.
The link group was moved upward after the first reference comparison.

Per the subsequent correction, only one reservation/hamburger pair is rendered.
It is portalled above the overlay and changes to the close state in place; no
second top-control row exists in the menu. The focus cycle includes that pair.

GSAP owns the 1800px-perspective/right-centre-hinged page timeline (1200px and a
smaller rotation on mobile). Reverse completion releases the fixed-body scroll
lock, restores focus without scrolling, and only then changes the route. An
immediate-close-at-time-zero regression was found and fixed. Reduced motion uses
a short fade/translation. New routes contain honest temporary text, not completed
pages. Production TypeScript/build passed. Seven responsive/race menu checks pass;
original homepage and language-position checks also passed after integration.
