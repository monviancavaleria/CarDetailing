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

## Hero wordmark: bg removal eats thin details + glint technique
AI background removal (removeImageBackground) deleted the thin blue speed lines at the left of the wordmark entirely (kept the thicker gray right-side ones). Border-connected floodfill (`-alpha set -channel RGBA -fuzz 9% -fill none -draw "alpha 0,0 floodfill"` from all 4 corners) preserves thin lines but leaves the original gray inside enclosed letter counters. Working recipe: use the AI result as base (clean bg + cleared counters + feathered shadows) and composite the floodfill version's line-only rectangle back over it, then alpha-clean/trim/resize.

**Never use CSS `mask-image: url(asset)` for logo glint overlays.** It intermittently paints the overlay UNMASKED (a semi-transparent rectangle "plate" behind the logo) — seen in headless captures even with a perfectly clean asset. Use the mask-free pattern instead: duplicate `<img aria-hidden>` of the same asset with `filter: brightness(...)`, clipped by an animated `clip-path` polygon band whose base (non-animated) position is fully off-canvas. Glow then physically cannot escape the logo pixels and reduced-motion degrades to invisible.

## Cache-bust al regenerar assets
Regenerating a `public/` asset under the SAME filename leaves users seeing the stale cached version (user kept seeing the pre-crop logo tagline after the crop). Fix by renaming the file (e.g. logo-hero.webp → logo-wordmark.webp) and updating every ref (components + index.html preload). Dev-server no-cache headers do not protect the user's browser/proxy cache.

- Jul 2026: logo replaced by penguin version (includes tagline "DETAILING · MANTENIMIENTO" and penguin with hose). Served as public/logo-wordmark-v4.webp. Cut recipe: AI-removal alpha UNION corner-floodfill alpha, PLUS luminance-keyed alpha (fx ramp ~0.68-0.74 + despeckle) in the right strip — the right silver lines fade into the bg and both AI and floodfill truncate them. Old logo-wordmark.webp kept but unused; og:image may still show old logo.
