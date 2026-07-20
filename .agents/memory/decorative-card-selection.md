---
name: Decorative card selection is intentional
description: Package cards' wash/glow selection is pointer-only by user choice; don't re-add select buttons unasked.
---

# Package-card selection is pointer-only decoration BY DESIGN

Rule: on the landing's package cards, the card-body click that triggers the wash animation + selected glow is a decorative, pointer-only flourish. It intentionally has no `role`, `tabIndex`, or `aria-pressed`, and there is no dedicated select button.

**Why:** the user explicitly replaced the earlier accessible "Seleccionar" toggle buttons with "Más información" links (in-page anchors that scroll to the #tarifas section and highlight that package's column there). Selection currently has no functional consequence — every real action (Más información, Reservar) is a proper link. Code review flags this as a medium a11y gap; it was consciously accepted to honor the user's design.

**How to apply:** do not "fix" this by re-adding aria-pressed buttons or card button semantics without the user asking. If a future feature makes selection functional (e.g. booking via WhatsApp with the chosen package pre-filled), THAT is the moment to design proper accessible selection semantics. When e2e-verifying selection, check the card's `card-selected-*` class + visuals, not aria state; the wash overlay unmounts after ~1.15 s.

## Tick badge #00EAFF en la matriz de tarifas (jul 2026)
Rule: the "included" badge in the Plan de Servicios matrix uses #00EAFF background + dark #05435C check — the user's explicit pick (sent a color-sample image, "Azul Eléctrico Luminoso").
**Why:** reviewers flag the cyan's soft contrast on light glass; do NOT revert it to #0077D6 or darken it unasked.
**How to apply:** the category filtering on "Más información" + "Ver los 4 paquetes" reset chip is deliberate UX (user wanted the section less overloaded).

## Paleta clara probada y RECHAZADA (jul 2026)
Rule: display letters stay navy #075A9E and icons stay brand blue #0077D6 / text-primary. A lighter two-tone palette from a user sample image (letters → #78C8ED, icons → #96DCF6) was applied sitewide and reverted the same day at the user's request ("no me gusta así").
**Why:** the user disliked the light-on-light result once seen on the real page; the "don't fix contrast" stance covers ONLY the #00EAFF tick badge, not site-wide text/icons.
**How to apply:** don't reintroduce pale-blue text/icon tones on your own. When the user sends color samples for broad changes, they may still reject the result on sight — confirming one section visually before styling the whole site can save a full revert.
