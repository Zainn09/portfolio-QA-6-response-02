# DevTools — private dashboard & database console

`/devtools` is a private, admin-only control center for this site. It is a
real full-stack implementation over the app's actual stack — **PostgreSQL
via Drizzle ORM** — not a mockup, and every number on it is measured.

## What's inside

| Route | Purpose |
|---|---|
| `/devtools` | Overview: live counts, 30-day submission trends, DB latency, recent admin activity |
| `/devtools/database` | Database explorer: table list, columns/FKs/indexes, searchable paginated row grid, read-only SQL console, CSV/JSON export |
| `/devtools/forms` | Submissions manager: audit requests + contact messages, status workflow, internal notes, CSV export, delete |
| `/devtools/projects` | Manage the `projects` table (the case-study content model) |
| `/devtools/api` | API request log (method/path/status/duration — never headers or bodies) |
| `/devtools/errors` | Captured server errors with stack traces (admin-only view) |
| `/devtools/logs` | Administrative activity trail (who did what, when, from where) |
| `/devtools/health` | Measured app/DB/session health + deployment identifiers |
| `/devtools/analytics` | Honest status of analytics (see below — no invented metrics) |
| `/devtools/settings` | Schema-update runner, required env vars, security model |

The existing `/admin` (blog content editor) keeps working unchanged; it now
uses the same signed session.

## One-time setup

1. **Environment** (Vercel → Project → Settings → Environment Variables):
   - `DATABASE_URL` — already required by the site (see `docs/neon-setup.md`).
   - `ADMIN_SESSION_SECRET` — **new, required for production**.
     Generate with `openssl rand -hex 32`. Without it the dashboard fails
     closed in production (by design).
2. **Schema additions** (new tables + columns for the dashboard):
   - In-app: DevTools → Settings → **Apply schema updates**, or
   - Console: paste `drizzle/0001_devtools.sql` into your database SQL
     editor (it is idempotent — safe to run repeatedly).
   - Or: `npx drizzle-kit push --dialect postgresql --schema ./src/db/schema.ts --url "$DATABASE_URL"`.
3. Sign in at `/devtools/login` with the admin account from `admin_users`
   (the same account `/admin` uses).

## Security model

- **Signed sessions** (iron-session, AES+HMAC). The old unsigned JSON cookie
  is gone; a forged cookie no longer verifies.
- **Fail-closed**: no `ADMIN_SESSION_SECRET` in production → no page or API
  under `/devtools` works, and login returns 503 with instructions.
- **Server-side authorization** on every route handler and page; the UI
  never substitutes for it.
- **Rate-limited login** (10 attempts / 15 min / IP), success and failure
  recorded in the activity trail.
- **Read-only SQL console**: a single `SELECT` / `WITH` / `EXPLAIN`
  statement, keyword-guarded, run in a transaction with a 10 s timeout,
  capped at 500 rows. Every attempt — allowed or rejected — is logged.
- **Identifier safety**: table/column names are validated against the live
  `information_schema` catalog before use; all search values are bound
  parameters.
- **No secrets in responses**: env values are never returned;
  credential-shaped variable names aren't even listed.
- **Audit trail**: every login, status change, edit, delete, query run,
  export and migration is written to `admin_activity` with actor + IP.
- Destructive actions require an explicit confirmation dialog and leave a
  snapshot in the trail.

## Honest limitations

- **Public content is Git-served.** The public `/work` and blog pages read
  TS files in the repo; the `projects`/`blog_posts` tables are the content
  model but are not yet the source for public pages. Managing them in
  DevTools stores real database records; publishing them to the public site
  is a follow-up.
- **Analytics**: the site loads Vercel Analytics (browser-only; no data
  API), so the Analytics page states what is real and what would need
  adding instead of showing invented numbers.
- **Request/error logging** starts when this build is deployed — there is
  no historical traffic before that, and the dashboard says so.
- **Rate limiting** is per-server-instance (in-memory), not account-wide.
- **Uptime** on the health page is per server process (resets on serverless
  cold starts), not a service-level SLA metric.

## Testing

Pure-logic unit tests (SQL guard, CSV, rate limiter, session utilities) run
with `npx vitest run`. Database-dependent behavior is covered by the API
contracts above; run the app against your Neon instance to exercise it end
to end.
