import express from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 5175;

app.use(express.json());
const staticDir = path.join(process.cwd(), 'client', 'dist');
app.use(express.static(staticDir));

const recipientEmail = process.env.CONTACT_RECEIVER_EMAIL || 'princembowana013@gmail.com';
const hasPlaceholderPassword =
  !process.env.SMTP_PASS || process.env.SMTP_PASS === 'REPLACE_WITH_GMAIL_APP_PASSWORD';

const mailTransport =
  process.env.SMTP_USER && !hasPlaceholderPassword
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT || 465),
        secure: String(process.env.SMTP_SECURE || 'true') === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      })
    : null;

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio server is running.' });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({
      ok: false,
      error: 'Please provide name, email, and message.'
    });
  }

  if (!mailTransport) {
    return res.status(500).json({
      ok: false,
      error: 'Email service is not configured. Add your Gmail App Password in server/.env (SMTP_PASS).'
    });
  }

  try {
    await mailTransport.sendMail({
      from: process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      to: recipientEmail,
      subject: `Portfolio Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New Portfolio Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `
    });

    return res.status(200).json({ ok: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Failed to send contact email:', error);
    if (error && (error.code === 'EAUTH' || error.responseCode === 535)) {
      return res.status(500).json({
        ok: false,
        error: 'Email authentication failed. Check SMTP_USER and Gmail App Password in server/.env.'
      });
    }

    return res.status(500).json({
      ok: false,
      error: 'Failed to send message. Please try again later.'
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
