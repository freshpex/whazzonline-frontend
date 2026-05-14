# Whazzonline Frontend

Storefront for Whazzonline, built for Blawdigital's mini e-commerce.

## Overview

This app delivers:

- Product listing with search, category filter, stock filter, sort, pagination, and skeleton loading states
- Product details with quantity controls, wishlist actions, and add-to-cart feedback
- Cart with quantity management, totals, persistence, and payment simulation checkout
- Authentication screens (login/sign-up), route guards, and role-based access flow
- Admin panel for product creation and controlled user creation
- Product reviews (read + write)
- Dark mode with persistence
- Responsive layout for mobile, tablet, and desktop
- Lazy-loaded product imagery and motion polish

## Tech Stack

- React 18 + TypeScript
- React Router
- TanStack Query
- Zustand + persist middleware
- Axios
- Tailwind CSS
- Vitest + Testing Library
- Vite

## Project Structure

```txt
src/
  app/
    admin/
    auth/
    cart/
    orders/
    products/
    wishlist/
  components/
    auth/
    empty-state/
    feedback/
    layout/
    media/
  hooks/
  lib/
  routes/
  store/
```

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

- `VITE_API_BASE_URL` Example: `http://localhost:4000/api/v1`

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Scripts

- `npm run dev` Start local Vite dev server
- `npm run build` Create production build
- `npm run preview` Preview production build
- `npm run check` Run lint + typecheck + tests

## Main Routes

- `/` Product listing
- `/products/:productId` Product details + reviews
- `/cart` Cart + payment simulation (auth required)
- `/wishlist` Wishlist (auth required)
- `/login` Login
- `/signup` Sign-up
- `/panel` Admin/Vendor panel (role-restricted)

## Deployment

Recommended: Vercel

Set on Vercel:

- `VITE_API_BASE_URL=https://<your-backend-domain>/api/v1`

## Known Limitations

- No real payment gateway integration (checkout is simulated)
- No image upload functionality yet; admin currently accepts image URLs
- No server-side session refresh token flow yet

## What We'd Improve Next

- Full admin catalog management (edit/delete product, inventory workflow)
- Dedicated order history page for buyers and vendors
- E2E tests for checkout/reviews/auth critical paths
- Accessibility pass with automated checks and keyboard-flow audits
