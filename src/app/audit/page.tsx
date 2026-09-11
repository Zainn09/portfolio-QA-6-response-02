import type { Metadata } from "next";
import { AuditCTA } from "@/components/audit/AuditCTA";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Free Store Audit — Shopify QA Review",
  description:
    "Request a free preliminary QA audit of your Shopify or Shopify Plus store. Functional, responsive, checkout, and accessibility issues identified.",
  alternates: { canonical: "/audit" },
};

export default function AuditPage() {
  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      <Toaster position="bottom-right" />
      <div style={{ paddingTop: "5rem", paddingBottom: "2rem", backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>Free Audit</p>
          <h1 style={{ maxWidth: "600px" }}>
            Think Your Store Is Fine?{" "}
            <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>Let&apos;s Find Out.</span>
          </h1>
        </div>
      </div>
      <AuditCTA />
    </div>
  );
}
