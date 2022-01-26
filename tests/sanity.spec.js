const puppeteer = require('puppeteer');
const dev = ['http://localhost:3333'];
const corpQa = [' https://cms-qa.{COMPANY}.com'];
const wiopQa = ['https://wiop-cms-qa.{COMPANY}.com/'];

describe(`Sanity CMS`, () => {
  let page;
  let browser;

  beforeEach(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    page.setDefaultNavigationTimeout(120000);
  });

  afterEach(async () => {
    const linkHandlers = await page.$x("//a[contains(@href, 'publications')]");
    if (linkHandlers.length < 1) {
      browser.close();
      throw new Error('Link not found');
    }
    browser.close();
  });
  const loginAndDeskValidation = async () => {
    await page.waitForXPath("//div[normalize-space()='E-mail / password']");
    const emailPasswordButton = await page.$x("//div[normalize-space()='E-mail / password']");
    await emailPasswordButton[0].click();
    await page.waitForSelector('input[type="text"]');
    await page.type('input[type="text"]', process.env.CIT_BOT_USERNAME);
    await page.type('input[type="password"]', process.env.CIT_BOT_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForSelector('div[data-testid="pane-content"] a[href="/desk/publications"]');
  };

  dev.forEach(url => {
    if (process.env.ENV_UNDER_TEST === 'dev') {
      it(`Validate Sanity is operational: ${url}`, async () => {
        await page.goto(url);
        await loginAndDeskValidation();
      });
    }
  });
  corpQa.forEach(url => {
    if (process.env.ENV_UNDER_TEST === 'CORP-QA') {
      it(`Validate Corp QA Sanity is operational: ${url}`, async () => {
        await page.goto(url);
        await loginAndDeskValidation();
      });
    }
  });
  wiopQa.forEach(url => {
    if (process.env.ENV_UNDER_TEST === 'WIOP-QA') {
      it(`Validate WIOP QA Sanity is operational: ${url}`, async () => {
        await page.goto(url);
        await loginAndDeskValidation();
      });
    }
  });
});