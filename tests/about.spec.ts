import {test,expect} from '@playwright/test';
const url='http://127.0.0.1:4181/LMD3Gwebsite/over-ons/';
for(const [width,height] of [[1920,1080],[1440,900],[1024,1366],[768,1024],[390,844],[375,812]])test(`About page ${width}`,async({page})=>{
 await page.setViewportSize({width,height});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.evaluate(()=>document.fonts.ready);
 await expect(page.locator('.about-hero')).toHaveJSProperty('clientHeight',height);await expect(page.locator('.route-pending')).toHaveCount(0);
 const images=page.locator('.about-hero img,.about-split img,.comparison img');await expect(images).toHaveCount(7);
 for(const img of await images.all()){await img.scrollIntoViewIfNeeded();await img.evaluate(async(el:HTMLImageElement)=>{await el.decode();if(!el.currentSrc.includes('about-'))throw Error('Wrong source');});}
 for(const slider of await page.getByRole('slider').all()){await slider.focus();await expect(slider).toHaveAttribute('aria-valuenow','50');await slider.press('ArrowRight');await expect(slider).toHaveAttribute('aria-valuenow','52');await slider.press('Home');await expect(slider).toHaveAttribute('aria-valuenow','0');await slider.press('End');await expect(slider).toHaveAttribute('aria-valuenow','100');await slider.press('Home');}
 const slider=page.getByRole('slider').first();await slider.scrollIntoViewIfNeeded();const b=(await slider.boundingBox())!;await page.mouse.move(b.x+b.width*.2,b.y+b.height*.5);await page.mouse.down();await page.mouse.move(b.x+b.width*.8,b.y+b.height*.5);await page.mouse.up();expect(Number(await slider.getAttribute('aria-valuenow'))).toBeGreaterThan(75);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await expect(page.locator('.about-story a')).toHaveAttribute('href','/LMD3Gwebsite/activiteiten');await expect(page.locator('.about-name a')).toHaveAttribute('href','/LMD3Gwebsite/reserveren');
 for(const control of await page.getByRole('slider').all()){await control.press('Home');for(let n=0;n<25;n++)await control.press('ArrowRight');}
 await page.locator('.fan').scrollIntoViewIfNeeded();await page.waitForTimeout(600);
 const layers=await page.locator('.fan-card').evaluateAll(cards=>cards.map(card=>getComputedStyle(card).zIndex));expect(layers).toEqual(['1','3','5','7','6','4','2']);
 await page.screenshot({path:`test-results/about-fan-${width}.png`});
 await page.locator('body').click({position:{x:1,y:1}});await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await page.screenshot({path:`test-results/about-${width}.png`,fullPage:true});
 await page.getByRole('button',{name:'Menu openen',exact:true}).click();await expect(page.locator('#main-menu a[aria-current="page"]')).toHaveText('Over ons');await page.keyboard.press('Escape');await page.waitForTimeout(1000);expect(errors).toEqual([]);
});
test('About touch drag and language controls',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:'nl-BE'});const page=await context.newPage();await page.goto(url);const slider=page.getByRole('slider').first();await slider.scrollIntoViewIfNeeded();const b=(await slider.boundingBox())!;const cdp=await context.newCDPSession(page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:b.x+b.width*.5,y:b.y+b.height*.5}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:b.x+b.width*.8,y:b.y+b.height*.5}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});expect(Number(await slider.getAttribute('aria-valuenow'))).toBeGreaterThan(70);
 for(const lang of ['fr','en','nl']){await page.locator(`.footer button[lang="${lang}"]`).click();await expect(page.locator('html')).toHaveAttribute('lang',lang);expect(await page.locator('.about-hero h1').innerText()).not.toContain('about.');}
 await context.close();
});
