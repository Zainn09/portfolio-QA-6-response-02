# Audit video

The homepage **Showreel** section (`src/components/showreel/ShowreelSection.tsx`)
plays the favourite above-the-fold video here.

## How to use

1. Copy the Response 01 above-the-fold video into this folder as:
   - `above-the-fold.mp4` (required — H.264 recommended)
   - `above-the-fold.webm` (optional — VP9, for extra browser coverage)
2. Keep it short (~60 seconds), muted-friendly, 16:9.
3. No code changes needed — the player picks it up automatically and loops it
   muted with a poster fallback at `public/images/showreel-poster.jpg`.

Until the file exists, the section shows the animated poster fallback so the
page never looks broken.
