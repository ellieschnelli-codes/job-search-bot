// HiBob careers JSON API. Undocumented but public — requires the
// `companyidentifier` header (the subdomain prefix of the careers site),
// otherwise it 401s. No browser/Playwright needed.

import { stripHtml } from '../utils/html.js';

export async function fetchJobs(company) {
  const res = await fetch(
    `https://${company.companyIdentifier}.careers.hibob.com/api/job-ad`,
    { headers: { companyidentifier: company.companyIdentifier, accept: 'application/json' } }
  );
  if (!res.ok) {
    throw new Error(`HiBob fetch failed for ${company.name}: ${res.status} ${res.statusText}`);
  }

  const { jobAdDetails } = await res.json();

  return (jobAdDetails ?? []).map((job) => ({
    id: `hibob:${company.companyIdentifier}:${job.id}`,
    company: company.name,
    title: job.title,
    location: job.country ?? job.site ?? 'Not specified',
    url: `https://${company.companyIdentifier}.careers.hibob.com/jobs/${job.id}`,
    description: stripHtml(
      [job.description, job.requirements, job.responsibilities].filter(Boolean).join('\n\n')
    ),
  }));
}
