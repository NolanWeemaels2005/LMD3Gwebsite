# SEO and sharing

Production URL is configured in `src/data/site.json`: https://nolanweemaels2005.github.io/LMD3Gwebsite/.
When moving to a custom domain, update this URL and Vite's base together, then rebuild.

`npm run build` builds the app and prerenders each of the five real routes using Playwright. Each HTML response contains the page content, a unique title/description, canonical URL, robots meta tag, Open Graph, Twitter summary_large_image and JSON-LD (WebSite, LodgingBusiness, WebPage and internal-page BreadcrumbList). The normal React application takes over for interactive visitors. No fabricated ratings, prices or contact details are added.

Local build prerequisite: installed Chrome. CI uses Chromium installed by the deployment workflow (`npx playwright install --with-deps chromium`). External activity-image hosts are skipped during HTML generation; the live application still loads their original images normally.

Generated output:
- dist/sitemap.xml: five canonical URLs with trailing slashes, no invented lastmod timestamps.
- dist/robots.txt: permits crawling and references the sitemap.
- dist/404.html: actual missing-page document, noindex, with a homepage link.
- dist/.nojekyll.
- Individual HTML entry points for all routes, readable without JavaScript.

Share image: `public/social/la-maison-des-trois-garcons.jpg`, 1200x630, generated from the existing homepage hero. JPEG used for sharing-service compatibility. Absolute image URLs and dimensions are in every page's source HTML.

Language changes update title, description, Open Graph locale and structured data through existing i18n. The initial static pages are Dutch. French/English currently share the same URLs, so no misleading hreflang links are emitted. Separately indexed language versions would require distinct language URLs and their own static pages.

## After deployment (owner actions)

1. Add the URL-prefix property `https://nolanweemaels2005.github.io/LMD3Gwebsite/` in Google Search Console. Use the real verification HTML file or meta token supplied by Google; no token has been invented or inserted.
2. If using HTML-file verification, put that exact file in public/ and redeploy. If using a meta token, add the exact Google tag to index.html and rebuild so all generated pages retain it.
3. Submit `https://nolanweemaels2005.github.io/LMD3Gwebsite/sitemap.xml` in Search Console.
4. Inspect the live homepage and main routes in URL Inspection and request indexing. Google determines whether/when to index; metadata cannot guarantee indexing or ranking.
5. Sharing platforms may cache older previews. Refresh through their debugging tools if needed after the new deployment.

## GitHub Pages robots limitation

Google only reads robots.txt at the origin root: `https://nolanweemaels2005.github.io/robots.txt`. This project deploys under /LMD3Gwebsite/, so its generated robots.txt is not authoritative on the current hosting URL. To use it, place it in the account-root Pages repository (`NolanWeemaels2005.github.io`) or move to a custom domain hosted at /. Preserve any existing root directives for other projects. A missing root robots.txt does not block indexing; submit the sitemap directly in Search Console. No separate root repository was changed by this task.

Checks: tests/seo.spec.ts validates all routes with JavaScript disabled, static head metadata, canonical URLs, JSON-LD, sitemap, share asset, noindex 404 and live navigation/language updates. Search Console verification, actual Google indexing and external sharing caches require the deployed site and owner's account.
