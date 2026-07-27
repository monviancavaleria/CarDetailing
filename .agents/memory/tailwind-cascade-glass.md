---
name: Unlayered CSS beats Tailwind utilities
description: Why ring/shadow utilities silently fail on elements styled with the glass-* classes, and the pattern to use instead.
---

# Unlayered CSS beats Tailwind utility layers

Rule: in this project the `glass`, `glass-blue`, `glass-silver`, `glass-popular` classes (and other plain CSS in `index.css`) are **unlayered**, so they override Tailwind v4 utilities (which live in `@layer utilities`) regardless of class order in the markup. Any `ring-*`, `shadow-*`, or other utility that touches a property those classes set (notably `box-shadow`) will silently not render.

**Why:** CSS cascade layers — unlayered author CSS always wins over layered CSS at equal specificity. Discovered when selected-state `ring-2 + shadow-[...]` on package cards never appeared; computed styles kept the glass box-shadow.

**How to apply:**
- To restyle a glass element's shadow/border for a state, define a plain CSS class in `index.css` placed AFTER the glass-* definitions (later unlayered rule wins) — e.g. `.card-selected-blue` / `.card-selected-silver`.
- For focus indicators on glass elements use `outline-*` utilities (outline is not set by glass-*), not `ring-*` (ring is box-shadow-based).
- Tailwind v4 note: `scale-*` sets the `scale` property, not `transform` — check the right computed property when verifying.
- e2e note: computed-style assertions right after a click can read mid-transition values (cards use `transition-all duration-300`); wait ~450ms before asserting a reset.

- Page background: `index.html` has an unlayered inline `html, body { background-color }` that beats the `@layer base` body rule for plain colors (gradient images still showed through). Change the bg in BOTH places. (User tried a uniform #B7C5D2 bg jul 2026 and reverted to the original gradient + hero orbs — keep the gradient.)
