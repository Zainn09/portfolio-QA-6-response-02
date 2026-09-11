"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Reveal } from "@/components/motion/Reveal";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  storeUrl: z.string().url("Valid store URL required").or(z.string().min(3, "Store URL required")),
  platform: z.string().min(1, "Please select a platform"),
  reviewScope: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function AuditCTA() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
      reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <section
      id="audit"
      aria-label="Free Audit Request"
      style={{
        paddingTop: "clamp(3rem, 6vw, 4.5rem)",
        paddingBottom: "clamp(3rem, 6vw, 4.5rem)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3.5rem",
            alignItems: "start",
          }}
          className="audit-grid"
        >
          {/* Left: copy */}
          <Reveal>
          <div>
            <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>
              Free Audit
            </p>
            <h2 style={{ marginBottom: "1rem" }}>
              Think Your Store Is Fine?
            </h2>
            <p
              style={{
                fontSize: "clamp(1.125rem, 2vw, 1.375rem)",
                color: "var(--text-secondary)",
                marginBottom: "1.5rem",
                fontWeight: 500,
              }}
            >
              Let&apos;s find out.
            </p>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Request a free preliminary audit report. I&apos;ll review your store and identify the
              most impactful QA issues worth addressing — no obligation, no fluff.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {[
                "Functional & UX issues",
                "Mobile & responsive problems",
                "Checkout & payment friction",
                "Accessibility gaps",
                "Cross-browser inconsistencies",
              ].map((item) => (
                <div
                  key={item}
                  style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
                >
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "var(--accent-muted)",
                      border: "1px solid var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent)",
                      fontSize: "0.625rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  <span style={{ fontSize: "0.9375rem", color: "var(--text-secondary)" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
          </Reveal>

          {/* Right: form */}
          <Reveal delay={120}>
          <div>
            {submitted ? (
              <div
                style={{
                  padding: "3rem",
                  border: "1px solid var(--verified)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "rgba(31, 157, 103, 0.06)",
                  textAlign: "center",
                  animation: "fade-up 0.4s ease forwards",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    backgroundColor: "var(--verified)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.25rem",
                    color: "white",
                    fontSize: "1.5rem",
                  }}
                >
                  ✓
                </div>
                <h3 style={{ marginBottom: "0.75rem" }}>Request Received</h3>
                <p style={{ color: "var(--text-secondary)" }}>
                  I&apos;ll review your store and be in touch shortly with an initial audit assessment.
                </p>
                <p
                  style={{
                    marginTop: "1.5rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.625rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--verified)",
                  }}
                >
                  Status: Queued for Review
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                style={{
                  padding: "1.75rem",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-surface)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div className="form-field">
                    <label htmlFor="audit-name" className="form-label">
                      Name *
                    </label>
                    <input
                      id="audit-name"
                      type="text"
                      className="form-input"
                      placeholder="Your name"
                      autoComplete="name"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="form-error" role="alert">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="form-field">
                    <label htmlFor="audit-email" className="form-label">
                      Email *
                    </label>
                    <input
                      id="audit-email"
                      type="email"
                      className="form-input"
                      placeholder="you@store.com"
                      autoComplete="email"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="form-error" role="alert">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="audit-store" className="form-label">
                    Store URL *
                  </label>
                  <input
                    id="audit-store"
                    type="url"
                    className="form-input"
                    placeholder="https://yourstore.com"
                    autoComplete="url"
                    {...register("storeUrl")}
                  />
                  {errors.storeUrl && (
                    <p className="form-error" role="alert">
                      {errors.storeUrl.message}
                    </p>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="audit-platform" className="form-label">
                    Platform *
                  </label>
                  <select id="audit-platform" className="form-select" {...register("platform")}>
                    <option value="">Select platform</option>
                    <option value="Shopify">Shopify</option>
                    <option value="Shopify Plus">Shopify Plus</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.platform && (
                    <p className="form-error" role="alert">
                      {errors.platform.message}
                    </p>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="audit-scope" className="form-label">
                    What would you like reviewed?
                  </label>
                  <input
                    id="audit-scope"
                    type="text"
                    className="form-input"
                    placeholder="Checkout, mobile, search..."
                    {...register("reviewScope")}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="audit-message" className="form-label">
                    Additional context
                  </label>
                  <textarea
                    id="audit-message"
                    className="form-textarea"
                    placeholder="Any specific concerns or context..."
                    rows={3}
                    {...register("message")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "#000",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    padding: "1rem",
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.7 : 1,
                    transition: "all var(--transition-fast)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    letterSpacing: "0.01em",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        style={{
                          width: "14px",
                          height: "14px",
                          border: "2px solid #000",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                          display: "inline-block",
                        }}
                      />
                      Submitting...
                    </>
                  ) : (
                    <>Get a Free Audit Report →</>
                  )}
                </button>

                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-tertiary)",
                    textAlign: "center",
                  }}
                >
                  No spam. No obligation. Just a real assessment of your store.
                </p>
              </form>
            )}
          </div>
          </Reveal>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .audit-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}
