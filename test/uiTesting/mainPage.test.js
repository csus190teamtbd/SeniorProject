import { expect } from "chai";
const puppeteer = require("puppeteer");

const baseUrl = "https://tbd.mattmerr.com";

describe("Main Page UI", () => {
  let broswer;
  let page;

  before(async () => {
    broswer = await puppeteer.launch({
      headless: false,
      slowMo: 0,
      // devtools: true,
      timeout: 10000
    });
    page = await broswer.newPage();
    await page.setViewport({
      width: 1024,
      height: 768
    });
    await page.goto(baseUrl);
  });

  after(async () => {
    await broswer.close();
  });

  it("should go to the right page", async () => {
    const url = await page.url();
    expect(url).to.contain(baseUrl);
  });

  it("should have correct title", async () => {
    const title = await page.title();
    expect(title).to.contain("Statistic");
  });

  it("should display one proportion page", async () => {
    await page.click("#main-menu > ul > li:nth-child(1) > a");
    const title = await page.title();
    expect(title).to.contain("One Proportion");
  });

  it("should back to main page", async () => {
    await page.click("#navbar > ul > li:nth-child(1) > a");
    const title = await page.title();
    expect(title).to.contain("Statistic");
  });

  it("should display one mean page", async () => {
    await page.waitForSelector("#main-menu > ul > li:nth-child(2) > a");
    await page.click("#main-menu > ul > li:nth-child(3) > a");
    const title = await page.title();
    expect(title).to.contain("One Mean");
  });
});
