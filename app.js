const puppeteer = require('puppeteer-core');
const { CronJob } = require('cron');
const fs = require('fs/promises');

const launchBrowserInstance = () => puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    defaultViewport: null,
});

const launchMeet = async (url, cookies, browserInstance = null) => {
    const browser = browserInstance ?? await launchBrowserInstance();
    const ctx = browser.defaultBrowserContext();
    const page = await browser.newPage();

    console.log(`Opening ${url}`);

    await ctx.overridePermissions('https://meet.google.com', ['camera', 'microphone']);
    await page.setCookie(...cookies);

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 0 });
    const media = await page.$$('[data-is-muted]');
    const [mute, camera] = [media[0], media[2]];
    const join = (await page.$$('[jsshadow] > span'))[3];
    await mute.click();
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
            }, null, true, 'Asia/Kolkata');
            console.log(`${subject} - ${job.nextDates().fromNow()} - ${link}`);
        });
    });
})();
