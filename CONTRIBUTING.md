# Frontend Contribution Guide

## Branching Convention

Create branches from `dev`:

```txt
users/<name>/<feature|bugfix|hotfix|chore|docs|refactor|test>/<description>
```

Example:

```txt
users/enoch/feature/payment-simulation-checkout
```

## Development Workflow

1. Pull latest `dev`.
2. Create branch with the convention above.
3. Keep commits focused and small.
4. Run all required checks locally.
5. Open PR into `dev` with context and evidence.

## Commit Message Style

Prefer conventional commit style:

- `feat: add product reviews submission on details page`
- `fix: guard lazy image for test environment`
- `docs: update architecture for wishlist and checkout`

## PR Checklist

Every PR should include:

- Clear summary of what changed
- Why the change was needed
- Screenshots/video for UI changes
- Test evidence (`npm run test`, `npm run build`)
- Any risks, assumptions, and known limitations

## Quality Gate (Must Pass)

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Frontend Standards

- Keep feature code inside `src/app/<feature>`
- Keep shared primitives in `src/components` or `src/lib`
- Prefer strongly typed API contracts in feature `types/`
- Add loading, error, and empty states for all user-facing data views
- Provide feedback to users for key actions (success/error/warning)

## Review Expectations

Reviewers should focus on:

- Functional correctness
- UX clarity (especially action feedback and edge states)
- Accessibility basics (labels, keyboard interactions, color contrast)
- Performance impact (bundle/runtime where relevant)
- Test coverage for behavioral changes
