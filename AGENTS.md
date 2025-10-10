# Project Overview

Trellone is a modern Trello‑style project management SPA that helps teams organize work into workspaces, boards, columns and cards with real‑time collaboration, focusing on speed, reliability, and an accessible UI powered by Material‑UI. It is a React 18 + TypeScript single page application structured by feature, with state management via Redux Toolkit and data fetching via RTK Query over a centralized Axios client, real-time collaboration using Socket.IO with JWT auth, and UI built with Material-UI and a custom CSS Vars theme.

## Trellone Directory Structure and File Organization

### Brief overview

This rule documents the complete directory structure and important files/folders of the Trellone project. It serves as a reference guide for understanding the project organization, locating specific functionality, and maintaining consistent file placement patterns. This is project-specific documentation for the React TypeScript Trello clone application.

### Project root structure

- **Configuration files** are placed at the project root level for build tools, linting, and deployment
- **Source code** is organized under `src/` with feature-based directory structure
- **Static assets** are stored in `public/` for direct serving
- **Documentation** includes comprehensive README.md and memory-bank for project context

### Core configuration files

- [`package.json`](package.json) - Project dependencies, scripts, and metadata with React 18.3.1, TypeScript 5.7.2, and Material-UI 5.16.14
- [`vite.config.ts`](vite.config.ts) - Vite build configuration with React SWC, SVGR plugin, and path aliases (`~` for `./src`)
- [`tsconfig.json`](tsconfig.json) - TypeScript configuration with references to app and node configs
- [`eslint.config.js`](eslint.config.js) - ESLint 9.19.0 configuration with TypeScript and React rules
- [`vercel.json`](vercel.json) - Vercel deployment configuration with SPA routing support
- [`index.html`](index.html) - Main HTML template with Vite entry point

### Source directory organization (`src/`)

#### Core application files

- [`App.tsx`](src/App.tsx) - Main application component with routing and authentication logic
- [`main.tsx`](src/main.tsx) - Application entry point with provider setup (Redux, Router, MUI Theme)
- [`theme.ts`](src/theme.ts) - Material-UI theme configuration with dark/light mode support
- [`index.css`](src/index.css) - Global CSS styles and Material-UI customizations
- [`vite-env.d.ts`](src/vite-env.d.ts) - Vite environment type definitions

#### Feature-based directories

##### Components (`src/components/`)

