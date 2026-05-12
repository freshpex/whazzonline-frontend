# Contribution Guide

## Workflow

1. Pull the latest `dev` branch.
2. Create your branch from `dev`.
3. Use the branch format: `users/<name>/<type>/<description>`.
4. Make focused commits with clear messages.
5. Run `npm run check` before pushing.
6. Open a pull request into `dev`.

## Commit Standard

Use clear conventional-style commits:

- `feat: add product cards`
- `fix: correct cart total calculation`
- `chore: update CI workflow`
- `docs: improve setup guide`

## Pull Request Rules

A PR must include:

- What changed
- Why it changed
- Screenshots for UI work
- Test evidence
- Known limitations

No PR should be merged if linting, type checking, tests, or build fails.
