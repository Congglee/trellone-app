# Tech Overview

Project type: React 18 + TypeScript + Vite SPA.

## Core runtime dependencies

- React: ^18.3.1
- React Router DOM: ^6.29.0
- Redux Toolkit: ^2.6.0, React Redux: ^9.2.0, redux-persist: ^6.0.0
- Axios: ^1.8.3
- Socket.IO client: ^4.8.1
- Material-UI: @mui/material ^5.16.14, @mui/icons-material ^5.16.14, @mui/lab ^5.0.0-alpha.163
- @mui/x-date-pickers: ^6.9.2, date-fns: ^2.30.0
- React Hook Form: ^7.54.2, Zod: ^3.24.2, @hookform/resolvers: ^3.10.0
- @dnd-kit/core ^6.3.1, @dnd-kit/sortable ^7.0.2, @dnd-kit/utilities ^3.2.2
- react-toastify: ^11.0.5
- @uiw/react-md-editor: ^4.0.5, rehype-sanitize: ^6.0.0
- lodash: ^4.17.21, jwt-decode: ^4.0.0, emoji-picker-react: ^4.12.3, randomcolor: ^0.6.2, mui-color-input: ^1.1.1, @uidotdev/usehooks: ^2.4.1

## Build and tooling

- Vite: ^6.1.0 with @vitejs/plugin-react-swc: ^3.5.0 and vite-plugin-svgr: ^4.3.0
- TypeScript: ~5.7.2
- ESLint: ^9.19.0 with typescript-eslint: ^8.22.0, eslint-plugin-react-hooks: ^5.0.0, eslint-plugin-react-refresh: ^0.4.18
- Prettier: ^3.5.2, eslint-config-prettier: ^10.0.1, eslint-plugin-prettier: ^5.2.3
- rollup-plugin-visualizer: ^5.14.0

## NPM scripts

- dev: vite --host
- build: tsc -b &#38;&#38; vite build
- preview: vite preview
- lint: eslint .
- lint:fix: eslint . --fix
- prettier: prettier --check "src/\*_/(_.tsx|_.ts|_.css|\*.scss)"
- prettier:fix: prettier --write "src/\*_/(_.tsx|_.ts|_.css|\*.scss)"

## Environment configuration

- import.meta.env.MODE selects development vs production
- Required Vite env variables (see src/constants/config.ts):
  - VITE_APP_DEV_API_URL
  - VITE_APP_PROD_API_URL
  - VITE_GOOGLE_CLIENT_ID
  - VITE_GOOGLE_REDIRECT_URI

## HTTP client and API

- Axios instance with interceptors: src/lib/http.ts
- RTK Query baseQuery wrapper over Axios: src/lib/redux/helpers.ts
- Token lifecycle: login stores access/refresh, auto refresh on 401 with expired token, deduped refresh requests, LS clear and logout dispatch on failure

## State management

- Redux store with persistence (auth slice only): src/lib/redux/store.ts
- Root reducer combines feature slices and RTK Query API reducers: src/store/root.reducer.ts

## Real-time

- Socket.IO client with Bearer Authorization and reconnect auth refresh: src/lib/socket.ts

## UI and theming

- Material-UI experimental CSS Vars theme with trellone-specific layout tokens and component overrides: src/theme.ts
- Global providers setup in src/main.tsx (Redux, PersistGate, Router, Helmet, CssVarsProvider, ConfirmProvider, LocalizationProvider, ErrorBoundary, ToastContainer)

## Code organization

- Feature-first pages under src/pages, reusable components under src/components
- Queries (RTK Query APIs) under src/queries
- Slices under src/store/slices
- Utilities under src/utils; constants under src/constants; schemas under src/schemas

## Developer workflow

- Start dev server: npm run dev
- Type-check: npx tsc -b --noEmit
- Lint and format: npm run lint &#38;&#38; npm run prettier
- Build: npm run build, then preview production bundle: npm run preview

## Conventions and constraints

- Use RTK Query for all HTTP interactions via axiosBaseQuery
- Persist only authentication state via redux-persist
- Use Zod schemas with RHF for all forms
- Use MUI sx prop and theme tokens; avoid deprecated styling systems
- Use react-toastify for user feedback; avoid ad-hoc toasts
- Path alias ~ points to src (configured in Vite)

## Security considerations

- Authorization header is set from in-memory/LS token
- Refresh-token flow protects against expired tokens; on failure, storage is cleared and logout is dispatched
- Markdown content sanitized with rehype-sanitize
- Environment variables prefixed with VITE\_ only; do not include secrets in client bundle
