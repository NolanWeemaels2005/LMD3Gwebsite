// Generate complete, language-specific HTML for visitors and search engines.
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {preview} from 'vite';
import {chromium} from '@playwright/test';
const site=JSON.parse(await readFile(new URL('../src/data/site.json',import.meta.url),'utf8'));
const template=await readFile('dist/index.html','utf8');
const base=new URL(site.url).pathname;
const pages=site.languages.flatMap(language=>site.routes.map(route=>({
 language, route, suffix:(language==='nl'?'':language+'/')+(route==='/'?'':route.slice(1)+'/'),
})));
for(const {suffix} of pages){
 await mkdir(`dist/${suffix}`,{recursive:true});await writeFile(`dist/${suffix}index.html`,template);
}
const server=await preview({preview:{host:'127.0.0.1',port:4193,strictPort:true,open:false}});
let browser;
try{
 browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'chrome',headless:true});
 const context=await browser.newContext({locale:'nl-BE',reducedMotion:'reduce',viewport:{width:1440,height:900}});
 await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
 for(const {suffix,language} of pages){
  const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:4193${base}${suffix}`,{waitUntil:'networkidle'});
  await page.locator('.route-loading').waitFor({state:'detached'});
  await page.locator('main h1').waitFor();await page.waitForFunction(()=>!!document.querySelector('#site-schema'));
  if(await page.locator('html').getAttribute('lang')!==language)throw new Error(`Wrong language: ${suffix}`);
  if(errors.length)throw new Error(errors.join('\n'));
  // Prerender every activity, not only the first interactive results batch.
  const more=page.locator('.activity-more');
  while(await more.count())await more.click();
  await page.evaluate(()=>{const root=document.getElementById('root');document.querySelectorAll('body > .shared-navigation-controls').forEach(node=>root.append(node));});
  const html=await page.content();
  if(!html.includes('rel="canonical"')||!html.includes('og:image'))throw new Error(`Missing SEO metadata: ${suffix}`);
  await writeFile(`dist/${suffix}index.html`,html);
  console.log(`Prerendered /${suffix}`);await page.close();
 }
}finally{await browser?.close();await new Promise(resolve=>server.httpServer.close(resolve));}
const urls=pages.map(({suffix})=>new URL(suffix,site.url).href);
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url=>`  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${site.url}sitemap.xml\n`);
await writeFile('dist/.nojekyll','');
await writeFile('dist/404.html',`<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Pagina niet gevonden | ${site.name}</title><style>body{margin:0;padding:12vh 8vw;background:#FBF5E3;color:#4b4f3f;font-family:system-ui}a{display:inline-block;background:#C8ADD2;padding:16px 24px;border-radius:20px;color:#25271f}</style></head><body><h1>Pagina niet gevonden</h1><p>Deze pagina bestaat niet of is verplaatst.</p><a href="${base}">Terug naar de homepage</a></body></html>`);
