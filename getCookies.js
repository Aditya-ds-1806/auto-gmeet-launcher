const puppeteer = require('puppeteer-core');
const fs = require('fs/promises');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        defaultViewport: null,
        args: ['--start-maximized'],
    });

    const page = await browser.newPage();
    await page.goto('https://meet.google.com', { waitUntil: 'networkidle0', timeout: 0 });
    await page.waitForTimeout(40000); // 40 seconds time to login to google meet with ur google acc
    const cookies = await page.cookies();
    await fs.writeFile('./cookies.json', JSON.stringify(cookies));
    browser.close();
})();
