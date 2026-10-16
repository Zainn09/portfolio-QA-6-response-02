import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/site";

/**
 * Per-page social share cards — /og?t=<title>&k=<kicker>
 *
 * Why a route instead of one static image: every page can share its own
 * branded card with its own headline, so a link to the checkout testing page
 * looks different from a link to the accessibility page. One renderer, no
 * committed binaries, and nothing to keep in sync with the branding.
 *
 * Text comes from query params, so lengths are clamped and the content is
 * drawn as text elements — there is no markup path from input to output.
 */

export const runtime = "nodejs";

const MAX_TITLE = 110;
const MAX_KICKER = 40;

/** Trim on a word boundary so a headline never ends mid-word. */
function clamp(value: string | null, max: number): string {
  if (!value) return "";
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = clamp(searchParams.get("t"), MAX_TITLE) || "Shopify QA Testing";
  const kicker = clamp(searchParams.get("k"), MAX_KICKER) || "QA Specialist";

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
            {kicker}
          </div>
        </div>

        <div
          style={{
            fontSize: title.length > 62 ? 58 : 72,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            maxWidth: "980px",
            display: "flex",
          }}
        >
          {title}
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
          <span>{SITE_URL.replace(/^https?:\/\//, "")}</span>
          <span style={{ width: 12, height: 12, backgroundColor: "#B7FF3C", display: "flex" }} />
          <span>Shopify QA, testing &amp; audits</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        // Cards are deterministic for a given title; cache hard at the edge.
        "Cache-Control": "public, max-age=3600, s-maxage=31536000, immutable",
      },
    }
  );
}
