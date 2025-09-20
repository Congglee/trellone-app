# Trellone Project Brief

## Project Overview

Trellone is a modern Trello-like project management SPA built with React and TypeScript. It provides boards, columns, and cards with real-time collaboration, advanced workspace management, and a polished Material‑UI interface. The app is bundled with Vite and integrates Redux Toolkit with RTK Query for state and data fetching.

Key implementation anchors:

- Routing, auth guards, and lazy loading in [`src/App.tsx`](src/App.tsx)
- Theme system in [`src/theme.ts`](src/theme.ts) using `extendTheme()`
- HTTP client with token lifecycle in [`src/lib/http.ts`](src/lib/http.ts) via `class Http`
- Socket.IO client factory in [`generateSocketInstace()`](src/lib/socket.ts)
- Redux store, persistence, and RTK Query middlewares in [`configureStore()`](src/lib/redux/store.ts)
- Workspace RTK Query slice in `workspaceApi = createApi()`
