// Candidate profile fed to the LLM judge (src/filter/llmJudge.js) to decide
// whether a given job posting is worth surfacing. Edit this freely as your
// search criteria evolve — it's the only place that should need tuning.

export const candidateProfile = `
Elena is a career changer with a strong B2B Customer Success background and
a genuine hands-on track record in AI and automation.

Location: based in Berlin, not willing to relocate. Roles must be either in
Berlin or fully remote within Europe.

Salary: minimum [Gehalt entfernt], flexible bis [Gehalt entfernt]. If a
posting doesn't mention salary at all, that's fine — do not filter it out
for missing salary information.

Looking for roles in these areas — job titles vary widely, so judge by what
the role actually does, not just the title:
- AI Enablement, AI Operations, AI Implementation, or anything that brings
  AI into organizations or helps teams work with AI tools.
- AI-native or hands-on Product Manager roles, junior/associate level (she
  has no formal PM experience).
- Technical Onboarding, Implementation Consultant, Solutions Engineer, or
  similar roles bridging a technical product and the customer — but only if
  the posting doesn't require 3+ years of that specific experience.
- "Builder" type roles that combine product thinking with hands-on
  execution.

Background:
- 2+ years of B2B Customer Success, managing 130+ enterprise clients with an
  89% renewal rate.
- At voiio: co-built an internal Slack AI bot with the product team, built
  Zapier automations, and developed an internal onboarding tool.
- Independently built real AI-powered tools: ownit (Node.js, Anthropic API,
  Google Calendar integration), n8n automation workflows, GitHub Actions
  pipelines, and a job search bot.
- Strong prompt engineering and LLM workflow experience.
- HubSpot user experience.
- Comfortable translating between business needs and technical systems.

Explicitly NOT a fit:
- Pure software engineering / backend developer roles.
- Pure sales or BDR roles.
- Roles explicitly requiring 3+ years of technical implementation experience.
- Roles with more than 3 mandatory office days per week.
- Roles outside Berlin or remote Europe.

When in doubt, mark as relevant — a false positive is better than a missed
opportunity. Pay special attention to postings that mention curiosity,
builder mindset, AI-native ways of working, cross-functional ownership, or
openness to non-traditional backgrounds, even if the title looks unfamiliar.

Bonus (note it, but never filter on it): the role mentions a dog-friendly
office, or the posting explicitly welcomes career changers.
`.trim();
