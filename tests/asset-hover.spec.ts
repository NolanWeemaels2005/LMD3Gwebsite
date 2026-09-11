import {test, expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import provenance from '../docs/asset-provenance.json' with { type: 'json' };

for(const width of [1440,1920]) test(`fan hover layers and returns at ${width}`, async ({page}) => {
  await page.setViewportSize({width,height:1080});await page.goto('/');
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('#booking').evaluate(el=>el.scrollIntoView({block:'center'}));
  await page.evaluate(()=>scrollBy(0,120));
  await expect.poll(()=>page.locator('.fan-card--3').evaluate(el=>Number(getComputedStyle(el).getPropertyValue('--spread')))).toBeGreaterThan(.99);
  await page.mouse.move(0,0);await page.waitForTimeout(450);
  const original = await page.locator('.fan-card').evaluateAll(cards=>cards.map(card=>{
    const m=new DOMMatrix(getComputedStyle(card).transform);return {x:m.m41,y:m.m42,angle:Math.atan2(m.b,m.a),z:getComputedStyle(card).zIndex};
  }));
  await page.screenshot({path:`test-results/fan-normal-${width}.png`});
  // Locate a genuinely visible patch of each card, including the outer cards.
  for(const selected of [3,1,5,0,6,2,4]) {
    await page.mouse.move(0,0);await page.waitForTimeout(450);
    const hit=await page.locator(`.fan-card--${selected}`).evaluate(card=>{
      const r=card.getBoundingClientRect();
      for(let y=Math.max(0,r.top+10);y<Math.min(innerHeight,r.bottom-10);y+=8)
        for(let x=Math.max(0,r.left+10);x<Math.min(innerWidth,r.right-10);x+=8)
          if(document.elementFromPoint(x,y)?.closest('.fan-card')===card) return {x,y};
      return null;
    });
    expect(hit).not.toBeNull();await page.mouse.move(hit!.x,hit!.y);await page.waitForTimeout(450);
    const state=await page.locator('.fan-card').evaluateAll(cards=>cards.map(card=>{
      const m=new DOMMatrix(getComputedStyle(card).transform);
      const inner=new DOMMatrix(getComputedStyle(card.querySelector('.fan-card-hover')!).transform);
      return {x:m.m41,angle:Math.atan2(m.b,m.a),scale:inner.a,z:Number(getComputedStyle(card).zIndex)};
    }));
    expect(state[selected].scale).toBeCloseTo(1.15,2);
    expect(state.map(card=>card.z)).toEqual([1,3,5,7,6,4,2]);
    for(let i=0;i<7;i++) {
      expect(state[i].angle).toBeCloseTo(original[i].angle,4);
      if(i<selected) expect(state[i].x).toBeLessThan(original[i].x-10);
      if(i>selected) expect(state[i].x).toBeGreaterThan(original[i].x+10);
    }
    // Relative spacing inside each side must be unchanged: two rigid groups.
    for (let i=1;i<7;i++) {
      if (i===selected || i-1===selected) continue;
      expect(state[i].x-state[i-1].x).toBeCloseTo(original[i].x-original[i-1].x,1);
    }
    await page.screenshot({path:`test-results/fan-hover-${selected}-${width}.png`});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.mouse.move(0,0);await page.waitForTimeout(450);
  const restored=await page.locator('.fan-card').evaluateAll(cards=>cards.map(card=>({
    x:new DOMMatrix(getComputedStyle(card).transform).m41,
    scale:new DOMMatrix(getComputedStyle(card.querySelector('.fan-card-hover')!).transform).a,
    z:getComputedStyle(card).zIndex,
  })));
  for(let i=0;i<7;i++){expect(restored[i].x).toBeCloseTo(original[i].x,2);expect(restored[i].scale).toBe(1);expect(restored[i].z).toBe(original[i].z);}
  await page.locator('.fan-card--3').hover();
  await page.evaluate(()=>scrollBy(0,-650));await page.waitForTimeout(600);
  expect(await page.locator('.fan-card--3').evaluate(el=>Number(getComputedStyle(el).getPropertyValue('--spread')))).toBeLessThan(.85);
  expect(await page.locator('.fan-card--3 .fan-card-hover').evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).a)).toBe(1);
});

