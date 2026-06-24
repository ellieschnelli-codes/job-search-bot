// Personio public XML recruiting feed. Not every Personio account exposes
// this — if it 404s or returns no <position> entries for a company you
// expect to have openings, move that company to `source: 'scrape'` in
// src/config/companies.js instead.

import { XMLParser } from 'fast-xml-parser';
import { stripHtml } from '../utils/html.js';

const parser = new XMLParser();

export async function fetchJobs(company) {
  const res = await fetch(`https://${company.subdomain}.jobs.personio.com/xml`);
  if (!res.ok) {
    throw new Error(`Personio fetch failed for ${company.name}: ${res.status} ${res.statusText}`);
  }

  const xml = await res.text();
  const parsed = parser.parse(xml);
  const positions = parsed?.['workzag-jobs']?.position ?? [];
  const list = Array.isArray(positions) ? positions : [positions];

  return list.map((position) => ({
    id: `personio:${company.subdomain}:${position.id}`,
    company: company.name,
    title: position.name,
    location: position.office ?? 'Not specified',
    url: `https://${company.subdomain}.jobs.personio.com/job/${position.id}`,
  }));
}

// The XML feed above doesn't include the job description — only the job's
// own hosted page does, embedded as schema.org JobPosting JSON-LD. Fetched
// lazily (only for new jobs, right before judging) rather than from
// `fetchJobs`, so already-seen jobs don't pay for an extra request.
export async function fetchDescription(job) {
  const res = await fetch(job.url);
  if (!res.ok) return '';

  const html = await res.text();
  const match = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) return '';

  try {
    return stripHtml(JSON.parse(match[1]).description ?? '');
  } catch {
    return '';
  }
}
