import {test,expect} from '@playwright/test';
test('gallery ends at its final photograph',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('/');await page.waitForTimeout(800);
 await page.locator('.gallery-viewport').focus();await page.keyboard.press('End');await page.waitForTimeout(700);
 const geometry=await page.evaluate(()=>{const v=document.querySelector('.gallery-viewport')!,t=document.querySelector('.gallery-track')!,l=t.lastElementChild!;return{right:v.getBoundingClientRect().right,last:l.getBoundingClientRect().right,scroll:v.scrollLeft,sw:t.scrollWidth,count:t.children.length}});
 await page.screenshot({path:'test-results/gallery-end.png'});expect(Math.abs(geometry.right-geometry.last)).toBeLessThan(2);
 // Reproduce shortening the gallery without a full reload.
 await page.locator('.gallery-card').nth(6).evaluate(el=>el.remove());await page.waitForTimeout(500);
 await page.keyboard.press('End');await page.waitForTimeout(700);
 const gap=await page.evaluate(()=>document.querySelector('.gallery-viewport')!.getBoundingClientRect().right-document.querySelector('.gallery-track')!.lastElementChild!.getBoundingClientRect().right);
 expect(Math.abs(gap)).toBeLessThan(2);
 expect(await page.locator('.fan-card img').nth(2).getAttribute('src')).toContain('bottomp6-960');
});
