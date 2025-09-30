# Repository Guidelines

This guide helps maintainers and automation agents work consistently in the Trellone frontend codebase.

## Project Structure & Module Organization

- `src/` contains TypeScript source; feature folders such as `components/`, `pages/`, `queries/`, `store/`, and `hooks/` mirror runtime domains.
- Domain constants and schema validation live under `src/constants/` and `src/schemas/`; reusable types are in `src/types/`.
- `src/docs/` hold contributor-facing documentation; update them when flows change.
- Static assets stay in `public/`; Vite outputs production bundles to `dist/` (gitignored).
- CI/CD and workflow automation reside in `.github/`, while infra configs live alongside `Dockerfile` and `vercel.json`.

## Environment & Configuration

- Copy `.env.example` to `.env` and supply API endpoints, Google OAuth values, and preview host allowances before running the app.
- Never commit `.env`; if new variables are introduced, document them in the example file and README.
- Prefer the provided Dockerfile for reproducible preview builds when integrating with backend services.

## Build, Test, and Development Commands

```
npm install           # install dependencies
npm run dev           # start Vite dev server on http://localhost:3000
npm run build         # type-check and create production bundle in dist/
npm run preview       # serve the built bundle locally
npm run lint          # ESLint rules via eslint.config.js
npm run lint:fix      # auto-fix lintable issues
npm run prettier      # enforce Prettier formatting rules
npm run prettier:fix  # write formatted output
```

## Coding Style & Naming Conventions

- Two-space indentation and spaces only (`.editorconfig` enforced).
- Prettier enforces single quotes, 120-character line width, and no semicolons; run formatters before committing.
- Name React components and exported hooks in PascalCase; colocate component-specific styles and tests with the component folder.
- Use camelCase for variables and functions; constant objects that model enums should be UPPER_SNAKE_CASE.

## Testing Guidelines

- No automated test runner is configured yet; include manual QA notes in PR descriptions (steps, expected result, screenshots).
- When adding tests, align with maintainers on Vitest + React Testing Library; place specs beside the unit under test (e.g., `ComponentName.test.tsx`).
- Guard asynchronous features with mockable abstractions in `lib/` to simplify future test scaffolding.

## Commit & Pull Request Guidelines

- Follow Conventional Commits, mirroring existing history (`docs:`, `refactor(scope): message`); scope names should match folders or domains.
- Reference related issues in the PR body, summarize functional changes, and attach before/after screenshots or recordings for UI tweaks.
- Ensure lint and build steps pass locally before requesting review; link backend branches or feature flags when relevant.
