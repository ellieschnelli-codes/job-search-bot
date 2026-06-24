// Renders the digest of relevant jobs as HTML, grouped by company.

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

export function renderDigestHtml(jobsByCompany) {
  const companies = Object.keys(jobsByCompany).sort();

  const sections = companies
    .map((company) => {
      const rows = jobsByCompany[company]
        .map(
          (job) => `
        <li style="margin-bottom: 8px;">
          <a href="${escapeHtml(job.url)}">${escapeHtml(job.title)}</a>
          <span style="color: #666;"> — ${escapeHtml(job.location)}</span>
        </li>`
        )
        .join('');

      return `
      <h2 style="margin-top: 24px;">${escapeHtml(company)}</h2>
      <ul style="padding-left: 20px;">${rows}</ul>`;
    })
    .join('');

  return `
  <html>
    <body style="font-family: sans-serif; max-width: 640px;">
      <h1>New job postings</h1>
      ${sections}
    </body>
  </html>`;
}
