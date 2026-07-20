---
name: Decorative card selection is intentional
description: Package cards' wash/glow selection is pointer-only by user choice; don't re-add select buttons unasked.
---

# Package-card selection is pointer-only decoration BY DESIGN

Rule: on the landing's package cards, the card-body click that triggers the wash animation + selected glow is a decorative, pointer-only flourish. It intentionally has no `role`, `tabIndex`, or `aria-pressed`, and there is no dedicated select button.

**Why:** the user explicitly replaced the earlier accessible "Seleccionar" toggle buttons with "Más información" links (in-page anchors that scroll to the #tarifas section and highlight that package's column there). Selection currently has no functional consequence — every real action (Más información, Reservar) is a proper link. Code review flags this as a medium a11y gap; it was consciously accepted to honor the user's design.

**How to apply:** do not "fix" this by re-adding aria-pressed buttons or card button semantics without the user asking. If a future feature makes selection functional (e.g. booking via WhatsApp with the chosen package pre-filled), THAT is the moment to design proper accessible selection semantics. When e2e-verifying selection, check the card's `card-selected-*` class + visuals, not aria state; the wash overlay unmounts after ~1.15 s.

## Paleta clara VIGENTE en todo el sitio (jul 2026)
Rule: standing palette from the user's two-tone sample image: former navy letters, script italics, blue prices and "Reservar por WhatsApp" button text → azul claro #78C8ED; ALL icons (stars, cars, check/X/clock, pin/list/user tabs, phone, hamburger, TikTok) → turquesa #96DCF6; body bg = subtle turquesa→azul claro vertical gradient. Main headings stay dark; the silver "mantenimiento" theme is untouched except its check icons; primary gradient buttons keep #0077D6→#37B6FF; Instagram keeps brand pink.
**Why:** the user rejected a PARTIAL version of this palette one day, then returned with a detailed spec enumerating every element — palette picks here are volatile and only the latest explicit spec counts. The old #00EAFF "included" tick was superseded: now a #96DCF6 badge with dark #05435C check kept for legibility.
**How to apply:** never contrast-"fix" these picks unasked. Reviewers flag the light CTA text on the blue gradient WhatsApp button — that exact combo was explicitly requested; it was disclosed to the user with an offer of white. If a new sample image arrives, apply fully but keep the swap cheap (grep-count verification + hero screenshot).

## Filtrado por categoría en #tarifas (UX deliberada)
"Más información" filters the plan matrix + price table to that package's category; the "Ver los 4 paquetes" chip resets. User wanted the section less overloaded — keep this behavior.
