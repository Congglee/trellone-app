## Brief overview

This rule defines the complete technology stack for the Trellone project, including specific versions and best practices for each major dependency. This ensures consistent development patterns and optimal usage of the chosen technologies.

## Core Framework Stack

- **React 18.3.1**: Use concurrent features, Suspense boundaries, and modern hooks patterns
- **TypeScript 5.7.2**: Leverage strict mode, latest type inference, and comprehensive type coverage
- **Vite 6.1.0**: Utilize fast HMR, optimized builds, and ES modules for development and production

## UI and Styling Framework

- **Material-UI 5.16.14**: Use sx prop for styling, leverage theme system, and follow Material Design principles
- **@emotion/react 11.14.0**: Prefer sx prop over styled components for consistency with MUI patterns
- **@mui/icons-material 5.16.14**: Use tree-shakable icon imports to optimize bundle size
- **@mui/x-date-pickers 6.9.2**: Integrate with React Hook Form for consistent form validation

## State Management Architecture

- **Redux Toolkit 2.6.0**: Use createSlice, createAsyncThunk, and RTK Query for all state management
- **React Redux 9.2.0**: Leverage typed hooks (useAppSelector, useAppDispatch) from lib/redux/hooks
- **Redux Persist 6.0.0**: Persist only essential state (auth) to avoid performance issues

## Form Management and Validation

- **React Hook Form 7.54.2**: Use with TypeScript generics and resolver pattern for type safety
- **Zod 3.24.2**: Define schemas in src/schemas/ directory, use with @hookform/resolvers for validation
- **@hookform/resolvers 3.10.0**: Bridge between React Hook Form and Zod for seamless integration

## Drag and Drop Implementation

- **@dnd-kit/core 6.3.1**: Use for accessible drag-and-drop with keyboard support
- **@dnd-kit/sortable 7.0.2**: Implement sortable lists with proper collision detection
- **@dnd-kit/utilities 3.2.2**: Leverage utility functions for transform calculations and animations

## Real-time Communication

- **socket.io-client 4.8.1**: Implement room-based collaboration with JWT authentication in headers
- **Connection patterns**: Use Redux slices to manage socket state and real-time updates

## HTTP Client and API Integration

- **axios 1.8.3**: Configure base instances in lib/http.ts with interceptors for auth tokens
- **RTK Query**: Use custom axios base query from lib/redux/helpers.ts for consistent API handling

## Rich Content and Media

- **@uiw/react-md-editor 4.0.5**: Implement markdown editing with live preview capabilities
- **rehype-sanitize 6.0.0**: Always sanitize markdown content to prevent XSS attacks
- **emoji-picker-react 4.12.3**: Use for emoji reactions in comments and descriptions

## Development Tools and Code Quality

- **ESLint 9.19.0**: Use flat config format with TypeScript and React-specific rules
- **Prettier 3.5.2**: Configure with ESLint integration for consistent code formatting
- **typescript-eslint 8.22.0**: Leverage strict TypeScript linting rules for type safety

## Utility Libraries

- **lodash 4.17.21**: Import specific functions to avoid bundle bloat (e.g., import { debounce } from 'lodash')
- **date-fns 2.30.0**: Use for date manipulation with tree-shaking support
- **jwt-decode 4.0.0**: Decode JWT tokens client-side for user session management

## Performance and User Experience

- **react-infinite-scroll-component 6.1.0**: Implement for large data sets with proper loading states
- **react-toastify 11.0.5**: Use for consistent notification patterns across the application
- **@uidotdev/usehooks 2.4.1**: Leverage modern React hooks for common functionality

## SEO and Meta Management

- **react-helmet-async 2.0.5**: Manage document head with proper SSR support and async rendering
- **Implement in components/SEO/ for reusable meta tag management**

## Build and Bundle Optimization

- **@vitejs/plugin-react-swc 3.5.0**: Use SWC for faster compilation and smaller bundles
- **rollup-plugin-visualizer 5.14.0**: Analyze bundle sizes regularly to identify optimization opportunities
- **vite-plugin-svgr 4.3.0**: Import SVGs as React components for better tree-shaking

## Version-Specific Best Practices

- **React 18**: Use concurrent features like Suspense, startTransition for better UX
- **Redux Toolkit 2.x**: Leverage improved TypeScript support and RTK Query enhancements
- **Material-UI 5.x**: Use sx prop consistently, avoid makeStyles (deprecated)
- **TypeScript 5.7**: Utilize latest type inference improvements and strict mode features
- **Vite 6.x**: Take advantage of improved build performance and ES2022 target support

## Integration Patterns

- **Forms + Validation**: Always pair React Hook Form with Zod schemas for type-safe validation
- **State + API**: Use RTK Query with Redux Toolkit slices for comprehensive state management
- **UI + Theme**: Leverage Material-UI theme system with TypeScript module augmentation
- **Real-time + State**: Integrate Socket.io events with Redux actions for consistent state updates

## Security Considerations

- **JWT Handling**: Use jwt-decode for client-side token parsing, never store sensitive data
- **Content Sanitization**: Always use rehype-sanitize for user-generated markdown content
- **Input Validation**: Implement Zod validation on all form inputs and API boundaries
- **Environment Variables**: Use Vite's environment variable system for configuration management