- **AppBar/** - Main application bar component
- **Dialog/** - Modal dialogs (NewBoardDialog, NewWorkspaceDialog)
- **Form/** - Form components (TextFieldInput, ToggleFocusInput, FieldErrorAlert)
- **Loading/** - Loading indicators and spinners (PageLoadingSpinner)
- **Modal/** - Complex modals (ActiveCard with attachments, dates, comments)
- **NavBar/** - Navigation with search, create, profile, notifications, workspaces
- **ErrorBoundary/** - Error handling and fallback UI
- **SEO/** - SEO component for metadata management
- **Workspace/** - Workspace-related UI components

##### Pages (`src/pages/`)

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

##### State management (`src/store/`)

- [`root.reducer.ts`](src/store/root.reducer.ts) - Root reducer combining all slices
- **slices/** - Redux Toolkit slices for different domains:
  - [`auth.slice.ts`](src/store/slices/auth.slice.ts) - User authentication state
  - [`app.slice.ts`](src/store/slices/app.slice.ts) - Application-wide state (socket connections)
  - [`board.slice.ts`](src/store/slices/board.slice.ts) - Active board state management
  - [`card.slice.ts`](src/store/slices/card.slice.ts) - Active card state management
  - [`notification.slice.ts`](src/store/slices/notification.slice.ts) - Notification system state
  - [`workspace.slice.ts`](src/store/slices/workspace.slice.ts) - Workspace state management

##### API layer (`src/queries/`)

- [`auth.ts`](src/queries/auth.ts) - Authentication endpoints (login, register, OAuth)
- [`boards.ts`](src/queries/boards.ts) - Board management endpoints (CRUD, invitations)
- [`cards.ts`](src/queries/cards.ts) - Card operations endpoints (CRUD, attachments, comments)
- [`columns.ts`](src/queries/columns.ts) - Column management endpoints (CRUD, reordering)
- [`users.ts`](src/queries/users.ts) - User management endpoints (profile, settings)
- [`medias.ts`](src/queries/medias.ts) - File upload and media handling endpoints
- [`invitations.ts`](src/queries/invitations.ts) - Board invitation system endpoints
- [`workspaces.ts`](src/queries/workspaces.ts) - Workspace management endpoints

##### Technical infrastructure

###### Library configurations (`src/lib/`)

- [`http.ts`](src/lib/http.ts) - Axios HTTP client configuration
- [`socket.ts`](src/lib/socket.ts) - Socket.io client configuration with JWT auth
- [`sensors.ts`](src/lib/sensors.ts) - Drag-and-drop sensor configuration for @dnd-kit
- [`jwt-decode.ts`](src/lib/jwt-decode.ts) - JWT token decoding utilities
- **redux/** - Redux store configuration:
  - [`store.ts`](src/lib/redux/store.ts) - Store setup with persistence and middleware
  - [`hooks.ts`](src/lib/redux/hooks.ts) - Typed Redux hooks (useAppDispatch, useAppSelector)
  - [`helpers.ts`](src/lib/redux/helpers.ts) - Custom axios base query for RTK Query

###### Validation schemas (`src/schemas/`)

- [`auth.schema.ts`](src/schemas/auth.schema.ts) - Authentication-related Zod schemas
- [`board.schema.ts`](src/schemas/board.schema.ts) - Board management schemas
- [`card.schema.ts`](src/schemas/card.schema.ts) - Card operation schemas
- [`user.schema.ts`](src/schemas/user.schema.ts) - User management schemas

###### Type definitions (`src/types/`)

- [`jwt.type.ts`](src/types/jwt.type.ts) - JWT and authentication-related types
- [`query-params.type.ts`](src/types/query-params.type.ts) - URL query parameter interfaces
- [`utils.type.ts`](src/types/utils.type.ts) - General utility types and error handling

###### Utilities (`src/utils/`)

- [`utils.ts`](src/utils/utils.ts) - General utilities (color generation, placeholders, DOM manipulation)
- [`validators.ts`](src/utils/validators.ts) - File and data validation functions
- [`storage.ts`](src/utils/storage.ts) - Local storage management utilities
- [`error-handlers.ts`](src/utils/error-handlers.ts) - Error type checking and handling functions
- [`oauth.ts`](src/utils/oauth.ts) - OAuth and authentication utilities
- [`formatters.ts`](src/utils/formatters.ts) - String and data formatting functions
- [`sorts.ts`](src/utils/sorts.ts) - Array sorting and ordering utilities

###### Constants (`src/constants/`)

- [`config.ts`](src/constants/config.ts) - Environment and application configuration
- [`type.ts`](src/constants/type.ts) - Type definitions, enums, and value arrays
- [`path.ts`](src/constants/path.ts) - Route path definitions
- [`pagination.ts`](src/constants/pagination.ts) - Pagination-related constants
- [`http-status-code.ts`](src/constants/http-status-code.ts) - HTTP status code enum
- [`mock-data.ts`](src/constants/mock-data.ts) - Mock data for development/testing
- [`animations.ts`](src/constants/animations.ts) - Animation configuration constants
- [`front-page.ts`](src/constants/front-page.ts) - Front page content constants
- [`site.ts`](src/constants/site.ts) - Site-wide constants and metadata

###### Custom hooks (`src/hooks/`)

- [`use-debounce.ts`](src/hooks/use-debounce.ts) - Debounce functionality hook
- [`use-infinite-scroll.ts`](src/hooks/use-infinite-scroll.ts) - Infinite scroll functionality
- [`use-query-config.ts`](src/hooks/use-query-config.ts) - Query configuration management
- [`use-query-params.ts`](src/hooks/use-query-params.ts) - URL search params handling

###### Assets (`src/assets/`)

- **404/** - 404 page assets
- **auth/** - Authentication page assets
- **front-page/** - Landing page assets
- **react.svg** - React logo
- **trello.svg** - Trello-style logo

### Static assets (`public/`)

- **Favicon files** - Complete favicon set (favicon.ico, apple-touch-icon.png, android-chrome variants)
- **Logo files** - Application logos (logo.png, trellone.svg, board.svg)
- **Social media** - Open Graph image (og.png) for social sharing
- **Build assets** - Vite logo (vite.svg) for development

### File naming conventions

- **Components** - PascalCase for directories and files (e.g., `NavBar/NavBar.tsx`)
- **Utilities** - kebab-case for files (e.g., `error-handlers.ts`, `use-debounce.ts`)
- **Constants** - kebab-case with descriptive names (e.g., `http-status-code.ts`)
- **Types** - kebab-case with `.type.ts` suffix (e.g., `jwt.type.ts`)
- **Schemas** - kebab-case with `.schema.ts` suffix (e.g., `auth.schema.ts`)
- **Slices** - kebab-case with `.slice.ts` suffix (e.g., `auth.slice.ts`)

### Import path patterns

- **Absolute imports** - Use `~` alias for src directory (configured in vite.config.ts)
- **Index exports** - Components export through index.ts files for clean imports
- **Relative imports** - Used within the same feature directory
- **Type imports** - Use `import type` for TypeScript type-only imports

### Key architectural patterns

- **Feature-based organization** - Group related files by feature rather than file type
- **Barrel exports** - Use index.ts files to create clean import paths
- **Separation of concerns** - Clear separation between UI, state, API, and utilities
- **Type safety** - Comprehensive TypeScript coverage with strict mode
- **Component co-location** - Keep component-specific files close to the component

---

## Material-UI Implementation Patterns

### Brief overview

This rule documents the established Material-UI (MUI) patterns, conventions, and best practices specifically identified from the Trellone React codebase. These guidelines ensure consistent component styling, proper theme integration, responsive design implementation, and maintainable Material-UI code across the application.

### Import patterns and component usage

- Use default imports for all Material-UI components, one per line: `import Box from '@mui/material/Box'`, `import Typography from '@mui/material/Typography'`, `import Button from '@mui/material/Button'`
- Import icons individually for tree-shaking: `import GoogleIcon from '@mui/icons-material/Google'`
- Use Material-UI component aliases when needed to avoid conflicts: `import { Card as MuiCard, Link as MuiLink } from '@mui/material'`
- Import Material-UI Grid2 for responsive layouts: `import Grid from '@mui/material/Unstable_Grid2'`
- Use `useColorScheme` hook for theme mode management: `import { useColorScheme } from '@mui/material'`
- Import theme utilities when needed: `import { useTheme, useMediaQuery } from '@mui/material'`

### Theme configuration and customization

- Use `experimental_extendTheme` for comprehensive theme setup with color schemes support
- Define custom theme properties using module augmentation for TypeScript integration
- Create custom theme constants for consistent spacing and layout dimensions
- Use `colorSchemes` object to define light and dark mode palettes separately
- Override component styles using the `components` key in theme configuration
- Use `unstable_sx` in component overrides for theme-aware styling within styleOverrides
- Define global CSS overrides in `MuiCssBaseline.styleOverrides` for scrollbar customization

### Styling conventions and sx prop usage

- Prefer `sx` prop over `styled` components for component-level styling
- Use theme callback functions in sx prop for theme-aware styling: `sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff' }}`
- Apply consistent spacing using theme spacing units: `gap: 2`, `padding: '0 1em'`
- Use theme breakpoints for responsive styling: `display: { xs: 'none', md: 'flex' }`
- Implement hover states using nested sx syntax: `'&:hover': { backgroundColor: 'primary.main' }`
- Use theme palette colors consistently: `color: 'primary.main'`, `bgcolor: 'background.paper'`

### Responsive design patterns

- Use Material-UI breakpoint system consistently: `{ xs: 'value', sm: 'value', md: 'value', lg: 'value' }`
- Apply responsive display properties: `display: { xs: 'none', md: 'inline-flex' }`
- Use responsive sizing for components: `width: { xs: 'auto', sm: 520 }`
- Implement responsive flexDirection: `flexDirection: { xs: 'column', md: 'row' }`
- Use `useMediaQuery` hook for conditional rendering based on breakpoints
- Apply responsive spacing and gaps: `gap: { xs: 1, md: 2 }`
- Use responsive typography sizing: `fontSize: { xs: '2.5rem', sm: '3rem' }`

### Component composition patterns

- Use Box component as the primary layout container with sx prop styling
- Implement Stack component for consistent spacing between elements
- Use Grid2 for responsive layout systems with proper spacing configuration
- Apply Tooltip components for enhanced user experience on interactive elements
- Use IconButton for clickable icons with proper accessibility attributes
- Implement Chip components for interactive tags and filters with consistent styling
- Use Card components with proper elevation and border radius for content containers

### Form integration with Material-UI

- Use TextField component with `fullWidth`, `variant='outlined'` as default configuration
- Apply consistent error styling using `error` prop with boolean values
- Use FormControl and InputLabel for complex form controls like Select components
- Implement FormControlLabel for checkbox and radio button groups
- Use Controller component from React Hook Form for Material-UI components that don't work with register
- Apply consistent form spacing using Box containers with margin/padding
- Use Alert component for form validation error display with severity levels

### Modal and dialog implementation

- Use Modal component with `disableScrollLock` for better UX in complex layouts
- Apply consistent modal styling with theme-aware background colors and border radius
- Use Dialog component with proper accessibility attributes and responsive sizing
- Implement DialogTitle, DialogContent, and DialogActions for structured dialog layout
- Use Divider components to separate dialog sections visually
- Apply proper z-index management for modal overlays and content
- Use Zoom transition component for modal entrance animations

### Icon usage and styling

- Import Material-UI icons individually: `import MenuIcon from '@mui/icons-material/Menu'`
- Use `fontSize='small'` consistently for icons in buttons and interactive elements
- Apply icon color inheritance: `sx={{ color: 'inherit' }}` for theme-aware coloring
- Use SvgIcon component for custom SVG icons with `inheritViewBox` prop
- Implement consistent icon sizing in different contexts (small, medium, large)
- Use startIcon and endIcon props in Button components for proper icon placement

### Animation and transition patterns

- Use Material-UI transition components: `Zoom`, `Fade`, `Slide` for entrance animations
- Apply theme transitions for smooth state changes: `theme.transitions.create(['margin', 'width'])`
- Use CSS keyframes for custom animations within styled components
- Implement hover transitions using sx prop: `transition: 'all 0.3s ease'`
- Apply consistent animation delays and durations across components
- Use transform properties for interactive feedback: `'&:hover': { transform: 'scale(1.1)' }`

### Layout and spacing consistency

- Use consistent padding and margin patterns: `padding: '0 1em'`, `margin: '1em'`
- Apply theme spacing units for consistent gaps: `gap: 2` (equivalent to 16px)
- Use flexbox properties consistently: `display: 'flex'`, `alignItems: 'center'`, `justifyContent: 'space-between'`
- Implement proper overflow handling: `overflowX: 'auto'`, `overflow: 'hidden'`
- Use position properties appropriately: `position: 'relative'`, `position: 'absolute'`
- Apply consistent border radius values: `borderRadius: '8px'`, `borderRadius: 0.5`

### Color and theming best practices

- Use theme palette colors instead of hardcoded values: `color: 'text.primary'`
- Apply theme-aware conditional styling for dark/light modes
- Use color generation utilities for dynamic colors: `generateColorFromString(title)`
- Implement consistent color schemes across light and dark themes
- Use Material-UI color imports when needed: `import { blueGrey } from '@mui/material/colors'`
- Apply proper contrast ratios for accessibility compliance

### Performance optimization patterns

- Use React.memo strategically for expensive Material-UI components
- Implement proper shouldForwardProp in styled components to avoid prop forwarding issues
- Use theme breakpoints efficiently to avoid unnecessary re-renders
- Apply consistent component composition to leverage Material-UI's built-in optimizations
- Use proper key props for list rendering with Material-UI components
- Leverage Material-UI's built-in performance features like sx prop compilation

### Accessibility and user experience

- Use proper ARIA attributes in interactive components: `aria-label`, `aria-describedby`
- Implement proper focus management with `autoFocus` and `focused` props
- Use semantic HTML elements through Material-UI component props: `component='main'`
- Apply proper color contrast for text and background combinations
- Use Tooltip components for additional context on interactive elements
- Implement proper keyboard navigation support through Material-UI's built-in features

---

## React TypeScript Best Practices

### Brief overview

This rule documents the established React TypeScript patterns, conventions, and best practices specifically identified from the Trellone codebase. These guidelines ensure consistent component development, proper TypeScript integration, and maintainable code architecture across the React application.

### Component structure and organization

- Use default exports for all React components with PascalCase naming: `export default function ComponentName()`
- Organize components in feature-based directories with dedicated folders for each component
- Include `index.ts` barrel exports in component directories for clean import paths
- Place component-specific files (styles, types, sub-components) within the component's directory
- Use the pattern `ComponentName/ComponentName.tsx` and `ComponentName/index.ts` for consistency

### TypeScript interface definitions

- Define component props interfaces directly above the component with descriptive names ending in `Props`
- Use optional properties (`?`) for non-required props with clear default handling
- Extend Material-UI component props when creating wrapper components: `extends Omit<TextFieldProps, 'name'>`
- Use generic constraints for reusable components: `<TFieldValues extends FieldValues = FieldValues>`
- Place interface definitions immediately before the component that uses them

```typescript
interface TextFieldInputProps<TFieldValues extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  register?: UseFormRegister<TFieldValues>
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>
  name?: FieldPath<TFieldValues>
}
```

### Import and export patterns

- Use the `~` path alias consistently for all internal imports: `import Component from '~/components/Component'`
- Group imports logically: React/external libraries first, then internal imports
- Use named imports for Material-UI components: `import { Box, Typography } from '@mui/material'`
- Import SVG assets as React components: `import TrelloneIcon from '~/assets/trello.svg?react'`
- Use `import type` for type-only imports to optimize bundle size
- Follow consistent import ordering: external libraries, internal components, types, utilities

### Component function patterns

- Use function declarations with default export pattern: `export default function ComponentName()`
- Destructure props in function parameters with TypeScript generics when applicable
- Use early returns for conditional rendering: `if (!errorMessage) return null`
- Implement proper prop spreading with rest parameters: `{...rest}` for Material-UI integration

### State management integration

- Use typed Redux hooks from `~/lib/redux/hooks`: `useAppDispatch`, `useAppSelector`
- Destructure specific state slices in selectors: `const { isAuthenticated, profile } = useAppSelector((state) => state.auth)`
- Use RTK Query mutations with proper error handling and loading states
- Implement optimistic updates followed by server synchronization for real-time features

### Form handling patterns

- Always use React Hook Form with Zod resolver for type-safe form validation
- Destructure form methods consistently: `register`, `handleSubmit`, `formState: { errors }`, `setError`
- Use schema-derived types for form data: `useForm<LoginBodyType>`
- Implement server-side error handling with `useEffect` and `isUnprocessableEntityError` type guard
- Use bracket notation for error field access: `errors['field_name']`

```typescript
const {
  register,
  setError,
  handleSubmit,
  formState: { errors }
} = useForm<LoginBodyType>({
  resolver: zodResolver(LoginBody),
  defaultValues: { email: '', password: '' }
})
```

### Material-UI integration

- Use `sx` prop consistently for styling instead of styled components
- Leverage theme-aware styling with callback functions: `sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff' }}`
- Use Material-UI Grid2 for responsive layouts: `import Grid from '@mui/material/Unstable_Grid2'`
- Apply consistent spacing patterns with theme spacing units
- Use Material-UI icons with proper tree-shaking imports: `import IconName from '@mui/icons-material/IconName'`

### Drag and drop implementation

- Use @dnd-kit with proper TypeScript integration and accessibility features
- Implement `useSortable` hook with unique IDs and custom data: `id: card._id, data: { ...card }`
- Apply proper CSS transforms: `transform: CSS.Translate.toString(transform)`
- Use `touchAction: 'none'` for pointer sensor compatibility
- Implement visual feedback during drag operations with opacity and border changes

### Error handling and validation

- Create type guards for different error scenarios: `isUnprocessableEntityError<FormError>`
- Use Zod schemas for comprehensive validation with custom error messages
- Implement proper error boundaries with fallback UI components
- Handle async operations with proper try-catch patterns and user feedback

### Lazy loading and code splitting

- Use React.lazy() for route-level components: `const Login = lazy(() => import('~/pages/Auth/Login'))`
- Wrap lazy components with Suspense boundaries and loading spinners
- Implement proper fallback components: `<Suspense fallback={<PageLoadingSpinner />}>`
- Use dynamic imports for large feature modules to optimize bundle size

### Custom hooks integration

- Use custom hooks with proper TypeScript generics: `useQueryConfig<AuthQueryParams>()`
- Implement hooks with comprehensive options interfaces and default values
- Use proper dependency arrays in useEffect hooks within custom hooks
- Export hooks with named exports and descriptive names starting with `use`

### SEO and metadata management

- Use react-helmet-async for dynamic metadata management with proper TypeScript integration
- Implement SEO component with optional props and sensible defaults
- Structure metadata objects with proper typing and theme-aware URL construction
- Include comprehensive Open Graph and Twitter meta tags

### Real-time features

- Integrate Socket.io with Redux state management and proper TypeScript typing
- Use room-based collaboration with proper connection lifecycle management
- Implement optimistic updates followed by socket event emission
- Handle socket events with proper error handling and state synchronization

### Performance optimization

- Use React.memo strategically for expensive components with proper comparison functions
- Implement proper useCallback and useMemo for expensive operations
- Use proper key props for list rendering with stable, unique identifiers
- Leverage Material-UI's built-in performance optimizations with sx prop

### Testing and development patterns

- Use className='interceptor-loading' for consistent loading state indicators
- Implement proper TypeScript strict mode compliance with comprehensive type coverage
- Use proper error boundaries for graceful error handling in production
- Implement proper cleanup functions in useEffect hooks for subscriptions and event listeners

---

## Redux Toolkit Patterns

### Brief overview

This rule documents the established Redux Toolkit patterns, conventions, and architectural best practices specifically identified from the Trellone React codebase. These guidelines ensure consistent state management, proper RTK Query usage, and maintainable Redux architecture across the application.

### Slice structure and organization

- Use `createSlice` from Redux Toolkit for all state slices with consistent naming: `entitySlice`
- Define TypeScript interfaces for slice state with descriptive names ending in `SliceState`
- Place all slice files in `src/store/slices/` directory with `.slice.ts` suffix
- Use default export for the reducer and named exports for actions: `export default entityReducer`
- Export actions using destructuring: `export const { action1, action2 } = entitySlice.actions`

### Initial state patterns

- Always define explicit `initialState` objects with proper TypeScript typing
- Use descriptive property names that clearly indicate the data they hold
- Initialize arrays as empty arrays `[]` and objects as `null` for single entities
- Include loading states for async operations: `loading: 'idle'`, `currentRequestId: undefined`, `error: null`

### Reducer implementation conventions

- Use descriptive action names that clearly indicate their purpose: `setAuthenticated`, `updateActiveCard`, `clearAndHideActiveCardModal`
- Leverage Immer's immutability through Redux Toolkit - directly mutate state in reducers
- Implement proper state updates using object property assignment and array methods
- Use `PayloadAction<T>` typing for actions that carry data with proper generic constraints

### Async thunk patterns

- Use `createAsyncThunk` for complex async operations that require loading states and error handling
- Follow naming convention: `entity/actionName` for thunk names (e.g., `'board/getBoardDetails'`)
- Implement proper error handling in rejected cases with meaningful error messages
- Use `thunkAPI.dispatch` to trigger other actions during async operations
- Handle request cancellation with `thunkAPI.signal` for HTTP requests

### RTK Query API slice structure

- Use `createApi` from `@reduxjs/toolkit/query/react` for all API interactions
- Define consistent constants: `reducerPath`, `tagTypes`, and `API_URL` at the top of each file
- Use custom `axiosBaseQuery()` helper for consistent HTTP client configuration
- Export both individual hooks and the reducer: `export const { useEntityMutation } = entityApi`

### RTK Query endpoint patterns

- Use descriptive endpoint names that clearly indicate the operation: `addBoard`, `updateCard`, `getBoards`
- Implement proper TypeScript generics: `build.mutation<ResponseType, RequestType>`
- Use `onQueryStarted` for side effects like toast notifications and state updates
- Handle errors consistently with try-catch blocks and user feedback via toast notifications

### Cache invalidation and tags

- Define meaningful tag types as const arrays: `const tagTypes = ['Board'] as const`
- Use `providesTags` for queries to mark what data they provide to the cache
- Use `invalidatesTags` for mutations to specify what cache data should be refreshed
- Implement both specific entity tags `{ type: 'Board', id: boardId }` and list tags `{ type: 'Board', id: 'LIST' }`

### State selector patterns

- Use typed Redux hooks from `~/lib/redux/hooks`: `useAppSelector`, `useAppDispatch`
- Destructure specific state properties in selectors: `const { isAuthenticated, profile } = useAppSelector((state) => state.auth)`
- Access nested state properties directly: `const { activeBoard } = useAppSelector((state) => state.board)`
- Use consistent selector patterns across components for the same data

### Real-time integration patterns

- Store Socket.io instances in Redux state using app slice: `socket: Socket | null`
- Implement socket connection management through Redux actions: `setSocket`, `disconnectSocket`
- Emit socket events after successful mutations to broadcast changes to other users
- Handle socket cleanup properly in disconnection actions with null checks

### Error handling conventions

- Use consistent error state structure: `error: string | null` in slice state
- Implement proper error handling in async thunks with meaningful error messages
- Clear errors when starting new operations or resetting state
- Use toast notifications for user feedback on both success and error cases

### State persistence patterns

- Use Redux Persist selectively - only persist essential state like authentication
- Configure persistence with whitelist approach: `whitelist: ['auth']`
- Implement proper store configuration with persistence middleware
- Handle rehydration properly with serializable check disabled for non-serializable data

### Component integration patterns

- Use RTK Query hooks directly in components: `const [updateCardMutation] = useUpdateCardMutation()`
- Implement optimistic updates by dispatching slice actions before API calls
- Handle loading states from RTK Query hooks: `const { data, isLoading, error } = useGetBoardsQuery()`
- Use mutation results with `.unwrap()` for error handling: `const result = await mutation(data).unwrap()`

### Store configuration best practices

- Combine all reducers in `root.reducer.ts` using `combineReducers`
- Include all RTK Query API reducers using dynamic keys: `[entityApi.reducerPath]: entityApiReducer`
- Configure middleware to include all RTK Query middleware: `entityApi.middleware`
- Disable serializable check for Redux Persist compatibility: `serializableCheck: false`

### Action naming conventions

- Use clear, descriptive action names that indicate the operation: `setAuthenticated`, `updateActiveBoard`
- Follow consistent patterns: `set` for simple assignments, `update` for modifications, `clear` for resets
- Use entity-specific prefixes when actions operate on specific data types
- Implement both singular and plural operations: `addWorkspace` vs `appendWorkspaces`

### Type safety patterns

- Define proper TypeScript interfaces for all state shapes and action payloads
- Use schema-derived types for API data: `BoardResType['result']`
- Export proper store types: `RootState`, `AppDispatch` from store configuration
- Implement typed hooks that provide proper IntelliSense and type checking

### Side effect management

- Use `onQueryStarted` in RTK Query for side effects like navigation and state updates
- Implement proper cleanup in logout actions: reset state, disconnect sockets, clear API cache
- Handle authentication state updates through RTK Query side effects
- Use `api.util.resetApiState()` to clear cached data when appropriate

### Performance optimization patterns

- Use selective state updates to minimize re-renders
- Implement proper memoization in selectors when needed
- Use RTK Query's built-in caching to avoid unnecessary API calls
- Handle duplicate prevention in array operations: filter existing items before appending

---

## React Hook Form Patterns

### Brief overview

This rule defines the standardized patterns and best practices for implementing React Hook Form within the Trellone project. These guidelines ensure consistent form handling, validation, error management, and TypeScript integration across all components.

### Form setup and configuration

- Always use `zodResolver` with Zod schemas for form validation to ensure type safety and consistent validation logic
- Import resolver from `@hookform/resolvers/zod` and schemas from the appropriate schema files in `~/schemas/`
- Always provide `defaultValues` in the form configuration object, even for empty forms
- Use TypeScript generics with schema-derived types for complete type safety: `useForm<CreateBoardBodyType>`

```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
  setError,
  reset
} = useForm<CreateBoardBodyType>({
  resolver: zodResolver(CreateBoardBody),
  defaultValues: { title: '', description: '', type: BoardType.Public }
})
```

### Form state destructuring patterns

- Always destructure `register`, `handleSubmit`, and `formState: { errors }` as minimum requirements
- Include `setError` when handling server-side validation errors
- Include `reset` when form values need to be updated based on props or external data
- Include `control` only when using `Controller` for complex form controls
- Use consistent destructuring order: `register`, `control`, `setError`, `handleSubmit`, `reset`, `formState`

### Input component integration

- Use the custom `TextFieldInput` component with the `register` prop for all text inputs
- Pass error state using double negation pattern: `error={!!errors['field_name']}`
- Always follow input with `FieldErrorAlert` component for consistent error display
- Use bracket notation for error field access to maintain consistency: `errors['field_name']`

```typescript
<TextFieldInput
  name='title'
  register={register}
  label='Board Title'
  error={!!errors['title']}
/>
<FieldErrorAlert errorMessage={errors.title?.message} />
```

### Controller usage for complex controls

- Use `Controller` component for Material-UI components that don't work directly with `register`
- Apply to Select, RadioGroup, DatePicker, and other controlled components
- Always destructure field props and handle onChange events explicitly
- Maintain consistent field value handling with fallbacks

```typescript
<Controller
  name='workspace_id'
  control={control}
  render={({ field }) => (
    <Select
      {...field}
      value={field.value || ''}
      onChange={(event) => field.onChange(event.target.value)}
    >
      {/* options */}
    </Select>
  )}
