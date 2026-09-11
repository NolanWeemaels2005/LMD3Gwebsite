import { test,expect,type Page } from '@playwright/test';
import {contactType,stayLength,addCalendarDays,validStay} from '../src/utils/reservation';
const chooseDates=async(page:Page)=>{
 await page.locator('#reservation-dates').click();
 await page.getByRole('button',{name:/^zondag 7 juli 2030$/}).click();
 await expect(page.getByRole('button',{name:/13 juli 2030/})).toBeDisabled();
 await page.getByRole('button',{name:/14 juli 2030/}).click();
 await expect(page.locator('#reservation-dates')).toContainText('07/07/2030 — 14/07/2030');
};
test('contact formats and DST-safe calendar days',()=>{
 for(const v of ['test@example.com','nolan.test@example.be']) expect(contactType(v)).toBe('email');
 for(const v of ['0471 12 34 56','0471/12.34.56','+32 471 12 34 56','0032 471 12 34 56']) expect(contactType(v)).toBe('phone');
 for(const v of ['test@','123','abcdef','++32123abc']) expect(contactType(v)).toBeNull();
 expect(stayLength(new Date(2030,6,10),new Date(2030,6,16))).toBe(6);expect(stayLength(new Date(2030,6,10),new Date(2030,6,17))).toBe(7);expect(stayLength(new Date(2030,6,10),new Date(2030,6,18))).toBe(8);
 for(const d of [new Date(2027,2,25),new Date(2027,9,28)]) expect(stayLength(d,addCalendarDays(d,7))).toBe(7);
});
for(const [width,height] of [[1440,900],[1920,1080],[1024,1366],[768,1024],[390,844],[375,812]]) test(`reservation ${width}`,async({page})=>{
 await page.clock.setFixedTime(new Date(2030,6,1,12));await page.setViewportSize({width,height});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));let sent:Record<string,unknown>|undefined;
 await page.route('https://formspree.io/**',async route=>{sent=route.request().postDataJSON();await new Promise(r=>setTimeout(r,300));await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({next:'/thanks',ok:true})});});
 await page.goto('/reserveren');await page.evaluate(()=>document.fonts.ready);await expect(page.locator('.hero')).toHaveCSS('height',`${height}px`);await page.screenshot({path:`test-results/reservation-hero-${width}.png`});
 await page.locator('.reservation-submit').click();await expect(page.locator('#name-error')).toBeVisible();expect(sent).toBeUndefined();
 await page.locator('#reservation-name').fill('Nolan Test');await page.locator('#reservation-contact').fill('test@example.com');
 await page.locator('#reservation-dates').click();await page.locator('.reservation-calendar').screenshot({path:`test-results/reservation-calendar-${width}.png`});const box=(await page.locator('.reservation-calendar').boundingBox())!;expect(box.x>=0&&box.x+box.width<=width).toBe(true);await page.keyboard.press('Escape');
 await chooseDates(page);await page.locator('#reservation-message').fill('Test request — intercepted by automated test.');await page.locator('.reservation-form').screenshot({path:`test-results/reservation-form-${width}.png`});
 await page.locator('.reservation-submit').click();await expect(page.locator('.reservation-submit')).toBeDisabled();await expect(page.locator('.reservation-success')).toBeVisible();expect(sent).toMatchObject({contact:'test@example.com',contact_type:'email',email:'test@example.com',arrival_date:'2030-07-07',departure_date:'2030-07-14',stay_length_days:7});expect(sent).not.toHaveProperty('phone');
 await page.locator('.reviews').scrollIntoViewIfNeeded();await expect(page.locator('.review-card')).toHaveCount(10);expect(await page.locator('#main > :last-child').getAttribute('class')).toBe('reviews');await expect(page.locator('.fan,video')).toHaveCount(0);
 await page.locator('.menu-toggle').click();await expect(page.locator('#main-menu a[aria-current="page"]')).toHaveText('Reserveer');expect(await page.locator('#main-menu a').allTextContents()).toEqual(['Home','Over ons','Activiteiten','Pluspunten','Reserveer']);await page.keyboard.press('Escape');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
});
test('phone payload, failure and localized calendar',async({page})=>{
 await page.clock.setFixedTime(new Date(2030,6,1,12));let sent:Record<string,unknown>|undefined;
 await page.route('https://formspree.io/**',route=>{sent=route.request().postDataJSON();return route.fulfill({status:422,contentType:'application/json',body:JSON.stringify({errors:[{message:'technical server detail',code:'INACTIVE'}]})});});await page.goto('/reserveren');await page.locator('#reservation-name').fill('Nolan');await page.locator('#reservation-contact').fill('+32 471 12 34 56');await chooseDates(page);await page.locator('.reservation-submit').click();await expect(page.getByText('Er ging iets mis bij het versturen. Probeer het opnieuw.')).toBeVisible();await expect(page.getByText('technical server detail')).toHaveCount(0);expect(sent).toMatchObject({contact_type:'phone',phone:'+32 471 12 34 56'});expect(sent).not.toHaveProperty('email');
 await page.locator('.language-switcher button[lang="fr"]').click();await page.locator('#reservation-dates').click();await expect(page.locator('.rdp-month_caption')).toContainText('juillet');await page.keyboard.press('Escape');
 await page.locator('.language-switcher button[lang="en"]').click();await page.locator('#reservation-dates').click();await expect(page.locator('.rdp-month_caption')).toContainText('July');
});
test('past dates, keyboard calendar and shared reviews',async({page})=>{
 await page.clock.setFixedTime(new Date(2030,6,5,12));await page.goto('/reserveren');await page.locator('#reservation-dates').click();await expect(page.getByRole('button',{name:/^donderdag 4 juli 2030$/})).toBeDisabled();await page.keyboard.press('Escape');await expect(page.locator('#reservation-dates')).toBeFocused();
 await page.keyboard.press('Enter');await expect(page.locator('.reservation-calendar')).toBeVisible();await page.keyboard.press('Escape');
 await page.locator('.reviews').scrollIntoViewIfNeeded();await page.locator('.review-card').first().hover();await expect(page.locator('.reviews-track')).toHaveCSS('animation-play-state','paused');await page.mouse.move(0,0);await page.locator('.review-card').first().focus();await expect(page.locator('.reviews-track')).toHaveCSS('animation-play-state','paused');
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.reviews-track')).toHaveCSS('animation-name','none');
});
test('global booking links and book closes before reservation route',async({page})=>{
 await page.goto('/');await expect(page.locator('.hero-buttons a').first()).toHaveAttribute('href','/reserveren');await expect(page.locator('#booking > a')).toHaveAttribute('href','/reserveren');
 await page.locator('.menu-toggle').click();await expect(page.locator('.navigation-scene')).toHaveAttribute('data-state','open');await page.locator('#main-menu a[href="/reserveren"]').click();expect(new URL(page.url()).pathname).toBe('/');await expect(page).toHaveURL(/\/reserveren$/);await expect(page.locator('.reservation-form')).toBeVisible();
});
for(const width of [1440,768,390]) test(`footer spacing and RELI ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/reserveren');const reli=page.locator('.button--reli');await expect(reli).toHaveCSS('background-color','rgb(139, 130, 239)');await expect(reli).toHaveAttribute('href','https://www.reli.be/nl/provence/var/le-reflet-du-lac');await expect(reli.locator('img')).toHaveJSProperty('complete',true);await page.screenshot({path:`test-results/reservation-reli-${width}.png`});
 await expect(page.locator('a').filter({hasText:/whatsapp/i})).toHaveCount(0);await expect(page.getByRole('link',{name:/whatsapp/i})).toHaveCount(0);await expect(page.locator('.social-links a')).toHaveCount(3);
 await page.locator('.footer').scrollIntoViewIfNeeded();const gap=await page.evaluate(()=>document.querySelector('.footer')!.getBoundingClientRect().top-Math.max(...Array.from(document.querySelectorAll('.review-card')).map(e=>e.getBoundingClientRect().bottom)));expect(gap).toBeGreaterThanOrEqual(width<768?48:width<1100?64:86);await page.screenshot({path:`test-results/reservation-footer-gap-${width}.png`});
});
test('Sunday validation rejects invalid endpoints and accepts complete weeks',()=>{
 const sunday=new Date(2030,6,7);
 expect(validStay(sunday,addCalendarDays(sunday,7))).toBe(true);
 expect(validStay(sunday,addCalendarDays(sunday,14))).toBe(true);
 for(const days of [0,1,6,8,13]) expect(validStay(sunday,addCalendarDays(sunday,days))).toBe(false);
 expect(validStay(new Date(2030,6,8),new Date(2030,6,15))).toBe(false);
 expect(validStay(undefined,sunday)).toBe(false);expect(validStay(sunday)).toBe(false);
 expect(validStay(new Date(2020,6,5),new Date(2020,6,12))).toBe(false);
});
test('Sunday calendar supports keyboard selection, editing and two-week submission',async({page})=>{
 await page.clock.setFixedTime(new Date(2030,6,8,12));let payload:Record<string,unknown>|undefined;
 await page.route('https://formspree.io/**',route=>{payload=route.request().postDataJSON();return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,next:'/thanks'})});});
 await page.goto('/reserveren');await page.locator('#reservation-name').fill('Nolan');await page.locator('#reservation-contact').fill('test@example.com');
 await page.locator('#reservation-dates').click();
 await expect(page.getByRole('button',{name:'zondag 7 juli 2030'})).toBeDisabled();
 await expect(page.getByRole('button',{name:'maandag 8 juli 2030'})).toBeDisabled();
 await page.getByRole('button',{name:'zondag 14 juli 2030'}).focus();await page.keyboard.press('Enter');
 await expect(page.getByRole('button',{name:'zondag 14 juli 2030'})).toBeDisabled();
 await page.getByRole('button',{name:'zondag 21 juli 2030'}).focus();await page.keyboard.press('Enter');
 await page.locator('#reservation-dates').click();await page.getByRole('button',{name:'Data wissen',exact:true}).click();
 await page.getByRole('button',{name:'zondag 14 juli 2030'}).click();await page.getByRole('button',{name:'zondag 28 juli 2030'}).click();
 await expect(page.locator('#reservation-dates')).toContainText('14/07/2030 — 28/07/2030');await page.locator('.reservation-submit').click();await expect(page.locator('.reservation-success')).toBeVisible();expect(payload).toMatchObject({arrival_date:'2030-07-14',departure_date:'2030-07-28',stay_length_days:14});
});
