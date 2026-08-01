# React Portfolio

A portfolio built with React, Vite, Node.js, HTML, and CSS.

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

## Contact Form Behavior

- In local development, the form posts to `/api/contact` on the Node server.
- In production, the form posts to Netlify Forms for fast delivery without a custom backend.

### Local Email Setup (Development)

1. Copy `server/.env.example` to `server/.env`.
2. Set `SMTP_USER`, `SMTP_PASS`, and `CONTACT_RECEIVER_EMAIL`.
3. In `server/`, run `npm install`.
4. Run `npm run dev` from the project root.

### Netlify Setup (Production)

1. Push this repository to GitHub.
2. In Netlify, create a new site from the repository.
3. Build settings are preconfigured by `netlify.toml`:
	- Build command: `npm run build --prefix client`
	- Publish directory: `client/dist`
4. Deploy the site.
5. Open Netlify dashboard > Forms to confirm the form `portfolio-contact` is detected.
6. Add email notifications in Netlify dashboard:
	- Site settings > Forms > Form notifications > Add notification > Email.

When a user clicks Send Message on the deployed site, submission goes to Netlify Forms and you receive notifications using your configured Netlify form notification channels.

## Notes

Replace the placeholder content in `client/src/App.jsx` and `client/src/styles.css` with your own projects, skills, and details.
