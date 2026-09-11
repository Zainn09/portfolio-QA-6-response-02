"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface BlogPost {
  id?: number;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  author: string | null;
  publishedAt: string | null;
  category: string | null;
  tags: string[];
  content: string | null;
  status: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoImage: string | null;
  seoCanonical: string | null;
}

interface BlogEditorProps {
  post: BlogPost | null;
  onSave: () => void;
  onCancel: () => void;
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function BlogEditor({ post, onSave, onCancel }: BlogEditorProps) {
  const isNew = !post?.id;
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content");
  const [tagsInput, setTagsInput] = useState(post?.tags?.join(", ") || "");

  const [form, setForm] = useState<BlogPost>({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    featuredImage: post?.featuredImage || "",
    author: post?.author || "QA Specialist",
    publishedAt: post?.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : "",
    category: post?.category || "",
    tags: post?.tags || [],
    content: post?.content || "",
    status: post?.status || "draft",
    seoTitle: post?.seoTitle || "",
    seoDescription: post?.seoDescription || "",
    seoImage: post?.seoImage || "",
    seoCanonical: post?.seoCanonical || "",
  });

  useEffect(() => {
    if (isNew && form.title && !form.slug) {
      setForm(f => ({ ...f, slug: generateSlug(f.title) }));
    }
  }, [form.title, isNew, form.slug]);

  const handleChange = (field: keyof BlogPost, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleSave = async (asDraft = false) => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.slug.trim()) { toast.error("Slug is required"); return; }

    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
        status: asDraft ? "draft" : form.status === "published" ? "published" : "draft",
        publishedAt: form.publishedAt || (asDraft ? null : new Date().toISOString()),
      };

      const url = isNew ? "/api/admin/blogs" : `/api/admin/blogs/${post?.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");
      toast.success(isNew ? "Post created!" : "Post updated!");
      onSave();
    } catch {
      toast.error("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    backgroundColor: "var(--bg-surface)",
    border: "1px solid var(--border-strong)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-sans)",
    fontSize: "0.9375rem",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: "0.375rem",
  };

  return (
    <div style={{ paddingTop: "var(--nav-height)", minHeight: "100vh", backgroundColor: "var(--bg-secondary)" }}>
      {/* Editor header */}
      <div style={{ backgroundColor: "var(--bg-surface)", borderBottom: "1px solid var(--border)", padding: "1rem 0", position: "sticky", top: "var(--nav-height)", zIndex: 50 }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
              {isNew ? "New Post" : "Editing Post"}
            </p>
            <h1 style={{ fontSize: "1.125rem", fontWeight: 700 }}>{form.title || "Untitled"}</h1>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button
              onClick={onCancel}
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", border: "1px solid var(--border)", padding: "0.625rem 1rem", borderRadius: "var(--radius-sm)", background: "none", cursor: "pointer" }}
            >
              ← Cancel
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", border: "1px solid var(--border-strong)", padding: "0.625rem 1rem", borderRadius: "var(--radius-sm)", background: "none", cursor: "pointer" }}
            >
              Save Draft
            </button>
            <button
              onClick={() => { handleChange("status", "published"); handleSave(false); }}
              disabled={saving}
              style={{ backgroundColor: "var(--accent)", color: "#000", fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.625rem 1rem", borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer" }}
            >
              {saving ? "Saving..." : isNew ? "Publish" : "Update"}
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", alignItems: "start" }} className="editor-grid">
          {/* Main content */}
          <div>
            {/* Tabs */}
            <div style={{ display: "flex", gap: "0", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
              {(["content", "seo"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "0.75rem 1.25rem",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: activeTab === tab ? "var(--text-primary)" : "var(--text-tertiary)",
                    borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
                    fontWeight: activeTab === tab ? 700 : 400,
                    marginBottom: "-1px",
                  }}
                >
                  {tab === "content" ? "Content" : "SEO"}
                </button>
              ))}
            </div>

            {activeTab === "content" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={labelStyle}>Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Post title..."
                    style={{ ...inputStyle, fontSize: "1.25rem", fontWeight: 600 }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Slug *</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>/blogs/</span>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => handleChange("slug", e.target.value)}
                      placeholder="post-slug"
                      style={inputStyle}
                    />
                    <button
                      onClick={() => handleChange("slug", generateSlug(form.title))}
                      type="button"
                      style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", border: "1px solid var(--border)", padding: "0.625rem 0.875rem", borderRadius: "var(--radius-sm)", background: "none", cursor: "pointer", whiteSpace: "nowrap" }}
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Excerpt</label>
                  <textarea
                    value={form.excerpt || ""}
                    onChange={(e) => handleChange("excerpt", e.target.value)}
                    placeholder="Short summary shown in blog listings..."
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Content (HTML)</label>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "0.5rem" }}>
                    Enter your content as HTML. Supports headings, paragraphs, lists, code blocks, and more.
                  </p>
                  <textarea
                    value={form.content || ""}
                    onChange={(e) => handleChange("content", e.target.value)}
                    placeholder="<p>Your blog content here...</p>"
                    rows={20}
                    style={{ ...inputStyle, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}
                  />
                </div>
              </div>
            )}

            {activeTab === "seo" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={labelStyle}>SEO Title</label>
                  <input type="text" value={form.seoTitle || ""} onChange={(e) => handleChange("seoTitle", e.target.value)} placeholder="Leave blank to use post title" style={inputStyle} />
                  <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "0.25rem" }}>Recommended: 50–60 characters. Currently: {(form.seoTitle || "").length}</p>
                </div>
                <div>
                  <label style={labelStyle}>SEO Description</label>
                  <textarea value={form.seoDescription || ""} onChange={(e) => handleChange("seoDescription", e.target.value)} placeholder="Meta description for search engines" rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                  <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "0.25rem" }}>Recommended: 150–160 characters. Currently: {(form.seoDescription || "").length}</p>
                </div>
                <div>
                  <label style={labelStyle}>OG/Social Image URL</label>
                  <input type="url" value={form.seoImage || ""} onChange={(e) => handleChange("seoImage", e.target.value)} placeholder="https://..." style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Canonical URL</label>
                  <input type="url" value={form.seoCanonical || ""} onChange={(e) => handleChange("seoCanonical", e.target.value)} placeholder="Leave blank for default" style={inputStyle} />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Publish settings */}
            <div style={{ padding: "1.25rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface)" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "1rem" }}>Publish Settings</p>

              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Status</label>
                <select value={form.status} onChange={(e) => handleChange("status", e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Publish Date</label>
                <input type="datetime-local" value={form.publishedAt || ""} onChange={(e) => handleChange("publishedAt", e.target.value)} style={inputStyle} />
              </div>
            </div>

            {/* Post details */}
            <div style={{ padding: "1.25rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface)" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "1rem" }}>Post Details</p>

              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Author</label>
                <input type="text" value={form.author || ""} onChange={(e) => handleChange("author", e.target.value)} style={inputStyle} />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Category</label>
                <input type="text" value={form.category || ""} onChange={(e) => handleChange("category", e.target.value)} placeholder="e.g. QA Tips" style={inputStyle} />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Tags</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="shopify, qa, checkout"
                  style={inputStyle}
                />
                <p style={{ fontSize: "0.6875rem", color: "var(--text-tertiary)", marginTop: "0.25rem" }}>Comma-separated</p>
              </div>

              <div>
                <label style={labelStyle}>Featured Image URL</label>
                <input type="url" value={form.featuredImage || ""} onChange={(e) => handleChange("featuredImage", e.target.value)} placeholder="https://..." style={inputStyle} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .editor-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