test('actual attached SVGs, platform order and only supplied photographs', async ({page})=>{
  for(const asset of provenance.svg) expect(createHash('sha256').update(readFileSync(asset.path)).digest('hex')).toBe(asset.sha256);
  for(const photo of provenance.photos) for(const variant of photo.variants) expect(createHash('sha256').update(readFileSync(variant.path)).digest('hex')).toBe(variant.sha256);
  await page.goto('/');
  await expect(page.locator('.logo img').first()).toHaveAttribute('src',/LogoLMD3G\.svg/);
  await expect(page.locator('.location-map img')).toHaveAttribute('src',/MapFrance\.svg/);
  const social=page.locator('.social-links a');
  expect(await social.evaluateAll(links=>links.map(link=>link.getAttribute('aria-label')))).toEqual(['Instagram','Facebook','Whatsapp','Reli']);
  await expect(social.last().locator('img')).toHaveAttribute('src',/ReliIcon\.svg/);
  const images=await page.locator('.hero-image,.gallery-card img,.fan-card img').evaluateAll(images=>images.map(image=>(image as HTMLImageElement).src));
  expect(images.every(src=>/\/(hero-home|caroussel(?:[0-9]|1[0-3])|bottomp[1-57])-\d+\.webp$/.test(src))).toBe(true);
  await page.locator('.footer').scrollIntoViewIfNeeded();await page.screenshot({path:'test-results/footer-svg.png'});
});

for(const width of [1024,768,390]) test(`touch cannot leave hover enlarged at ${width}`,async({browser})=>{
 const context=await browser.newContext({viewport:{width,height:1024},isMobile:true,hasTouch:true});const page=await context.newPage();await page.goto('/');
 await page.locator('#booking').evaluate(el=>el.scrollIntoView({block:'center'}));await page.waitForTimeout(500);
 await page.locator('.fan-card--3').tap();await page.waitForTimeout(450);
 expect(await page.locator('.fan-card--3 .fan-card-hover').evaluate(el=>getComputedStyle(el).transform)).toBe('none');
 expect(await page.locator('.fan-card--2').evaluate(el=>getComputedStyle(el).getPropertyValue('--hover-x').trim())).toBe('0px');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
});