/>
```

### Form submission patterns

- Always wrap submission logic with `handleSubmit` from React Hook Form
- Use async functions for form submission to handle API calls properly
- Handle successful submissions with navigation or state updates
- Use `.then()` pattern for RTK Query mutations to check for errors

```typescript
const onSubmit = handleSubmit(async (values) => {
  addBoardMutation(values).then((res) => {
    if (!res.error) {
      navigate(`/boards/${res.data?.result._id}`)
    }
  })
})
```

### Server-side error handling

- Always implement `useEffect` hook to handle server validation errors
- Use `isUnprocessableEntityError` type guard to check error types
- Iterate through error object and set individual field errors using `setError`
- Follow consistent error mapping pattern with proper TypeScript typing

```typescript
useEffect(() => {
  if (isError && isUnprocessableEntityError<CreateBoardBodyType>(error)) {
    const formError = error.data.errors

    if (formError) {
      for (const [key, value] of Object.entries(formError)) {
        setError(key as keyof CreateBoardBodyType, {
          type: value.type,
          message: value.msg
        })
      }
    }
  }
}, [isError, error, setError])
```

### Form reset and data synchronization

- Use `reset` function to update form values when external data changes
- Implement `useEffect` hooks to sync form state with props or API data
- Always check for data existence before calling reset
- Use dependency arrays that include the data source and reset function

```typescript
useEffect(() => {
  if (workspace && open) {
    const { title, description } = workspace
    reset({ title, description })
  }
}, [workspace, reset, open])
```

### TypeScript integration

- Always use schema-derived types for form data: `CreateBoardBodyType`, `UpdateWorkspaceBodyType`
- Import types from schema files to maintain single source of truth
- Use proper generic typing for `useForm`, `handleSubmit`, and error handling functions
- Maintain type safety in error handling with `keyof` operator for field names

### Form validation and error display

- Rely on Zod schemas for all validation logic rather than inline validation
- Use `FieldErrorAlert` component consistently for all error displays
- Position error alerts immediately after their corresponding input fields
- Use optional chaining for error message access: `errors.field?.message`

### Loading states and user feedback

- Add `className='interceptor-loading'` to submit buttons for consistent loading indicators
- Use RTK Query loading states from mutation hooks when needed
- Implement proper disabled states during form submission
- Provide immediate user feedback for successful operations

### Form accessibility and UX

- Always provide proper labels for form inputs through the `label` prop
- Use appropriate input types (email, password, text) for semantic correctness
- Implement proper form structure with semantic HTML elements
- Ensure proper focus management and keyboard navigation

### File upload handling

- Use `VisuallyHiddenInput` component for file input styling consistency
- Implement proper file validation before submission
- Handle file uploads separately from form data when needed
- Use FormData for multipart form submissions with file attachments

### Popover and modal form patterns

- Reset form state when popover/modal opens using `useEffect` with open state dependency
- Close popover/modal after successful form submission
- Handle form cleanup on component unmount or close events
- Maintain consistent popover positioning and styling patterns

---

## TypeScript Types

### Brief overview

This rule defines TypeScript type definition patterns and conventions for the Trellone project based on the established patterns in `src/types/`. These guidelines ensure consistent, maintainable, and type-safe TypeScript code across the application.

### File naming and organization

- Use kebab-case for type definition files with `.type.ts` suffix (e.g., `jwt.type.ts`, `query-params.type.ts`)
- Organize types by domain or feature area rather than by type category
- Place all type definitions in `src/types/` directory for centralized access
- Use descriptive filenames that clearly indicate the domain (e.g., `jwt.type.ts` for JWT-related types)

### Import patterns

- Use the `~` path alias for importing from src directory: `import { TokenType } from '~/constants/type'`
- Import types from their logical source (constants, schemas, other type files)
- Use `import type` syntax when importing only for type annotations to optimize bundle size
- Group imports logically: external libraries first, then internal imports

### Type extraction from constants

- Extract type values from const objects using `typeof` and `keyof` pattern:
  ```typescript
  export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType]
  ```
- This pattern ensures type safety when constants change and provides better IntelliSense
- Use this approach for enum-like constant objects to maintain single source of truth

### Interface definitions

- Use PascalCase for interface names: `TokenPayload`, `InviteTokenPayload`
- Define interfaces for structured data objects with clear, descriptive property names
- Use snake_case for property names to match backend API conventions: `user_id`, `token_type`
- Group related interfaces in the same file when they share a common domain

### Interface extension patterns

- Use interface extension for related types that share common properties:
  ```typescript
  export interface InviteTokenPayload extends TokenPayload {
    inviter_id: string
    invitation_id: string
  }
  ```
- Prefer interface extension over intersection types for better error messages and IntelliSense

### Optional properties and flexibility

- Use optional properties (`?`) for parameters that may not always be present:
  ```typescript
  export interface CommonQueryParams {
    page?: number | string
    limit?: number | string
  }
  ```
- Use union types for flexible typing when multiple types are acceptable: `number | string`

### Generic types and constraints

- Use generic types with sensible defaults for reusable type definitions:
  ```typescript
  type EntityValidationErrors<T = Record<string, any>> = {
    message: string
    errors?: {
      [K in keyof T]?: {
        type: string
        value: string
        msg: string
        path: string
        location: string
      }
    }
  }
  ```
- Apply mapped types with `keyof` for dynamic property generation based on input types

### Type references and indexed access

- Use indexed access types to reference properties from existing types:
  ```typescript
  new_user?: number
  verify?: UserType['verify']
  ```
- This maintains type safety and automatically updates when source types change

### Union types for controlled values

- Use string literal union types for controlled vocabularies:
  ```typescript
  export type Mode = 'light' | 'dark' | 'system'
  ```
- This provides better type safety than generic strings while maintaining readability

### Complex nested structures

- Define complex nested interfaces with clear hierarchy and meaningful property names:
  ```typescript
  export interface SiteConfig {
    name: string
    author: string
    description: string
    keywords: Array<string>
    url: {
      base: string
      author: string
    }
    links: {
      github: string
    }
    ogImage: string
  }
  ```
- Use nested objects to group related properties logically

### Error handling types

- Define specific error types for different error scenarios with generic support:
  ```typescript
  export interface EntityError<T = Record<string, any>> {
    status: number
    data: EntityValidationErrors<T>
  }
  ```
- Include both the error structure and the entity type for comprehensive error handling

### Type exports and barrel patterns

- Export all types from their respective files for external consumption
- Use clear, descriptive export names that indicate the type's purpose
- Avoid default exports for types to maintain explicit import patterns

### Documentation and comments

- Use TypeScript's built-in type system for self-documenting code
- Add JSDoc comments only when the type's purpose isn't immediately clear from its name and structure
- Rely on meaningful property names and interface names for clarity

---

## Custom Hooks Patterns

### Brief overview

This rule defines the established patterns, conventions, and best practices for creating and utilizing custom React hooks within the Trellone project. These guidelines ensure consistent hook implementation, proper TypeScript integration, and maintainable code across the application.

### File naming and organization

- Use kebab-case for hook filenames with `use-` prefix: `use-debounce.ts`, `use-infinite-scroll.ts`
- Place all custom hooks in `src/hooks/` directory for centralized access
- Use descriptive names that clearly indicate the hook's functionality
- Always use `.ts` extension for TypeScript hook files

### Export patterns

- Use named exports with `export const` pattern: `export const useDebounce = (...) => { ... }`
- Avoid default exports to maintain explicit import patterns
- Export hook function directly without intermediate variables or wrappers

### TypeScript integration

- Define comprehensive interfaces for hook options with JSDoc comments for complex parameters
- Use generic types for flexible reusability: `useQueryConfig<T = CommonQueryParams>()`
- Provide sensible default values for generic types to reduce boilerplate
- Use proper typing for return values and parameters with descriptive property names

```typescript
interface UseInfiniteScrollOptions {
  /**
   * Function to call when the user scrolls near the bottom
   */
  onLoadMore: () => void
  /**
   * Whether there are more items to load
   */
  hasMore: boolean
  /**
   * Distance from bottom (in pixels) to trigger loading more items
   * @default 100
   */
  threshold?: number
}
```

### Input validation and error handling

- Implement comprehensive input validation with descriptive error messages
- Throw errors for invalid parameters using clear, actionable messages
- Validate function parameters, boolean flags, and numeric values
- Use early returns and guard clauses for validation logic

```typescript
if (!onLoadMore || typeof onLoadMore !== 'function') {
  throw new Error('onLoadMore must be a function')
}

