// Greenhouse public job board API — no auth required.
// Docs: https://developers.greenhouse.io/job-board.html

import { stripHtml } from '../utils/html.js';

export async function fetchJobs(company) {
  const res = await fetch(
    `https://boards-api.greenhouse.io/v1/boards/${company.boardToken}/jobs?content=true`
  );
  if (!res.ok) {
    throw new Error(`Greenhouse fetch failed for ${company.name}: ${res.status} ${res.statusText}`);
  }

  const { jobs } = await res.json();

  return (jobs ?? []).map((job) => ({
    id: `greenhouse:${company.boardToken}:${job.id}`,
    company: company.name,
    title: job.title,
    location: job.location?.name ?? 'Not specified',
    url: job.absolute_url,
    description: stripHtml(job.content),
  }));
}
