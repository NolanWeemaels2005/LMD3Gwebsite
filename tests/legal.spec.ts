import {test,expect} from '@playwright/test';
const base='http://127.0.0.1:4181/LMD3Gwebsite/';
for(const width of [1440,768,390])test(`Legal pages and translations ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const kind of ['legal','privacy','cookies']){
  await page.goto(base+kind+'/');await expect(page.locator('.legal-page')).toBeVisible();await expect(page.locator('.legal-contact')).toContainText('SenK');await expect(page.locator('.legal-contact')).toContainText('BE0825893137');await expect(page.locator('.legal-contact a')).toHaveAttribute('href','mailto:decosterkaren@icloud.com');
  for(const lang of ['fr','en','nl']){await page.locator(`.footer button[lang="${lang}"]`).click();await expect(page.locator('html')).toHaveAttribute('lang',lang);expect(await page.locator('.legal-page').innerText()).not.toContain('legalPages.');}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:`test-results/legal-${kind}-${width}.png`});
 }
 await page.goto(base+'reserveren/');await expect(page.locator('.reservation-privacy a')).toHaveAttribute('href','/LMD3Gwebsite/privacy');expect(errors).toEqual([]);
});
test('Privacy retention and external images remain enabled',async({page})=>{
 await page.goto(base+'privacy/');await expect(page.locator('.legal-page')).toContainText('drie maanden na het laatste contact');await expect(page.locator('.legal-page')).toContainText('dynamic-media-cdn.tripadvisor.com');
 await page.goto(base+'activiteiten/');await expect(page.locator('.activity-image img').first()).toHaveAttribute('src',/^https:\/\//);for(const [index,path] of ['legal','cookies','privacy'].entries())await expect(page.locator('.legal-links a').nth(index)).toHaveAttribute('href','/LMD3Gwebsite/'+path);
});
