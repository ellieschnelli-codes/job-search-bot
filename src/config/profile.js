// Candidate profile fed to the LLM judge (src/filter/llmJudge.js) to decide
// whether a given job posting is worth surfacing. Edit this freely as your
// search criteria evolve — it's the only place that should need tuning.

export const candidateProfile = `
Looking for roles in: customer-facing implementation, onboarding, customer
success engineering, or AI enablement (e.g. helping customers adopt AI
products, internal AI tooling/enablement, technical onboarding/solutions
roles that involve both customer interaction and hands-on technical work).

Location: Berlin, elsewhere in the DACH region (Germany/Austria/Switzerland),
or fully remote (ideally Europe-friendly hours).

Explicitly NOT a fit:
- Pure software engineering roles (e.g. "Backend Engineer", "Software
  Engineer", "SDE") with no customer-facing or implementation component.
- Pure sales roles (e.g. "Account Executive", "SDR/BDR", "Sales
  Development Representative") with no technical/implementation component.

When in doubt, prefer roles that blend technical depth with direct customer
interaction over roles that are purely one or the other.
`.trim();
