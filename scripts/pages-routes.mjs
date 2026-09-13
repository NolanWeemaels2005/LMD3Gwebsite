// Render the actual React pages at build time for crawlers and link preview bots.
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {preview} from 'vite';
import {chromium} from '@playwright/test';
const site=JSON.parse(await readFile(new URL('../src/data/site.json',import.meta.url),'utf8'));
const template=await readFile('dist/index.html','utf8');
const base=new URL(site.url).pathname;
for(const route of site.routes.filter(route=>route!=='/')){
 await mkdir(`dist${route}`,{recursive:true});await writeFile(`dist${route}/index.html`,template);
}
const server=await preview({preview:{host:'127.0.0.1',port:4193,strictPort:true,open:false}});
let browser;
try{
 browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'chrome',headless:true});
 const context=await browser.newContext({locale:'nl-BE',reducedMotion:'reduce',viewport:{width:1440,height:900}});
 await context.addInitScript(()=>localStorage.setItem('siteLanguage','nl'));
 // External card-image hosts are unnecessary for producing the page HTML.
 await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
 for(const route of site.routes){
  const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:4193${base}${route==='/'?'':route.slice(1)+'/'}`,{waitUntil:'networkidle'});
  await page.locator('main h1').waitFor();await page.waitForFunction(()=>!!document.querySelector('#site-schema'));
  if(errors.length)throw new Error(errors.join('\n'));
  // Recreate the live React tree on load; this HTML also remains usable without JS.
  // Keep prerendered portals inside the replaceable root to prevent duplicate controls.
  await page.evaluate(()=>{const root=document.getElementById('root');document.querySelectorAll('body > .shared-navigation-controls').forEach(node=>root.append(node));});
  const html=await page.content();
  if(!html.includes('rel="canonical"')||!html.includes('og:image'))throw new Error(`Missing SEO metadata: ${route}`);
  await writeFile(route==='/'?'dist/index.html':`dist${route}/index.html`,html);
  console.log(`Prerendered ${route}`);await page.close();
 }
}finally{await browser?.close();await new Promise(resolve=>server.httpServer.close(resolve));}
const urls=site.routes.map(route=>new URL(route==='/'?'':route.slice(1)+'/',site.url).href);
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url=>`  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${site.url}sitemap.xml\n`);
await writeFile('dist/.nojekyll','');
await writeFile('dist/404.html',`<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Pagina niet gevonden | ${site.name}</title><style>body{margin:0;padding:12vh 8vw;background:#FBF5E3;color:#4b4f3f;font-family:system-ui}a{display:inline-block;background:#C8ADD2;padding:16px 24px;border-radius:20px;color:#25271f}</style></head><body><h1>Pagina niet gevonden</h1><p>Deze pagina bestaat niet of is verplaatst.</p><a href="${base}">Terug naar de homepage</a></body></html>`);
