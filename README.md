# React Portfolio

A starter portfolio built with React, Vite, Node.js, HTML, and CSS.

## Structure

- `client/` — React front-end app
- `server/` — Express backend for deployment and API stub

## Scripts

- `npm install` — install root dependencies
- `npm run dev` — start client and server concurrently
- `npm run build` — build the React app for production
- `npm start` — start the deployed Node.js server after `npm run build`

## Development

1. `npm install`
2. `cd client && npm install`
3. `cd server && npm install`
4. `npm run dev`

## Contact Form Email Delivery

The contact form now sends messages through the backend API to your email inbox.

1. Copy `server/.env.example` to `server/.env`.
2. Keep `SMTP_USER` and `CONTACT_RECEIVER_EMAIL` as `princembowana013@gmail.com`.
3. Generate a Gmail App Password and paste it into `SMTP_PASS`.
4. In `server/`, run `npm install` to install email dependencies.
5. Restart `npm run dev`.

When someone submits the form, you will receive the message in your email and can reply directly to the sender.

## Notes

Replace the placeholder content in `client/src/App.jsx` and `client/src/styles.css` with your own projects, skills, and details.
