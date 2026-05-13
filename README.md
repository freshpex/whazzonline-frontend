# Whazzonline Frontend

React + TypeScript + Tailwind CSS frontend for the Whazzonline mini e-commerce assessment.

## Architecture

```txt
src/
  app/
    products/
      components/
      hooks/
      modal/
      services/
      types/
      index.ts
    cart/
    auth/
    admin/
    home/
  components/
    empty-state/
    layout/
    protected-route/
    tables/
    ui/
  lib/
  routes/
```

## Local Setup

```bash
cp .env.example .env
npm install
npm run dev
```

## Required Checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Branching Standard

Create branches from `dev` only:

```txt
users/<name>/<feature|bugfix|hotfix|chore|docs|refactor|test>/<description>
```

Example:

```txt
users/enoch/feature/product-listing-ui
```

Direct push to `main` and `dev` is blocked by Husky locally. GitHub branch protection should require pull requests and passing CI before merge.

## Deployment

Recommended frontend deployment: Vercel.

Set this environment variable on Vercel:

- `VITE_API_BASE_URL=https://your-render-backend-url.com/api/v1`

## Known Limitations

Cart persistence currently uses `localStorage`. Server-side cart persistence will be added.
