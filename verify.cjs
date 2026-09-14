const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/HP/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({channel:'msedge', headless:true});
 const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:3000'); await page.waitForLoadState('networkidle');
 await page.screenshot({path:'preview-desktop.png',fullPage:true});
 await page.locator('main img').evaluateAll(imgs=>Promise.all(imgs.map(i=>{i.loading='eager';return i.decode()})));
 assert.equal(await page.locator('main img').evaluateAll(imgs=>imgs.every(i=>i.complete && i.naturalWidth>0)),true);
 await page.locator('[data-watch]').click(); await page.getByRole('heading',{name:'Experience the ministry'}).waitFor(); await page.locator('#info-dialog .dialog-close').click();
 await page.locator('.event-card').first().click(); await page.getByRole('button',{name:'Enquire about a similar event'}).click(); assert.equal(await page.locator('#event-type').inputValue(),'Gospel show');
 await page.locator('[data-filter="fellowship"]').click(); assert.equal(await page.locator('.gallery-item:visible').count(),1);
 await page.locator('.gallery-item:visible').click(); assert.equal(await page.locator('#lightbox').evaluate(d=>d.open),true); await page.keyboard.press('Escape');
 await page.locator('[data-filter="all"]').click();
 await page.locator('[name="name"]').fill('Sample Visitor'); await page.locator('[name="phone"]').fill('+256 700 000 000'); await page.locator('[name="location"]').fill('Demo venue'); await page.locator('[name="date"]').fill('2027-12-20'); await page.locator('.submit').click();
 await page.getByRole('heading',{name:'Your enquiry is ready.'}).waitFor(); assert.match(await page.locator('#info-dialog textarea').inputValue(),/Sample Visitor/);
 const downloadPromise=page.waitForEvent('download'); await page.getByRole('button',{name:'Download enquiry'}).click(); const download=await downloadPromise; assert.equal(download.suggestedFilename(),'hope-to-reach-enquiry.txt'); await page.keyboard.press('Escape');
 await page.locator('.floating-whatsapp').click(); await page.getByRole('heading',{name:'Contact details coming soon'}).waitFor(); await page.keyboard.press('Escape');
 for (const width of [320,375,390,768,1024,1440]) { await page.setViewportSize({width,height:900}); assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`Overflow at ${width}`); }
 await page.setViewportSize({width:390,height:844}); await page.goto('http://localhost:3000'); await page.locator('.menu-toggle').click(); assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true'); await page.locator('#navigation a[href="#about"]').click(); assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false'); await page.evaluate(()=>scrollTo(0,0)); await page.screenshot({path:'preview-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]); console.log('PASS: images, video placeholder, events, filters, lightbox, enquiry validation/preview/download, contact placeholders, mobile menu, six responsive widths, no JS errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
