# Technology Stack: Trellone

## 1. Core Frameworks and Tooling

- React 18.3.1
- TypeScript ~5.7.2
- Vite 6.1.0 with SWC plugin
- React Router DOM 6.29.0

Authoritative references:

- Project scripts and dependencies: [package.json](package.json)
- App entry and routing: [src/App.tsx](src/App.tsx)
- HTML entry: [index.html](index.html)

## 2. UI and Styling

- Material‑UI (MUI) 5.16.14
- @mui/icons-material 5.16.14
- @mui/lab 5.0.0‑alpha.163
- @mui/x-date-pickers 6.9.2
- Emotion 11.14.0
- Theme defined via [experimental_extendTheme](src/theme.ts:2)

Theme and overrides:

- MUI color schemes (light/dark) and component overrides: [extendTheme()](src/theme.ts:46)
- CssBaseline, AppBar, Button, OutlinedInput, ListItemButton overrides:
  - [MuiCssBaseline.styleOverrides](src/theme.ts:84)
  - [MuiAppBar.styleOverrides](src/theme.ts:101)
  - [MuiButton.styleOverrides](src/theme.ts:118)
  - [MuiOutlinedInput.styleOverrides](src/theme.ts:139)
  - [MuiListItemButton.styleOverrides](src/theme.ts:149)

Layout constants are centralized under `theme.trellone`:

- [trellone config block](src/theme.ts:46)

## 3. State Management

- Redux Toolkit 2.6.0
- React‑Redux 9.2.0
- Redux Persist 6.0.0
- RTK Query (bundled with Redux Toolkit)

Store configuration:

- [configureStore()](src/lib/redux/store.ts:34)
- Persistence with whitelist auth: [persistReducer](src/lib/redux/store.ts:21)
- RTK Query middlewares: [apiMiddlewares](src/lib/redux/store.ts:23)

Root reducer and slices:

- [root.reducer.ts](src/store/root.reducer.ts)
- Slices:
  - [auth.slice.ts](src/store/slices/auth.slice.ts)
  - [app.slice.ts](src/store/slices/app.slice.ts)
  - [board.slice.ts](src/store/slices/board.slice.ts)
  - [card.slice.ts](src/store/slices/card.slice.ts)
  - [notification.slice.ts](src/store/slices/notification.slice.ts)
  - [workspace.slice.ts](src/store/slices/workspace.slice.ts)

## 4. Data Access Layer (RTK Query + Axios)

- Axios 1.8.3 (JSON, withCredentials)
- RTK Query with custom baseQuery wrapping axios

Key pieces:

- Base query wrapper: [axiosBaseQuery()](src/lib/redux/helpers.ts:5)
- Workspace API with tags and invalidations: [workspaceApi = createApi()](src/queries/workspaces.ts:23)
  - Queries: [getWorkspaces](src/queries/workspaces.ts:41), [getWorkspace](src/queries/workspaces.ts:52)
  - Mutations: [addWorkspace](src/queries/workspaces.ts:28), [updateWorkspace](src/queries/workspaces.ts:57), [editWorkspaceMemberRole](src/queries/workspaces.ts:65), [leaveWorkspace](src/queries/workspaces.ts:77), [removeWorkspaceMember](src/queries/workspaces.ts:85), [joinWorkspaceBoard](src/queries/workspaces.ts:140)

## 5. HTTP Client and Auth

- Token lifecycle maintained in a dedicated Http class
- Access token attached on requests; refresh token flow on 401

Implementation:

- [class Http](src/lib/http.ts:24)
- Request interceptor (attach token, trigger loading indicator): [interceptors.request.use](src/lib/http.ts:41)
- Response interceptor (login/logout side effects): [interceptors.response.use](src/lib/http.ts:59)
- Refresh token logic: [handleRefreshToken](src/lib/http.ts:131)
- Logout on unauthorized/error paths: [logout dispatch](src/lib/http.ts:123)

Utilities referenced:

- Storage helpers (set/clear tokens, event target): [utils/storage.ts](src/utils/storage.ts)
- Error guards (e.g., isAxiosUnauthorizedError): [utils/error-handlers.ts](src/utils/error-handlers.ts)
- Loading indicator utility: [interceptorLoadingElements](src/utils/utils.ts)

## 6. Real‑time Communication

- Socket.IO client 4.8.1
- Auth header refreshed on reconnect attempts

Implementation:

- Socket factory: [generateSocketInstace()](src/lib/socket.ts:4)
- Reconnect auth refresh: [socket.io reconnect handler](src/lib/socket.ts:19)

Integration with app lifecycle:

- Socket instance created when authenticated in app shell: [App.tsx](src/App.tsx)

## 7. Forms and Validation

- React Hook Form 7.54.2
- Zod 3.24.2 with @hookform/resolvers 3.10.0
- MUI form components, consistent error display components

Key usage:

- Schemas under `src/schemas/*`
- RHF patterns and custom components (TextFieldInput, FieldErrorAlert) across forms
- Example pages for account settings, workspace settings (routing in [App.tsx](src/App.tsx))

## 8. Rich Content and UX Utilities

- @uiw/react-md-editor 4.0.5 with rehype-sanitize 6.0.0
- emoji-picker-react 4.12.3
- react-toastify 11.0.5
- date-fns 2.30.0
- lodash 4.17.21

## 9. Build, Lint, and Scripts

NPM scripts:

- dev: vite dev server with host: [package.json](package.json)
- build: typecheck + vite build: [package.json](package.json)
- preview: vite preview: [package.json](package.json)
- lint: eslint flat config: [package.json](package.json)
- lint:fix, prettier, prettier:fix: [package.json](package.json)

Dev dependencies:

- ESLint 9.19.0, typescript‑eslint 8.22.0
- Prettier 3.5.2, eslint‑plugin‑prettier 5.2.3
- @vitejs/plugin-react-swc 3.5.0
- rollup-plugin-visualizer 5.14.0
- types: node/react/react-dom/lodash/randomcolor
- vite-plugin-svgr 4.3.0

## 10. Environment and Configuration

- Vite environment variables (must be prefixed with VITE\_)
- Example .env keys in [AGENTS.md](AGENTS.md)
- Base URL is read from env config (see constants/config, not listed here)

## 11. Browser and Security Considerations

- Modern browsers with ES6+ and WebSocket support
- LocalStorage token handling; axios withCredentials enabled
- Sanitization of markdown content (rehype-sanitize)
- Protected route and verification guards (see [App.tsx](src/App.tsx))

## 12. Operational Notes and Best Practices

- Use RTK Query tags for fine‑grained invalidation
- Prefer optimistic UI combined with socket broadcasts where applicable
- Keep axios interceptors free of heavy logic; dispatch only on auth changes
- Maintain theme consistency through theme.trellone metrics and sx patterns
- Persist only minimal state (auth) to avoid rehydration performance issues

## 13. Quick References

- Routing and guards: [export default App](src/App.tsx:230)
- Store configuration: [configureStore()](src/lib/redux/store.ts:34)
- Axios base query: [axiosBaseQuery()](src/lib/redux/helpers.ts:5)
- Token refresh: [handleRefreshToken](src/lib/http.ts:131)
- Socket factory: [generateSocketInstace()](src/lib/socket.ts:4)
