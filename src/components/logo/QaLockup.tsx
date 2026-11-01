import { useId } from "react";
import type { CSSProperties } from "react";

/**
 * AR monogram + "QA SPECIALIST" wordmark lockup, inlined so it can react to
 * the site theme.
 *
 * The gradient strokes (A/R, Q/A) and cyan accents read on both cream and
 * obsidian. Everything chrome (#F5F7FF in the static SVG) is `currentColor`
 * here, and the wrapper colour is `var(--text-primary)` — near-white in dark
 * mode, near-black in light mode — so the "SPECIALIST" row, crossbars and
 * hairlines never blend into the background of either theme.
 *
 * IDs are namespaced per instance (nav + footer on the same page) so the
 * two inline SVGs can't collide on gradient/mask references.
 */
export function QaLockup({
  width,
  height,
  style,
}: {
  width: number;
  height: number;
  style?: CSSProperties;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gMain = `lk${uid}main`;
  const gBowl = `lk${uid}bowl`;
  const gWord = `lk${uid}word`;
  const voidMask = `lk${uid}void`;

  return (
    <svg
      viewBox="0 0 1240 512"
      width={width}
      height={height}
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", color: "var(--text-primary)", ...style }}
    >
      <defs>
        <linearGradient id={gMain} gradientUnits="userSpaceOnUse" x1="96" y1="400" x2="368" y2="400">
          <stop offset="0" stopColor="#3DF2FF" />
          <stop offset="0.5" stopColor="#5E7BFF" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id={gBowl} gradientUnits="userSpaceOnUse" x1="300" y1="250" x2="450" y2="410">
          <stop offset="0" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#3DF2FF" />
        </linearGradient>
        <linearGradient id={gWord} gradientUnits="userSpaceOnUse" x1="566" y1="203" x2="998" y2="203">
          <stop offset="0" stopColor="#3DF2FF" />
          <stop offset="0.55" stopColor="#5E7BFF" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
        <mask id={voidMask}>
          <rect x="0" y="0" width="512" height="512" fill="white" />
          <path d="M 390 256 L 424 292 L 390 328 L 356 292 Z" fill="black" />
        </mask>
      </defs>

      {/* AR monogram */}
      <path d="M 96 400 L 224 116 L 240 116 L 368 400" fill="none" stroke={`url(#${gMain})`} strokeWidth="46" strokeLinecap="round" strokeLinejoin="miter" />
      <path d="M 264 178 C 340 122, 432 152, 432 234 C 432 300, 362 306, 322 302 L 436 400" mask={`url(#${voidMask})`} fill="none" stroke={`url(#${gBowl})`} strokeWidth="46" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 112 398 L 224 130" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
      <path d="M 218 219 L 231 232 L 218 245 L 205 232 Z" fill="#3DF2FF" fillOpacity="0.9" />
      <path d="M 150 300 L 322 300" fill="none" stroke="currentColor" strokeOpacity="0.85" strokeWidth="10" strokeLinecap="round" />
      <path d="M 452 386 L 480 411" fill="none" stroke="#3DF2FF" strokeOpacity="0.95" strokeWidth="9" strokeLinecap="round" />
      <path d="M 468 371 L 496 396" fill="none" stroke="#3DF2FF" strokeOpacity="0.6" strokeWidth="9" strokeLinecap="round" />

      {/* QA — diamond Q with flux tail, monogram A with echo */}
      <path d="M 668 118 L 753 203 L 668 288 L 583 203 Z" fill="none" stroke={`url(#${gWord})`} strokeWidth="34" strokeLinejoin="round" />
      <path d="M 700 238 L 772 330" fill="none" stroke="#3DF2FF" strokeWidth="12" strokeLinecap="round" strokeOpacity="0.95" />
      <path d="M 812 288 L 890 118 L 903 118 L 981 288" fill="none" stroke={`url(#${gWord})`} strokeWidth="34" strokeLinecap="round" strokeLinejoin="miter" />
      <path d="M 848 232 L 946 232" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeOpacity="0.85" />
      <path d="M 897 191 L 909 205 L 897 219 L 885 205 Z" fill="#3DF2FF" fillOpacity="0.9" />

      {/* SPECIALIST */}
      <path d="M 600 352 L 574 352 L 574 380 L 600 380 L 600 408 L 574 408" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.92" />
      <path d="M 630 422 L 630 342 L 656 342 L 656 380 L 630 380" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.92" />
      <path d="M 712 342 L 686 342 L 686 422 L 712 422 M 686 382 L 708 382" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.92" />
      <path d="M 768 354 L 742 354 L 742 410 L 768 410" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.92" />
      <path d="M 811 342 L 811 422" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.92" />
      <path d="M 848 422 L 867 342 L 886 422 M 856 396 L 878 396" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.92" />
      <path d="M 910 342 L 910 422 L 936 422" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.92" />
      <path d="M 979 342 L 979 422" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.92" />
      <path d="M 1048 352 L 1022 352 L 1022 380 L 1048 380 L 1048 408 L 1022 408" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.92" />
      <path d="M 1072 342 L 1110 342 M 1091 342 L 1091 422" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.92" />
      <path d="M 1150 396 L 1178 421" fill="none" stroke="#3DF2FF" strokeWidth="9" strokeLinecap="round" strokeOpacity="0.95" />
      <path d="M 1166 381 L 1194 406" fill="none" stroke="#3DF2FF" strokeWidth="9" strokeLinecap="round" strokeOpacity="0.6" />
    </svg>
  );
}
