# Product Definition: Trellone

## 1. Purpose

Provide a modern, self-hostable Trello-like project management experience with real-time collaboration, intuitive UX, and a production-ready frontend architecture.

Anchors in code:

- Routing, authentication guards, lazy loading in [App.tsx](src/App.tsx)
- Workspace CRUD and membership flows via [workspaceApi = createApi()](src/queries/workspaces.ts:23)
- HTTP client with token lifecycle [class Http](src/lib/http.ts:24)
- Real-time socket factory [generateSocketInstace()](src/lib/socket.ts:4)
- Redux store and middleware [configureStore()](src/lib/redux/store.ts:34)
- Theme system [extendTheme()](src/theme.ts:46)

## 2. Problem Statement

Teams need a flexible, collaborative tool for planning and tracking work. Existing tools can be costly or inflexible. Trellone offers an open, modern, and performant alternative focused on core Kanban flows and collaboration.

## 3. Core Features

- Boards, Columns, Cards
  - Create, reorder via drag-and-drop
  - Rich card content: markdown, attachments, due dates, cover, comments, reactions
- Workspaces
  - Board organization, members and guests management, role-sensitive actions
  - Settings and visibility management
- Authentication
  - JWT-based auth; token storage and refresh handled by HTTP client
  - Google OAuth ready (env-based config)
- Real-time Collaboration
  - Socket.IO client with resilient reconnection and up-to-date auth
- UX and Theming
  - Material‑UI 5 with light/dark schemes, responsive design
  - Consistent component overrides and typography
- State and Data
  - Redux Toolkit + RTK Query with cache invalidation and tags
  - Optimistic patterns combined with socket broadcasts

## 4. Target Users

- Engineering teams planning sprints and tasks
- Project managers coordinating work across boards
- SMBs/startups seeking self-hostable workflows
- Remote teams needing real-time, low-friction collaboration

## 5. User Stories

- As a user, I can create workspaces, boards, columns, and cards to organize tasks.
- As a collaborator, I can move cards between columns and see updates in real-time.
- As an owner, I can manage workspace members and guests, adjusting roles when needed.
- As a contributor, I can add descriptions, attachments, and due dates to cards.
- As a user, I can sign in, stay authenticated, and seamlessly continue after token refresh.
- As a user, I can benefit from responsive UI and consistent theming across devices.

Relevant flows:

- Route access and guards: [export default App](src/App.tsx:230)
- Workspace APIs: [workspaceApi = createApi()](src/queries/workspaces.ts:23)
- Token refresh flow: [Http.handleRefreshToken](src/lib/http.ts:131)

## 6. Success Metrics

- Engagement: daily active users, boards created, real-time session counts
- Performance: responsive interactions, low navigation latency
- Reliability: low error rate surfaced to toasts, successful reconnection rate
- UX: smooth DnD interactions, accessible contrast, theme consistency
- Code Quality: passing lint and type checks, maintainable TypeScript

## 7. Competitive Advantages

- Open and modern stack (React 18, MUI 5, Vite 6)
- Real-time-first experience with resilient socket handling
- Strong type safety and tooling via TypeScript and RTK Query
- Production-ready build pipeline and DX

## 8. Future Enhancements (Roadmap)

- Role-based permissions refinement across boards/workspaces
- Advanced visibility options and public sharing modes
- Analytics and activity insights
- Additional integrations (calendar, notifications)
- Containerization and deployment blueprints

## 9. Configuration and Environments

- Vite-based envs via VITE\_\* variables
- OAuth envs for Google provider
- API base URL via env-config in constants

## 10. References

- App routing and guards: [App.tsx](src/App.tsx)
- Workspaces API: [src/queries/workspaces.ts](src/queries/workspaces.ts)
- HTTP client: [src/lib/http.ts](src/lib/http.ts)
- Socket client: [src/lib/socket.ts](src/lib/socket.ts)
- Store config: [src/lib/redux/store.ts](src/lib/redux/store.ts)
- Theme: [src/theme.ts](src/theme.ts)
