---
name: E2E color/style checks
description: How to ask the testing subagent to verify colors or computed styles without false failures
---

Rule: when a test must verify a color or style, name the exact element (selector/classes/DOM position) and the exact computed property (e.g. `background-color` of the badge span, not the SVG stroke) in the plan upfront.

**Why:** a generic instruction like "check the checkmarks are cyan" made the tester sample unrelated decorative SVGs (brand-blue icons) and report a false failure, costing an extra follow-up round.

**How to apply:** in this design-heavy project many elements share similar colors on purpose; always distinguish the target element from intentional neighbors and state the expected rgb() value.
