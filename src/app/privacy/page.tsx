import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for QA Specialist portfolio.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      <div style={{ paddingTop: "5rem", paddingBottom: "4rem", borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>Legal</p>
          <h1>Privacy Policy</h1>
        </div>
      </div>
      <div className="container" style={{ paddingTop: "4rem", paddingBottom: "6rem", maxWidth: "800px" }}>
        <div className="rich-text">
          <p>This portfolio website collects minimal personal data submitted through contact and audit request forms.</p>
          <h2>Data Collected</h2>
          <p>When you submit a contact or audit form, we collect your name, email address, and any information you choose to provide in the form fields.</p>
          <h2>How Data Is Used</h2>
          <p>Form submissions are used solely to respond to your enquiry. Data is not shared with third parties, sold, or used for marketing purposes without explicit consent.</p>
          <h2>Data Storage</h2>
          <p>Form data is stored securely in a private database. You may request deletion of your data at any time by contacting us.</p>
          <h2>Cookies</h2>
          <p>This website uses a single cookie to store your theme preference (light/dark). No third-party tracking cookies are used.</p>
          <h2>Contact</h2>
          <p>For any privacy-related queries, please use the contact form on this website.</p>
        </div>
      </div>
    </div>
  );
}
