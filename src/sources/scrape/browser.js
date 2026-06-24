// Shared Playwright browser lifecycle. One browser is launched per run and
// reused across all scraped companies' pages, rather than launching a fresh
// browser per company.

import { chromium } from 'playwright';

let browser;

export async function getBrowser() {
  if (!browser) {
    browser = await chromium.launch({ headless: true });
  }
  return browser;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = undefined;
  }
}
