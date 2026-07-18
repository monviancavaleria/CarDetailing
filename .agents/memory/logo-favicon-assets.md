---
name: Logo & favicon assets
description: Constraint for deriving icons/social images from the Puro Detalle logo, and favicon provenance
---

# Logo & favicon assets (Puro Detalle)

**Rule:** Never derive icons by cropping single letters out of the official logo. In the artwork, the blue script "Puro" is drawn ON TOP of the chrome "DETALLE" block, so any bounding-box crop of a "P" or "D" drags in pixels of the other word.

**Why:** Verified with a coordinate-grid overlay during logo integration; every letter-crop attempt came out contaminated.

**How to apply:** For og:images, touch icons or manifest icons, either use the FULL transparent logo on a brand background, or regenerate a monogram from scratch (the shipped favicon is a generated Kaushan-Script "P" on a brand-blue rounded square — Kaushan matches the site's script font and is downloadable from the google/fonts GitHub repo). The transparent logo asset came from background-removal of the user's attached original; if a higher-res source is ever needed, ask the user rather than upscaling.
