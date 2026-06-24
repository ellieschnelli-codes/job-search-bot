// Ashby public job board API — no auth required.
// Docs: https://developers.ashbyhq.com/reference/jobpostingapi

export async function fetchJobs(company) {
  const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${company.boardName}`);
  if (!res.ok) {
    throw new Error(`Ashby fetch failed for ${company.name}: ${res.status} ${res.statusText}`);
  }

  const { jobs } = await res.json();

  return (jobs ?? []).map((job) => ({
    id: `ashby:${company.boardName}:${job.id}`,
    company: company.name,
    title: job.title,
    location: job.location ?? job.address?.postalAddress?.addressRegion ?? 'Not specified',
    url: job.applyUrl ?? job.jobUrl,
    description: job.descriptionPlain ?? '',
  }));
}
