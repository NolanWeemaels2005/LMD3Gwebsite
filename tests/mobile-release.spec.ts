import { test, expect, devices } from '@playwright/test';
const base = 'http://127.0.0.1:4181';
for (const device of ['iPhone 13', 'Pixel 7']) test(`mobile scrolling and navigation: ${device}`, async ({ browser }) => {
  const context = await browser.newContext({ ...devices[device], locale: 'nl-BE' });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await context.route('https://**/*', route => route.abort());
  await page.goto(base + '/');
  await page.evaluate(() => document.fonts.ready);
  const introTop = await page.locator('.home-intro').evaluate(el => el.getBoundingClientRect().top + scrollY);
  // Scroll down and back through image-heavy sections, checking for delayed jumps.
  for (const section of ['#gallery', '#location', '.reviews', '#booking', '.footer', '#booking', '#location', '#gallery', '#home']) {
    await page.locator(section).scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => scrollY);
    await page.waitForTimeout(250);
    expect(Math.abs(await page.evaluate(() => scrollY) - before)).toBeLessThan(3);
    expect(await page.locator('.home-intro').evaluate(el => el.getBoundingClientRect().top + scrollY)).toBeCloseTo(introTop, 0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.locator('.reviews').scrollIntoViewIfNeeded();
  const viewport = page.locator('.reviews-viewport');
  await viewport.evaluate(el => el.scrollBy({ left: 280, behavior: 'instant' }));
  await expect.poll(() => viewport.evaluate(el => el.scrollLeft)).toBeGreaterThan(100);
  // The fixed menu must preserve the position when closed.
  const saved = await page.evaluate(() => scrollY);
  await page.locator('.menu-toggle').click();
  await expect(page.locator('.navigation-scene')).toHaveAttribute('data-state', 'open');
  await page.locator('.menu-toggle').click();
  await expect(page.locator('.navigation-scene')).toHaveCount(0);
  expect(await page.evaluate(() => scrollY)).toBeCloseTo(saved, 0);
  await page.locator('.menu-toggle').click();
  await page.locator('#main-menu a[href="/reserveren"]').click();
  await expect(page.locator('.reservation-form')).toBeVisible();
  await page.locator('.footer a[lang="fr"]').click();
  await expect(page).toHaveURL(/\/fr\/reserveren$/);
  await page.reload();
  await expect(page.locator('.reservation-form')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await page.screenshot({ path: `test-results/mobile-release-${device.replaceAll(' ', '-')}.png`, fullPage: true });
  expect(errors).toEqual([]);
  await context.close();
});
test('a failed page download shows a recoverable message instead of a blank screen', async ({ page }) => {
  await page.route('**/assets/ReservationPage-*.js', route => route.abort());
  await page.goto(base + '/');
  await page.locator('#home .hero-buttons a').first().click();
  await expect(page.getByRole('alert')).toContainText('De pagina kon niet worden geladen.');
  await page.unroute('**/assets/ReservationPage-*.js');
  await page.getByRole('button', { name: 'Opnieuw laden' }).click();
  await expect(page.locator('.reservation-form')).toBeVisible();
});
