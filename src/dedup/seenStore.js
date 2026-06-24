import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const STORE_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../data/seen_jobs.json'
);

export async function loadSeenJobs() {
  const raw = await readFile(STORE_PATH, 'utf-8');
  return JSON.parse(raw);
}

export function diffNewJobs(jobs, seenMap) {
  return jobs.filter((job) => !(job.id in seenMap));
}

export function markSeen(seenMap, jobs) {
  const now = new Date().toISOString();
  for (const job of jobs) {
    if (!(job.id in seenMap)) {
      seenMap[job.id] = {
        firstSeenAt: now,
        company: job.company,
        title: job.title,
      };
    }
  }
  return seenMap;
}

export async function saveSeenJobs(seenMap) {
  await writeFile(STORE_PATH, JSON.stringify(seenMap, null, 2) + '\n', 'utf-8');
}
