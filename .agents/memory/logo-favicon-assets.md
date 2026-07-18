---
name: Logo & favicon assets
description: Constraint for deriving icons/social images from the Puro Detalle logo, and favicon provenance
---

# Logo & favicon assets (Puro Detalle)

**Rule:** Never derive icons by cropping single letters out of the official logo. In the artwork, the blue script "Puro" is drawn ON TOP of the chrome "DETALLE" block, so any bounding-box crop of a "P" or "D" drags in pixels of the other word.

**Why:** Verified with a coordinate-grid overlay during logo integration; every letter-crop attempt came out contaminated.

**How to apply:** For og:images, touch icons or manifest icons, either use the FULL transparent logo on a brand background, or regenerate a monogram from scratch (the shipped favicon is a generated Kaushan-Script "P" on a brand-blue rounded square — Kaushan matches the site's script font and is downloadable from the google/fonts GitHub repo). The transparent logo asset came from background-removal of the user's attached original; if a higher-res source is ever needed, ask the user rather than upscaling.

## Alpha cleanup after background removal
Background removal (removeImageBackground) can leave faint semi-transparent remnants (alpha ~3-15%) in the corners/edges of the subject's bounding box. They are invisible on white but show as ghost rectangles over tinted/gradient page backgrounds.

**Why:** Happened with the circular badge for the hero (July 2026): screenshots showed pale rectangles around the badge; alpha extract looked clean at a glance, but low-alpha junk remained inside the bbox.

**How to apply:** After any bg removal, run `magick in.png -channel A -level 15%,100% +channel ...` before trim/resize, then verify by compositing the result over a flat saturated color (`magick -size WxH xc:"#cfe2f0" img -gravity center -composite`) — never judge transparency on a white preview alone.
