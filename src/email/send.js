import nodemailer from 'nodemailer';

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 10_000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  });
}

export async function sendDigestEmail(html, jobCount) {
  const mail = {
    from: process.env.SMTP_USER,
    to: process.env.EMAIL_TO,
    subject: jobCount === 0 ? 'Job digest: nothing new today' : `Job digest: ${jobCount} new posting${jobCount === 1 ? '' : 's'}`,
    html,
  };

  let lastErr;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      // A fresh transport per attempt — retrying on the same connection
      // tends to reproduce the same stuck/dropped socket.
      await buildTransport().sendMail(mail);
      return;
    } catch (err) {
      lastErr = err;
      console.error(`[email] attempt ${attempt}/${MAX_ATTEMPTS} failed: ${err.message}`);
      if (attempt < MAX_ATTEMPTS) await sleep(RETRY_DELAY_MS * attempt);
    }
  }
  throw lastErr;
}
