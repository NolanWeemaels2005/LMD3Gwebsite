import { test, expect } from '@playwright/test';
for (const width of [1440,390]) test(`menu contrast ${width}`, async ({page}) => {
 await page.setViewportSize({width,height:900});await page.goto('/activiteiten');
 const button=page.locator('.menu-toggle');const line=button.locator('span').first();
 await expect(button).toHaveCSS('background-color','rgb(251, 245, 227)');await expect(line).toHaveCSS('height','3px');
 await page.locator('.favorites-section').evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY,behavior:'instant'}));
 await expect(button).toHaveCSS('background-color','rgb(164, 167, 143)');await expect(line).toHaveCSS('background-color','rgb(251, 245, 227)');
 await page.screenshot({path:`test-results/menu-light-${width}.png`});
 await button.click();await expect(button).toHaveAttribute('aria-expanded','true');await page.keyboard.press('Escape');await expect(button).toHaveAttribute('aria-expanded','false');
 await page.locator('.all-activities').evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY,behavior:'instant'}));
 await expect(button).toHaveCSS('background-color','rgb(251, 245, 227)');await expect(line).toHaveCSS('background-color','rgb(164, 167, 143)');
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await expect(button).toHaveCSS('background-color','rgb(251, 245, 227)');
});
