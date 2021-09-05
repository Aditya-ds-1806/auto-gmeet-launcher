const puppeteer = require('puppeteer-core');
const { CronJob } = require('cron');
const fs = require('fs/promises');
const say = require('say');

const launchBrowserInstance = () => puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    defaultViewport: null,
    args: ['--start-maximized'],
});

const launchMeet = async (url, cookies, browserInstance = null) => {
    const
        browser = browserInstance?.isConnected() ? browserInstance : await launchBrowserInstance();
    const ctx = browser.defaultBrowserContext();
    const page = await browser.newPage();
    const joinSelector = '#yDmH0d > c-wiz > div > div > div:nth-child(9) > div.crqnQb > div > div > div.vgJExf > div > div > div.d7iDfe.NONs6c > div > div.Sla0Yd > div > div.XCoPyb > div.uArJ5e.UQuaGc.Y5sE8d.uyXBBb.xKiqt > span > span';
    const micSelector = '#yDmH0d > c-wiz > div > div > div:nth-child(9) > div.crqnQb > div > div > div.vgJExf > div > div > div.ZUpb4c > div.oORaUb.NONs6c > div > div.EhAUAc > div.ZB88ed > div > div > div';
    const cameraSelector = '#yDmH0d > c-wiz > div > div > div:nth-child(9) > div.crqnQb > div > div > div.vgJExf > div > div > div.ZUpb4c > div.oORaUb.NONs6c > div > div.EhAUAc > div.GOH7Zb > div > div';
    console.log(`Opening ${url}`);

    await ctx.overridePermissions('https://meet.google.com', ['camera', 'microphone']);
    if (!browserInstance?.isConnected()) await page.setCookie(...cookies);

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 0 });
    const camera = await page.waitForSelector(cameraSelector, { visible: true, timeout: 0 });
    const mic = await page.waitForSelector(micSelector, { visible: true, timeout: 0 });
    const join = await page.waitForSelector(joinSelector, { visible: true, timeout: 0 });
    await mic.click();
    await camera.click();
    await join.click();

    console.log('done boss');
    return browser;
};

(async () => {
    const cookies = JSON.parse(await fs.readFile('./cookies.json'));
    const { courses } = JSON.parse(await fs.readFile('./timetable.json'));
    let browserInstance = null;
    courses.forEach(({ link, crons, subject }) => {
        crons.forEach((cron) => {
            const job = new CronJob(cron, async () => {
                browserInstance = await launchMeet(link, cookies, browserInstance);
                say.speak(`You have a ${subject} in 5 minutes`);
            }, null, true, 'Asia/Kolkata');
            console.log(`${subject} - ${job.nextDates().fromNow()} - ${link}`);
        });
    });
})();
