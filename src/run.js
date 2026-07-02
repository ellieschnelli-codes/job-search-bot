import 'dotenv/config';
import { companies } from './config/companies.js';
import { fetchJobs as fetchAshbyJobs } from './sources/ashby.js';
import { fetchJobs as fetchGreenhouseJobs } from './sources/greenhouse.js';
import { fetchJobs as fetchLeverJobs } from './sources/lever.js';
import { fetchJobs as fetchPersonioJobs } from './sources/personio.js';
import { fetchJobs as fetchPersonioCareersJobs } from './sources/personioCareers.js';
import { fetchJobs as fetchHibobJobs } from './sources/hibob.js';
import { fetchDescription as fetchPersonioDescription } from './sources/personio.js';
import { getBrowser, closeBrowser } from './sources/scrape/browser.js';
import { loadSeenJobs, diffNewJobs, markSeen, saveSeenJobs } from './dedup/seenStore.js';
import { judgeJob } from './filter/llmJudge.js';
import { renderDigestHtml } from './email/render.js';
import { sendDigestEmail } from './email/send.js';

const DRY_RUN = process.env.DRY_RUN === 'true';
// Fetches and records every current posting as "seen" without judging or
// emailing anything. Run this once before turning on the schedule so the
// first real digest only contains postings that appear after that point,
// instead of every job all ~20 companies currently have open.
const SEED = process.env.SEED === 'true';

async function fetchCompanyJobs(company) {
  switch (company.source) {
    case 'ashby':
      return fetchAshbyJobs(company);
    case 'greenhouse':
      return fetchGreenhouseJobs(company);
    case 'lever':
      return fetchLeverJobs(company);
    case 'personio':
      return fetchPersonioJobs(company);
    case 'personioCareers':
      return fetchPersonioCareersJobs(company);
    case 'hibob':
      return fetchHibobJobs(company);
    case 'scrape': {
      const { scrape } = await import(`./sources/scrape/${company.scraperModule}.js`);
      const browser = await getBrowser();
      const page = await browser.newPage();
      try {
        return await scrape(page, company);
      } finally {
        await page.close();
      }
    }
    default:
      throw new Error(`Unknown source type "${company.source}" for ${company.name}`);
  }
}

// Most sources already include `description` for free in their bulk fetch.
// The ones that don't (Personio's XML feed, Odoo's scrape) need a per-job
// page fetch — done here, lazily, only for new jobs about to be judged, so
// already-seen jobs never pay for it.
async function enrichWithDescription(job) {
  if (job.description) return job;

  const [source, ...rest] = job.id.split(':');
  if (source === 'personio') {
    job.description = await fetchPersonioDescription(job);
  } else if (source === 'scrape') {
    const scraperModule = rest[0];
    const { fetchDescription } = await import(`./sources/scrape/${scraperModule}.js`);
    if (!fetchDescription) return job;
    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
      job.description = await fetchDescription(page, job);
    } finally {
      await page.close();
    }
  }
  // personio-careers has no accessible per-job description (its job pages
  // sit behind bot-detection that blocks headless browsers) — left blank.
  return job;
}

// GitHub Actions cron is UTC-only, so the workflow fires at both 06:00 and
// 07:00 UTC to cover both sides of Europe/Berlin's DST shift. Only the
// trigger that actually lands at 8am Berlin time should do real work — the
// other one no-ops. This guard only applies to the `schedule` event so
// manual `workflow_dispatch` runs and local dev runs are unaffected.
function isWrongDstTrigger() {
  if (process.env.GITHUB_EVENT_NAME !== 'schedule') return false;
  const berlinHour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Berlin',
      hour: 'numeric',
      hour12: false,
    }).format(new Date())
  );
  return berlinHour !== 8;
}

async function main() {
  console.log(`Starting run (${new Date().toISOString()})${DRY_RUN ? ' [DRY RUN]' : ''}`);

  if (isWrongDstTrigger()) {
    console.log('Skipping — this trigger does not land at 8am Europe/Berlin today; the other scheduled trigger handles it.');
    return;
  }

  // Isolate failures per company so one broken scraper or API outage
  // doesn't take down the whole run.
  const results = await Promise.allSettled(companies.map(fetchCompanyJobs));

  const allJobs = [];
  results.forEach((result, i) => {
    const company = companies[i];
    if (result.status === 'fulfilled') {
      console.log(`[ok] ${company.name}: ${result.value.length} posting(s)`);
      allJobs.push(...result.value);
    } else {
      console.error(`[FAILED] ${company.name}: ${result.reason.message}`);
    }
  });

  const seenMap = await loadSeenJobs();

  if (SEED) {
    await closeBrowser();
    markSeen(seenMap, allJobs);
    await saveSeenJobs(seenMap);
    console.log(`[seed] recorded ${allJobs.length} posting(s) as seen — no judging, no email`);
    return;
  }

  const newJobs = diffNewJobs(allJobs, seenMap);
  console.log(`${allJobs.length} total posting(s), ${newJobs.length} new`);

  for (const job of newJobs) {
    await enrichWithDescription(job);
  }
  await closeBrowser();

  // Only spend an LLM call on postings we haven't already evaluated.
  const relevantJobs = [];
  for (const job of newJobs) {
    const { relevant, reason } = await judgeJob(job);
    console.log(`[judge] ${relevant ? 'KEEP' : 'skip'} — ${job.company}: ${job.title} (${reason})`);
    if (relevant) relevantJobs.push(job);
  }

  const jobsByCompany = {};
  for (const job of relevantJobs) {
    (jobsByCompany[job.company] ??= []).push(job);
  }
  const html = renderDigestHtml(jobsByCompany);

  if (DRY_RUN) {
    console.log(`[dry run] would send email with ${relevantJobs.length} job(s)`);
  } else {
    await sendDigestEmail(html, relevantJobs.length);
    console.log(`Sent email with ${relevantJobs.length} job(s)`);
  }

  if (DRY_RUN) {
    console.log('[dry run] not writing seen_jobs.json');
  } else {
    // Mark every fetched job as seen, not just the relevant ones, so
    // jobs the judge correctly filtered out don't get re-evaluated
    // (and re-billed) on every future run.
    markSeen(seenMap, allJobs);
    await saveSeenJobs(seenMap);
    console.log('seen_jobs.json updated');
  }
}

main().catch((err) => {
  console.error('Run failed:', err);
  process.exit(1);
});
