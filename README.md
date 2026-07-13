# job-search-bot

Fetches new job postings from a watchlist of companies (Ashby, Greenhouse,
Lever, Personio APIs + Playwright-scraped career pages), filters them with
Claude against a candidate profile, and emails an HTML digest of only the
relevant new postings — twice a week, Mondays and Wednesdays at 8am
Europe/Berlin, via a GitHub Actions scheduled workflow (no server to run
or pay for).

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in:
   - `ANTHROPIC_API_KEY` — used for the LLM relevance judge.
   - `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` — for sending the
     digest via nodemailer. If using Gmail, you need an
     [App Password](https://support.google.com/accounts/answer/185833), not
     your normal account password.
   - `EMAIL_TO` — where the digest gets sent.
3. Fill in `src/config/companies.js` with your real ~20 companies:
   - **Ashby**: `boardName` from `jobs.ashbyhq.com/{boardName}`.
   - **Greenhouse**: `boardToken` from `boards.greenhouse.io/{boardToken}`.
   - **Lever**: `companySlug` from `jobs.lever.co/{companySlug}`.
   - **Personio**: `subdomain` from `{subdomain}.jobs.personio.com`. Not
     every Personio account exposes the public XML feed this uses — if a
     company 404s, switch it to `source: 'scrape'` instead.
   - **Custom pages**: copy `src/sources/scrape/companyA.js` to a new file
     per company, fill in the real URL and CSS selectors for that page, and
     point `scraperModule` at the new filename in `companies.js`.
4. Edit `src/config/profile.js` to match your actual search criteria.

## Before turning on the schedule: seed run

The very first run would otherwise treat every current posting from every
company as "new" (since `data/seen_jobs.json` starts empty) and judge/email
all of them at once. Run the seed mode first — it fetches everything and
records it as seen, without calling the LLM judge or sending an email:

```
npm run seed
```

After that, the first real run will only see postings that appear after
this point.

## Running locally

```
npm start       # full run: fetch, judge, email, persist
npm run seed    # fetch + persist only, no judging, no email (see above)
npm run dry-run # fetch + judge only, no email, no persist (safe to test repeatedly)
```

## Running on a schedule (GitHub Actions)

1. Push this repo to GitHub.
2. In **Settings → Secrets and variables → Actions**, add:
   `ANTHROPIC_API_KEY`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`,
   `EMAIL_TO`.
3. The workflow at `.github/workflows/job-search.yml` runs automatically
   Mondays and Wednesdays. It schedules at both 06:00 and 07:00 UTC to cover
   Europe/Berlin's DST shift; `src/run.js`'s `isWrongDstTrigger()` check
   makes whichever trigger doesn't match the current DST offset a no-op, so
   you still only get one real run per day. This match is based on which
   cron fired, not the wall-clock hour at execution time, since GitHub
   Actions schedule triggers can land hours late — an hour-of-day check
   would then skip both triggers on a delayed day and drop the digest
   entirely.
4. After each run, the workflow commits the updated `data/seen_jobs.json`
   back to the repo — that's the persistence layer, no database needed.
5. You can trigger a run manually anytime from the Actions tab
   (`workflow_dispatch`) to sanity-check secrets and the Playwright install
   before trusting the cron schedule.

## Known rough edges

- The 3 scraper templates in `src/sources/scrape/` need real selectors
  filled in — they'll throw until you do. Selectors will also break
  whenever one of those companies redesigns their careers page; that's
  expected maintenance, not a bug.
- The LLM judge isn't perfectly deterministic on borderline postings —
  `console.log` output during a run shows each job's `reason` so you can
  sanity-check its calls.
- `data/seen_jobs.json` is a plain file with no locking — fine at
  twice-a-week usage from a single workflow, just don't run it manually in
  parallel with itself.
