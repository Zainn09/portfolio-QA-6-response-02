import Link from "next/link";

const footerLinks = {
  work: [
    { href: "/work", label: "All Work" },
    { href: "/work?platform=Shopify+Plus", label: "Shopify Plus" },
    { href: "/work?platform=Shopify", label: "Shopify" },
  ],
  pages: [
    { href: "/about", label: "About" },
    { href: "/blogs", label: "Blogs" },
    { href: "/contact", label: "Contact" },
    { href: "/audit", label: "Free Audit" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
};

export function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{
        borderTop: "1px solid var(--border)",
        backgroundColor: "var(--bg-secondary)",
        padding: "4rem 0 2rem",
      }}
    >
      <style>{`
        .footer-link {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          transition: color var(--transition-fast);
          text-decoration: none;
        }
        .footer-link:hover {
          color: var(--text-primary);
        }
      `}</style>

      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "3rem",
            marginBottom: "4rem",
          }}
        >
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "inline-block", marginBottom: "1rem", textDecoration: "none" }}>
              <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
                QA
              </span>
              <span style={{ display: "block", fontSize: "1.125rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
                SPECIALIST
              </span>
            </Link>
            <p style={{ fontSize: "0.875rem", color: "var(--text-tertiary)", lineHeight: 1.6, maxWidth: "220px" }}>
              Quality Assurance for Shopify & Shopify Plus.
            </p>
            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {["Shopify", "Shopify Plus", "E-commerce QA"].map((tag) => (
                <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Work */}
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "1rem" }}>
              Work
            </p>
            <ul role="list" style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {footerLinks.work.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "1rem" }}>
              Pages
            </p>
            <ul role="list" style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {footerLinks.pages.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "1rem" }}>
              Legal
            </p>
            <ul role="list" style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {footerLinks.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
            © 2026 QA Portfolio. All rights reserved.
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", fontStyle: "italic" }}>
            &quot;Everything works until someone tests it.&quot;
          </p>
        </div>
      </div>
    </footer>
  );
}
