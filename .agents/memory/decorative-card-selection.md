---
name: Decorative card selection is intentional
description: Package cards' wash/glow selection is pointer-only by user choice; don't re-add select buttons unasked.
---

# Package-card selection is pointer-only decoration BY DESIGN

Rule: on the landing's package cards, the card-body click that triggers the wash animation + selected glow is a decorative, pointer-only flourish. It intentionally has no `role`, `tabIndex`, or `aria-pressed`, and there is no dedicated select button.

**Why:** the user explicitly replaced the earlier accessible "Seleccionar" toggle buttons with "Más información" links (in-page anchors that scroll to the #tarifas section and highlight that package's column there). Selection currently has no functional consequence — every real action (Más información, Reservar) is a proper link. Code review flags this as a medium a11y gap; it was consciously accepted to honor the user's design.

**How to apply:** do not "fix" this by re-adding aria-pressed buttons or card button semantics without the user asking. If a future feature makes selection functional (e.g. booking via WhatsApp with the chosen package pre-filled), THAT is the moment to design proper accessible selection semantics. When e2e-verifying selection, check the card's `card-selected-*` class + visuals, not aria state; the wash overlay unmounts after ~1.15 s.

## Paleta dos tonos VIGENTE en todo el sitio (jul 2026)
Rule: standing palette after the user asked for legibility on light cards: former navy letters, script italics, blue prices and WhatsApp button text → azul #1D80C3; ALL icons (stars, cars, check/X/clock, pin/list/user tabs, phone, hamburger, TikTok) → turquesa #2CA5DC; the bottom gradient "Reservar por WhatsApp" CTA uses white text/icon; body bg = subtle light turquesa→azul claro vertical gradient. Main headings stay dark; the silver "mantenimiento" theme is untouched except its check icons; primary gradient buttons keep #0077D6→#37B6FF; Instagram keeps brand pink. Old #00EAFF tick superseded: #2CA5DC badge with dark #05435C check.
**Why:** the user's own sample tones (#78C8ED letters / #96DCF6 icons) were applied literally and the user then reported text/icons blending into the light cards; the fix was to deepen the SAME hues, not abandon the palette. Palette picks here are volatile — only the latest explicit request counts.
**How to apply:** when the user sends light sample colors again, applying them literally may fail on light backgrounds — deliver deeper same-hue tones for text and icons, keeping light tones for backgrounds and glows. Keep swaps cheap: hex-token grep counts + typecheck + one hero screenshot.

## Filtrado por categoría en #tarifas (UX deliberada)
"Más información" filters the plan matrix + price table to that package's category; the "Ver los 4 paquetes" chip resets. User wanted the section less overloaded — keep this behavior.
