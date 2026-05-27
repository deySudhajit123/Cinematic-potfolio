const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(2500);
  const startBtn = page.locator('button').filter({ hasText: 'Start' }).first();
  await startBtn.click();
  await page.waitForTimeout(1800);
  await page.evaluate(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTop = window.innerHeight;
  });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'ss.png', fullPage: false });
  await browser.close();
  console.log('done');
})().catch(e => { console.error(e.message); process.exit(1); });
