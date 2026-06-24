// Odoo's careers page has no public API. It's server-rendered (not an SPA),
// auto-filtered by visitor geolocation, and listings live in `#jobs_grid`.

export async function scrape(page, company) {
  await page.goto('https://www.odoo.com/jobs', { waitUntil: 'domcontentloaded' });

  await page.waitForSelector('#jobs_grid .card', { timeout: 10_000 });

  const rows = await page.$$eval('#jobs_grid .card', (elements) =>
    elements.map((el) => ({
      title: el.querySelector('h3')?.textContent?.trim() ?? '',
      location: el.querySelector('address')?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      url: el.querySelector('a')?.href ?? '',
    }))
  );

  return rows
    .filter((row) => row.title && row.url)
    .map((row) => ({
      id: `scrape:${company.scraperModule}:${row.url}`,
      company: company.name,
      title: row.title,
      location: row.location || 'Not specified',
      url: row.url,
    }));
}

// Job descriptions are free-form CMS content with no dedicated class, so
// `<main>`'s rendered text (minus the shared header/nav) is the cleanest
// generic extraction. Called lazily — only for new jobs, right before
// judging — via a fresh page on the shared browser.
export async function fetchDescription(page, job) {
  await page.goto(job.url, { waitUntil: 'domcontentloaded' });
  return page.$eval('main', (el) => el.innerText).catch(() => '');
}
