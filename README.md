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
- `/manager` — manager dashboard: summary stats (coverage failures, unresolved
  tickets, DOA swaps, billing anomalies, sign-off completion) plus filterable
  tables for both installs and tickets. Not linked from the tech home screen and
  has no access gate in this trial version — treat the URL as manager-only info.

## Deployment notes

- The app runs anywhere Node.js runs (`npm run build && npm run start`). `npm start`
  runs `prisma db push` before `next start`, so the SQLite schema is created/updated
  automatically on boot — no separate migration step needed for this trial setup.
- **SQLite caveat:** on serverless/ephemeral hosts (e.g. default Vercel deployments),
  the filesystem the db file lives on is not persistent across deploys/instances. For
  a short trial batch, run this on a small persistent host (a VPS, Render, Fly.io,
  Railway with a Volume — see below, or even a laptop on the same network as techs)
  so the SQLite file sticks around. If this graduates beyond the trial, swap
  `DATABASE_URL` in `.env` for a hosted Postgres/MySQL instance — the Prisma schema
  only needs a `provider` change plus a migration.
- Back up the SQLite file periodically (it's just a file) until a longer-term
  database is in place.

### Deploying to Railway

1. **New Project → Deploy from GitHub repo** → pick `brayden-t-cove/4gcivil2026` →
   select the `claude/4g-camera-trial-app-m3qn2a` branch (or whatever branch this
   merges into). Railway auto-detects the Next.js app via Nixpacks — no Dockerfile
   needed.
2. **Attach a Volume** (Service → Settings → Volumes) so the SQLite file survives
   redeploys/restarts — Railway's container filesystem is otherwise wiped on every
   deploy. Mount it at, e.g., `/data`.
3. **Set the `DATABASE_URL` variable** (Service → Variables) to point at a file
   inside that mounted volume:
   ```
   DATABASE_URL=file:/data/dev.db
   ```
4. **Generate a public URL**: Service → Settings → Networking → Generate Domain.
   You'll get a free `<something>.up.railway.app` URL — that's what you hand to
   techs (add it to the home screen as a PWA per the "Running locally" section
   above, same idea, just pointed at the Railway URL instead of localhost).
5. Deploy. Railway runs `npm install` (which also runs `prisma generate` via the
   `postinstall` script) → `npm run build` → `npm start` (which runs `prisma db push`
   against the volume, then starts the server).
6. Keep this service at **1 replica**. SQLite is a single file with file-level
   locking — it isn't safe to share across multiple concurrent replicas.

If you ever need to intentionally make a destructive schema change against data
already on the volume, `prisma db push` will refuse and ask for `--accept-data-loss`
— run that manually via `railway run` rather than baking it into the start script,
so a routine restart can never silently drop data.
