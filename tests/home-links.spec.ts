import {test,expect} from '@playwright/test';
const base='http://127.0.0.1:4181/LMD3Gwebsite/';
for(const width of [1440,390])test(`Home links and Vigna ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto(base);const about=page.locator('#home .hero-buttons a').nth(1);await expect(about).toHaveText('Over ons');await about.click();await page.waitForURL('**/over-ons');await expect(page.locator('.about-hero')).toBeVisible();
 await page.goto(base);await page.locator('#location .button').click();await page.waitForURL('**/activiteiten');await expect(page.locator('.activities-hero')).toBeVisible();
 const card=page.locator('.all-activities [data-activity-id="vigna"]');await expect(card.locator('.activity-address')).toContainText('4005 Chemin de la Martinette');await expect(card.locator('.activity-route')).toHaveAttribute('href','https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent('4005 Chemin de la Martinette, 83510 Lorgues, France'));await expect(card.locator('.activity-route')).toHaveAttribute('target','_blank');
 await expect(page.locator('.footer a[href="https://www.reli.be/nl/provence/var/le-reflet-du-lac"]')).toHaveCount(2);
 for(const lang of ['fr','en']){await page.locator(`.footer button[lang="${lang}"]`).click();await expect(card.locator('.activity-route')).toHaveText(lang==='fr'?'Itinéraire':'Directions');}
 for (const lang of ['nl','fr','en']) {
  await page.locator(`.footer button[lang="${lang}"]`).click();
  for (const platform of ['Instagram','Facebook']) {
   await page.locator('.footer-links').getByRole('button',{name:platform}).click();
   await expect(page.getByRole('status')).toContainText(platform);
   await expect(page.getByRole('status')).toContainText(lang==='nl'?'komt eraan':lang==='fr'?'bientôt':'coming soon');
   await page.keyboard.press('Escape');await expect(page.locator('.social-notice')).toHaveCount(0);
   await page.locator('.social-links').getByRole('button',{name:platform}).click();
   await expect(page.getByRole('status')).toContainText(platform);
   await page.locator('.social-notice button').click();await expect(page.locator('.social-notice')).toHaveCount(0);
  }
 }
 await page.locator('.social-links').getByRole('button',{name:'Instagram'}).click();
 await page.screenshot({path:`test-results/social-notice-${width}.png`});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.goto(base);await expect(page.locator('#home .hero-buttons a').nth(1)).toHaveText('About us');
});