test('direct card transitions retain the active fan through gaps and recenter every layout',async({page})=>{
 await page.setViewportSize({width:1440,height:1080});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
 await page.locator('#booking').evaluate(el=>el.scrollIntoView({block:'center'}));await page.evaluate(()=>scrollBy(0,120));await page.waitForTimeout(600);
 const fan=page.locator('.fan');
 await fan.evaluate(el=>{
   (window as unknown as {fanHistory: (string|null)[]}).fanHistory=[];
   new MutationObserver(()=>{(window as unknown as {fanHistory: (string|null)[]}).fanHistory.push(el.getAttribute('data-active-index'));}).observe(el,{attributes:true,attributeFilter:['data-active-index']});
 });
 for(const index of [0,1,2,3,4,5,6,3,1,5]){
   const hit=await page.locator(`.fan-card--${index}`).evaluate(card=>{
     const r=card.getBoundingClientRect();
     for(let y=Math.max(0,r.top+15);y<Math.min(innerHeight,r.bottom-15);y+=8)
       for(let x=Math.max(0,r.left+15);x<Math.min(innerWidth,r.right-15);x+=8)
         if(document.elementFromPoint(x,y)?.closest('.fan-card')===card)return {x,y};
     return null;
   });
   expect(hit).not.toBeNull();await page.mouse.move(hit!.x,hit!.y);
   await expect(fan).toHaveAttribute('data-active-index',String(index));await page.waitForTimeout(450);
   await expect(fan).toHaveAttribute('data-active-index',String(index));
   const geometry=await fan.evaluate(el=>{
     const r=el.getBoundingClientRect();const surfaces=[...el.querySelectorAll('.fan-card-hover')].map(card=>card.getBoundingClientRect());
     return {center:(Math.min(...surfaces.map(r=>r.left))+Math.max(...surfaces.map(r=>r.right)))/2,expected:r.left+r.width/2,top:Math.min(...surfaces.map(r=>r.top))};
   });
   expect(Math.abs(geometry.center-geometry.expected)).toBeLessThan(2);
   expect(geometry.top).toBeGreaterThan(0);
 }
 // Empty space within the fan is not a reason to reset the selected layout.
 const gap=await fan.evaluate(el=>{const r=el.getBoundingClientRect();return{x:r.left+4,y:r.bottom-4};});
 await page.mouse.move(gap.x,gap.y);await page.waitForTimeout(450);await expect(fan).toHaveAttribute('data-active-index','5');
 const history=await page.evaluate(()=>(window as unknown as {fanHistory:(string|null)[]}).fanHistory);
 expect(history).not.toContain(null);
 await page.mouse.move(0,0);await expect(fan).not.toHaveAttribute('data-active-index');
 await page.waitForTimeout(450);
 expect(await page.locator('.fan-layout').evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m41)).toBe(0);
 // Resizing while selected must remove all desktop-only interaction state.
 await page.locator('.fan-card--3').hover();await page.waitForTimeout(450);
 await page.setViewportSize({width:1024,height:1024});
 await expect(fan).not.toHaveAttribute('data-active-index');
 expect(await page.locator('.fan-card--3 .fan-card-hover').evaluate(el=>getComputedStyle(el).transform)).toBe('none');
});


test('gallery allowlist is exact and fan layers stay fixed on every animation frame', async ({page}) => {
  await page.setViewportSize({width:1440,height:1080});await page.goto('/');
  const sources=await page.locator('.gallery-card img').evaluateAll(images=>images.map(image=>(image as HTMLImageElement).getAttribute('src')));
  const expectedIndices = [0,1,2,3,4,5,6,8,9,10,11,12,13];
  expect(sources).toHaveLength(expectedIndices.length);
  sources.forEach((src,i)=>expect(src).toMatch(new RegExp(`caroussel${expectedIndices[i]}-960.*\\.webp`)));
  await page.locator('#booking').evaluate(el=>el.scrollIntoView({block:'center'}));
  await page.evaluate(()=>scrollBy(0,120));await page.waitForTimeout(600);
  await page.evaluate(()=>{
    const cards=[...document.querySelectorAll('.fan-card')];
    (window as unknown as {layerErrors:string[]}).layerErrors=[];
    const check=()=>{
      const z=cards.map(card=>getComputedStyle(card).zIndex).join(',');
      if(z!=='1,3,5,7,6,4,2') (window as unknown as {layerErrors:string[]}).layerErrors.push(z);
      requestAnimationFrame(check);
    };check();
  });
  for (const index of [0,1,2,3,4,5,6]) {
    const point=await page.locator(`.fan-card--${index}`).evaluate(card=>{
      const r=card.getBoundingClientRect();
      for(let y=Math.max(0,r.top+8);y<Math.min(innerHeight,r.bottom-8);y+=6)
        for(let x=Math.max(0,r.left+8);x<Math.min(innerWidth,r.right-8);x+=6)
          if(document.elementFromPoint(x,y)?.closest('.fan-card')===card)return{x,y};
      return null;
    });
    expect(point).not.toBeNull();await page.mouse.move(point!.x,point!.y);
    await expect(page.locator('.fan')).toHaveAttribute('data-active-index',String(index));
    await page.waitForTimeout(450);
  }
  await page.mouse.move(0,0);await page.waitForTimeout(450);
  expect(await page.evaluate(()=>(window as unknown as {layerErrors:string[]}).layerErrors)).toEqual([]);
});
