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
  company: z.string().optional(),
  website: z.string().optional(),
  projectType: z.string().optional(),
  message: z.string().min(10, "Please provide a brief message"),
});

type FormData = z.infer<typeof schema>;

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/contact", {
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
      id="contact"
      aria-label="Contact"
      style={{
        paddingTop: "clamp(3rem, 6vw, 4.5rem)",
        paddingBottom: "clamp(3rem, 6vw, 4.5rem)",
        backgroundColor: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
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
          className="contact-grid"
        >
          {/* Left: copy */}
          <Reveal>
          <div>
            <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>
              Contact
            </p>
            <h2 style={{ marginBottom: "1.25rem" }}>
              Have Something That Needs Breaking?
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Whether it&apos;s a full QA engagement, a pre-launch audit, a post-migration check, or
              an ongoing testing partnership — I&apos;d like to hear about your store.
            </p>

            <div
              style={{
                padding: "1.5rem",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--bg-surface)",
                marginBottom: "2rem",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-tertiary)",
                  marginBottom: "0.75rem",
                }}
              >
                I can help with
              </p>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {[
                  "Pre-launch QA audits",
                  "Post-migration regression testing",
                  "Ongoing monthly QA retainers",
                  "Checkout & payment flow testing",
                  "Accessibility audits (WCAG 2.1)",
                  "Cross-browser & device testing",
                  "Third-party app integration testing",
                  "Performance-focused QA review",
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      fontSize: "0.9375rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span style={{ color: "var(--accent)", fontWeight: 700 }}>›</span>
                    {item}
                  </li>
                ))}
              </ul>
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
                <h3 style={{ marginBottom: "0.75rem" }}>Message Received</h3>
                <p style={{ color: "var(--text-secondary)" }}>
                  I&apos;ll review your message and be in touch shortly.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                <div className="form-row-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-field">
                    <label htmlFor="contact-name" className="form-label">Name *</label>
                    <input id="contact-name" type="text" className="form-input" placeholder="Your name" autoComplete="name" {...register("name")} />
                    {errors.name && <p className="form-error" role="alert">{errors.name.message}</p>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="contact-email" className="form-label">Email *</label>
                    <input id="contact-email" type="email" className="form-input" placeholder="you@company.com" autoComplete="email" {...register("email")} />
                    {errors.email && <p className="form-error" role="alert">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="form-row-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-field">
                    <label htmlFor="contact-company" className="form-label">Company</label>
                    <input id="contact-company" type="text" className="form-input" placeholder="Your company" autoComplete="organization" {...register("company")} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="contact-website" className="form-label">Website</label>
                    <input id="contact-website" type="url" className="form-input" placeholder="https://yourstore.com" autoComplete="url" {...register("website")} />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="contact-type" className="form-label">Project Type</label>
                  <select id="contact-type" className="form-select" {...register("projectType")}>
                    <option value="">Select type</option>
                    <option value="Pre-launch Audit">Pre-launch Audit</option>
                    <option value="Post-migration Testing">Post-migration Testing</option>
                    <option value="Monthly Retainer">Monthly Retainer</option>
                    <option value="One-time Audit">One-time Audit</option>
                    <option value="Accessibility Audit">Accessibility Audit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="contact-message" className="form-label">Message *</label>
                  <textarea
                    id="contact-message"
                    className="form-textarea"
                    placeholder="Tell me about your store and what you'd like tested..."
                    rows={5}
                    {...register("message")}
                  />
                  {errors.message && <p className="form-error" role="alert">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: "var(--text-primary)",
                    color: "var(--bg-primary)",
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
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent)";
                      (e.currentTarget as HTMLButtonElement).style.color = "#000";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--text-primary)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--bg-primary)";
                  }}
                >
                  {isSubmitting ? "Sending..." : "Start a Conversation →"}
                </button>
              </form>
            )}
          </div>
          </Reveal>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}
