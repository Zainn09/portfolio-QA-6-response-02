"use client";

import React from "react";
import Link from "next/link";
import { Kv } from "@/components/devtools/ui";

/**
 * Analytics — honest by design.
 *
 * The public site loads the Vercel Analytics browser snippet, but Vercel
 * Analytics has no API that returns page-view data to the application, so
 * this page deliberately does not invent numbers. It states exactly what
 * is measured, where to look, and what would need to be added to make
 * in-dashboard analytics real.
 */
export function AnalyticsPanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="dt-alert warn" role="status">
        <div style={{ flex: 1, fontSize: 12.5 }}>
          <strong>No in-dashboard traffic metrics are available yet.</strong> The site collects Vercel Analytics in the browser, but
          that data is only viewable in the Vercel dashboard — there is no server-side analytics store on this app. Rather than show
          invented numbers, this page lists what is real today and what it would take to add the rest.
        </div>
      </div>

      <div className="dt-grid cols-2" style={{ alignItems: "start" }}>
        <div className="dt-card">
          <h3>Measured today</h3>
          <Kv
            rows={[
              ["Client page views", "Vercel Analytics snippet (view in Vercel dashboard → Analytics)"],
              ["Audit form conversion", "count of audit_requests rows — see the Overview and Submissions pages"],
              ["Contact form conversion", "count of contact_messages rows — see the Overview and Submissions pages"],
              ["API traffic", "per-endpoint request log — see the API monitor page"],
              ["Errors", "captured server errors — see the Errors page"],
            ]}
          />
        </div>

        <div className="dt-card">
          <h3>Not yet configured</h3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "var(--dt-text-dim)", lineHeight: 1.9 }}>
            <li>Popular routes and traffic trends — would need a first-party pageview log (privacy-conscious, no personal data).</li>
            <li>Device / browser categories — same, with coarse user-agent classes only.</li>
            <li>Campaign referrals — same, using the URL referrer only.</li>
            <li>Visitor identity — intentionally not collected; the design goal is aggregate, privacy-conscious metrics.</li>
          </ul>
          <p style={{ fontSize: 12, color: "var(--dt-text-faint)", marginTop: 14, marginBottom: 0, lineHeight: 1.6 }}>
            If you want these, the shape is a small <span className="mono">/api/analytics/pageview</span> endpoint plus a pageview
            table — say the word and it is a follow-up commit.
          </p>
        </div>
      </div>

      <p style={{ fontSize: 12, color: "var(--dt-text-faint)", margin: 0, lineHeight: 1.7 }}>
        Related: the public site already reports to Vercel Analytics — open{" "}
        <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" style={{ color: "var(--dt-accent)" }}>
          the Vercel dashboard
        </a>{" "}
        for the live pageview numbers, and use <Link href="/devtools/forms" style={{ color: "var(--dt-accent)" }}>
          Submissions
        </Link>{" "}
        for the conversion-relevant counts that live in your database.
      </p>
    </div>
  );
}
