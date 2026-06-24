// Shared Playwright browser lifecycle. One browser is launched per run and
// reused across all scraped companies' pages, rather than launching a fresh
// browser per company.

import { chromium } from 'playwright';

// Default Playwright UA advertises "HeadlessChrome", which some career
// pages' bot detection (e.g. Odoo) blocks with a 403. A realistic UA avoids
// that without otherwise changing scraping behavior.
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

let browser;
let context;

export async function getBrowser() {
  if (!browser) {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({ userAgent: USER_AGENT });
  }
  return context;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = undefined;
    context = undefined;
  }
}
