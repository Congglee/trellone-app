# Repository Guidelines

## Project Structure & Module Organization
Trellone is a Vite + React + TypeScript client. Application code lives in `src/`. Shared UI components sit in `src/components/`, route-level views in `src/pages/`, and reusable logic in `src/hooks/`. Data fetching and server mutations are organized under `src/queries/`, while Redux logic stays in `src/store/` (for example `board.slice.ts`). Domain contracts are defined in `src/schemas/` and `src/types/`; helpers and constants live in `src/utils/` and `src/constants/`. Static media belongs in `src/assets/`. `public/` serves unprocessed assets, `mdx/` hosts marketing content, and built bundles land in `dist/`; never commit manual edits there.

## Build, Test, and Development Commands
- `npm install`: provision dependencies before any build.
- `npm run dev`: start Vite with hot reload on all interfaces (`--host`).
- `npm run build`: run TypeScript project references then create a production bundle.
- `npm run preview`: serve the latest production build for acceptance smoke tests.
- `npm run lint` / `npm run lint:fix`: apply the ESLint plus Prettier rule set.
- `npm run prettier` / `npm run prettier:fix`: verify or rewrite formatting for TS, TSX, CSS, and SCSS.

## Coding Style & Naming Conventions
We use 2-space indentation and spaces only (see `.editorconfig`). ESLint is configured with TypeScript, React Hooks, and Prettier integration; expect `semi: false`, single quotes, and 120 character lines. Name React components and files with PascalCase (`BoardColumn.tsx`), hooks with `use` prefixes, Redux slices as `<feature>.slice.ts`, and schema or type exports with descriptive nouns.

## Testing Guidelines
An automated runner is not yet provisioned. When adding coverage, prefer Vitest with React Testing Library so the stack aligns with Vite. Co-locate specs as `*.test.tsx` beside the source and focus on board workflows, auth, and workspace permissions. Until the harness lands, capture manual QA notes in the pull request and always ship with `npm run lint` and `npm run build` passing.

## Commit & Pull Request Guidelines
Commits follow Conventional Commit syntax (`feat(board): ...`, `refactor:`). Keep messages scoped and imperative; squash fixups locally. For pull requests, include a concise summary, linked issue or tracking task, screenshots or GIFs for UI changes, a checklist of manual verifications, and call out any schema or environment updates.

## Environment & Configuration
Copy `.env.example` to `.env` and fill required secrets before running locally; never commit populated secrets. Docker support is available via `Dockerfile` for parity checks. Update `vercel.json` and `vite.config.ts` together when touching routing or deployment settings.
