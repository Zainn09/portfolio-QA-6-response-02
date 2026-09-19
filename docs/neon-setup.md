# Connecting the site to your Neon PostgreSQL

The app reads its database from the `DATABASE_URL` environment variable
(`src/db/index.ts`). The full schema lives in `src/db/schema.ts` and the
ready-to-run SQL is in `drizzle/0000_medical_stardust.sql`.

## Option A — create the schema from your machine (recommended)

```bash
npx drizzle-kit push --dialect postgresql --schema ./src/db/schema.ts \
  --url "postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
```

## Option B — paste the SQL into the Neon console

Open your Neon project → **SQL Editor** → paste the contents of
`drizzle/0000_medical_stardust.sql` → Run. This creates all five tables:
`admin_users`, `audit_requests`, `blog_posts`, `contact_messages`, `projects`.

## Point a deployment at Neon

Set `DATABASE_URL` in your hosting provider's env vars (Vercel → Project →
Settings → Environment Variables) to your Neon connection string, then deploy:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST/neondb?sslmode=require
```

Note: this sandbox's egress firewall blocks TLS to Neon, so the live preview
here runs against a local PostgreSQL instance instead — the schema and code
paths are identical, so a deployment using Neon needs no code changes.
