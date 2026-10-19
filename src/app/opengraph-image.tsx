import { ImageResponse } from "next/og";

/**
 * Default social share card, generated at build time.
 *
 * Next.js wires this file into `<meta property="og:image">` for every route
 * that doesn't declare its own image, so links shared to X, LinkedIn, Slack
 * or WhatsApp render as a branded card instead of a bare URL. Generated
 * rather than committed as a binary so it can never drift from the brand.
 */

export const alt = "QA Specialist — Shopify & Shopify Plus Quality Assurance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#F5F3ED",
          color: "#111310",
          padding: "64px 72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: 56, height: 8, backgroundColor: "#B7FF3C" }} />
          <div
            style={{
              fontSize: 24,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#4A4F45",
            }}
          >
            QA Specialist
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: 78,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: "960px",
            }}
          >
            I find what your store gets wrong before your customers do.
          </div>
          <div style={{ fontSize: 30, color: "#4A4F45", maxWidth: "820px" }}>
            100+ Shopify stores tested · Checkout, responsive, accessibility &amp; performance QA
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 22,
            color: "#4A4F45",
          }}
        >
          <span>abdulrehman-qa.vercel.app</span>
          {/* Drawn as a box, not a glyph — the default font has no "■". */}
          <span
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#B7FF3C",
              display: "flex",
            }}
          />
          <span>Case studies &amp; blog</span>
        </div>
      </div>
    ),
    size
  );
}
