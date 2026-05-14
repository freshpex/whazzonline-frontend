# Frontend Architecture

## Architectural Style

The frontend follows a feature-first modular architecture:

- `src/app/<feature>` owns feature components, hooks, services, and types
- `src/components` contains reusable cross-feature UI building blocks
- `src/store` holds global client state (auth, cart, theme, wishlist)
- `src/lib` provides API client and shared formatting/query utilities

This keeps domain logic close to each feature while avoiding monolithic component sprawl.

## High-Level Flow

1. Route layer maps URL to feature pages (`src/routes/AppRoutes.tsx`)
2. Feature hooks call API services via TanStack Query
3. Global state (cart/auth/theme/wishlist) is handled by persisted Zustand stores
4. UI components render optimistic/loading/error/empty/success states

## State Boundaries

- Server state: TanStack Query (`products`, `product details`, `reviews`, `checkout` responses)
- Client session state: Zustand (`auth`, `cart`, `theme`, `wishlist`)
- Local view state: component-level `useState` (form controls, transient UI feedback)

## Current Feature Modules

- `products`: catalog listing, filters, pagination, product details, reviews
- `cart`: quantity management, totals, payment simulation trigger
- `orders`: checkout API integration
- `wishlist`: save/remove product workflow
- `auth`: sign-up/login and role-aware guard integration
- `admin`: product creation + managed user creation UI

## Design & UX Principles Applied

- Responsive-first layout using Grid/Flex
- Immediate feedback for action outcomes (toast + inline alerts)
- Dark mode persistence and route-wide theming
- Lazy-loaded imagery to reduce initial render cost
- Motion used for hierarchy and perceived performance (`animate-fade-up`)

## Scalability Notes

The codebase is ready to evolve into:

- Additional role-specific dashboards
- Order history and vendor analytics features
- Richer product media workflows
- Incremental migration to SSR/edge rendering if needed
