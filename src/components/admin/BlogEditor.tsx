"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

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

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.625rem",
        fontWeight: 700,
        letterSpacing: "0.04em",
        padding: "0.4375rem 0.625rem",
        borderRadius: "var(--radius-sm)",
        border: "1px solid " + (active ? "var(--accent)" : "var(--border)"),
        backgroundColor: active ? "var(--accent-muted)" : "transparent",
        color: active ? "var(--text-primary)" : "var(--text-secondary)",
        cursor: "pointer",
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
      }}
    >
      {children}
    </button>
  );
}

export function BlogEditor({ post, onSave, onCancel }: BlogEditorProps) {
  const isNew = !post?.id;
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content");
  const [tagsInput, setTagsInput] = useState(post?.tags?.join(", ") || "");
  const [showSource, setShowSource] = useState(false);

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

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({
        placeholder: "Write your story — paste screenshots or photos straight into the text.",
      }),
      CharacterCount,
    ],
    content: form.content || "",
    editorProps: { attributes: { class: "blog-editor-prose" } },
    onUpdate: ({ editor: e }) => {
      setForm((f) => ({ ...f, content: e.getHTML() }));
    },
  });

  const handleChange = (field: keyof BlogPost, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  /** Switching back from raw-HTML mode reloads the editor with the edited markup. */
  const switchToRich = () => {
    if (editor) editor.commands.setContent(form.content || "", { emitUpdate: false });
    setShowSource(false);
  };

  const handleSave = async (asDraft = false) => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.slug.trim()) {
      toast.error("Slug is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
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

  const words = editor?.storage.characterCount?.words() ?? 0;
  const contentKb = Math.round(new Blob([form.content || ""]).size / 1024);

  return (
    <div style={{ paddingTop: 0, minHeight: "100vh", backgroundColor: "var(--bg-secondary)" }}>
      {/* Editor header */}
      <div style={{ backgroundColor: "var(--bg-surface)", borderBottom: "1px solid var(--border)", padding: "1rem 0", position: "sticky", top: 0, zIndex: 50 }}>
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
              onClick={() => {
                handleChange("status", "published");
                handleSave(false);
              }}
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
              {(["content", "seo"] as const).map((tab) => (
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
                    onChange={(e) => {
                      const title = e.target.value;
                      // New posts: keep the slug in step with the title until
                      // the user edits the slug (or hits Generate) themselves.
                      setForm((f) => ({
                        ...f,
                        title,
                        ...(isNew && !f.slug ? { slug: generateSlug(title) } : {}),
                      }));
                    }}
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
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem", marginBottom: "0.375rem" }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>Content</label>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", color: "var(--text-tertiary)" }}>
                      {words} words · {contentKb} KB
                    </span>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "0.5rem" }}>
                    Paste screenshots or photos from your clipboard straight into the text (or drag them in) — they are resized and saved with the post.
                  </p>

                  {showSource ? (
                    <>
                      <textarea
                        value={form.content || ""}
                        onChange={(e) => handleChange("content", e.target.value)}
                        placeholder="<p>Your blog content here...</p>"
                        rows={20}
                        style={{ ...inputStyle, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}
                      />
                      <div style={{ marginTop: "0.5rem" }}>
                        <button type="button" onClick={switchToRich} style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", border: "1px solid var(--accent)", padding: "0.5rem 1rem", borderRadius: "var(--radius-sm)", background: "none", cursor: "pointer" }}>
                          ← Back to visual editor
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Toolbar */}
                      <div
                        role="toolbar"
                        aria-label="Text formatting"
                        style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", padding: "0.5rem", border: "1px solid var(--border-strong)", borderBottom: "none", borderRadius: "var(--radius-sm) var(--radius-sm) 0 0", backgroundColor: "var(--bg-surface)", alignItems: "center" }}
                      >
                        <ToolbarButton label="Undo" onClick={() => editor?.chain().focus().undo().run()}>↺</ToolbarButton>
                        <ToolbarButton label="Redo" onClick={() => editor?.chain().focus().redo().run()}>↻</ToolbarButton>
                        <span style={{ width: 1, height: 18, backgroundColor: "var(--border)", margin: "0 0.25rem" }} />
                        <ToolbarButton label="Heading 2" active={editor?.isActive("heading", { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolbarButton>
                        <ToolbarButton label="Heading 3" active={editor?.isActive("heading", { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolbarButton>
                        <span style={{ width: 1, height: 18, backgroundColor: "var(--border)", margin: "0 0.25rem" }} />
                        <ToolbarButton label="Bold" active={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()}><b>B</b></ToolbarButton>
                        <ToolbarButton label="Italic" active={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()}><i>I</i></ToolbarButton>
                        <ToolbarButton label="Strikethrough" active={editor?.isActive("strike")} onClick={() => editor?.chain().focus().toggleStrike().run()}><s>S</s></ToolbarButton>
                        <ToolbarButton label="Inline code" active={editor?.isActive("code")} onClick={() => editor?.chain().focus().toggleCode().run()}>{"</>"}</ToolbarButton>
                        <span style={{ width: 1, height: 18, backgroundColor: "var(--border)", margin: "0 0.25rem" }} />
                        <ToolbarButton label="Bullet list" active={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()}>• List</ToolbarButton>
                        <ToolbarButton label="Numbered list" active={editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>1. List</ToolbarButton>
                        <ToolbarButton label="Quote" active={editor?.isActive("blockquote")} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>❝</ToolbarButton>
                        <ToolbarButton label="Code block" active={editor?.isActive("codeBlock")} onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>Code</ToolbarButton>
                        <ToolbarButton label="Divider" onClick={() => editor?.chain().focus().setHorizontalRule().run()}>—</ToolbarButton>
                        <span style={{ width: 1, height: 18, backgroundColor: "var(--border)", margin: "0 0.25rem" }} />
                        <ToolbarButton
                          label="Add or edit link"
                          active={editor?.isActive("link")}
                          onClick={() => {
                            if (editor?.isActive("link")) {
                              editor.chain().focus().extendMarkRange("link").unsetLink().run();
                              return;
                            }
                            const href = window.prompt("Link URL", "https://");
                            if (href && href !== "https://") editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
                          }}
                        >
                          Link
                        </ToolbarButton>
                        <ToolbarButton
                          label="Insert image from URL"
                          onClick={() => {
                            const src = window.prompt("Image URL", "https://");
                            if (src) editor?.chain().focus().setImage({ src, alt: "" }).run();
                          }}
                        >
                          Image
                        </ToolbarButton>
                        {editor?.getAttributes("image").src && (
                          <ToolbarButton label="Remove selected image" onClick={() => editor?.chain().focus().deleteSelection().run()}>Remove image</ToolbarButton>
                        )}
                        <span style={{ flex: 1 }} />
                        <ToolbarButton label="View raw HTML" onClick={() => setShowSource(true)}>&lt;/&gt;</ToolbarButton>
                      </div>

                      {/* Editor surface */}
                      <div style={{ border: "1px solid var(--border-strong)", borderRadius: "0 0 var(--radius-sm) var(--radius-sm)", backgroundColor: "var(--bg-surface)" }}>
                        <EditorContent editor={editor} />
                      </div>
                    </>
                  )}
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
                  <textarea value={form.seoDescription || ""} onChange={(e) => handleChange("seoDescription", e.target.value)} placeholder="Meta description for search engines" rows={3} style={inputStyle} />
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

      <style>{`
        .blog-editor-prose { min-height: 480px; padding: 1.25rem 1.5rem; outline: none; font-family: var(--font-sans); font-size: 1rem; line-height: 1.8; color: var(--text-primary); }
        .blog-editor-prose > * + * { margin-top: 0.875rem; }
        .blog-editor-prose h1 { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.02em; }
        .blog-editor-prose h2 { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.02em; }
        .blog-editor-prose h3 { font-size: 1.1875rem; font-weight: 700; }
        .blog-editor-prose p { margin: 0; }
        .blog-editor-prose ul, .blog-editor-prose ol { padding-left: 1.5rem; }
        .blog-editor-prose ul { list-style: disc; }
        .blog-editor-prose ol { list-style: decimal; }
        .blog-editor-prose li { margin: 0.25rem 0; }
        .blog-editor-prose blockquote { border-left: 3px solid var(--accent); padding-left: 1rem; color: var(--text-secondary); font-style: italic; }
        .blog-editor-prose code { font-family: var(--font-mono); font-size: 0.875em; background: var(--accent-muted); padding: 0.1em 0.35em; border-radius: 4px; }
        .blog-editor-prose pre { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1rem; overflow-x: auto; }
        .blog-editor-prose pre code { background: none; padding: 0; }
        .blog-editor-prose img { max-width: 100%; height: auto; border-radius: var(--radius-md); border: 1px solid var(--border); display: block; }
        .blog-editor-prose a { color: var(--text-primary); font-weight: 600; text-decoration: underline; text-decoration-color: var(--accent); text-underline-offset: 3px; }
        .blog-editor-prose hr { border: none; border-top: 1px solid var(--border-strong); margin: 1.5rem 0; }
        .blog-editor-prose p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--text-tertiary); float: left; height: 0; pointer-events: none; }
        @media (max-width: 900px) {
          .editor-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
