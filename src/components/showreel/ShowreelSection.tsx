"use client";

import React, { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";

const VIDEO_MP4 = "/videos/above-the-fold.mp4";
const VIDEO_WEBM = "/videos/above-the-fold.webm";
const POSTER = "/images/showreel-poster.jpg";

/**
 * Showreel — gives the favourite above-the-fold video its own stage.
 * Drop the video file at `public/videos/above-the-fold.mp4` and it plays
 * here automatically (muted loop). Until then, an animated poster fallback
 * keeps the section looking intentional.
 */
export function ShowreelSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  // If the video file is missing, the element ends up with NO_SOURCE —
  // detect that shortly after mount and switch to the poster fallback.
  useEffect(() => {
    const t = setTimeout(() => {
      const v = videoRef.current;
      if (v && v.readyState < 2 && (v.networkState === 3 || v.networkState === 0)) {
        setFailed(true);
      }
    }, 3500);
    return () => clearTimeout(t);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v || failed) return;
    if (v.paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section
      id="showreel"
      aria-label="Store audit showreel"
      style={{
        paddingTop: "clamp(3rem, 6vw, 4.5rem)",
        paddingBottom: "clamp(3rem, 6vw, 4.5rem)",
        borderTop: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-10%",
          right: "-10%",
          width: "50%",
          height: "60%",
          background:
            "radial-gradient(closest-side, var(--accent-muted), transparent)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 380px) 1fr",
            gap: "clamp(2rem, 4vw, 3rem)",
            alignItems: "center",
          }}
          className="showreel-grid"
        >
          {/* Copy */}
          <Reveal>
            <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>
              Watch It Break
            </p>
            <h2 style={{ marginBottom: "1rem" }}>
              A Real Audit,{" "}
              <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>
                in 60 Seconds.
              </span>
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
              The above-the-fold favourite — now playing on its own stage. Press
              play and watch a store get inspected the way your customers
              experience it: fast, unforgiving, and full of surprises.
            </p>

            <ul
              role="list"
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "0.625rem",
                marginBottom: "1.25rem",
              }}
            >
              {[
                "Live inspection of a real product flow",
                "Issues flagged the moment they appear",
                "The exact report a client receives",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      backgroundColor: "var(--accent-muted)",
                      border: "1px solid var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent)",
                      fontSize: "0.5625rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {["60 seconds", "No signup", "Real store"].map((chip) => (
                <span
                  key={chip}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    border: "1px solid var(--border)",
                    padding: "0.375rem 0.75rem",
                    borderRadius: "999px",
                    color: "var(--text-tertiary)",
                    backgroundColor: "var(--bg-surface)",
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </Reveal>

          {/* Video frame */}
          <Reveal delay={120}>
            <div
              style={{
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                backgroundColor: "var(--bg-surface)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              {/* Frame chrome */}
              <div
                style={{
                  padding: "0.625rem 0.875rem",
                  borderBottom: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface-2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", gap: "0.375rem" }}>
                  {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                    <div
                      key={c}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: c,
                        opacity: 0.8,
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: "22px",
                    backgroundColor: "var(--bg-secondary)",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "0.75rem",
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.625rem",
                      color: "var(--text-tertiary)",
                      letterSpacing: "0.04em",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    audit-replay — store-inspection.mp4
                  </span>
                </div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--critical)",
                    flexShrink: 0,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      backgroundColor: "var(--critical)",
                      animation: "pulse-dot 1.6s ease-in-out infinite",
                    }}
                  />
                  <span className="showreel-live-text">Live audit</span>
                </span>
              </div>

              {/* Player */}
              <div
                style={{
                  position: "relative",
                  aspectRatio: "16/9",
                  backgroundColor: "#000",
                  cursor: failed ? "default" : "pointer",
                }}
                onClick={togglePlay}
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
                    <source src={VIDEO_MP4} type="video/mp4" onError={() => setFailed(true)} />
                    <source src={VIDEO_WEBM} type="video/webm" onError={() => setFailed(true)} />
                  </video>
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={POSTER}
                      alt="QA engineer auditing a Shopify store"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      loading="lazy"
                    />
                    {/* Animated scanline keeps the fallback feeling alive */}
                    <div
                      aria-hidden="true"
                      className="showreel-scanline"
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        height: "2px",
                        background:
                          "linear-gradient(90deg, transparent, var(--accent), transparent)",
                        opacity: 0.8,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0.75rem",
                        left: "0.75rem",
                        right: "0.75rem",
                        backgroundColor: "rgba(0,0,0,0.65)",
                        backdropFilter: "blur(6px)",
                        padding: "0.375rem 0.75rem",
                        borderRadius: "var(--radius-sm)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.5625rem",
                        letterSpacing: "0.08em",
                        color: "#fff",
                      }}
                    >
                      Drop the audit video at /videos/above-the-fold.mp4 to play it here
                    </div>
                  </>
                )}

                {/* Centre play/pause affordance */}
                {!failed && (
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "none",
                      opacity: playing ? 0 : 1,
                      transition: "opacity 250ms ease",
                    }}
                  >
                    <div
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(0,0,0,0.55)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "1.5rem",
                        paddingLeft: "0.25rem",
                      }}
                    >
                      ▶
                    </div>
                  </div>
                )}

                {/* Mute toggle */}
                {!failed && (
                  <button
                    onClick={toggleMute}
                    aria-label={muted ? "Unmute video" : "Mute video"}
                    style={{
                      position: "absolute",
                      bottom: "0.75rem",
                      right: "0.75rem",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      border: "1px solid rgba(255,255,255,0.35)",
                      backgroundColor: "rgba(0,0,0,0.55)",
                      backdropFilter: "blur(8px)",
                      color: "#fff",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "transform 200ms ease, background-color 200ms ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                    }}
                  >
                    {muted ? "🔇" : "🔊"}
                  </button>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .showreel-grid {
            grid-template-columns: 1fr !important;
          }
        }
        /* On very narrow screens keep only the pulsing dot, not the label */
        @media (max-width: 480px) {
          .showreel-live-text {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
