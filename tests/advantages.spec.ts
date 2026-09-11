import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
for (const [width,height] of [[1440,900],[1920,1080],[1024,1366],[768,1024],[390,844],[375,812]]) test(`advantages ${width}`,async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width,height});await page.goto('/pluspunten');await page.evaluate(()=>document.fonts.ready);
 await expect(page.locator('.hero')).toHaveCSS('height',`${height}px`);await expect(page.locator('.hero-image')).toHaveJSProperty('complete',true);
 await page.screenshot({path:`test-results/advantages-hero-${width}.png`});
 await expect(page.locator('.advantage-card')).toHaveCount(10);expect(await page.locator('.advantages-grid').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length)).toBe(width>=1100?5:width>850?3:width>=768?2:1);
 await page.locator('.advantages-grid').screenshot({path:`test-results/advantages-cards-${width}.png`});
 await expect(page.locator('.facility-photo')).toHaveCount(5);await page.locator('.facilities-gallery').scrollIntoViewIfNeeded();await page.waitForTimeout(300);await page.locator('.facilities-gallery').screenshot({path:`test-results/advantages-gallery-${width}.png`});
 for(const image of await page.locator('.advantage-icon img, .facility-photo img').all()) expect(await image.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
 await page.locator('.brochure-section').screenshot({path:`test-results/advantages-brochure-${width}.png`});
 const downloadEvent=page.waitForEvent('download');await page.locator('.brochure-section a').click();const download=await downloadEvent;expect(download.suggestedFilename()).toBe('la-maison-des-trois-garcons-brochure.pdf');const bytes=readFileSync((await download.path())!);expect(bytes.equals(readFileSync('public/downloads/la-maison-des-trois-garcons-brochure.pdf'))).toBe(true);
 await page.locator('#booking').scrollIntoViewIfNeeded();await page.waitForTimeout(600);await page.screenshot({path:`test-results/advantages-fan-${width}.png`});expect(await page.locator('.fan-card').evaluateAll(es=>es.map(e=>getComputedStyle(e).zIndex))).toEqual(['1','3','5','7','6','4','2']);
 await page.locator('.menu-toggle').click();await expect(page.locator('#main-menu a[aria-current="page"]')).toHaveText('Pluspunten');await page.keyboard.press('Escape');await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded','false');
 await page.locator('.language-switcher button[lang="fr"]').click();await expect(page.locator('#advantages-title')).toContainText('Les atouts');await page.locator('.language-switcher button[lang="en"]').click();await expect(page.locator('#advantages-title')).toContainText('highlights');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
});
test('advantages shared fan opens early and keeps hover layers',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('/pluspunten');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(300);
 const range=await page.locator('.fan').evaluate(e=>{const r=e.getBoundingClientRect(),top=r.top+scrollY;return {start:top-innerHeight*.9,end:top+r.height-innerHeight*.2};});
 for(const p of [.15,.4,.6]) {await page.evaluate(({start,end,p})=>scrollTo({top:start+(end-start)*p,behavior:'instant'}),{...range,p});await page.waitForTimeout(650);expect(await page.locator('.fan-card').first().evaluate(e=>Number(getComputedStyle(e).getPropertyValue('--spread')))).toBeCloseTo(Math.min(1,p/.4),1);}
 await page.locator('.fan-card--3').hover();await page.waitForTimeout(450);await expect(page.locator('.fan')).toHaveAttribute('data-active-index','3');expect(await page.locator('.fan-card').evaluateAll(es=>es.map(e=>getComputedStyle(e).zIndex))).toEqual(['1','3','5','7','6','4','2']);await page.mouse.move(0,0);await expect(page.locator('.fan')).not.toHaveAttribute('data-active-index');
});
