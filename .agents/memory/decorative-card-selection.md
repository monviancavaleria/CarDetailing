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

## Paleta clara elegida por el usuario (jul 2026)
Rule: sitewide, letters that were navy #075A9E are now #78C8ED, and icons that were brand blue #0077D6 / text-primary are now #96DCF6 — both sampled from a user-sent two-tone image (top color = icons, bottom = letters).
**Why:** explicit user pick despite light-on-light contrast; do NOT darken or revert unasked (same stance as the #00EAFF tick).
**How to apply:** new icons → #96DCF6; display text that used to be navy → #78C8ED. Script italic phrases, prices and outline "Reservar/Más información" buttons intentionally keep #0077D6 (user scoped the change to navy letters + icons only). The #05435C check inside the cyan tick and the decorative #0077D6/10 quote mark stay as-is.
