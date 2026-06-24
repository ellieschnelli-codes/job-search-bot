import nodemailer from 'nodemailer';

export async function sendDigestEmail(html, jobCount) {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transport.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.EMAIL_TO,
    subject: `Job digest: ${jobCount} new posting${jobCount === 1 ? '' : 's'}`,
    html,
  });
}
