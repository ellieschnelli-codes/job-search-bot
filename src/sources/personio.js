// Personio public XML recruiting feed. Not every Personio account exposes
// this — if it 404s or returns no <position> entries for a company you
// expect to have openings, move that company to `source: 'scrape'` in
// src/config/companies.js instead.

import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser();

export async function fetchJobs(company) {
  const res = await fetch(`https://${company.subdomain}.jobs.personio.com/xml`);
  if (!res.ok) {
    throw new Error(`Personio fetch failed for ${company.name}: ${res.status} ${res.statusText}`);
  }

  const xml = await res.text();
  const parsed = parser.parse(xml);
  const positions = parsed?.positions?.position ?? [];
  const list = Array.isArray(positions) ? positions : [positions];

  return list.map((position) => ({
    id: `personio:${company.subdomain}:${position.id}`,
    company: company.name,
    title: position.name,
    location: position.office ?? 'Not specified',
    url: `https://${company.subdomain}.jobs.personio.com/job/${position.id}`,
  }));
}
