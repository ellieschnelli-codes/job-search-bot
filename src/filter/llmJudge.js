import Anthropic from '@anthropic-ai/sdk';
import { candidateProfile } from '../config/profile.js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const JUDGMENT_TOOL = {
  name: 'submit_judgment',
  description: 'Submit the relevance judgment for this job posting.',
  input_schema: {
    type: 'object',
    properties: {
      relevant: { type: 'boolean' },
      reason: { type: 'string', description: 'One sentence explaining the decision.' },
    },
    required: ['relevant', 'reason'],
  },
};

// Descriptions vary wildly in length (some scraped pages include unrelated
// boilerplate); cap what we send so one verbose posting doesn't blow up
// token usage or push out the more decision-relevant fields.
const MAX_DESCRIPTION_CHARS = 4000;

// Evaluates a single normalized job against the candidate profile and
// returns { relevant, reason }. Called once per new (not-yet-seen) job.
export async function judgeJob(job) {
  const description = (job.description ?? '').slice(0, MAX_DESCRIPTION_CHARS);
  const descriptionBlock = description
    ? `\n\nDescription:\n${description}`
    : '\n\n(No description available for this posting — judge on title, company, and location alone.)';

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    system: `You are screening job postings for a candidate against their profile. Decide if this posting is worth surfacing.\n\nCandidate profile:\n${candidateProfile}`,
    messages: [
      {
        role: 'user',
        content: `Company: ${job.company}\nTitle: ${job.title}\nLocation: ${job.location}${descriptionBlock}\n\nIs this job relevant to the candidate's profile? Call submit_judgment with your decision.`,
      },
    ],
    tools: [JUDGMENT_TOOL],
    tool_choice: { type: 'tool', name: 'submit_judgment' },
  });

  const toolUse = message.content.find((block) => block.type === 'tool_use');
  return toolUse.input;
}
