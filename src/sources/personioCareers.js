// Personio (the HR software company) doesn't run its own careers page on
// its own ATS product — personio.jobs.personio.de only carries a single
// legacy posting. Their real careers page (personio.com/careers) is a
// custom-built site with its own JSON API, found by inspecting Wayback
// Machine snapshots since the live page sits behind a bot-detection wall
// that blocks headless browsers but, notably, not this API route.

export async function fetchJobs(company) {
  const res = await fetch('https://www.personio.com/api/careers/jobs/list/', {
    headers: { accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Personio careers fetch failed for ${company.name}: ${res.status} ${res.statusText}`);
  }

  const jobs = await res.json();

  return (jobs ?? []).map((job) => ({
    id: `personio-careers:${job.id}`,
    company: company.name,
    title: job.name,
    location: job.office ?? 'Not specified',
    url: `https://www.personio.com/careers/${job.id}/`,
  }));
}
