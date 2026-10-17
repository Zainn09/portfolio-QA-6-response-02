-- 0001_devtools.sql
-- DevTools dashboard additions. Idempotent — safe to run multiple times.
-- Run this once against your database (Neon console → SQL Editor → paste → Run),
-- or use the in-app "Apply schema updates" action on the DevTools → Settings page
-- (admin sign-in required).

-- Administrative audit trail: who did what, when.
CREATE TABLE IF NOT EXISTS admin_activity (
  id serial PRIMARY KEY,
  actor_email varchar(255),
  action varchar(100) NOT NULL,
  target varchar(255),
  detail jsonb,
  ip varchar(64),
  created_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_activity_created_at_idx ON admin_activity (created_at DESC);
CREATE INDEX IF NOT EXISTS admin_activity_action_idx ON admin_activity (action);

-- API request logs (sanitized: method, path, status, duration — no headers, no bodies).
CREATE TABLE IF NOT EXISTS api_requests (
  id serial PRIMARY KEY,
  method varchar(10) NOT NULL,
  path varchar(255) NOT NULL,
  status integer NOT NULL,
  duration_ms integer,
  error text,
  created_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS api_requests_created_at_idx ON api_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS api_requests_path_idx ON api_requests (path);

-- Application errors captured by server routes.
CREATE TABLE IF NOT EXISTS app_errors (
  id serial PRIMARY KEY,
  source varchar(100) NOT NULL,
  severity varchar(20) DEFAULT 'error',
  message text NOT NULL,
  stack text,
  context jsonb,
  created_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS app_errors_created_at_idx ON app_errors (created_at DESC);

-- Form-submission workflow columns (additive, non-breaking).
ALTER TABLE audit_requests ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS status varchar(50) DEFAULT 'new';
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS notes text;
