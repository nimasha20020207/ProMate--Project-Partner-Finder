const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:5182/login');
  
  // attempt login
  await page.fill('input[name="identifier"]', 'it12345678@my.sliit.lk');
  await page.fill('input[name="password"]', 'password');
  await page.click('button:has-text("Sign In")');
  
  // Wait a bit for navigation and dashboard loading
  await page.waitForTimeout(4000);
  
  await browser.close();
})();
