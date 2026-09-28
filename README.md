# Project Tracker

One dashboard to track every project you've built — where it's hosted, which
account it lives under, which database it uses, and every other small detail
that's easy to forget across 4-5 different accounts (Render, Firebase,
Vercel, etc).

## What it tracks per project

- Basics: name, description, category, tech stack, status, priority, tags
- Repo & live URL, custom domain
- Hosting: provider, account email, account label, service name, plan, region, deploy branch
- Database/backend: provider, type, account email, connection notes
- DNS: provider, account email
- Environment variables: **only where they live and their names** (never store actual secret values here)
- Monitoring: provider, account email
- Free-form notes
- **Custom fields** — add any extra detail per project on the fly

Plus a separate **Accounts** registry: a simple table of every service +
email/login you use, so you always know which account a project belongs to.

## Stack

- Node.js + Express (backend/API)
- MongoDB + Mongoose (database)
- Plain HTML/CSS/JS frontend (no build step)

## Local setup

```bash
npm install
cp .env.example .env   # then put your MongoDB connection string in MONGO_URI
npm start
```

Open http://localhost:3000

## Deploying on Render

1. Push this repo to GitHub.
2. On Render: New → Web Service → connect this repo.
3. Render will detect `render.yaml`. Build command `npm install`, start command `npm start`.
4. Add the `MONGO_URI` environment variable in Render's dashboard (Environment tab) — get this from your MongoDB Atlas cluster's "Connect" button.
5. Deploy. Render gives you a live URL — add that project entry into this very tracker once it's up (meta, but useful).

## MongoDB setup (free tier)

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Database Access → add a user with a password.
3. Network Access → allow access from anywhere (0.0.0.0/0) so Render can connect.
4. Connect → Drivers → copy the connection string → put it in `MONGO_URI`.

## Security note

This app intentionally does **not** store actual secrets/passwords — only
references to where they're stored (e.g. "Render dashboard → Environment").
If you later want to store real secrets here, put that behind proper
authentication first.
