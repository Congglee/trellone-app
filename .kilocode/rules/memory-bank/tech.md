# Technology Stack: Trellone

## 1. Core Frameworks and Libraries

- **React**: 18.3.1 - A JavaScript library for building user interfaces
- **TypeScript**: 5.7.2 - A typed superset of JavaScript that compiles to plain JavaScript
- **Vite**: 6.1.0 - A build tool that provides a faster and leaner development experience for modern web projects
- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine

## 2. UI and Styling

- **Material-UI (MUI)**: 5.16.14 - A comprehensive library of React components that implement Google's Material Design
- **@mui/icons-material**: 5.16.14 - Material-UI icons library
- **@mui/lab**: 5.0.0-alpha.163 - Experimental Material-UI components
- **@mui/x-date-pickers**: 6.9.2 - Advanced date picker components
- **Emotion**: 11.14.0 - A library designed for writing CSS styles with JavaScript
- **Vite-plugin-svgr**: 4.3.0 - A Vite plugin to import SVGs as React components

## 3. State Management

- **Redux Toolkit**: 2.6.0 - The official, opinionated, batteries-included toolset for efficient Redux development
- **React-Redux**: 9.2.0 - Official React bindings for Redux
- **Redux Persist**: 6.0.0 - A library to persist and rehydrate a Redux store

## 4. Routing

- **React Router DOM**: 6.29.0 - A standard library for routing in React

## 5. Real-time Communication

- **Socket.io-client**: 4.8.1 - The client-side library for Socket.io, enabling real-time, bidirectional event-based communication

## 6. Drag and Drop

- **@dnd-kit/core**: 6.3.1 - A modern, lightweight drag and drop toolkit core
- **@dnd-kit/sortable**: 7.0.2 - Sortable components for dnd-kit
- **@dnd-kit/utilities**: 3.2.2 - Utility functions for dnd-kit

## 7. Form Management and Validation

- **React Hook Form**: 7.54.2 - A library for managing forms with a focus on performance and ease of use
- **Zod**: 3.24.2 - A TypeScript-first schema declaration and validation library
- **@hookform/resolvers**: 3.10.0 - A resolver to use Zod with React Hook Form

## 8. API Communication

- **Axios**: 1.8.3 - A promise-based HTTP client for the browser and Node.js
- **RTK Query**: Built into Redux Toolkit - A powerful data fetching and caching tool

## 9. Utilities and Helpers

- **Lodash**: 4.17.21 - A modern JavaScript utility library
- **JWT-decode**: 4.0.0 - A library to decode JWT tokens
- **@uidotdev/usehooks**: 2.4.1 - A collection of modern React hooks
- **Date-fns**: 2.30.0 - Modern JavaScript date utility library
- **randomcolor**: 0.6.2 - A tiny script for generating attractive colors

## 10. Rich Content and Media

- **@uiw/react-md-editor**: 4.0.5 - A markdown editor with live preview
- **rehype-sanitize**: 6.0.0 - HTML sanitization for markdown content
- **emoji-picker-react**: 4.12.3 - Emoji picker component for React

## 11. UI Enhancement Libraries

- **material-ui-confirm**: 4.0.0 - Confirmation dialogs for Material-UI
- **mui-color-input**: 1.1.1 - Color input component for Material-UI
- **react-infinite-scroll-component**: 6.1.0 - Infinite scroll component
- **react-toastify**: 11.0.5 - Toast notification library

## 12. SEO and Meta Management

- **react-helmet-async**: 2.0.5 - Document head management for React
- **date-fns**: 2.30.0 - With enGB locale support for internationalization

## 13. Development Tools and Linters

- **ESLint**: 9.19.0 - A pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript
- **TypeScript ESLint**: 8.22.0 - ESLint plugin for TypeScript
- **Prettier**: 3.5.2 - An opinionated code formatter
- **eslint-config-prettier**: 10.0.1 - ESLint configuration to work with Prettier
- **eslint-plugin-prettier**: 5.2.3 - ESLint plugin for Prettier integration
- **eslint-plugin-react-hooks**: 5.0.0 - ESLint plugin for React Hooks rules
- **eslint-plugin-react-refresh**: 0.4.18 - ESLint plugin for React refresh
- **rollup-plugin-visualizer**: 5.14.0 - A plugin to visualize the size of your Rollup bundles

## 14. Build and Development Infrastructure

