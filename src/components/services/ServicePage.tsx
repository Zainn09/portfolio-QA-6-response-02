import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceBySlug } from "@/data/services";
import type { ServiceBlock, ServicePageContent } from "@/data/services/types";
import { SITE_URL, absoluteUrl } from "@/lib/site";

/* ─── Shared primitives, matching the site's existing patterns ──────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.625rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--accent)",
        fontWeight: 700,
        marginBottom: "0.75rem",
      }}
    >
      {children}
    </p>
  );
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} style={{ letterSpacing: "-0.03em", margin: "0 0 1rem", scrollMarginTop: "calc(var(--nav-height) + 1.5rem)" }}>
      {children}
    </h2>
  );
}

function SectionIntro({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "1.0625rem", lineHeight: 1.75, color: "var(--text-secondary)", maxWidth: "52rem", margin: "0 0 2rem" }}>
      {children}
    </p>
  );
}

function Block({ block, index }: { block: ServiceBlock; index: number }) {
  const id = `s-${index}`;

  switch (block.type) {
    case "prose":
      return (
        <section style={{ marginBottom: "3.5rem" }}>
          {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
          <SectionHeading id={id}>{block.heading}</SectionHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.125rem", maxWidth: "56rem" }}>
            {block.paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize: "1.0625rem", lineHeight: 1.8, color: "var(--text-secondary)" }}>
                {p}
              </p>
            ))}
          </div>
        </section>
      );

    case "cards": {
      const cols = block.columns ?? 3;
      return (
        <section style={{ marginBottom: "3.5rem" }}>
          {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
          <SectionHeading id={id}>{block.heading}</SectionHeading>
          {block.intro && <SectionIntro>{block.intro}</SectionIntro>}
          <div className={`service-grid cols-${cols}`}>
            {block.cards.map((c, i) => (
              <Reveal key={c.title} delay={Math.min(i, 5) * 60} className="service-card">
                <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, marginBottom: "0.5rem" }}>{c.title}</h3>
                <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>{c.text}</p>
              </Reveal>
            ))}
          </div>
        </section>
      );
    }

    case "steps":
      return (
        <section style={{ marginBottom: "3.5rem" }}>
          {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
          <SectionHeading id={id}>{block.heading}</SectionHeading>
          {block.intro && <SectionIntro>{block.intro}</SectionIntro>}
          <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", counterReset: "step" }}>
            {block.steps.map((s, i) => (
              <Reveal key={s.title} delay={Math.min(i, 5) * 50}>
                <li
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "1.25rem",
                    alignItems: "start",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    backgroundColor: "var(--bg-surface)",
                    padding: "1.25rem 1.5rem",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      paddingTop: "0.2rem",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, marginBottom: "0.375rem" }}>{s.title}</h3>
                    <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>{s.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>
      );

    case "checklist":
      return (
        <section style={{ marginBottom: "3.5rem" }}>
          {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
          <SectionHeading id={id}>{block.heading}</SectionHeading>
          {block.intro && <SectionIntro>{block.intro}</SectionIntro>}
          <ul className="service-list">
            {block.items.map((item) => (
              <li key={item.title} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span aria-hidden="true" style={{ color: "var(--accent)", fontWeight: 700, lineHeight: 1.7 }}>
                  ▸
                </span>
                <span style={{ fontSize: "1rem", lineHeight: 1.75, color: "var(--text-secondary)" }}>
                  <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>{item.title}</strong>
                  {item.text ? ` — ${item.text}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      );

    case "table":
      return (
        <section style={{ marginBottom: "3.5rem" }}>
          {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
          <SectionHeading id={id}>{block.heading}</SectionHeading>
          {block.intro && <SectionIntro>{block.intro}</SectionIntro>}
          <div className="service-table-wrap">
            <table className="service-table">
              <thead>
                <tr>
                  {block.headers.map((h) => (
                    <th key={h} scope="col">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) =>
                      j === 0 ? (
                        <th key={j} scope="row">{cell}</th>
                      ) : (
                        <td key={j}>{cell}</td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );

    case "callout":
      return (
        <Reveal>
          <aside
            style={{
              margin: "0 0 3.5rem",
              border: "1px solid var(--accent)",
              borderLeftWidth: "4px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--accent-muted)",
              padding: "1.5rem 1.75rem",
            }}
          >
            <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, marginBottom: "0.5rem" }}>{block.heading}</h3>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.75, color: "var(--text-secondary)" }}>{block.text}</p>
          </aside>
        </Reveal>
      );

    case "links":
      return (
        <section style={{ marginBottom: "3.5rem" }}>
          {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
          <SectionHeading id={id}>{block.heading}</SectionHeading>
          {block.intro && <SectionIntro>{block.intro}</SectionIntro>}
          <div className="service-grid cols-3">
            {block.items.map((l, i) => (
              <Reveal key={l.href + l.label} delay={Math.min(i, 5) * 60} className="service-card">
                <Link href={l.href} style={{ display: "block", textDecoration: "none" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                    {l.label}
                  </h3>
                  <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                    {l.text}
                  </p>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.5625rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      color: "var(--accent)",
                    }}
                  >
                    Read more →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      );
  }
}

/* ─── The page ───────────────────────────────────────────────────────────── */

