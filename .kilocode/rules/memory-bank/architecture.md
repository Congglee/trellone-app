# Architecture Definition: Trellone

## 1. System Architecture

Trellone is a client-side, single-page application (SPA) built with React 18.3.1 and TypeScript 5.7.2. It communicates with a separate backend API for data persistence and real-time collaboration via Socket.io.

```mermaid
graph TD
    A[Client (React SPA)] -->|HTTP/HTTPS (Axios)| B(Backend API)
    A -->|WebSocket (Socket.io)| B
    A -->|Redux Store| C[Local State Management]
    A -->|RTK Query| D[API Cache Layer]
    C -->|Redux Persist| E[LocalStorage]
    A -->|Vite Build| F[Production Bundle]
```

## 2. Directory Structure

The `src` directory follows a feature-based organization with clear separation of concerns between components, pages, services, and state management.

**Core Application Structure:**

- **`/src/App.tsx`**: Main application component with routing, authentication logic, and protected/rejected route handling
- **`/src/main.tsx`**: Application entry point with comprehensive provider setup (Redux, Router, MUI Theme, Error Boundary)
- **`/src/theme.ts`**: Material-UI theme configuration with dark/light mode support and custom styling
- **`/src/index.css`**: Global CSS styles and Material-UI customizations

**Feature-Based Organization:**

- **`/src/assets`**: Static assets organized by feature (auth, 404, front-page, react.svg, trello.svg)
- **`/src/components`**: Reusable UI components organized by functionality

  - **`/src/components/AppBar`**: Main application bar component
  - **`/src/components/Dialog`**: Modal dialog components (NewBoardDialog, NewWorkspaceDialog)
  - **`/src/components/DrawerHeader`**: Drawer header component for navigation
  - **`/src/components/ErrorBoundary`**: Error handling and fallback UI
  - **`/src/components/Favicon`**: Dynamic favicon management component
  - **`/src/components/Form`**: Form-related components (TextFieldInput, ToggleFocusInput, FieldErrorAlert, VisuallyHiddenInput)
  - **`/src/components/Loading`**: Loading indicators and spinners (PageLoadingSpinner)
  - **`/src/components/Main`**: Main content wrapper component
  - **`/src/components/Modal`**: Complex modal components (ActiveCard with attachments, dates, comments, etc.)
  - **`/src/components/NavBar`**: Navigation bar with search, create, profile, notifications, workspaces
  - **`/src/components/SEO`**: SEO component for metadata management with react-helmet-async
  - **`/src/components/TooltipLink`**: Reusable tooltip link component
  - **`/src/components/Workspace`**: Workspace-related UI components (WorkspaceAvatar)

- **`/src/pages`**: Route-specific page components with lazy loading
  - **`/src/pages/Auth`**: Authentication pages (Login, Register, OAuth, ForgotPassword, ResetPassword, AccountVerification, ForgotPasswordVerification)
    - **`/src/pages/Auth/layouts/AuthLayout`**: Authentication page layout wrapper
  - **`/src/pages/Boards`**: Board management and details
    - **`/src/pages/Boards/BoardDetails`**: Main board view with drag-and-drop functionality
    - **`/src/pages/Boards/BoardDetails/components`**: Board-specific components (BoardBar, BoardContent, Card, Column, etc.)
    - **`/src/pages/Boards/BoardInvitationVerification`**: Board invitation handling
  - **`/src/pages/Workspaces`**: Workspace dashboard and board organization
    - **`/src/pages/Workspaces/pages/Home`**: Workspace dashboard with recently viewed boards
    - **`/src/pages/Workspaces/pages/BoardsList`**: List of workspace boards
    - **`/src/pages/Workspaces/pages/WorkspaceBoardsList`**: Workspace-specific board lists
    - **`/src/pages/Workspaces/layouts/HomeLayout`**: Workspace layout with navigation
    - **`/src/pages/Workspaces/components/NavigationMenu`**: Workspace navigation with collapse functionality
  - **`/src/pages/Settings`**: User settings and account management (AccountTab, SecurityTab)
  - **`/src/pages/FrontPage`**: Marketing/landing page with comprehensive components (Hero, Features, Productivity, Workflows, CTA, Footer)
  - **`/src/pages/404`**: Error page with NotFound component

**Technical Infrastructure:**

- **`/src/constants`**: Application-wide constants organized by domain

  - **`/src/constants/config.ts`**: Environment and application configuration
  - **`/src/constants/type.ts`**: Type definitions, enums, and value arrays
  - **`/src/constants/path.ts`**: Route path definitions
  - **`/src/constants/pagination.ts`**: Pagination-related constants
  - **`/src/constants/http-status-code.ts`**: HTTP status code enum
  - **`/src/constants/mock-data.ts`**: Mock data for development/testing
  - **`/src/constants/animations.ts`**: Animation configuration constants with keyframes
  - **`/src/constants/front-page.ts`**: Front page content constants and data
  - **`/src/constants/site.ts`**: Site-wide constants and metadata configuration

