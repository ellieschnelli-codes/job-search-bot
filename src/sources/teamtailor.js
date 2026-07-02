// Teamtailor public JSON feed — no auth required.
// Each company exposes a standard JSON Feed at {subdomain}.teamtailor.com/jobs.json
// with Schema.org JobPosting data embedded in each item's _jobposting field.

import { stripHtml } from '../utils/html.js';

export async function fetchJobs(company) {
  const res = await fetch(`https://${company.subdomain}.teamtailor.com/jobs.json`);
  if (!res.ok) {
    throw new Error(`Teamtailor fetch failed for ${company.name}: ${res.status} ${res.statusText}`);
  }

  const { items } = await res.json();

  return (items ?? []).map((item) => {
    const jp = item._jobposting ?? {};
    const addr = jp.jobLocation?.[0]?.address ?? {};
    const location = [addr.addressLocality, addr.addressCountry].filter(Boolean).join(', ') || 'Not specified';

    return {
      id: `teamtailor:${company.subdomain}:${item.id}`,
      company: company.name,
      title: item.title,
      url: item.url,
      location,
      description: jp.description ? stripHtml(jp.description) : '',
    };
  });
}