- **@vitejs/plugin-react-swc**: 3.5.0 - Vite plugin for React using SWC
- **globals**: 15.14.0 - Global variables for different environments
- **@types/**: Type definitions for various libraries (lodash, node, randomcolor, react, react-dom)

## 15. Development Environment

- **Node.js**: Modern JavaScript runtime (version 18.0 or higher required)
- **npm**: Package manager
- **Vite Dev Server**: Fast development server with HMR (Hot Module Replacement) on port 3000
- **TypeScript Compiler**: For type checking and compilation with strict mode

## 16. Production Build

- **Vite Build**: Optimized production builds with TypeScript compilation
- **Tree Shaking**: Automatic dead code elimination
- **Code Splitting**: Automatic code splitting for better performance
- **Asset Optimization**: Automatic asset optimization and compression
- **Bundle Analysis**: rollup-plugin-visualizer for bundle size monitoring

## 17. Browser Compatibility

- **ES6+ Support**: Modern JavaScript features
- **CSS Variables**: For theming and styling
- **WebSocket Support**: For real-time communication
- **Local Storage**: For data persistence

## 18. Testing and Quality Assurance

- **TypeScript**: Static type checking with strict mode
- **ESLint**: Code quality and consistency with comprehensive rules
- **Prettier**: Code formatting with automatic fixes
- **Error Boundaries**: Runtime error handling in React components
- **Toast Notifications**: User feedback and error reporting

## 19. Additional Development Dependencies

- **@types/lodash**: 4.17.16 - Type definitions for lodash
- **@types/node**: 22.13.5 - Type definitions for Node.js
- **@types/randomcolor**: 0.5.9 - Type definitions for randomcolor
- **@types/react**: 18.3.18 - Type definitions for React
- **@types/react-dom**: 18.3.5 - Type definitions for React DOM
- **@eslint/js**: 9.19.0 - ESLint JavaScript configuration

## 20. Development Scripts

- **dev**: `vite --host` - Start development server with network access
- **build**: `tsc -b && vite build` - TypeScript compilation and production build
- **preview**: `vite preview` - Preview production build locally
- **lint**: `eslint .` - Run ESLint code quality checks
- **lint:fix**: `eslint . --fix` - Fix automatically fixable ESLint issues
- **prettier**: `prettier --check "src/**/(*.tsx|*.ts|*.css|*.scss)"` - Check code formatting
- **prettier:fix**: `prettier --write "src/**/(*.tsx|*.ts|*.css|*.scss)"` - Fix code formatting

## 21. Version Compatibility Notes

1. **React 18 + MUI 5**: Fully compatible, leveraging concurrent features
2. **Redux Toolkit 2.x**: Uses Immer 10.x internally, excellent TypeScript support
3. **React Hook Form 7.x**: Stable API with excellent performance
4. **Zod 3.x**: Mature schema validation with excellent TypeScript integration
5. **DND Kit 6.x**: Modern replacement for react-beautiful-dnd with accessibility focus
6. **Vite 6.x**: Latest build tool with enhanced performance and TypeScript support

## 22. Performance Considerations

1. **Bundle Splitting**: Dynamic imports for route-based code splitting
2. **Tree Shaking**: Vite handles this automatically for optimal bundle sizes
3. **Lazy Loading**: React.lazy for component-level splitting
4. **Memoization**: Strategic use of React.memo, useMemo, useCallback
5. **Bundle Analysis**: rollup-plugin-visualizer for monitoring bundle sizes

## 23. Security Best Practices

1. **JWT Handling**: jwt-decode for token parsing with secure storage
2. **Validation**: Zod validation on both client and server integration
3. **Sanitization**: rehype-sanitize for markdown content security
4. **HTTPS**: Production deployment requires HTTPS for security
5. **Environment Variables**: Secure configuration management with Vite

## 24. Migration Path for Future Updates

1. **React 19**: Monitor for release and compatibility updates
2. **MUI 6**: Watch for breaking changes and migration guides
3. **Redux Toolkit**: Keep updated for performance improvements
4. **TypeScript**: Regular updates for latest language features
5. **Vite**: Stay current with build tool optimizations

## 25. Current Dependency Status (August 2025)

All dependencies are up-to-date and actively maintained:

- **Core Framework**: React 18.3.1 with TypeScript 5.7.2 (latest stable versions)
- **Build Tool**: Vite 6.1.0 with SWC plugin for optimal performance
- **UI Framework**: Material-UI 5.16.14 with comprehensive component library
- **State Management**: Redux Toolkit 2.6.0 with RTK Query integration
- **Real-time**: Socket.io 4.8.1 for WebSocket communication
- **Form Handling**: React Hook Form 7.54.2 with Zod 3.24.2 validation
- **Drag & Drop**: @dnd-kit 6.3.1 for accessible interactions
- **Code Quality**: ESLint 9.19.0 and Prettier 3.5.2 with latest rules

## 26. Development Workflow Integration

- **Hot Reload**: Instant feedback during development with Vite HMR
- **Type Checking**: Real-time TypeScript validation in IDE and build process
- **Code Formatting**: Automated formatting with Prettier on save
- **Linting**: Continuous code quality checks with ESLint
- **Bundle Optimization**: Automatic optimization for production builds
- **Environment Management**: Seamless switching between development and production configurations
