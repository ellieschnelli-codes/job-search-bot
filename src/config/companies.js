// Watchlist of companies to check on every run.
//
// `source` selects which module in src/sources/ handles the company:
//   - 'ashby'      -> needs `boardName` (find it in the URL: jobs.ashbyhq.com/{boardName})
//   - 'greenhouse' -> needs `boardToken` (find it in: boards.greenhouse.io/{boardToken})
//   - 'lever'      -> needs `companySlug` (find it in: jobs.lever.co/{companySlug})
//   - 'personio'   -> needs `subdomain` (find it in: {subdomain}.jobs.personio.com)
//   - 'scrape'     -> needs `scraperModule`, matching a filename in src/sources/scrape/
//                     (e.g. 'companyA' -> src/sources/scrape/companyA.js)
//
// Replace every placeholder below with your real ~20 companies.

export const companies = [
  // --- Ashby (10) ---
  { name: 'Ashby Company 1', source: 'ashby', boardName: 'TODO-ashby-board-name' },
  { name: 'Ashby Company 2', source: 'ashby', boardName: 'TODO-ashby-board-name' },
  { name: 'Ashby Company 3', source: 'ashby', boardName: 'TODO-ashby-board-name' },
  { name: 'Ashby Company 4', source: 'ashby', boardName: 'TODO-ashby-board-name' },
  { name: 'Ashby Company 5', source: 'ashby', boardName: 'TODO-ashby-board-name' },
  { name: 'Ashby Company 6', source: 'ashby', boardName: 'TODO-ashby-board-name' },
  { name: 'Ashby Company 7', source: 'ashby', boardName: 'TODO-ashby-board-name' },
  { name: 'Ashby Company 8', source: 'ashby', boardName: 'TODO-ashby-board-name' },
  { name: 'Ashby Company 9', source: 'ashby', boardName: 'TODO-ashby-board-name' },
  { name: 'Ashby Company 10', source: 'ashby', boardName: 'TODO-ashby-board-name' },

  // --- Greenhouse (2) ---
  { name: 'Greenhouse Company 1', source: 'greenhouse', boardToken: 'TODO-greenhouse-board-token' },
  { name: 'Greenhouse Company 2', source: 'greenhouse', boardToken: 'TODO-greenhouse-board-token' },

  // --- Lever (1) ---
  { name: 'Lever Company 1', source: 'lever', companySlug: 'TODO-lever-company-slug' },

  // --- Personio (3) ---
  // Note: not every Personio account exposes the public XML feed used here.
  // If a fetch comes back empty/404 for one of these, that company likely
  // needs to move to `source: 'scrape'` instead.
  { name: 'Personio Company 1', source: 'personio', subdomain: 'TODO-personio-subdomain' },
  { name: 'Personio Company 2', source: 'personio', subdomain: 'TODO-personio-subdomain' },
  { name: 'Personio Company 3', source: 'personio', subdomain: 'TODO-personio-subdomain' },

  // --- Custom career pages, scraped with Playwright (3) ---
  // Add a matching module in src/sources/scrape/ for each (see companyA.js
  // template) and point `scraperModule` at its filename.
  { name: 'Scraped Company 1', source: 'scrape', scraperModule: 'companyA' },
  { name: 'Scraped Company 2', source: 'scrape', scraperModule: 'companyB' },
  { name: 'Scraped Company 3', source: 'scrape', scraperModule: 'companyC' },
];
