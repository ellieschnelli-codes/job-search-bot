// Lever public postings API — no auth required.
// Docs: https://github.com/lever/postings-api

export async function fetchJobs(company) {
  const res = await fetch(`https://api.lever.co/v0/postings/${company.companySlug}?mode=json`);
  if (!res.ok) {
    throw new Error(`Lever fetch failed for ${company.name}: ${res.status} ${res.statusText}`);
  }

  const postings = await res.json();

  return (postings ?? []).map((job) => ({
    id: `lever:${company.companySlug}:${job.id}`,
    company: company.name,
    title: job.text,
    location: job.categories?.location ?? 'Not specified',
    url: job.applyUrl ?? job.hostedUrl,
    description: job.descriptionPlain ?? '',
  }));
}