if (isNaN(delay)) {
  throw new Error('Delay value should be a number.')
}
```

### Default parameters and configuration

- Provide sensible default values for optional parameters
- Use object destructuring with defaults for complex configuration options
- Document default values in JSDoc comments using `@default` tag
- Make commonly used parameters optional with reasonable fallbacks

```typescript
export const useInfiniteScroll = ({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 100,
  useWindowScroll = false
}: UseInfiniteScrollOptions) => {
```

### Documentation patterns

- Add comprehensive JSDoc comments for complex hooks with usage examples
- Include `@param` descriptions for all parameters
- Provide `@returns` documentation for return values
- Include practical usage examples in JSDoc using `@example` tag

````typescript
/**
 * Custom hook for implementing infinite scroll functionality
 *
 * @param options Configuration options for infinite scroll behavior
 * @returns Object containing ref to attach to the container element
 *
 * @example
 * ```typescript
 * const { containerRef } = useInfiniteScroll({
 *   onLoadMore: loadMoreItems,
 *   hasMore: pagination.page < pagination.total_page,
 *   isLoading: isLoadingMore
 * })
 * ```
 */
````

### Lodash integration patterns

- Import specific lodash functions to avoid bundle bloat: `import debounce from 'lodash/debounce'`
- Use lodash utilities for common operations like `omitBy`, `isUndefined`
- Leverage lodash functions within `useCallback` for performance optimization
- Prefer lodash utilities over custom implementations for well-established patterns

### Hook composition and dependencies

- Use `useCallback` for function memoization with proper dependency arrays
- Include all dependencies in `useEffect` dependency arrays for correctness
- Use `useRef` for mutable values that don't trigger re-renders
- Implement proper cleanup functions in `useEffect` for event listeners and subscriptions

```typescript
const handleScroll = useCallback(() => {
  // Implementation
}, [onLoadMore, isLoading, hasMore, threshold, useWindowScroll])

useEffect(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}, [handleScroll, useWindowScroll])
```

### Usage patterns in components

- Use consistent delay values for debouncing: 1500ms for search, 2000ms for autocomplete
- Configure infinite scroll with appropriate thresholds and scroll modes
- Apply generic types when using hooks with specific data structures
- Pass hook options as objects for better readability and maintainability

```typescript
// Debouncing with consistent delays
const debounceSearchPhotos = useDebounce(onSearchQueryChange, 1500)

// Infinite scroll with window scroll for page-level scrolling
useInfiniteScroll({
  onLoadMore: loadMoreWorkspaces,
  hasMore: pagination.page < pagination.total_page,
  isLoading: isFetching || isLoadingMore,
  threshold: 200,
  useWindowScroll: true
})

// Generic type usage for specific query parameters
const { token, email } = useQueryConfig<AuthQueryParams>()
```

### Performance considerations

- Use `useCallback` for functions passed to hooks to prevent unnecessary re-renders
- Implement proper memoization for expensive calculations within hooks
- Add passive event listeners for scroll events to improve performance
- Use refs for values that don't need to trigger component re-renders

### Error boundaries and edge cases

- Handle edge cases like missing DOM elements or invalid configurations
- Provide fallback behavior for optional dependencies
- Use conditional logic to prevent errors when required elements are not available
- Implement proper cleanup to prevent memory leaks and event listener accumulation

### Hook testing and validation

- Validate hook behavior with different parameter combinations
- Test error conditions and edge cases thoroughly
- Ensure proper cleanup and memory management
- Verify TypeScript types work correctly with different generic parameters

---
