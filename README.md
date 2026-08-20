# Luna 4G PTZ Trial Tracker

A mobile-first field app for Alder techs on the Luna 4G Solar PTZ camera trial batch
(control batch, per `Luna_4G_PTZ_Install_Guide_v2`). Techs use it to:

- Log a **Trial Install Record** for each customer's 1-year trial install — just
  enough (tech, Pando account #, customer's Luna email, success/fail, notes) for
  Bossman to transfer the dealer account from the Luna database to the Alder
  database. It's intentionally quick (under a minute); the detailed install steps
  live on the separate install tech ticket techs already fill out.
- Log a **Failure / DOA Ticket** for any setup issue (DOA unit, coverage failure,
  connectivity/registration issue, billing anomaly, event-detection failure, etc.) —
  matches the SOP's Section 8 troubleshooting categories.

This is intentionally lightweight, matching the SOP's framing that this is a trial
batch and not yet full production infrastructure.

## Stack

- **Next.js (App Router) + TypeScript + Tailwind CSS** — mobile-first UI, installable
  as a home-screen PWA (see `public/manifest.json`).
- **Prisma + PostgreSQL** — needs a Postgres database reachable via `DATABASE_URL`
  (a local Postgres for dev, a managed one like Railway's Postgres plugin in
  production). Handles multiple techs writing at the same time, which a single
  SQLite file doesn't do well.

## Running locally

```bash
npm install
cp .env.example .env   # point DATABASE_URL at a local Postgres instance
npx prisma db push     # creates/updates tables from prisma/schema.prisma
npm run dev
```

Open http://localhost:3000. On a phone, open the URL in the browser and use
"Add to Home Screen" to install it as an app icon.

## Data model

See `prisma/schema.prisma` for the full field list. Two tables:

- `TrialInstall` — one row per completed customer install: tech name/employee ID,
  Pando account number, customer's Luna account email, whether setup/install was
  successful, whether the account needs publishing (and when it was published),
  and free-text notes.
- `FailureTicket` — one row per DOA/failure/troubleshooting event, including
  coverage failures found during the pre-install site test (before any customer
  install happens).

Both records capture a free-text **tech name or employee ID** field for
accountability — there's no login/auth in this trial version.

## Viewing submitted records

- `/records/installs` — all trial install records, newest first. Each record's
  "needs publishing" flag is editable right here: flag it, un-flag it, or mark
  it published, without needing to go to `/publish`. Other fields are read-only
  on this page.
- `/records/tickets` — all failure/DOA tickets, newest first.
- `/manager` — manager dashboard: summary stats (unsuccessful setups, pending
  publish, unresolved tickets, DOA swaps, billing anomalies) plus filterable
  tables for both installs and tickets. Not linked from the tech home screen and
  has no access gate in this trial version — treat the URL as manager-only info.
- `/publish` — publish queue: every install flagged "Account needs publishing"
  that hasn't been marked published yet, oldest first. Whoever's doing the actual
  Luna → Alder account transfer (Bossman) works through this list and clicks
  "Mark published" on each one as they go, which removes it from the queue.
  There's a manual Refresh button, and the queue re-reads from the database on
  every page load — new "needs publishing" installs from techs in the field show
  up automatically the next time it's opened or refreshed. Also linked from the
  manager dashboard's "Pending publish" stat.

## Deployment notes

The app runs anywhere Node.js runs (`npm run build && npm run start`). `npm start`
runs `prisma db push` before `next start`, so tables are created/updated
automatically on boot — no separate migration step needed for this trial setup.
It needs a real Postgres database reachable via `DATABASE_URL`; there's no
local-file fallback.

### Deploying to Railway

1. **New Project → Deploy from GitHub repo** → pick `brayden-t-cove/4gcivil2026` →
   select the `claude/4g-camera-trial-app-m3qn2a` branch (or whatever branch this
   merges into). Railway auto-detects the Next.js app via Nixpacks — no Dockerfile
   needed.
2. **Add a Postgres database**: in the project canvas, **New → Database →
   Add PostgreSQL**. This creates a separate Postgres service in the same project
   (no Volumes setup needed — Railway manages that database's storage itself).
3. **Set the `DATABASE_URL` variable on the app service** (not the Postgres
   service): Service → Variables → New Variable, then use the variable reference
   picker to point it at the Postgres service's connection string (something like
   `${{Postgres.DATABASE_URL}}`, exact name depends on what the Postgres service
   is called) instead of retyping the credentials.
4. **Generate a public URL**: on the app service, Settings → Networking →
   Generate Domain. You'll get a free `<something>.up.railway.app` URL — that's
   what you hand to techs (add it to the home screen as a PWA per the "Running
   locally" section above, same idea, just pointed at the Railway URL instead of
   localhost).
5. Deploy. Railway runs `npm install` (which also runs `prisma generate` via the
   `postinstall` script) → `npm run build` → `npm start` (which runs `prisma db push`
   against the Postgres service, then starts the server).

Unlike SQLite, Postgres handles multiple concurrent writers fine, so this doesn't
need to be pinned to a single replica.
