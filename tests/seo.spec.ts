import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const site=JSON.parse(readFileSync('src/data/site.json','utf8')) as {url:string;image:string;routes:string[]};
const base='http://127.0.0.1:4181/LMD3Gwebsite/';
for(const route of site.routes)test(`Static crawlable HTML ${route}`,async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();const suffix=route==='/'?'':route.slice(1)+'/';const response=await page.goto(base+suffix);expect(response?.status()).toBe(200);
 await expect(page.locator('main h1')).toBeVisible();expect((await page.locator('main').innerText()).length).toBeGreaterThan(400);
 await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',site.url+suffix);
 await expect(page.locator('meta[name="description"]')).toHaveCount(1);expect((await page.locator('meta[name="description"]').getAttribute('content'))!.length).toBeGreaterThan(80);
 await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content',site.url+suffix);await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content',site.url+site.image);await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content','summary_large_image');
 await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/index, follow/);const data=JSON.parse((await page.locator('#site-schema').textContent())!);expect(data['@graph'].some((node:{'@type':string})=>node['@type']==='WebPage')).toBe(true);
 await expect(page.locator('html')).toHaveAttribute('lang','nl');await context.close();
});
test('Sitemap, preview image, robots and 404',async({request})=>{
 const xml=await (await request.get(base+'sitemap.xml')).text();expect((xml.match(/<loc>/g)||[]).length).toBe(site.routes.length);for(const route of site.routes)expect(xml).toContain(site.url+(route==='/'?'':route.slice(1)+'/'));
 const image=await request.get(base+site.image);expect(image.status()).toBe(200);expect(image.headers()['content-type']).toContain('image/jpeg');const robots=await (await request.get(base+'robots.txt')).text();expect(robots).toContain('Sitemap: '+site.url+'sitemap.xml');expect(await (await request.get(base+'404.html')).text()).toContain('noindex,follow');
});
test('Live navigation and language metadata stay synchronized',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base);await page.getByRole('button',{name:'Menu openen',exact:true}).click();await page.locator('#main-menu a').filter({hasText:'Over ons'}).click();await page.waitForURL('**/over-ons');await expect(page).toHaveTitle(/Over ons/);await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',site.url+'over-ons/');
 await page.locator('.footer button[lang="fr"]').click();await expect(page).toHaveTitle(/À propos/);await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content','fr_FR');await page.goBack();await expect(page).toHaveTitle(/Maison de vacances/);await expect(page.locator('meta[name="description"]')).toHaveCount(1);expect(errors).toEqual([]);
});
