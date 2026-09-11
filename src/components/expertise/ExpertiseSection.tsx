"use client";

import React, { useState } from "react";

const EXPERTISE_CATEGORIES = [
  {
    id: "storefront",
    label: "Storefront",
    items: [
      { name: "Product Pages", desc: "Full product page flow testing including variants, media, and CTAs." },
      { name: "Collections", desc: "Filtering, sorting, pagination, and product grid behaviour." },
      { name: "Navigation", desc: "Menu states, dropdowns, mobile navigation, and keyboard access." },
      { name: "Search", desc: "Predictive search, results accuracy, and edge-case query handling." },
      { name: "Filters", desc: "Filter interaction, URL state, combination logic, and clearing." },
      { name: "Cart", desc: "Add/remove, quantity updates, discount codes, and persistence." },
    ],
  },
  {
    id: "commerce",
    label: "Commerce",
    items: [
      { name: "Discounts", desc: "Automatic discounts, codes, stacking, and edge conditions." },
      { name: "Shipping", desc: "Rate calculation, zones, carrier-calculated, and edge cases." },
      { name: "Taxes", desc: "Tax display, exemptions, and regional calculation accuracy." },
      { name: "Checkout", desc: "End-to-end checkout flow across all payment methods and states." },
      { name: "Payment Flows", desc: "Card, digital wallets, BNPL, and redirect payment testing." },
      { name: "B2B", desc: "Price lists, net terms, company accounts, and B2B checkout." },
    ],
  },
  {
    id: "experience",
    label: "Experience",
    items: [
      { name: "Mobile", desc: "iOS Safari, Chrome Android, across phone sizes and orientations." },
      { name: "Tablet", desc: "iPad and Android tablet layouts and touch interactions." },
      { name: "Desktop", desc: "1024px to ultrawide — layout, typography, and interaction." },
      { name: "Accessibility", desc: "WCAG 2.1 AA — keyboard, screen reader, contrast, and focus." },
      { name: "UX Consistency", desc: "Visual hierarchy, interaction patterns, and flow logic." },
      { name: "Performance", desc: "Core Web Vitals, load behaviour, and render stability." },
    ],
  },
  {
    id: "technical",
    label: "Technical",
    items: [
      { name: "Cross-browser", desc: "Chrome, Firefox, Safari, Edge — current and recent versions." },
      { name: "Regression", desc: "Post-change verification that existing behaviour is preserved." },
      { name: "Functional", desc: "Feature-by-feature verification against requirements." },
      { name: "Exploratory", desc: "Unscripted investigation for unexpected behaviours." },
      { name: "Edge Cases", desc: "Boundary conditions, unusual inputs, and unlikely-but-real scenarios." },
      { name: "Third-party Apps", desc: "Subscription, reviews, loyalty, search, and upsell apps." },
    ],
  },
];

export function ExpertiseSection() {
  const [activeCategory, setActiveCategory] = useState("storefront");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const category = EXPERTISE_CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <section
      id="expertise"
      aria-label="QA Expertise"
      style={{
        paddingTop: "clamp(5rem, 10vw, 9rem)",
        paddingBottom: "clamp(5rem, 10vw, 9rem)",
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "3.5rem", maxWidth: "640px" }}>
          <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>
            Expertise
          </p>
          <h2 style={{ marginBottom: "1rem" }}>
            I Don't Test Pages.{" "}
            <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>
              I Test Experiences.
            </span>
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            A systematic approach that covers every layer of your Shopify store — from the first
            page load to the final order confirmation.
          </p>
        </div>

        {/* Category tabs */}
        <div
          role="tablist"
          aria-label="Expertise categories"
          style={{
            display: "flex",
            gap: "0.25rem",
            marginBottom: "2rem",
            borderBottom: "1px solid var(--border)",
            overflowX: "auto",
            paddingBottom: "0",
          }}
        >
          {EXPERTISE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === cat.id}
              aria-controls={`panel-${cat.id}`}
              id={`tab-${cat.id}`}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: "0.75rem 1.25rem",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: activeCategory === cat.id ? "var(--text-primary)" : "var(--text-tertiary)",
                borderBottom: activeCategory === cat.id ? "2px solid var(--accent)" : "2px solid transparent",
                fontWeight: activeCategory === cat.id ? 700 : 400,
                transition: "all var(--transition-fast)",
                whiteSpace: "nowrap",
                marginBottom: "-1px",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div
          role="tabpanel"
          id={`panel-${activeCategory}`}
          aria-labelledby={`tab-${activeCategory}`}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {category?.items.map((item) => (
            <div
              key={item.name}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                padding: "1.25rem",
                border: "1px solid",
                borderColor: hoveredItem === item.name ? "var(--accent)" : "var(--border)",
                borderRadius: "var(--radius-sm)",
                backgroundColor: hoveredItem === item.name ? "var(--accent-muted)" : "var(--bg-surface)",
                cursor: "default",
                transition: "all var(--transition-fast)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem" }}>
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: hoveredItem === item.name ? "var(--accent)" : "var(--text-tertiary)",
                    transition: "background-color var(--transition-fast)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {item.name}
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  paddingLeft: "0.875rem",
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
