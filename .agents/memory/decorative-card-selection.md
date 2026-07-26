---
name: Decorative card selection is intentional
description: Package cards' wash/glow selection is pointer-only by user choice; don't re-add select buttons unasked.
---

# Package-card selection is pointer-only decoration BY DESIGN

Rule: on the landing's package cards, the card-body click that triggers the wash animation + selected glow is a decorative, pointer-only flourish. It intentionally has no `role`, `tabIndex`, or `aria-pressed`, and there is no dedicated select button.

**Why:** the user explicitly replaced the earlier accessible "Seleccionar" toggle buttons with "Más información" links (in-page anchors that scroll to the #tarifas section and highlight that package's column there). Selection currently has no functional consequence — every real action (Más información, Reservar) is a proper link. Code review flags this as a medium a11y gap; it was consciously accepted to honor the user's design.

**How to apply:** do not "fix" this by re-adding aria-pressed buttons or card button semantics without the user asking. If a future feature makes selection functional (e.g. booking via WhatsApp with the chosen package pre-filled), THAT is the moment to design proper accessible selection semantics. When e2e-verifying selection, check the card's `card-selected-*` class + visuals, not aria state; the wash overlay unmounts after ~1.15 s.

## Paleta clara VIGENTE y FINAL en todo el sitio (jul 2026)
Rule: standing palette: former navy letters, script italics, blue prices and "Reservar por WhatsApp" button text → azul #4FA9DE (originally the sample's #78C8ED; brightened one step at the user's request when it faded against the truck-gray bg); ALL icons (stars, cars, check/X/clock, pin/list/user tabs, phone, hamburger, TikTok) → turquesa #96DCF6 (incl. the gradient CTA's MessageCircle); body bg = the user's truck color (gris azulado claro ~#B7C5D2, sampled from their Ford Ranger photo jul 2026), a soft vertical gradient #BCCAD6→#A9B8C4 with a faint white top glow — replaced the earlier turquoise gradient at the user's request. Main headings stay dark; silver "mantenimiento" theme untouched except its check icons; primary gradient buttons keep #0077D6→#37B6FF; Instagram keeps brand pink. Old #00EAFF tick superseded: #96DCF6 badge with dark #05435C check. Jul 2026: Detallado package-card body/tagline text darkened to #2E7FB8 and both cards share the same light glass style — user found #4FA9DE text lost on blue-tinted cards and explicitly wants both cards IDENTICAL (no premium/popular card-background differentiation).
**Why:** after applying the light palette, the user briefly asked for more clarity; a deepened-hue pass (#1D80C3/#2CA5DC + white CTA text) was applied and the user IMMEDIATELY asked to undo it — they prefer the soft light look over legibility. Reviewers' contrast complaints are consciously overridden by the user.
**How to apply:** never darken these tones or "fix" contrast again unless the user gives a new explicit spec. If they mention readability, ask what exact element bothers them before touching the global palette.

## Filtrado por categoría en #tarifas (UX deliberada)
"Más información" filters the plan matrix + price table to that package's category; the "Ver los 4 paquetes" chip resets. User wanted the section less overloaded — keep this behavior.
