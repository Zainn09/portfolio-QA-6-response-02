import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for QA Specialist portfolio.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      <div style={{ paddingTop: "5rem", paddingBottom: "4rem", borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>Legal</p>
          <h1>Terms of Use</h1>
        </div>
      </div>
      <div className="container" style={{ paddingTop: "4rem", paddingBottom: "6rem", maxWidth: "800px" }}>
        <div className="rich-text">
          <p>By using this website, you agree to the following terms.</p>
          <h2>Content</h2>
          <p>All content on this website, including case studies, written copy, and design, is the intellectual property of the site owner. Case study content represents real QA work but is presented without disclosing confidential client information.</p>
          <h2>Portfolio Use</h2>
          <p>Projects presented in this portfolio represent real QA engagements. Names used are illustrative. No confidential client information is disclosed.</p>
          <h2>Forms</h2>
          <p>Form submissions do not constitute a binding contract or guarantee of service. A response to your enquiry will be provided in good faith.</p>
          <h2>Liability</h2>
          <p>This website is provided as-is. No warranties are made regarding the accuracy or completeness of information presented.</p>
          <h2>Changes</h2>
          <p>These terms may be updated at any time without notice.</p>
        </div>
      </div>
    </div>
  );
}
