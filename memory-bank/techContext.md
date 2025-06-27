# Technical Context

## Technology Stack

### Core Framework

- **React 18.3.1**: Latest stable with concurrent features, automatic batching
- **TypeScript 5.7.2**: Strict type checking, latest language features
- **Vite 6.1.0**: Lightning-fast development server and optimized builds

### UI Framework & Styling

- **Material-UI (MUI) 5.16.14**: Comprehensive React component library
  - `@mui/material`: Core components
  - `@mui/icons-material`: Material Design icons
  - `@mui/lab`: Experimental components
  - `@mui/x-date-pickers`: Date/time picker components
- **Emotion 11.14.0**: CSS-in-JS styling (MUI dependency)
- **Theme System**: Custom Material Design theme with dark/light modes

### State Management

- **Redux Toolkit 2.6.0**: Modern Redux with best practices
- **React Redux 9.2.0**: React bindings for Redux
- **Redux Persist 6.0.0**: State persistence across browser sessions
- **RTK Query**: Built-in data fetching and caching

### Real-time Communication

- **Socket.io Client 4.8.1**: WebSocket communication with fallbacks
- **Real-time Features**: Live board updates, user presence, collaborative editing

### HTTP & Data Management

- **Axios 1.8.3**: HTTP client with interceptors and error handling
- **Zod 3.24.2**: TypeScript-first schema validation
- **React Hook Form 7.54.2**: Performant form management
- **@hookform/resolvers 3.10.0**: Schema validation integration

### Drag & Drop

- **@dnd-kit/core 6.3.1**: Modern, accessible drag-and-drop
- **@dnd-kit/sortable 7.0.2**: Sortable lists implementation
- **@dnd-kit/utilities 3.2.2**: Utility functions for DnD

### Rich Content & Utilities

- **@uiw/react-md-editor 4.0.5**: Markdown editor for card descriptions
- **date-fns 2.30.0**: Date manipulation and formatting
- **jwt-decode 4.0.0**: JWT token parsing
- **lodash 4.17.21**: Utility library for data manipulation
- **react-toastify 11.0.5**: Toast notifications
- **randomcolor 0.6.2**: Color generation utilities

## Development Environment

### Build & Development Tools

- **Vite Configuration**:
  - SWC for fast compilation
  - SVG-to-React component loading
  - Development server with HMR
  - Optimized production builds

### Code Quality & Standards

- **ESLint 9.19.0**: Code linting with TypeScript rules
- **Prettier 3.5.2**: Code formatting
- **TypeScript ESLint**: Integration between ESLint and TypeScript
- **Strict Configuration**: Type checking with strict mode enabled

### File Structure Standards

```
src/
├── components/          # Reusable UI components
├── pages/              # Route-specific page components
├── store/              # Redux store and slices
├── queries/            # RTK Query API definitions
├── schemas/            # Zod validation schemas
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── constants/          # Application constants
├── hooks/              # Custom React hooks
├── lib/                # Core libraries (HTTP, Redux, Socket)
└── assets/             # Static assets
```

## Project Configuration

### TypeScript Configuration

- **tsconfig.app.json**: Application-specific config
- **tsconfig.node.json**: Node.js specific config
- **Strict Mode**: Enabled for maximum type safety
- **Path Aliases**: `~/` maps to `src/` for clean imports

### Environment Configuration

- **Development**: `npm run dev` - Vite dev server with HMR
- **Production**: `npm run build` - Optimized build for deployment
- **Linting**: `npm run lint` - ESLint checking
- **Formatting**: `npm run prettier` - Code formatting

### Deployment Configuration

- **Vercel Ready**: `vercel.json` configuration included
- **Build Output**: Optimized static files for CDN deployment
- **Environment Variables**: Configured for different environments

## Architecture Patterns

### Component Architecture

- **Function Components**: All components use React function syntax
- **Custom Hooks**: Business logic extracted to reusable hooks
- **Component Composition**: Flexible, reusable component patterns
- **TypeScript Props**: Strict typing for all component interfaces

### State Management Patterns

- **Redux Slices**: Feature-based state organization
- **RTK Query**: Automated API state management with caching
- **Normalized State**: Efficient data structures for complex relationships
- **Optimistic Updates**: UI updates before server confirmation

### Styling Patterns

- **MUI sx prop**: Component-level styling with theme integration
- **Styled Components**: Reusable styled components with theme support
- **Responsive Design**: Mobile-first approach with MUI breakpoints
- **Dark/Light Themes**: Complete theme switching capability

### Real-time Architecture

- **Socket.io Integration**: WebSocket connection management
- **Event-driven Updates**: Real-time state synchronization
- **Connection Resilience**: Automatic reconnection and error handling
- **Optimistic UI**: Immediate updates with server reconciliation

## Performance Optimizations

### Bundle Optimization

- **Code Splitting**: Route-based lazy loading
- **Tree Shaking**: Automatic unused code elimination
- **Asset Optimization**: Image and SVG optimization
- **Bundle Analysis**: Rollup visualizer for bundle inspection

### Runtime Performance

- **React.memo**: Component memoization where appropriate
- **useMemo/useCallback**: Expensive calculation memoization
- **Virtualization**: Large list rendering optimization
- **Image Lazy Loading**: Progressive image loading

### Caching Strategy

- **RTK Query Cache**: Automatic API response caching
- **Redux Persist**: Selective state persistence
- **Browser Caching**: Optimized cache headers for static assets
- **Service Worker**: (Ready for implementation)

## Security Considerations

### Authentication & Authorization

- **JWT Tokens**: Secure token-based authentication
- **Token Refresh**: Automatic token renewal
- **Secure Storage**: Tokens stored in localStorage with events
- **OAuth Integration**: Google OAuth2 implementation

### Data Validation

- **Client-side Validation**: Zod schemas for all forms
- **Input Sanitization**: Safe handling of user inputs
- **XSS Prevention**: Sanitized markdown rendering
- **CSRF Protection**: Token-based request authentication

## Integration Points

### External APIs

- **Authentication API**: JWT-based auth endpoints
- **File Upload API**: Image and document upload services
- **Unsplash API**: Background image integration
- **Email Services**: Account verification and notifications

### Browser APIs

- **Local Storage**: State persistence and token storage
- **Drag & Drop API**: Native HTML5 drag-and-drop integration
- **File API**: File upload and preview functionality
- **Notification API**: (Ready for push notifications)

## Development Workflow

### Local Development Setup

1. **Install Dependencies**: `npm install`
2. **Environment Setup**: Configure `.env` variables
3. **Start Development**: `npm run dev`
4. **Code Quality**: `npm run lint && npm run prettier`

### Build & Deployment

1. **Production Build**: `npm run build`
2. **Preview Build**: `npm run preview`
3. **Deploy**: Push to Vercel or similar platform
4. **Monitoring**: Check build analytics and performance

### Code Quality Standards

- **TypeScript Strict Mode**: All code must be properly typed
- **ESLint Compliance**: No linting errors in production code
- **Prettier Formatting**: Consistent code formatting
- **Component Testing**: (Ready for test implementation)

## Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **ES6+ Features**: All modern JavaScript features supported
- **WebSocket Support**: Required for real-time features
- **Local Storage**: Required for authentication persistence