- **`/src/hooks`**: Custom React hooks for reusable logic

  - **`/src/hooks/use-debounce.ts`**: Debounce functionality hook
  - **`/src/hooks/use-infinite-scroll.ts`**: Infinite scroll functionality
  - **`/src/hooks/use-query-config.ts`**: Query configuration management
  - **`/src/hooks/use-query-params.ts`**: URL search params handling

- **`/src/lib`**: Third-party library configurations and core utilities

  - **`/src/lib/redux`**: Redux store configuration and helpers
    - **`/src/lib/redux/store.ts`**: Store setup with persistence and middleware
    - **`/src/lib/redux/hooks.ts`**: Typed Redux hooks (useAppDispatch, useAppSelector)
    - **`/src/lib/redux/helpers.ts`**: Custom axios base query for RTK Query
  - **`/src/lib/http.ts`**: Axios HTTP client configuration
  - **`/src/lib/socket.ts`**: Socket.io client configuration with JWT auth
  - **`/src/lib/sensors.ts`**: Drag-and-drop sensor configuration for @dnd-kit
  - **`/src/lib/jwt-decode.ts`**: JWT token decoding utilities

- **`/src/queries`**: RTK Query API definitions organized by entity

  - **`/src/queries/auth.ts`**: Authentication endpoints
  - **`/src/queries/boards.ts`**: Board management endpoints
  - **`/src/queries/cards.ts`**: Card operations endpoints
  - **`/src/queries/columns.ts`**: Column management endpoints
  - **`/src/queries/users.ts`**: User management endpoints
  - **`/src/queries/medias.ts`**: File upload/media handling
  - **`/src/queries/invitations.ts`**: Board invitation system
  - **`/src/queries/workspaces.ts`**: Workspace management endpoints

- **`/src/schemas`**: Zod validation schemas for type safety and form validation

  - **`/src/schemas/auth.schema.ts`**: Authentication-related schemas
  - **`/src/schemas/board.schema.ts`**: Board management schemas
  - **`/src/schemas/card.schema.ts`**: Card operation schemas
  - **`/src/schemas/user.schema.ts`**: User management schemas

- **`/src/store`**: Redux Toolkit store configuration

  - **`/src/store/slices`**: Redux slices for different feature domains
    - **`/src/store/slices/auth.slice.ts`**: User authentication state
    - **`/src/store/slices/app.slice.ts`**: Application-wide state (socket connections)
    - **`/src/store/slices/board.slice.ts`**: Active board state management
    - **`/src/store/slices/card.slice.ts`**: Active card state management
    - **`/src/store/slices/notification.slice.ts`**: Notification system state
    - **`/src/store/slices/workspace.slice.ts`**: Workspace state management
  - **`/src/store/root.reducer.ts`**: Root reducer combining all slices

- **`/src/types`**: TypeScript type definitions organized by domain

  - **`/src/types/jwt.type.ts`**: JWT and authentication-related types
  - **`/src/types/query-params.type.ts`**: URL query parameter interfaces
  - **`/src/types/utils.type.ts`**: General utility types and error handling

- **`/src/utils`**: General utility functions organized by functionality
  - **`/src/utils/utils.ts`**: General utilities (color generation, placeholders, DOM manipulation)
  - **`/src/utils/validators.ts`**: File and data validation functions
  - **`/src/utils/storage.ts`**: Local storage management utilities
  - **`/src/utils/error-handlers.ts`**: Error type checking and handling functions
  - **`/src/utils/oauth.ts`**: OAuth and authentication utilities
  - **`/src/utils/formatters.ts`**: String and data formatting functions
  - **`/src/utils/sorts.ts`**: Array sorting and ordering utilities

## 3. State Management Architecture

**Redux Toolkit 2.6.0 with RTK Query:**

- Centralized store with feature-based slices using Redux Toolkit patterns
- RTK Query for efficient data fetching, caching, and synchronization with automatic cache invalidation
- Redux Persist 6.0.0 for selective state persistence (auth state only)
- Custom axios base query for consistent HTTP handling across all API endpoints

**Key Redux Slices:**

- **`auth.slice.ts`**: User authentication state (isAuthenticated, profile)
- **`app.slice.ts`**: Application-wide state (socket connections, global UI state)
- **`board.slice.ts`**: Active board state management with async thunks for board details
- **`card.slice.ts`**: Active card state management with modal visibility
- **`notification.slice.ts`**: Notification system state and real-time updates
- **`workspace.slice.ts`**: Workspace state management and organization

**RTK Query API Slices:**

- **`authApi`**: Authentication endpoints (login, register, logout, OAuth)
- **`boardApi`**: Board management endpoints (CRUD operations, invitations)
- **`cardApi`**: Card operations endpoints (CRUD, attachments, comments)
- **`columnApi`**: Column management endpoints (CRUD, reordering)
- **`userApi`**: User management endpoints (profile, settings)
- **`mediaApi`**: File upload and media handling endpoints
- **`invitationApi`**: Board invitation system endpoints
- **`workspaceApi`**: Workspace management endpoints

## 4. Real-time Architecture

**Socket.io 4.8.1 Integration:**

