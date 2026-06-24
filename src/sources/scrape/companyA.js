// TEMPLATE — copy this file for each of your 3 custom-career-page
// companies (e.g. companyB.js, companyC.js) and fill in the real selectors
// for that page. Register the filename in src/config/companies.js as
// `scraperModule`.

export async function scrape(page, company) {
  await page.goto('https://TODO-real-careers-url.example.com/jobs', {
    waitUntil: 'domcontentloaded',
  });

  // TODO: replace with the real selector for this page's job listing rows
  await page.waitForSelector('.TODO-job-listing-selector', { timeout: 10_000 });

  const rows = await page.$$eval('.TODO-job-listing-selector', (elements) =>
    elements.map((el) => ({
      title: el.querySelector('.TODO-title-selector')?.textContent?.trim() ?? '',
      location: el.querySelector('.TODO-location-selector')?.textContent?.trim() ?? '',
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
