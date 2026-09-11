import { test, expect } from '@playwright/test';
for (const [width,height] of [[390,844],[375,812],[768,1024],[1440,900],[1920,1080]]) {
 test(`hero and filters ${width}`, async ({page}) => {
  const errors: string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width,height});await page.goto('/activiteiten');await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('.hero')).toHaveCSS('height',`${height}px`);await expect(page.locator('.hero-image')).toHaveJSProperty('complete',true);
  expect(await page.locator('.hero-image').evaluate((e: HTMLImageElement)=>e.currentSrc)).toMatch(/activiteiten-hero-\d+\.webp/);
  await page.screenshot({path:`test-results/fixes-hero-${width}.png`});
  const filters=page.locator('.activity-filters');await filters.scrollIntoViewIfNeeded();
  await expect(page.locator('.category-filters button')).toHaveCount(6);
  const boxes=await page.locator('.category-filters button').evaluateAll(els=>els.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,right:r.right,y:r.y,bottom:r.bottom};}));
  expect(boxes.every(b=>b.x>=0&&b.right<=width)).toBe(true);
  if(width<768) {expect(boxes.every((b,i)=>i===0||b.y>=boxes[i-1].bottom)).toBe(true);expect(await page.locator('.category-filters').evaluate(e=>e.scrollWidth===e.clientWidth)).toBe(true);expect((await page.locator('select').boundingBox())!.y).toBeGreaterThan(boxes[5].bottom);}
  await expect(page.locator('select')).toHaveCSS('padding-right','52px');await expect(page.locator('select')).toHaveCSS('appearance','none');
  await filters.screenshot({path:`test-results/fixes-filters-${width}.png`});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
 });
}
for(const route of ['/','/activiteiten']) {
 test(`early fan and unchanged hover ${route}`,async ({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto(route);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(600);
  const geometry=await page.locator('.fan').evaluate(e=>{const r=e.getBoundingClientRect();const top=r.top+scrollY;return {start:top-innerHeight*.9,end:top+r.height-innerHeight*.2};});
  const cards=page.locator('.fan-card');
  for(const progress of [0,.15,.4,.7,1]) {
   await page.evaluate(({start,end,p})=>scrollTo({top:start+(end-start)*p,behavior:'instant'}),{...geometry,p:progress});await page.waitForTimeout(700);
   const spread=await cards.first().evaluate(e=>Number(getComputedStyle(e).getPropertyValue('--spread')));
   if(progress>=.4) expect(spread).toBeCloseTo(1,2);else expect(spread).toBeCloseTo(progress/.4,1);
   if(progress===.4) await page.screenshot({path:`test-results/fixes-fan-early-${route==='/'?'home':'activities'}.png`});
  }
  const layers=await cards.evaluateAll(els=>els.map(e=>getComputedStyle(e).zIndex));
  await page.locator('.fan-card--3').hover();await page.waitForTimeout(450);await expect(page.locator('.fan')).toHaveAttribute('data-active-index','3');
  expect(await cards.evaluateAll(els=>els.map(e=>getComputedStyle(e).zIndex))).toEqual(layers);
  expect(await page.locator('.fan-card--2').evaluate(e=>Math.abs(parseFloat(e.style.getPropertyValue('--hover-x'))))).toBeGreaterThan(1);
  await page.mouse.move(5,5);await page.waitForTimeout(450);await expect(page.locator('.fan')).not.toHaveAttribute('data-active-index');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
}
