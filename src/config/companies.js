// Watchlist of companies to check on every run.
//
// `source` selects which module in src/sources/ handles the company:
//   - 'ashby'      -> needs `boardName` (find it in the URL: jobs.ashbyhq.com/{boardName})
//   - 'greenhouse' -> needs `boardToken` (find it in: boards.greenhouse.io/{boardToken})
//   - 'lever'      -> needs `companySlug` (find it in: jobs.lever.co/{companySlug})
//   - 'personio'   -> needs `subdomain` (find it in: {subdomain}.jobs.personio.com)
//   - 'hibob'      -> needs `companyIdentifier` (the subdomain prefix of {x}.careers.hibob.com)
//   - 'scrape'     -> needs `scraperModule`, matching a filename in src/sources/scrape/

export const companies = [
  // --- Ashby ---
  { name: 'Moss', source: 'ashby', boardName: 'moss' },
  { name: 'n8n', source: 'ashby', boardName: 'n8n' },
  { name: 'Kittl', source: 'ashby', boardName: 'kittl' },
  { name: 'Pleo', source: 'ashby', boardName: 'pleo' },
  { name: 'deepset', source: 'ashby', boardName: 'deepsetai' },
  { name: 'Leapsome', source: 'ashby', boardName: 'leapsome' },
  { name: 'Taxfix', source: 'ashby', boardName: 'taxfix.com' },
  { name: 'Hawk', source: 'ashby', boardName: 'hawk' },
  { name: 'Camunda', source: 'ashby', boardName: 'camunda' },
  { name: 'Aleph Alpha', source: 'ashby', boardName: 'AlephAlpha' },
  // Billie has no separate careers API of its own — its jobs page is
  // backed by Ashby (board name "billie"), found by inspecting its
  // network traffic, so it's listed here rather than under `scrape`.
  { name: 'Billie', source: 'ashby', boardName: 'billie' },

  // --- Greenhouse ---
  { name: 'Parloa', source: 'greenhouse', boardToken: 'parloa' },
  { name: 'Raisin', source: 'greenhouse', boardToken: 'raisin' },

  // --- Lever ---
  // Forto: the "forto" Lever slug 404s — their careers page has moved to a
  // custom WordPress site (careers.forto.com) with no confirmed API/scrape
  // target yet. Omitted until a working source is found.

  // --- Personio ---
  { name: 'Personio', source: 'personio', subdomain: 'personio' },
  { name: 'Merantix Momentum', source: 'personio', subdomain: 'merantix-momentum' },
  { name: 'Everphone', source: 'personio', subdomain: 'everphone' },

  // --- HiBob ---
  { name: 'HiBob', source: 'hibob', companyIdentifier: 'hibob-fa0ad69d0cb34a' },

  // --- Custom career pages, scraped with Playwright ---
  { name: 'Odoo', source: 'scrape', scraperModule: 'odoo' },
];
