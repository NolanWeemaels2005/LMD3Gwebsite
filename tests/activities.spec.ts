import { test, expect } from '@playwright/test';
import data from '../src/data/activities.json' with { type: 'json' };
for (const [width,height] of [[1440,900],[1920,1080],[1024,1366],[768,1024],[390,844]]) {
 test(`activities ${width}`, async ({page}) => {
  await page.setViewportSize({width,height}); const errors: string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/activiteiten'); await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('.hero')).toHaveCSS('height',`${height}px`);
  await expect(page.locator('.favorites-section .activity-card')).toHaveCount(3);
  expect(await page.locator('.favorites-section .activity-card').evaluateAll(els=>els.map(e=>e.getAttribute('data-activity-id')))).toEqual(['cotignac','bistrot-le-ptit-bouchon','domaine-fontainebleau-en-provence']);
  await page.screenshot({path:`test-results/activities-hero-${width}.png`});
  await page.locator('.favorites-section').scrollIntoViewIfNeeded(); await page.waitForTimeout(1700);
  await page.screenshot({path:`test-results/activities-cards-${width}.png`});
  await expect(page.locator('.all-activities .activity-card')).toHaveCount(width<768?6:9);
  await page.getByRole('button',{name:'Meer resultaten',exact:true}).click();await expect(page.locator('.all-activities .activity-card')).toHaveCount(width<768?12:18);
  await page.getByRole('button',{name:'Natuur',exact:true}).click();await page.getByRole('combobox').selectOption('Carcès');
  await expect(page.locator('.all-activities .activity-card')).toHaveCount(data.items.filter(a=>a.category==='Natuur'&&a.location==='Carcès').length);
  await page.getByRole('combobox').selectOption('Cotignac');await expect(page.locator('.activity-empty')).toBeVisible();await page.getByRole('button',{name:'Toon alles',exact:true}).click();
  const route=page.locator('.favorites-section .activity-route').first(); expect(await route.getAttribute('href')).toBe('https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(data.items.find(a=>a.id==='cotignac')!.address));
  await page.locator('.all-activities').scrollIntoViewIfNeeded();await page.screenshot({path:`test-results/activities-grid-${width}.png`});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.locator('.booking-cta').count();
  await page.getByRole('button',{name:'Menu openen',exact:true}).click();await expect(page.locator('#main-menu a[aria-current="page"]')).toHaveText('Activiteiten');await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);expect(errors).toEqual([]);
  await page.goto('/');await expect(page.locator('.hero')).toHaveCSS('height',`${height}px`);
 });
}
test('shared fan, language and close-before-navigation', async ({page}) => {
 await page.setViewportSize({width:1440,height:900});await page.goto('/activiteiten');
 await page.locator('#booking').scrollIntoViewIfNeeded();await page.waitForTimeout(600);
 const layers=await page.locator('.fan-card').evaluateAll(els=>els.map(e=>getComputedStyle(e).zIndex));
 await page.locator('.fan-card--3').hover();await page.waitForTimeout(450);expect(await page.locator('.fan-card').evaluateAll(els=>els.map(e=>getComputedStyle(e).zIndex))).toEqual(layers);
 await page.screenshot({path:'test-results/activities-fan.png'});
 await page.locator('.language-switcher button[lang="fr"]').click();await expect(page.locator('html')).toHaveAttribute('lang','fr');await expect(page.locator('#favorites-title')).toHaveText('Nos coups de cœur');
 await page.locator('.language-switcher button[lang="en"]').click();await expect(page.locator('#favorites-title')).toHaveText('Our favourites');expect(await page.evaluate(()=>localStorage.getItem('siteLanguage'))).toBe('en');
 await page.screenshot({path:'test-results/activities-footer.png'});
 await page.locator('.menu-toggle').click();await page.waitForTimeout(900);await page.locator('#main-menu a[href="/"]').click();expect(new URL(page.url()).pathname).toBe('/activiteiten');await expect(page).toHaveURL(/\/$/);
});
