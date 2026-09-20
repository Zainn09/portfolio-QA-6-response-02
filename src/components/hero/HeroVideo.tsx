"use client";

import React, { useRef, useState } from "react";

const VIDEO_MP4 = "/videos/above-the-fold.mp4";
const POSTER = "/images/showreel-poster.jpg";

/**
 * Hero visual — the real store-journey capture, autoplaying muted.
 * Falls back to the poster still if the file is missing or the browser
 * refuses to play it, so the hero never renders an empty black box.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(true);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
    } else {
      v.pause();
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "620px",
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border)",
        backgroundColor: "var(--bg-surface)",
        overflow: "hidden",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Browser chrome strip — frames the capture as a real store session */}
      <div
        aria-hidden="true"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 0.75rem",
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--bg-surface-2)",
        }}
      >
        <span style={{ display: "flex", gap: "0.25rem" }}>
          {["#E05252", "#D97706", "#1F9D67"].map((c) => (
            <span
              key={c}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: c,
                display: "inline-block",
              }}
            />
          ))}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.5625rem",
            letterSpacing: "0.06em",
            color: "var(--text-tertiary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          live store audit — recorded session
        </span>
      </div>

      <div
        style={{
          position: "relative",
          aspectRatio: "16/10",
          backgroundColor: "#000",
          cursor: failed ? "default" : "pointer",
        }}
        onClick={failed ? undefined : togglePlay}
        role={failed ? undefined : "button"}
        tabIndex={failed ? undefined : 0}
        aria-label={failed ? undefined : playing ? "Pause audit video" : "Play audit video"}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !failed) {
            e.preventDefault();
            togglePlay();
          }
        }}
      >
        {!failed ? (
          <video
            ref={videoRef}
            poster={POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setFailed(true)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          >
            <source src={VIDEO_MP4} type="video/mp4" />
          </video>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={POSTER}
            alt="QA engineer auditing a Shopify store"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}

        {/* Pause affordance — only while paused, so it never covers the capture */}
        {!failed && !playing && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.25)",
            }}
          >
            <span
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "var(--accent)",
                color: "#000",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                paddingLeft: "3px",
              }}
            >
              ▶
            </span>
          </div>
        )}

        {/* Live badge */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "0.625rem",
            left: "0.625rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
            padding: "0.25rem 0.5rem",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.5rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#fff",
          }}
        >
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "var(--accent)",
              animation: "pulse-dot 2s ease-in-out infinite",
            }}
          />
          Real audit footage
        </div>
      </div>
    </div>
  );
}
