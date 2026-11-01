/**
 * Width math for the blog editor's image resize controls.
 *
 * The width is stored on the image node as a fixed pixel value (rendered as
 * the HTML `width` attribute, which the public post styles cap with
 * `max-width: 100%` so it scales down on narrow screens). The UI exposes it
 * as a percentage of the editor column, which is what an author can reason
 * about. A missing width means "full column width" (fluid).
 */

/** Smallest percentage the resize slider allows. */
export const MIN_IMAGE_PCT = 10;

/** Percentage that maps to the full column width. */
export const FULL_IMAGE_PCT = 100;

/** Below this many pixels an image is useless, so widths clamp to it. */
export const MIN_IMAGE_PX = 48;

/**
 * Fixed pixel width for a percentage (clamped 0–100) of the column.
 * Returns null when the column width is unknown (editor not visible yet).
 */
export function imageWidthForPct(pct: number, columnWidth: number): number | null {
  if (!Number.isFinite(columnWidth) || columnWidth <= 0) return null;
  const clamped = Math.min(100, Math.max(0, Math.round(pct)));
  if (clamped >= FULL_IMAGE_PCT) return Math.round(columnWidth);
  return Math.max(MIN_IMAGE_PX, Math.round((columnWidth * clamped) / 100));
}

/**
 * Percentage of the column for a stored pixel width. A missing width (or an
 * unknown column) reads as full width; percentages clamp to 10–100.
 */
export function imagePctForWidth(width: number | null, columnWidth: number): number {
  if (width == null || !Number.isFinite(columnWidth) || columnWidth <= 0) return FULL_IMAGE_PCT;
  return Math.min(FULL_IMAGE_PCT, Math.max(MIN_IMAGE_PCT, Math.round((width / columnWidth) * 100)));
}
