---
name: Monorepo db/api quirks
description: Gotchas when adding DB tables and API routes in this pnpm monorepo
---

- After adding exports to `lib/db` (composite TS project), `tsc --noEmit` in `artifacts/api-server` fails with "no exported member" until you run `pnpm exec tsc -b` (rebuilds project-reference declarations).
- **Why:** api-server consumes lib/db via stale `.d.ts` from project references, not source.
- Schema push: `cd lib/db && pnpm run push` (drizzle-kit). API server needs a workflow restart after new routes.
- Reviews POST endpoint is public/anonymous with a simple in-memory IP rate limit (3/hour); moderation and pagination were deliberately deferred as proposed tasks.
