# Frontend Architecture

The frontend is organized by feature under `src/app`. Shared reusable components live under `src/components`, while API utilities and cross-cutting helpers live under `src/lib`.

Each feature can own its components, modals, services, hooks, types, and root `index.ts` export. This keeps product, cart, auth, admin, and future features independent while still sharing common UI patterns.
