# Activities page

`src/data/activities.json` is an unchanged copy of the supplied final dataset (24 records). The typed adapter validates required fields and derives the ordered three favorites and sorted village options. Category and village filters combine; load more reveals 9 records per batch (6 on mobile).

`ActivityCard` uses each original image URL and address. Failed external images show a neutral translated fallback. Cotignac's external image failed during browser QA; no substitute photo or modified URL was introduced. Google Maps directions encode the address. Full descriptions remain readable and accessible.

The existing Header/book menu, BookingCTASection and Footer are reused. Both pages use the same Hero component and viewport-height CSS. The activities hero uses the supplied Activiteiten-hero.HEIC, converted to 960/1920/2560px WebP variants without upscaling. Mobile category filters form one vertical column; the location select uses a custom arrow inset 20px. The shared fan opens in the first 40% of its scroll timeline and holds for the remaining 60%, with hover and fixed layers unchanged.

Visual QA screenshots are in test-results/activities-*.png at 1440×900, 1920×1080, 1024×1366, 768×1024 and 390×844. Automated coverage is in tests/activities.spec.ts: hero height on both routes, favorites, filters, combined village selection, empty/reset state, load more, Maps destinations, overflow, active menu, language persistence, shared fan layers and close-before-navigation.
