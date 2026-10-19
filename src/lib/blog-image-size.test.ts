import { describe, expect, it } from "vitest";
import {
  FULL_IMAGE_PCT,
  MIN_IMAGE_PCT,
  MIN_IMAGE_PX,
  imagePctForWidth,
  imageWidthForPct,
} from "./blog-image-size";

describe("imageWidthForPct", () => {
  it("maps a percentage of the column to a pixel width", () => {
    expect(imageWidthForPct(50, 800)).toBe(400);
    expect(imageWidthForPct(25, 800)).toBe(200);
    expect(imageWidthForPct(75, 800)).toBe(600);
  });

  it("rounds to whole pixels", () => {
    expect(imageWidthForPct(33, 801)).toBe(264);
  });

  it("treats 100% as the full column width", () => {
    expect(imageWidthForPct(100, 800)).toBe(800);
  });

  it("clamps percentages to 0–100", () => {
    expect(imageWidthForPct(120, 800)).toBe(800);
    expect(imageWidthForPct(-20, 800)).toBe(MIN_IMAGE_PX);
  });

  it("never returns a width below the minimum", () => {
    expect(imageWidthForPct(1, 800)).toBe(MIN_IMAGE_PX);
  });

  it("returns null when the column width is unknown", () => {
    expect(imageWidthForPct(50, 0)).toBeNull();
    expect(imageWidthForPct(50, NaN)).toBeNull();
  });
});

describe("imagePctForWidth", () => {
  it("maps a stored pixel width back to a column percentage", () => {
    expect(imagePctForWidth(400, 800)).toBe(50);
    expect(imagePctForWidth(800, 800)).toBe(FULL_IMAGE_PCT);
  });

  it("reads a missing width as full width", () => {
    expect(imagePctForWidth(null, 800)).toBe(FULL_IMAGE_PCT);
  });

  it("clamps percentages to the slider range", () => {
    expect(imagePctForWidth(8, 800)).toBe(MIN_IMAGE_PCT);
    expect(imagePctForWidth(99999, 800)).toBe(FULL_IMAGE_PCT);
  });

  it("round-trips with imageWidthForPct", () => {
    for (const pct of [10, 25, 50, 75, 90, 100]) {
      const width = imageWidthForPct(pct, 800)!;
      expect(imagePctForWidth(width, 800)).toBe(pct);
    }
  });
});