export function ServicePage({ content }: { content: ServicePageContent }) {
  const url = absoluteUrl(`/${content.slug}`);
  const related = content.related
    .map((slug) => serviceBySlug.get(slug))
    .filter((s): s is ServicePageContent => Boolean(s));

  // Service schema, wired into the site-wide entity graph by @id so Google
  // reads this page as part of one organisation, not a standalone document.
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: content.schemaName,
    description: content.schemaDescription,
    url,
    serviceType: content.serviceType,
    provider: { "@id": `${SITE_URL}/#person` },
    areaServed: { "@type": "Place", name: "Worldwide" },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/ecommerce-qa-testing") },
      { "@type": "ListItem", position: 3, name: content.crumb, item: url },
    ],
  };

  // FAQPage only ever mirrors the FAQ block that is visible further down.
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <JsonLd data={[serviceLd, breadcrumbsLd, faqLd]} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: "calc(var(--nav-height) + 3.5rem)",
          paddingBottom: "clamp(2.5rem, 5vw, 4rem)",
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        <div className="container">
          <nav
            aria-label="Breadcrumb"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.5625rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              marginBottom: "2rem",
            }}
          >
            <Link href="/" style={{ color: "inherit" }}>Home</Link>
            <span aria-hidden="true"> / </span>
            <Link href="/ecommerce-qa-testing" style={{ color: "inherit" }}>Services</Link>
            <span aria-hidden="true"> / </span>
            <span style={{ color: "var(--text-secondary)" }}>{content.crumb}</span>
          </nav>

          <div style={{ maxWidth: "60rem" }}>
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <h1 style={{ letterSpacing: "-0.035em", lineHeight: 1.08, margin: "0 0 1.25rem" }}>
              {content.h1}
            </h1>
            <p style={{ fontSize: "clamp(1rem, 1.1vw + 0.6rem, 1.25rem)", lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "1.75rem" }}>
              {content.lead}
            </p>

            <ul className="service-list" style={{ marginBottom: "2rem" }}>
              {content.heroPoints.map((point) => (
                <li key={point} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <span aria-hidden="true" style={{ color: "var(--accent)", fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>{point}</span>
                </li>
              ))}
            </ul>

            <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", alignItems: "center" }}>
              <Link href={content.primaryCta.href} className="service-cta-primary">
                {content.primaryCta.label}
              </Link>
              {content.secondaryCta && (
                <Link href={content.secondaryCta.href} className="service-cta-secondary">
                  {content.secondaryCta.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="container" style={{ paddingTop: "clamp(3rem, 6vw, 4.5rem)", paddingBottom: "clamp(2rem, 4vw, 3rem)" }}>
        {content.blocks.map((block, i) => (
          <Block key={i} block={block} index={i} />
        ))}

        {/* ── FAQ ────────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "3.5rem" }}>
          <Eyebrow>Questions</Eyebrow>
          <SectionHeading id="faq">Frequently asked questions</SectionHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "56rem" }}>
            {content.faq.map((f) => (
              <details
                key={f.q}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-surface)",
                  padding: "1.125rem 1.375rem",
                }}
              >
                <summary
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    listStyle: "none",
                  }}
                >
                  {f.q}
                </summary>
                <p style={{ fontSize: "0.9375rem", lineHeight: 1.75, color: "var(--text-secondary)", marginTop: "0.875rem" }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Related services ───────────────────────────────────────────── */}
        <section style={{ marginBottom: "3.5rem" }}>
          <Eyebrow>Related services</Eyebrow>
          <SectionHeading id="related">Where to go next</SectionHeading>
          <div className="service-grid cols-3">
            {related.map((s, i) => (
              <Reveal key={s.slug} delay={Math.min(i, 5) * 60} className="service-card">
                <Link href={`/${s.slug}`} style={{ display: "block", textDecoration: "none" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                    {s.crumb}
                  </h3>
                  <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                    {s.metaDescription.length > 130 ? `${s.metaDescription.slice(0, 127)}…` : s.metaDescription}
                  </p>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.5625rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      color: "var(--accent)",
                    }}
                  >
                    View service →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Closing CTA ────────────────────────────────────────────────── */}
        <Reveal>
          <aside
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              backgroundColor: "var(--bg-secondary)",
              padding: "clamp(1.75rem, 4vw, 3rem)",
              display: "flex",
              flexWrap: "wrap",
              gap: "1.75rem",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ maxWidth: "44rem" }}>
              <Eyebrow>Next step</Eyebrow>
              <h2 style={{ letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>Tell me what you need tested.</h2>
              <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "var(--text-secondary)" }}>
                Send the store URL and what concerns you most. You will get a straight answer on scope,
                what would be covered, and what it costs — no obligation.
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
              <Link href={content.primaryCta.href} className="service-cta-primary">
                {content.primaryCta.label}
              </Link>
              <Link href="/contact" className="service-cta-secondary">
                Ask a question
              </Link>
            </div>
          </aside>
        </Reveal>
      </div>
    </>
  );
}
