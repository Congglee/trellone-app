# Trellone Directory Structure and File Organization

## Brief overview

This rule documents the complete directory structure and important files/folders of the Trellone project. It serves as a reference guide for understanding the project organization, locating specific functionality, and maintaining consistent file placement patterns. This is project-specific documentation for the React TypeScript Trello clone application.

## Project root structure

- **Configuration files** are placed at the project root level for build tools, linting, and deployment
- **Source code** is organized under `src/` with feature-based directory structure
- **Static assets** are stored in `public/` for direct serving
- **Documentation** includes comprehensive README.md and memory-bank for project context

## Core configuration files

- [`package.json`](package.json) - Project dependencies, scripts, and metadata with React 18.3.1, TypeScript 5.7.2, and Material-UI 5.16.14
- [`vite.config.ts`](vite.config.ts) - Vite build configuration with React SWC, SVGR plugin, and path aliases (`~` for `./src`)
- [`tsconfig.json`](tsconfig.json) - TypeScript configuration with references to app and node configs
- [`eslint.config.js`](eslint.config.js) - ESLint 9.19.0 configuration with TypeScript and React rules
- [`vercel.json`](vercel.json) - Vercel deployment configuration with SPA routing support
- [`index.html`](index.html) - Main HTML template with Vite entry point

## Source directory organization (`src/`)

### Core application files

- [`App.tsx`](src/App.tsx) - Main application component with routing and authentication logic
- [`main.tsx`](src/main.tsx) - Application entry point with provider setup (Redux, Router, MUI Theme)
- [`theme.ts`](src/theme.ts) - Material-UI theme configuration with dark/light mode support
- [`index.css`](src/index.css) - Global CSS styles and Material-UI customizations
- [`vite-env.d.ts`](src/vite-env.d.ts) - Vite environment type definitions

### Feature-based directories

#### Components (`src/components/`)

