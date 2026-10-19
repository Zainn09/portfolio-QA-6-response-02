import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

// ─── Projects / Case Studies ─────────────────────────────────────────────────

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  industry: varchar("industry", { length: 100 }),
  platform: varchar("platform", { length: 100 }), // Shopify | Shopify Plus
  partnerType: varchar("partner_type", { length: 100 }),
  featured: boolean("featured").default(false),
  featuredOrder: integer("featured_order").default(0),
  thumbnail: text("thumbnail"),
  heroImage: text("hero_image"),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  summary: text("summary"),
  challenge: text("challenge"),
  investigation: text("investigation"),
  rootCause: text("root_cause"),
  resolution: text("resolution"),
  outcome: text("outcome"),
  testingScope: jsonb("testing_scope").$type<string[]>().default([]),
  issues: jsonb("issues")
    .$type<
      {
        id: string;
        title: string;
        severity: "critical" | "major" | "minor";
        description: string;
        rootCause: string;
        resolution: string;
      }[]
    >()
    .default([]),
  beforeImage: text("before_image"),
  afterImage: text("after_image"),
  verification: jsonb("verification")
    .$type<{ label: string; status: "verified" | "failed" | "pending" }[]>()
    .default([]),
  technologies: jsonb("technologies").$type<string[]>().default([]),
  externalLinks: jsonb("external_links")
    .$type<{ label: string; url: string }[]>()
    .default([]),
  faqs: jsonb("faqs")
    .$type<{ question: string; answer: string }[]>()
    .default([]),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  seoImage: text("seo_image"),
  seoCanonical: text("seo_canonical"),
  status: varchar("status", { length: 50 }).default("draft"), // draft | published
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),
  author: varchar("author", { length: 100 }).default("QA Specialist"),
  publishedAt: timestamp("published_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
  category: varchar("category", { length: 100 }),
  tags: jsonb("tags").$type<string[]>().default([]),
  content: text("content"),
  status: varchar("status", { length: 50 }).default("draft"), // draft | published
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  seoImage: text("seo_image"),
  seoCanonical: text("seo_canonical"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Admin Users ──────────────────────────────────────────────────────────────

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Audit Requests ───────────────────────────────────────────────────────────

export const auditRequests = pgTable("audit_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  storeUrl: text("store_url"),
  platform: varchar("platform", { length: 100 }),
  reviewScope: text("review_scope"),
  message: text("message"),
  status: varchar("status", { length: 50 }).default("new"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Contact Messages ─────────────────────────────────────────────────────────

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  website: text("website"),
  projectType: varchar("project_type", { length: 100 }),
  message: text("message"),
  status: varchar("status", { length: 50 }).default("new"), // new | in_progress | completed | archived
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── DevTools: administrative audit trail ─────────────────────────────────────
export const adminActivity = pgTable("admin_activity", {
  id: serial("id").primaryKey(),
  actorEmail: varchar("actor_email", { length: 255 }),
  action: varchar("action", { length: 100 }).notNull(), // e.g. "submission.status", "project.delete", "query.run", "export.csv", "login"
  target: varchar("target", { length: 255 }),
  detail: jsonb("detail"),
  ip: varchar("ip", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── DevTools: API request logs (sanitized — no headers, no bodies) ──────────
export const apiRequests = pgTable("api_requests", {
  id: serial("id").primaryKey(),
  method: varchar("method", { length: 10 }).notNull(),
  path: varchar("path", { length: 255 }).notNull(),
  status: integer("status").notNull(),
  durationMs: integer("duration_ms"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── DevTools: application errors ─────────────────────────────────────────────
export const appErrors = pgTable("app_errors", {
  id: serial("id").primaryKey(),
  source: varchar("source", { length: 100 }).notNull(),
  severity: varchar("severity", { length: 20 }).default("error"), // error | warn
  message: text("message").notNull(),
  stack: text("stack"),
  context: jsonb("context"),
  createdAt: timestamp("created_at").defaultNow(),
});
