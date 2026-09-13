# Activity translations and fan layout updates

All 24 activities retain their identity, category, address, image and driving time from activities.json. Display names and descriptions use existing i18n keys `activities.items.<id>.name/description` in NL/FR/EN. Proper names and postal addresses are preserved; generic market and activity names are translated. Image alternatives and route-link accessible names use the localized display name. Dutch copy includes spelling/grammar corrections without changing the facts.

The shared booking fan observes the layout size of its main container and sibling sections using ResizeObserver. Filter changes, load-more, image/font changes and translated wrapping schedule one ScrollTrigger.refresh per animation frame. The scroll timeline is not recreated. Its existing 40% opening interval, hover transforms and fixed z-index data are preserved. The observer disconnects and cancels pending work on unmount.

Tests in activity-translations.spec.ts cover all locale keys, every rendered activity, unchanged Maps destinations and fan progress at 0%, 15%, 40%, 70% after category/location filters, zero results, resetting, load-more and language changes on desktop/tablet/mobile.
