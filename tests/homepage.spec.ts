import { test, expect } from '@playwright/test';
const sizes = [[1440,900],[1920,1080],[1024,1366],[768,1024],[390,844],[375,812]];
for (const [width,height] of sizes) {
  test(`layout and interactions ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (['error','warning'].includes(message.type())) errors.push(message.text() + ' ' + message.location().url); });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang','nl');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('La Maison Des Trois Garçons');
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `test-results/hero-${width}.png` });
    if (width >= 1100) {
      await expect(page.locator('.gallery')).toHaveClass(/gallery--pinned/);
      const top = await page.locator('.gallery').evaluate(el => el.getBoundingClientRect().top + window.scrollY);
      await page.evaluate(y => window.scrollTo(0,y+600), top);
      await page.waitForTimeout(600);
      const offset = await page.locator('.gallery-track').evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41);
      expect(offset).toBeLessThan(-300);
      expect(Math.abs(await page.locator('.gallery').evaluate(el => el.getBoundingClientRect().top))).toBeLessThan(3);
      await page.screenshot({path:`test-results/gallery-${width}.png`});
      await page.evaluate(y => window.scrollTo(0,y+150), top);
      await page.waitForTimeout(600);
      const reverse = await page.locator('.gallery-track').evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41);
      expect(reverse).toBeGreaterThan(offset);
      // Reach the end, then verify the pinned section releases.
      const distance = await page.locator('.gallery-track').evaluate(el => el.scrollWidth - el.parentElement!.clientWidth);
      await page.evaluate(y => window.scrollTo(0,y), top + distance + 160);
      await page.waitForTimeout(500);
      expect(await page.locator('.gallery').evaluate(el => el.getBoundingClientRect().top)).toBeLessThan(-100);
    } else {
      await expect(page.locator('.gallery')).not.toHaveClass(/gallery--pinned/);
      await page.locator('#gallery').scrollIntoViewIfNeeded();
      await expect(page.getByRole('button',{name:'Vorige afbeelding'})).toBeDisabled();
      await page.getByRole('button',{name:'Volgende afbeelding'}).click();
      await expect.poll(() => page.locator('.gallery-viewport').evaluate(el => el.scrollLeft)).toBeGreaterThan(150);
      await expect(page.getByRole('button',{name:'Vorige afbeelding'})).toBeEnabled();
      await page.locator('.gallery-viewport').evaluate(el => el.scrollLeft = el.scrollWidth);
      await expect(page.getByRole('button',{name:'Volgende afbeelding'})).toBeDisabled();
      await page.screenshot({path:`test-results/gallery-${width}.png`});
    }
    const card = page.locator('.review-card').first();
    await page.locator('.reviews').scrollIntoViewIfNeeded();
    await card.focus();
    await expect.poll(() => page.locator('.reviews-track').evaluate(el => getComputedStyle(el).animationPlayState)).toBe('paused');
    await card.evaluate(el => el.blur());
    await page.mouse.move(0,0);
    await expect.poll(() => page.locator('.reviews-track').evaluate(el => getComputedStyle(el).animationPlayState)).toBe('running');
    if (width >= 1100) {
      const rect = await page.locator('.review-card').nth(2).boundingBox();
      await page.mouse.move(rect!.x + rect!.width / 2, rect!.y + rect!.height / 2);
      await expect.poll(() => page.locator('.reviews-track').evaluate(el => getComputedStyle(el).animationPlayState)).toBe('paused');
      await page.mouse.move(0,0);
    }
    const fanTop = await page.locator('#booking').evaluate(el => el.getBoundingClientRect().top + scrollY);
    await page.evaluate(y => scrollTo(0,y),fanTop-height*.85);
    await page.waitForTimeout(600);
    const start = await page.locator('.fan-card--1').evaluate(el => Number(getComputedStyle(el).getPropertyValue('--spread')));
    await page.locator('.footer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    const end = await page.locator('.fan-card--1').evaluate(el => Number(getComputedStyle(el).getPropertyValue('--spread')));
    expect(end).toBeGreaterThan(start);
    expect(end).toBeGreaterThan(.95);
    await page.screenshot({path:`test-results/footer-${width}.png`});
    await page.getByRole('button',{name:'français',exact:true}).click();
    await expect(page.locator('html')).toHaveAttribute('lang','fr');
    await expect(page.getByRole('heading',{name:'Prêts pour la Provence ?'})).toBeVisible();
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang','fr');
    await page.getByRole('button',{name:'English',exact:true}).click();
    await expect(page.locator('html')).toHaveAttribute('lang','en');
    await page.getByRole('button',{name:'Nederlands',exact:true}).click();
    await page.locator('#home').scrollIntoViewIfNeeded();
    await page.getByRole('button',{name:'Menu openen'}).click();
    await expect(page.locator('#main-menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#main-menu')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}
test('language detection priority, variants and Dutch fallback', async ({ browser }) => {
  for (const [locale, expected] of [['de-DE','nl'],['fr-BE','fr'],['en-GB','en'],['nl-NL','nl']]) {
    const context = await browser.newContext({ locale });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang',expected);
    expect(await page.evaluate(() => localStorage.getItem('siteLanguage'))).toBeNull();
    await context.close();
  }
});
test('reduced motion keeps gallery scrollable and fan fully spread', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.gallery')).not.toHaveClass(/gallery--pinned/);
  expect(await page.locator('.reviews-track').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  expect(await page.locator('.fan-card--1').evaluate(el => Number(getComputedStyle(el).getPropertyValue('--spread')))).toBe(1);
  await page.evaluate(async () => { for (const image of document.images) { image.loading = 'eager'; } await Promise.all([...document.images].map(image => image.decode())); });
  expect(await page.locator('img').evaluateAll(images => images.every(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0))).toBe(true);
  await page.screenshot({path:'test-results/full-desktop.png',fullPage:true});
  for (const width of [1024,390]) { await page.setViewportSize({width,height:900}); await page.screenshot({path:`test-results/full-${width}.png`,fullPage:true}); }
});
test('review loop is seamless and pause resumes from the same position', async ({page}) => {
  await page.goto('/');
  await page.locator('.reviews').scrollIntoViewIfNeeded();
  await page.getByRole('button',{name:'Beoordelingen pauzeren'}).click();
  const before = await page.locator('.reviews-track').evaluate(async el => { const animation = el.getAnimations()[0]; await animation.ready; return animation.currentTime; });
  await page.waitForTimeout(200);
  expect(await page.locator('.reviews-track').evaluate(el => el.getAnimations()[0].currentTime)).toBe(before);
  await page.getByRole('button',{name:'Beoordelingen afspelen'}).click();
  await expect.poll(() => page.locator('.reviews-track').evaluate(el => Number(el.getAnimations()[0].currentTime))).toBeGreaterThan(Number(before));
  const seam = await page.locator('.reviews-track').evaluate(el => {
    const animation = el.getAnimations()[0]; animation.pause();
    animation.currentTime = 74999;
    const outgoing = el.children[1].children[0].getBoundingClientRect().x;
    animation.currentTime = 75001;
    const incoming = el.children[0].children[0].getBoundingClientRect().x;
    return Math.abs(outgoing - incoming);
  });
  expect(seam).toBeLessThan(1);
});
test('touch gallery swipes without pinning', async ({browser}) => {
  const context = await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:'nl-BE'});
  const page = await context.newPage(); await page.goto('/');
  await page.locator('.gallery-viewport').scrollIntoViewIfNeeded();
  await expect(page.locator('.gallery')).not.toHaveClass(/gallery--pinned/);
  const rect = await page.locator('.gallery-viewport').boundingBox();
  const session = await context.newCDPSession(page);
  const y = Math.min(600, rect!.y + rect!.height / 2);
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:330,y}]});
  for(let x=300;x>=70;x-=30) { await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y}]}); }
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect.poll(() => page.locator('.gallery-viewport').evaluate(el => el.scrollLeft)).toBeGreaterThan(100);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});