- Dynamic socket instance creation with JWT authentication in headers
- Room-based collaboration (users join specific board rooms for isolated updates)
- Real-time events for board updates, card changes, user actions, and presence
- Automatic reconnection handling with connection state management
- Integration with Redux store for state synchronization

**Key Socket Events:**

- **Client Events**:
  - `CLIENT_JOIN_BOARD` - Join specific board room
  - `CLIENT_LEAVE_BOARD` - Leave board room
  - `CLIENT_USER_UPDATED_BOARD` - Broadcast board changes
  - `CLIENT_USER_UPDATED_CARD` - Broadcast card changes
- **Server Events**:
  - `SERVER_BOARD_UPDATED` - Receive board updates from other users
  - `SERVER_CARD_UPDATED` - Receive card updates from other users
  - `SERVER_USER_ACCEPTED_BOARD_INVITATION` - Handle invitation acceptances

## 5. Component Architecture

**Route-Level Components with Lazy Loading:**

- All major page components use React.lazy() for code splitting
- Suspense boundaries with PageLoadingSpinner for loading states
- Protected and rejected route components for authentication-based access control
- SEO optimization with react-helmet-async 2.0.5 for metadata management

**Reusable Component Library:**

- Material-UI 5.16.14 based component system with custom theming
- Consistent styling patterns using sx prop and styled components
- Modular modal and dialog system with complex state management
- Form components with React Hook Form 7.54.2 and Zod 3.24.2 validation

**Key Component Patterns:**

- **Drag-and-Drop**: @dnd-kit 6.3.1 for accessible board, column, and card interactions
- **Forms**: Comprehensive form handling with validation and error display
- **Loading States**: Consistent loading indicators and skeleton screens
- **Error Boundaries**: Graceful error handling with fallback UI components
- **Real-time Updates**: Components that respond to Socket.io events and Redux state changes
- **SEO Management**: Dynamic metadata management with SEO component

## 6. Data Flow Patterns

**Authentication Flow:**

```mermaid
graph LR
    A[User Login] --> B[JWT Token Storage]
    B --> C[Redux Auth State Update]
    C --> D[Socket Connection with JWT]
    D --> E[Protected Routes Access]
    E --> F[API Requests with Auth Headers]
```

**Real-time Collaboration Flow:**

```mermaid
graph LR
    A[User Action] --> B[Optimistic UI Update]
    B --> C[API Call via RTK Query]
    C --> D[Socket Event Emission]
    D --> E[Other Users Receive Update]
    E --> F[Redux State Synchronization]
```

**Form Submission Flow:**

```mermaid
graph LR
    A[Form Input] --> B[Zod Validation]
    B --> C[React Hook Form Processing]
    C --> D[RTK Query Mutation]
    D --> E[Cache Invalidation]
    E --> F[UI State Update]
```

## 7. Performance Optimizations

- **Code Splitting**: Route-based lazy loading with React.lazy() and Suspense
- **Bundle Analysis**: rollup-plugin-visualizer 5.14.0 for bundle size monitoring
- **Memoization**: Strategic use of React.memo, useMemo, and useCallback
- **Efficient Re-renders**: Optimized Redux selectors and component structure
- **Asset Optimization**: Vite 6.1.0 automatic asset optimization and compression
- **Tree Shaking**: Automatic dead code elimination in production builds
- **SVG Optimization**: vite-plugin-svgr 4.3.0 for optimized SVG imports

## 8. Security Patterns

- **JWT Authentication**: Secure token-based authentication with refresh token support
- **Route Protection**: ProtectedRoute and RejectedRoute components for access control
- **Input Validation**: Comprehensive Zod schemas for all form inputs and API data
- **XSS Prevention**: rehype-sanitize 6.0.0 for safe markdown rendering
- **HTTPS Enforcement**: Production deployment requires HTTPS for security
- **Environment Variables**: Secure configuration management with Vite environment handling

## 9. Build and Deployment Architecture

- **Build Tool**: Vite 6.1.0 for fast development and optimized production builds
- **TypeScript Compilation**: Strict mode TypeScript 5.7.2 with comprehensive type checking
- **Environment Configuration**: Environment-based configuration with development and production settings
- **Static Asset Handling**: Optimized asset processing and caching strategies
- **SEO Optimization**: react-helmet-async for metadata management and search engine optimization
- **Deployment**: Vercel-ready configuration with automatic deployments and environment variable management

## 10. Development Workflow

- **Hot Module Replacement**: Vite dev server with instant updates during development
- **Code Quality**: ESLint 9.19.0 and Prettier 3.5.2 integration with pre-commit hooks
- **Type Safety**: 100% TypeScript coverage with strict mode and comprehensive type definitions
- **Error Handling**: Comprehensive error boundaries and development-time error reporting
- **Development Scripts**: Comprehensive npm scripts for development, building, linting, and formatting

## 11. SEO and Marketing Features

- **Dynamic SEO**: Comprehensive SEO component with Open Graph and Twitter meta tags
- **Landing Page**: Complete front page with hero section, features, productivity tabs, workflows
- **Site Configuration**: Centralized site metadata and configuration management
- **Social Media Integration**: Open Graph images and social sharing optimization
- **Animation System**: Custom keyframe animations for enhanced user experience
