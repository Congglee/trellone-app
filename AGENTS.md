# AGENTS.md

## Project overview

- **Purpose**: Trellone App is a React + TypeScript SPA for Trello-like boards/workspaces, talking to the Trellone API server.
- **Architecture**: Vite bundler, React 18, Redux Toolkit, Axios, Socket.IO client, Material UI (MUI), Zod.
- **Main modules**:
  - `src/pages`: route-driven screens
  - `src/components`: reusable UI
  - `src/lib`: HTTP client, sockets, redux store helpers
  - `src/queries`: API calls
  - `src/schemas`: Zod schemas
  - `src/constants`, `src/utils`, `src/hooks`, `src/store`, `src/theme.ts`
  - Aliases: `~/*` → `src/*` (Vite + TS configured)

## Setup commands

- **Requirements**: Node.js 20+ (Dockerfile uses Node 20). npm with `package-lock.json`.
- **Install**:

```bash
cd trellone-app
npm ci
```

- **Environment (Vite)**: create `.env.development` for local dev (Vite reads `.env*`).

```bash
# Client to API URLs
VITE_APP_DEV_API_URL=http://localhost:8000
VITE_APP_PROD_API_URL=https://api.example.com

# OAuth
VITE_GOOGLE_CLIENT_ID=
VITE_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Optional: allow vite preview to be accessed externally
VITE_PREVIEW_ALLOWED_HOSTS=localhost,127.0.0.1
```

- **Run dev server** (long-running on port 3000):

```bash
npm run dev
```

- **Build**:

```bash
npm run build
```

- **Preview built app** (long-running on port 3000):

```bash
npm run preview -- --host --port 3000
```

- **Lint / format**:

```bash
npm run lint
npm run lint:fix
npm run prettier
npm run prettier:fix
```

- **Type check**:

```bash
npx tsc -b --noEmit
```

<!-- TODO: confirm whether to add a dedicated typecheck script -->

## Code style & conventions

- **TypeScript**: strict mode enabled, JSX `react-jsx`; path alias `~/*`.
- **ESLint + Prettier**: single quotes, no semicolons, width 120, `jsxSingleQuote: true`.
- **MUI styling rules**: see `trellone-app/mui-styling-rules` for import and `sx` usage guidance.
- **Directory conventions**: feature-first under `src/pages/*` with colocated components where appropriate.

## Testing instructions

- No explicit test runner configured.
- **Proposal**: adopt Vitest + React Testing Library; standard commands:

```bash
# Suggested (not configured yet)
npx vitest run --reporter=verbose
```

<!-- TODO: confirm testing setup and add scripts -->

## Security considerations

- **Environment variables**: Only `VITE_*` variables are exposed to the client; never store secrets here.
- **Auth tokens**: Access/refresh tokens are stored in LocalStorage and attached as `authorization` headers; Axios uses `withCredentials: true`.
- **CORS**: Must align with server CORS whitelist; in dev, server allows all origins; production uses a whitelist.
- **Dependencies**: run `npm audit` periodically.

## Commit & PR guidelines

- **Conventional Commits** recommended (e.g., `feat:`, `fix:`, `docs:`). <!-- TODO: confirm -->
- **Pre-merge**: lint, build, and typecheck must pass.
- **Reviews/labels**: require 1 approval; label by scope (`app`, `ui`, `deps`). <!-- TODO: confirm -->

## Tooling & agent-executable commands

- Safe to run automatically:
  - `npm ci` — install deps
  - `npm run lint` — lint check
  - `npm run prettier` — formatting check
  - `npm run build` — typecheck + bundle
  - `npx tsc -b --noEmit` — typecheck only
- Long-running (run in background if needed):
  - `npm run dev`
  - `npm run preview -- --host --port 3000`

## Deployment steps

- **Vercel**: single-page app rewrite via `vercel.json`. Build command `npm run build`; output `dist/`.
  - Set environment variables in Vercel dashboard (`VITE_*`).
- **Docker (local or containerized hosting)**:

```bash
docker build -t trellone-app .
docker run --rm -p 3000:3000 trellone-app
```

- Container runs `vite preview` on port 3000; provide `VITE_*` vars at build/run as needed.
<!-- TODO: confirm hosting provider and env propagation strategy -->

## Data & assets

- Static assets in `public/` are served at root; additional assets in `src/assets/`.
- MDX/content in `mdx/` (if used by pages).

## Monorepo tips (context)

- This repo is the frontend. A separate sibling repo `trellone-server` contains the API.
- Keep an `AGENTS.md` in each repo; the nearest `AGENTS.md` governs agent behavior.

## Known pitfalls & gotchas

- Ensure `VITE_APP_DEV_API_URL` matches server origin and that cookies/cors are configured correctly.
- When using `vite preview` behind a proxy, set `VITE_PREVIEW_ALLOWED_HOSTS`.
- Path alias `~/*` must be supported both in Vite and TS (already configured).

## Support & ownership

- Maintainers: <!-- TODO: confirm -->
- Communication: <!-- TODO: confirm channel (Slack/Email) -->
