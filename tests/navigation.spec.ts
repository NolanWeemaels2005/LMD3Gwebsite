import {test,expect} from '@playwright/test';
for(const [width,height] of [[1440,900],[1920,1080],[1024,1366],[768,1024],[390,844],[375,812]]) test(`book navigation ${width}`,async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width,height});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
 const toggle=page.locator('.menu-toggle');await toggle.click();
 await expect(page.locator('.navigation-scene')).toHaveAttribute('data-state','opening');
 await page.waitForTimeout(220);await page.screenshot({path:`test-results/menu-opening-${width}.png`});
 await expect(page.locator('.navigation-scene')).toHaveAttribute('data-state','open');
 await page.screenshot({path:`test-results/menu-open-${width}.png`});
 expect(await page.locator('#root').evaluate(el=>(el as HTMLElement).inert)).toBe(true);
 await expect(page.locator('.menu-toggle')).toBeFocused();
 await page.locator('.navigation-languages button').last().focus();await page.keyboard.press('Tab');await expect(page.locator('.shared-navigation-controls a')).toBeFocused();
 await page.locator('.navigation-languages button[lang="fr"]').click();await expect(page.locator('html')).toHaveAttribute('lang','fr');await expect(page.locator('.navigation-scene')).toHaveAttribute('data-state','open');
 await page.locator('.menu-toggle').click();await expect(page.locator('.navigation-scene')).toHaveAttribute('data-state','closing');await expect(page.locator('.navigation-scene')).toHaveCount(0);await expect(toggle).toBeFocused();
 await toggle.click();await expect(page.locator('.navigation-scene')).toHaveAttribute('data-state','open');
 await page.locator('#main-menu a[href="/activiteiten"]').click();expect(new URL(page.url()).pathname).toBe('/');await expect(page.locator('.navigation-scene')).toHaveCount(0);await expect(page).toHaveURL(/\/activiteiten$/);
 await toggle.click();await expect(page.locator('.navigation-scene')).toHaveAttribute('data-state','open');await expect(page.locator('#main-menu a[href="/activiteiten"]')).toHaveAttribute('aria-current','page');await page.keyboard.press('Escape');await expect(page.locator('.navigation-scene')).toHaveCount(0);
 await page.emulateMedia({reducedMotion:'reduce'});await toggle.click();await expect(page.locator('.navigation-scene')).toHaveAttribute('data-state','open');await page.keyboard.press('Escape');await expect(page.locator('.navigation-scene')).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
});
test('scroll lock restores position and close can interrupt opening',async({page})=>{
 await page.goto('/');await page.waitForTimeout(500);await page.evaluate(()=>scrollTo(0,450));
 // Open without scrolling the offscreen header into view.
 await page.locator('.menu-toggle').evaluate((el:HTMLButtonElement)=>el.click());await expect(page.locator('.navigation-scene')).toHaveAttribute('data-state','open');
 await page.mouse.wheel(0,500);expect(await page.locator('body').evaluate(el=>el.style.top)).toBe('-450px');
 await page.keyboard.press('Escape');await expect(page.locator('.navigation-scene')).toHaveCount(0);expect(await page.evaluate(()=>scrollY)).toBe(450);
 await page.locator('.menu-toggle').evaluate((el:HTMLButtonElement)=>el.click());await page.keyboard.press('Escape');await expect(page.locator('.navigation-scene')).toHaveCount(0);expect(await page.evaluate(()=>scrollY)).toBe(450);
});
test('one control pair, backdrop close and reservation wait for the book',async({page})=>{
 await page.goto('/');
 const toggle=page.locator('.menu-toggle');await toggle.click();await expect(page.locator('.navigation-scene')).toHaveAttribute('data-state','open');
 await expect(toggle).toHaveCount(1);await expect(page.locator('.navigation-page .navigation-top')).toHaveCount(0);
 await page.locator('.navigation-shade').click({position:{x:20,y:200}});await expect(page.locator('.navigation-scene')).toHaveCount(0);
 await toggle.click();await expect(page.locator('.navigation-scene')).toHaveAttribute('data-state','open');
 await page.locator('.shared-navigation-controls a').click();expect(new URL(page.url()).pathname).toBe('/');
 await expect(page.locator('.navigation-scene')).toHaveCount(0);await expect(page).toHaveURL(/\/reserveren$/);
 await toggle.click();await expect(page.locator('.navigation-scene')).toHaveAttribute('data-state','open');
 await page.locator('#main-menu a[href="/reserveren"]').click();await expect(page.locator('.navigation-scene')).toHaveCount(0);await expect(page).toHaveURL(/\/reserveren$/);
});
