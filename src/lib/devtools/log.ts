import { db } from "@/db";
import { adminActivity, apiRequests, appErrors } from "@/db/schema";

/**
 * DevTools telemetry writers.
 *
 * Every write is fire-and-forget: telemetry must never break the request it
 * is observing, so failures are swallowed (and console.warn'd in dev).
 * Nothing sensitive (headers, bodies, credentials, cookies) is ever passed
 * to these helpers by the calling routes.
 */

function ipOf(req: { headers: { get(name: string): string | null } }): string | null {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim().slice(0, 64) || null;
  return null;
}

export function getIp(req: Parameters<typeof ipOf>[0]): string | null {
  return ipOf(req);
}

export function recordActivity(
  actorEmail: string | null,
  action: string,
  target?: string,
  detail?: Record<string, unknown>,
  ip?: string | null,
): void {
  db.insert(adminActivity)
    .values({
      actorEmail: actorEmail ? actorEmail.slice(0, 255) : null,
      action: action.slice(0, 100),
      target: target ? target.slice(0, 255) : undefined,
      detail: detail && Object.keys(detail).length > 0 ? detail : undefined,
      ip: ip ? ip.slice(0, 64) : null,
    })
    .catch((err) => {
      if (process.env.NODE_ENV !== "production") console.warn("[devtools] activity log failed:", err);
    });
}

export function recordApiRequest(
  method: string,
  path: string,
  status: number,
  durationMs?: number,
  error?: string,
): void {
  db.insert(apiRequests)
    .values({
      method: method.slice(0, 10),
      path: path.slice(0, 255),
      status,
      durationMs: durationMs === undefined ? undefined : Math.max(0, Math.min(600_000, Math.round(durationMs))),
      error: error ? error.slice(0, 2000) : undefined,
    })
    .catch((err) => {
      if (process.env.NODE_ENV !== "production") console.warn("[devtools] api log failed:", err);
    });
}

export function recordError(
  source: string,
  message: string,
  stack?: string,
  context?: Record<string, unknown>,
  severity: "error" | "warn" = "error",
): void {
  db.insert(appErrors)
    .values({
      source: source.slice(0, 100),
      severity,
      message: message.slice(0, 4000),
      stack: stack ? stack.slice(0, 8000) : undefined,
      context: context && Object.keys(context).length > 0 ? context : undefined,
    })
    .catch((err) => {
      if (process.env.NODE_ENV !== "production") console.warn("[devtools] error log failed:", err);
    });
}
