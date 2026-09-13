import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
const base='http://127.0.0.1:4181/LMD3Gwebsite/';
const locales=Object.fromEntries(['nl','fr','en'].map(lang=>[lang,JSON.parse(readFileSync(`src/i18n/locales/${lang}.json`,'utf8'))]));
const items=JSON.parse(readFileSync('src/data/activities.json','utf8')).items as {id:string;address:string}[];
test('Every activity and UI key has NL/FR/EN translations',()=>{
 const keys=(value:Record<string,unknown>,prefix=''):string[]=>Object.entries(value).flatMap(([key,v])=>v&&typeof v==='object'?keys(v as Record<string,unknown>,prefix+key+'.'):[prefix+key]);
 for(const lang of ['fr','en'])expect(keys(locales[lang]).sort()).toEqual(keys(locales.nl).sort());
 for(const lang of ['nl','fr','en'])for(const item of items){expect(locales[lang].activities.items[item.id].name.length).toBeGreaterThan(1);expect(locales[lang].activities.items[item.id].description.length).toBeGreaterThan(15);if(lang!=='nl')expect(locales[lang].activities.items[item.id].description).not.toBe(locales.nl.activities.items[item.id].description);}
});
test('All rendered cards translate, preserve addresses and update accessible labels',async({page})=>{
 await page.goto(base+'activiteiten/');
 while(await page.locator('.activity-more').count())await page.locator('.activity-more').click();
 for(const lang of ['fr','en','nl']){
  await page.locator(`.footer button[lang="${lang}"]`).click();
  await expect(page.locator('.all-activities .activity-card')).toHaveCount(items.length);
  for(const item of items){const card=page.locator(`.all-activities [data-activity-id="${item.id}"]`);await expect(card.locator('h3')).toHaveText(locales[lang].activities.items[item.id].name);await expect(card.locator('.activity-description')).toHaveText(locales[lang].activities.items[item.id].description);if(item.address)await expect(card.locator('.activity-route')).toHaveAttribute('href',`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(item.address.trim())}`);}
  const favorite=page.locator('.favorites-section [data-activity-id="cotignac"]');await expect(favorite.locator('.activity-description')).toHaveText(locales[lang].activities.items.cotignac.description);
 }
});
async function checkSpread(page:Page){
 for(const progress of [0,.15,.4,.7]){
  await page.evaluate(p=>{const fan=document.querySelector('.fan')!;const box=fan.getBoundingClientRect();const top=box.top+scrollY;const start=top-innerHeight*.9;const end=top+box.height-innerHeight*.2;scrollTo({top:start+(end-start)*p,behavior:'instant'});},progress);
  await page.waitForTimeout(650);
  const spread=await page.locator('.fan-card').first().evaluate(el=>parseFloat(getComputedStyle(el).getPropertyValue('--spread')));
  expect(spread).toBeCloseTo(Math.min(progress/.4,1),1);
 }
 expect(await page.locator('.fan-card').evaluateAll(cards=>cards.map(c=>getComputedStyle(c).zIndex))).toEqual(['1','3','5','7','6','4','2']);
}
for(const width of [1440,768,390])test(`Fan recalculates after filters, load-more and language ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'activiteiten/');await checkSpread(page);
 await page.getByRole('button',{name:'Natuur',exact:true}).click();await checkSpread(page);
 await page.locator('.activity-filters select').selectOption('Carcès');await checkSpread(page);
 await page.getByRole('button',{name:'Eten & drinken',exact:true}).click();await expect(page.locator('.activity-empty')).toBeVisible();await checkSpread(page);
 await page.locator('.activity-empty button').click();await page.locator('.activity-more').click();await checkSpread(page);
 await page.locator('.footer button[lang="fr"]').click();await checkSpread(page);
 await page.locator('.footer button[lang="en"]').click();await checkSpread(page);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
 await page.screenshot({path:`test-results/activities-translated-fan-${width}.png`});
});
