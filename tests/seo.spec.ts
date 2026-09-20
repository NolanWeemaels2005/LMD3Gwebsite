import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const site=JSON.parse(readFileSync('src/data/site.json','utf8')) as {url:string;image:string;routes:string[];languages:string[]};
const base='http://127.0.0.1:4181/';
for(const language of site.languages)for(const route of site.routes)test(`Static crawlable HTML ${language} ${route}`,async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 const suffix=(language==='nl'?'':language+'/')+(route==='/'?'':route.slice(1)+'/');
 const response=await page.goto(base+suffix);expect(response?.status()).toBe(200);
 await expect(page.locator('main h1')).toBeVisible();expect((await page.locator('main').innerText()).length).toBeGreaterThan(400);
 await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',site.url+suffix);
 await expect(page.locator('meta[name="description"]')).toHaveCount(1);expect((await page.locator('meta[name="description"]').getAttribute('content'))!.length).toBeGreaterThan(80);
 await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content',site.url+suffix);await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content',site.url+site.image);
 await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content','summary_large_image');
 await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/index, follow/);
 const data=JSON.parse((await page.locator('#site-schema').textContent())!);expect(data['@graph'].some((node:{'@type':string})=>node['@type']==='WebPage')).toBe(true);
 await expect(page.locator('html')).toHaveAttribute('lang',language);
 await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(4);
 for(const lang of site.languages){
  const variant=(lang==='nl'?'':lang+'/')+(route==='/'?'':route.slice(1)+'/');
  await expect(page.locator(`link[hreflang="${lang}"]`)).toHaveAttribute('href',site.url+variant);
  await expect(page.locator(`.language-switcher a[lang="${lang}"]`)).toHaveAttribute('href',(lang==='nl'?'':'/'+lang)+route);
 }
 if(route==='/activiteiten')await expect(page.locator('.all-activities .activity-card')).toHaveCount(JSON.parse(readFileSync('src/data/activities.json','utf8')).items.length);
 expect(await page.locator('body').innerText()).not.toMatch(/weekelijks/i);
 await expect(page.locator('a[download], a[href*="brochure"]')).toHaveCount(0);
 await context.close();
});
test('Sitemap, preview image, robots, removed download and 404',async({request})=>{
 const xml=await (await request.get(base+'sitemap.xml')).text();expect((xml.match(/<loc>/g)||[]).length).toBe(site.routes.length*site.languages.length);
 for(const lang of site.languages)for(const route of site.routes)expect(xml).toContain(site.url+(lang==='nl'?'':lang+'/')+(route==='/'?'':route.slice(1)+'/'));
 const image=await request.get(base+site.image);expect(image.status()).toBe(200);expect(image.headers()['content-type']).toContain('image/jpeg');
 expect(await (await request.get(base+'robots.txt')).text()).toContain('Sitemap: '+site.url+'sitemap.xml');
 expect(await (await request.get(base+'404.html')).text()).toContain('noindex,follow');
 expect((await request.get(base+'downloads/la-maison-des-trois-garcons-brochure.pdf')).headers()['content-type']).not.toContain('application/pdf');
});
test('Language URLs, canonical metadata and history stay synchronized',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base);
 await page.getByRole('button',{name:'Menu openen',exact:true}).click();await page.locator('#main-menu a').filter({hasText:'Over ons'}).click();
 await page.waitForURL('**/over-ons');await expect(page).toHaveTitle(/Over ons/);
 await page.locator('.footer a[lang="fr"]').click();await expect(page).toHaveURL(/\/fr\/over-ons$/);await expect(page).toHaveTitle(/À propos/);
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',site.url+'fr/over-ons/');
 await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content','fr_FR');
 await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','fr');
 await page.goBack();await expect(page).toHaveTitle(/Over ons/);await expect(page.locator('html')).toHaveAttribute('lang','nl');
 expect(errors).toEqual([]);
});
