CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(100),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "audit_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"store_url" text,
	"platform" varchar(100),
	"review_scope" text,
	"message" text,
	"status" varchar(50) DEFAULT 'new',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"excerpt" text,
	"featured_image" text,
	"author" varchar(100) DEFAULT 'QA Specialist',
	"published_at" timestamp,
	"updated_at" timestamp DEFAULT now(),
	"category" varchar(100),
	"tags" jsonb DEFAULT '[]'::jsonb,
	"content" text,
	"status" varchar(50) DEFAULT 'draft',
	"seo_title" text,
	"seo_description" text,
	"seo_image" text,
	"seo_canonical" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"company" varchar(255),
	"website" text,
	"project_type" varchar(100),
	"message" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"industry" varchar(100),
	"platform" varchar(100),
	"partner_type" varchar(100),
	"featured" boolean DEFAULT false,
	"featured_order" integer DEFAULT 0,
	"thumbnail" text,
	"hero_image" text,
	"gallery" jsonb DEFAULT '[]'::jsonb,
	"summary" text,
	"challenge" text,
	"investigation" text,
	"root_cause" text,
	"resolution" text,
	"outcome" text,
	"testing_scope" jsonb DEFAULT '[]'::jsonb,
	"issues" jsonb DEFAULT '[]'::jsonb,
	"before_image" text,
	"after_image" text,
	"verification" jsonb DEFAULT '[]'::jsonb,
	"technologies" jsonb DEFAULT '[]'::jsonb,
	"external_links" jsonb DEFAULT '[]'::jsonb,
	"faqs" jsonb DEFAULT '[]'::jsonb,
	"seo_title" text,
	"seo_description" text,
	"seo_image" text,
	"seo_canonical" text,
	"status" varchar(50) DEFAULT 'draft',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
