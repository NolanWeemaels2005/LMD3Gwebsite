import {test,expect} from '@playwright/test';
for(const width of [1440,1920,1024,390]) test(`language change keeps the footer visible at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
 await page.locator('.language-switcher').scrollIntoViewIfNeeded();await page.waitForTimeout(500);
 for(const language of ['fr','en','nl']) {
  const before=await page.evaluate(()=>scrollY);
  await page.locator(`.language-switcher button[lang="${language}"]`).click();await page.waitForTimeout(500);
  await expect(page.locator('html')).toHaveAttribute('lang',language);
  await expect(page.locator('.language-switcher')).toBeInViewport();
  expect(Math.abs(await page.evaluate(()=>scrollY)-before)).toBeLessThan(180);
 }
});
