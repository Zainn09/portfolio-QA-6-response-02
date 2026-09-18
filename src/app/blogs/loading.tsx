export default function BlogsLoading() {
  return (
    <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }} aria-busy="true" aria-label="Loading articles">
      <div style={{ width: "180px", height: "12px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "9999px", marginBottom: "1.25rem" }} />
      <div style={{ width: "min(52rem, 90%)", height: "44px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", marginBottom: "1rem" }} />
      <div style={{ width: "min(44rem, 80%)", height: "16px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", marginBottom: "2.5rem" }} />
      <div className="blog-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden", backgroundColor: "var(--bg-surface)" }}>
            <div style={{ width: "100%", aspectRatio: "16/9", backgroundColor: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }} />
            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ width: "40%", height: "10px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "9999px" }} />
              <div style={{ width: "90%", height: "14px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }} />
              <div style={{ width: "70%", height: "14px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
