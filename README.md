# Luna 4G PTZ Trial Tracker

A mobile-first field app for Alder techs on the Luna 4G Solar PTZ camera trial batch
(control batch, per `Luna_4G_PTZ_Install_Guide_v2`). Techs use it to:

- Log a **Trial Install Record** for each customer's 1-year trial install (pre-install
  checklist, site test result, mounting method, pairing/subscription, final sign-off).
- Log a **Failure / DOA Ticket** for any setup issue (DOA unit, coverage failure,
  connectivity/registration issue, billing anomaly, event-detection failure, etc.) —
  matches the SOP's Section 8 troubleshooting categories.

This is intentionally lightweight, matching the SOP's framing that this is a trial
batch and not yet full production infrastructure.

## Stack

- **Next.js (App Router) + TypeScript + Tailwind CSS** — mobile-first UI, installable
  as a home-screen PWA (see `public/manifest.json`).
- **Prisma + SQLite** — a single-file database (`dev.db`), no external DB service
  required to run this for a trial batch.

## Running locally

```bash
npm install
cp .env.example .env
npx prisma db push   # creates/updates dev.db from prisma/schema.prisma
npm run dev
```

Open http://localhost:3000. On a phone, open the URL in the browser and use
"Add to Home Screen" to install it as an app icon.

## Data model

See `prisma/schema.prisma` for the full field list. Two tables:

- `TrialInstall` — one row per completed (or in-progress) customer install.
- `FailureTicket` — one row per DOA/failure/troubleshooting event, including
  coverage failures found during the pre-install site test (before any customer
  install happens).

Both records capture a free-text **tech name or employee badge #** field for
accountability — there's no login/auth in this trial version.

## Viewing submitted records

- `/records/installs` — all trial install records, newest first.
- `/records/tickets` — all failure/DOA tickets, newest first.

These are read-only list views for the trial; there's no manager dashboard/filtering
yet — start there if/when this expands past the control batch.

## Deployment notes

- The app runs anywhere Node.js runs (`npm run build && npm run start`).
- **SQLite caveat:** on serverless/ephemeral hosts (e.g. default Vercel deployments),
  the filesystem `dev.db` lives on is not persistent across deploys/instances. For a
  short trial batch, run this on a small persistent host (a VPS, Render, Fly.io, or
  even a laptop on the same network as techs) so `dev.db` sticks around. If this
  graduates beyond the trial, swap `DATABASE_URL` in `.env` for a hosted Postgres/MySQL
  instance — the Prisma schema only needs a `provider` change plus a migration.
- Back up `dev.db` periodically (it's just a file) until a longer-term database is in
  place.
