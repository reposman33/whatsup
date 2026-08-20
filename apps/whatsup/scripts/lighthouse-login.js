import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import fs from 'node:fs';

const username = process.env.AUTH_USER;
const password = process.env.AUTH_PASS;
// const baseUrl = 'http://localhost:4200';
const baseUrl = 'https://whatsup-tau.vercel.app/login';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--remote-debugging-port=9222']
  });
  const page = await browser.newPage();

  // Step 1: Navigate to login page
  await page.goto(`${baseUrl}/login`);
  
  // Step 2: Enter credentials
  await page.waitForSelector('#email', {visible: true, timeout:20000});
  await page.type('#email', username);
  await page.type('#password', password);
  await Promise.all([
    page.click('#login'),
    page.waitForNavigation({waitUntil: 'networkidle0'}).catch(() => ({}))
  ])
  
  console.log('Login successful');

  // Step 3: Navigate to the page you want to audit
  await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('#email', { visible: true, timeout: 10000 });

  await page.type('#email', username);
  await page.type('#password', password);
  const url = page.url();

  // Step 4: Run Lighthouse
  const result = await lighthouse(url, {
    port: 9222,
    output: 'html',
    logLevel: 'info'
  });

  // Save the report
  fs.writeFileSync('lh-report-auth.html', result.report);

  await browser.close();

  // Fail the build if performance is too low
  const perfScore = result.lhr.categories.performance.score;
  if (perfScore < 0.7) {
    console.error('Performance score too low!');
    process.exit(1);
  }
})();