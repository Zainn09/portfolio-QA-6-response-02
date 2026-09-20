"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BlogEditor } from "./BlogEditor";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  status: string;
  publishedAt: string | null;
  category: string | null;
  excerpt: string | null;
  content: string | null;
  author: string | null;
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  seoImage: string | null;
  seoCanonical: string | null;
  featuredImage: string | null;
};

export function AdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "new" | "edit">("list");
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const router = useRouter();

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/blogs");
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  const handleSave = async () => {
    await fetchPosts();
    setView("list");
    setEditPost(null);
  };

  if (view === "new" || view === "edit") {
    return (
      <BlogEditor
        post={editPost}
        onSave={handleSave}
        onCancel={() => { setView("list"); setEditPost(null); }}
      />
    );
  }

  return (
    <div style={{ paddingTop: "var(--nav-height)", minHeight: "100vh", backgroundColor: "var(--bg-secondary)" }}>
      {/* Admin header */}
      <div style={{ backgroundColor: "var(--bg-surface)", borderBottom: "1px solid var(--border)", padding: "1rem 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
              Admin Panel
            </p>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
              Content Management
            </h1>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <Link href="/" style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", border: "1px solid var(--border)", padding: "0.5rem 0.875rem", borderRadius: "var(--radius-sm)" }}>
              ← View Site
            </Link>
            <button
              onClick={handleLogout}
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", border: "1px solid var(--border)", padding: "0.5rem 0.875rem", borderRadius: "var(--radius-sm)", background: "none", cursor: "pointer" }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
          {[
            { label: "Total Posts", value: posts.length },
            { label: "Published", value: posts.filter(p => p.status === "published").length },
            { label: "Drafts", value: posts.filter(p => p.status === "draft").length },
          ].map(stat => (
            <div key={stat.label} style={{ padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface)" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "0.375rem" }}>{stat.label}</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Blog Posts section */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", gap: "1rem" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700 }}>Blog Posts</h2>
          <button
            onClick={() => setView("new")}
            style={{
              backgroundColor: "var(--accent)",
              color: "#000",
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              fontSize: "0.5625rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.625rem 1rem",
              borderRadius: "var(--radius-sm)",
              border: "none",
              cursor: "pointer",
            }}
          >
            + New Post
          </button>
        </div>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Loading...
          </div>
        ) : posts.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", border: "1px dashed var(--border-strong)", borderRadius: "var(--radius-md)" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "0.75rem" }}>No Posts</p>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.25rem" }}>Create your first blog post.</p>
            <button
              onClick={() => setView("new")}
              style={{ backgroundColor: "var(--accent)", color: "#000", fontWeight: 700, fontSize: "0.875rem", padding: "0.75rem 1.25rem", borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer" }}
            >
              Write First Post
            </button>
          </div>
        ) : (
          <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden", backgroundColor: "var(--bg-surface)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-surface-2)" }}>
                  {["Title", "Status", "Category", "Published", "Actions"].map(h => (
                    <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((post, i) => (
                  <tr key={post.id} style={{ borderBottom: i < posts.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td style={{ padding: "1rem", fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", maxWidth: "280px" }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.06em", color: "var(--text-tertiary)", marginTop: "0.125rem" }}>/blogs/{post.slug}</div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", color: post.status === "published" ? "var(--verified)" : "var(--text-tertiary)", border: `1px solid ${post.status === "published" ? "var(--verified)" : "var(--border)"}`, padding: "0.2rem 0.5rem", borderRadius: "2px" }}>
                        {post.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>{post.category || "—"}</td>
                    <td style={{ padding: "1rem", fontFamily: "var(--font-mono)", fontSize: "0.5625rem", color: "var(--text-tertiary)" }}>
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => { setEditPost(post); setView("edit"); }}
                          style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", border: "1px solid var(--border)", padding: "0.375rem 0.625rem", borderRadius: "2px", background: "none", cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        {post.status === "published" && (
                          <Link href={`/blogs/${post.slug}`} target="_blank" style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", border: "1px solid var(--border)", padding: "0.375rem 0.625rem", borderRadius: "2px" }}>
                            View
                          </Link>
                        )}
                        <button
                          onClick={() => handleDelete(post.id)}
                          style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--critical)", border: "1px solid var(--critical)", padding: "0.375rem 0.625rem", borderRadius: "2px", background: "none", cursor: "pointer", opacity: 0.7 }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Audit requests section */}
        <div style={{ marginTop: "3rem" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.75rem" }}>Audit Requests & Contact Messages</h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Audit requests and contact form submissions are stored in the database. Use a DB viewer or API to manage them.
          </p>
        </div>
      </div>
    </div>
  );
}