- **AppBar/** - Main application bar component
- **Dialog/** - Modal dialogs (NewBoardDialog, NewWorkspaceDialog)
- **Form/** - Form components (TextFieldInput, ToggleFocusInput, FieldErrorAlert)
- **Loading/** - Loading indicators and spinners (PageLoadingSpinner)
- **Modal/** - Complex modals (ActiveCard with attachments, dates, comments)
- **NavBar/** - Navigation with search, create, profile, notifications, workspaces
- **ErrorBoundary/** - Error handling and fallback UI
- **SEO/** - SEO component for metadata management
- **Workspace/** - Workspace-related UI components

#### Pages (`src/pages/`)

- **Auth/** - Authentication pages (Login, Register, OAuth, ForgotPassword, ResetPassword)
  - **layouts/AuthLayout/** - Authentication page layout wrapper
- **Boards/** - Board management and details
  - **BoardDetails/** - Main board view with drag-and-drop functionality
  - **BoardInvitationVerification/** - Board invitation handling
- **Workspaces/** - Workspace dashboard and board organization
  - **pages/Home/** - Workspace dashboard
  - **pages/BoardsList/** - List of workspace boards
  - **layouts/HomeLayout/** - Workspace layout with navigation
- **Settings/** - User settings and account management
- **FrontPage/** - Marketing/landing page components
- **404/** - Error page with NotFound component

#### State management (`src/store/`)

- [`root.reducer.ts`](src/store/root.reducer.ts) - Root reducer combining all slices
- **slices/** - Redux Toolkit slices for different domains:
  - [`auth.slice.ts`](src/store/slices/auth.slice.ts) - User authentication state
  - [`app.slice.ts`](src/store/slices/app.slice.ts) - Application-wide state (socket connections)
  - [`board.slice.ts`](src/store/slices/board.slice.ts) - Active board state management
  - [`card.slice.ts`](src/store/slices/card.slice.ts) - Active card state management
  - [`notification.slice.ts`](src/store/slices/notification.slice.ts) - Notification system state
  - [`workspace.slice.ts`](src/store/slices/workspace.slice.ts) - Workspace state management

#### API layer (`src/queries/`)

- [`auth.ts`](src/queries/auth.ts) - Authentication endpoints (login, register, OAuth)
- [`boards.ts`](src/queries/boards.ts) - Board management endpoints (CRUD, invitations)
- [`cards.ts`](src/queries/cards.ts) - Card operations endpoints (CRUD, attachments, comments)
- [`columns.ts`](src/queries/columns.ts) - Column management endpoints (CRUD, reordering)
- [`users.ts`](src/queries/users.ts) - User management endpoints (profile, settings)
- [`medias.ts`](src/queries/medias.ts) - File upload and media handling endpoints
- [`invitations.ts`](src/queries/invitations.ts) - Board invitation system endpoints
- [`workspaces.ts`](src/queries/workspaces.ts) - Workspace management endpoints

#### Technical infrastructure

##### Library configurations (`src/lib/`)

- [`http.ts`](src/lib/http.ts) - Axios HTTP client configuration
- [`socket.ts`](src/lib/socket.ts) - Socket.io client configuration with JWT auth
- [`sensors.ts`](src/lib/sensors.ts) - Drag-and-drop sensor configuration for @dnd-kit
- [`jwt-decode.ts`](src/lib/jwt-decode.ts) - JWT token decoding utilities
- **redux/** - Redux store configuration:
  - [`store.ts`](src/lib/redux/store.ts) - Store setup with persistence and middleware
  - [`hooks.ts`](src/lib/redux/hooks.ts) - Typed Redux hooks (useAppDispatch, useAppSelector)
  - [`helpers.ts`](src/lib/redux/helpers.ts) - Custom axios base query for RTK Query

##### Validation schemas (`src/schemas/`)

- [`auth.schema.ts`](src/schemas/auth.schema.ts) - Authentication-related Zod schemas
- [`board.schema.ts`](src/schemas/board.schema.ts) - Board management schemas
- [`card.schema.ts`](src/schemas/card.schema.ts) - Card operation schemas
- [`user.schema.ts`](src/schemas/user.schema.ts) - User management schemas

##### Type definitions (`src/types/`)

- [`jwt.type.ts`](src/types/jwt.type.ts) - JWT and authentication-related types
- [`query-params.type.ts`](src/types/query-params.type.ts) - URL query parameter interfaces
- [`utils.type.ts`](src/types/utils.type.ts) - General utility types and error handling

##### Utilities (`src/utils/`)

- [`utils.ts`](src/utils/utils.ts) - General utilities (color generation, placeholders, DOM manipulation)
- [`validators.ts`](src/utils/validators.ts) - File and data validation functions
- [`storage.ts`](src/utils/storage.ts) - Local storage management utilities
- [`error-handlers.ts`](src/utils/error-handlers.ts) - Error type checking and handling functions
- [`oauth.ts`](src/utils/oauth.ts) - OAuth and authentication utilities
- [`formatters.ts`](src/utils/formatters.ts) - String and data formatting functions
- [`sorts.ts`](src/utils/sorts.ts) - Array sorting and ordering utilities

##### Constants (`src/constants/`)

- [`config.ts`](src/constants/config.ts) - Environment and application configuration
- [`type.ts`](src/constants/type.ts) - Type definitions, enums, and value arrays
- [`path.ts`](src/constants/path.ts) - Route path definitions
- [`pagination.ts`](src/constants/pagination.ts) - Pagination-related constants
- [`http-status-code.ts`](src/constants/http-status-code.ts) - HTTP status code enum
- [`mock-data.ts`](src/constants/mock-data.ts) - Mock data for development/testing
- [`animations.ts`](src/constants/animations.ts) - Animation configuration constants
- [`front-page.ts`](src/constants/front-page.ts) - Front page content constants
- [`site.ts`](src/constants/site.ts) - Site-wide constants and metadata

##### Custom hooks (`src/hooks/`)

- [`use-debounce.ts`](src/hooks/use-debounce.ts) - Debounce functionality hook
- [`use-infinite-scroll.ts`](src/hooks/use-infinite-scroll.ts) - Infinite scroll functionality
- [`use-query-config.ts`](src/hooks/use-query-config.ts) - Query configuration management
- [`use-query-params.ts`](src/hooks/use-query-params.ts) - URL search params handling

##### Assets (`src/assets/`)

- **404/** - 404 page assets
- **auth/** - Authentication page assets
- **front-page/** - Landing page assets
- **react.svg** - React logo
- **trello.svg** - Trello-style logo

## Static assets (`public/`)

- **Favicon files** - Complete favicon set (favicon.ico, apple-touch-icon.png, android-chrome variants)
- **Logo files** - Application logos (logo.png, trellone.svg, board.svg)
- **Social media** - Open Graph image (og.png) for social sharing
- **Build assets** - Vite logo (vite.svg) for development

## Documentation and context (`memory-bank/`)

- [`activeContext.md`](memory-bank/activeContext.md) - Current development context
- [`productContext.md`](memory-bank/productContext.md) - Product requirements and features
- [`progress.md`](memory-bank/progress.md) - Development progress tracking
- [`projectbrief.md`](memory-bank/projectbrief.md) - Project overview and goals
- [`systemPatterns.md`](memory-bank/systemPatterns.md) - Architecture patterns and conventions
- [`techContext.md`](memory-bank/techContext.md) - Technical stack and implementation details

## File naming conventions

- **Components** - PascalCase for directories and files (e.g., `NavBar/NavBar.tsx`)
- **Utilities** - kebab-case for files (e.g., `error-handlers.ts`, `use-debounce.ts`)
- **Constants** - kebab-case with descriptive names (e.g., `http-status-code.ts`)
- **Types** - kebab-case with `.type.ts` suffix (e.g., `jwt.type.ts`)
- **Schemas** - kebab-case with `.schema.ts` suffix (e.g., `auth.schema.ts`)
- **Slices** - kebab-case with `.slice.ts` suffix (e.g., `auth.slice.ts`)

## Import path patterns

- **Absolute imports** - Use `~` alias for src directory (configured in vite.config.ts)
- **Index exports** - Components export through index.ts files for clean imports
- **Relative imports** - Used within the same feature directory
- **Type imports** - Use `import type` for TypeScript type-only imports

## Key architectural patterns

- **Feature-based organization** - Group related files by feature rather than file type
- **Barrel exports** - Use index.ts files to create clean import paths
- **Separation of concerns** - Clear separation between UI, state, API, and utilities
- **Type safety** - Comprehensive TypeScript coverage with strict mode
- **Component co-location** - Keep component-specific files close to the component
