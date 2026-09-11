import type { Metadata } from "next";
import { ContactSection } from "@/components/contact/ContactSection";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Contact — Start a Conversation",
  description:
    "Get in touch to discuss your Shopify QA needs. Pre-launch audits, monthly retainers, accessibility audits, and more.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      <Toaster position="bottom-right" />
      <div style={{ paddingTop: "5rem", paddingBottom: "2rem", backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>Contact</p>
          <h1 style={{ maxWidth: "600px" }}>Have Something That Needs Breaking?</h1>
        </div>
      </div>
      <ContactSection />
    </div>
  );
}
