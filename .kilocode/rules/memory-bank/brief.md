# Trellone Project Brief

## Project Overview

**Trellone** is a modern, feature-rich Trello clone built with React 18.3.1, TypeScript 5.7.2, and Material-UI 5.16.14 that provides comprehensive project management and collaboration capabilities with real-time updates.

## Core Value Proposition

- **Real-time Collaboration**: Multiple users can work on boards simultaneously with instant updates via Socket.io 4.8.1
- **Modern UX**: Clean, responsive Material-UI interface with dark/light theme support and smooth animations
- **Complete Project Management**: Full-featured board, column, and card management with drag-and-drop using @dnd-kit
- **Rich Content Support**: File attachments, markdown descriptions with live preview, due dates, cover photos, and emoji reactions
- **Secure Authentication**: JWT-based auth with Google OAuth integration and comprehensive email verification
- **Production Ready**: Optimized Vite 6.1.0 builds with comprehensive error handling and SEO optimization

## Target Users

- **Development Teams**: Agile project management and sprint planning with real-time collaboration
- **Project Managers**: Task organization and team coordination with advanced workspace management
- **Small to Medium Businesses**: Workflow organization and collaboration with secure authentication
- **Remote Teams**: Real-time collaboration across different locations with presence indicators

## Key Success Metrics

1. **User Engagement**: Active board collaboration and real-time interactions with Socket.io
2. **Performance**: Sub-second response times with Vite-optimized builds and lazy loading
3. **Reliability**: 99%+ uptime with seamless real-time synchronization and automatic reconnection
4. **User Experience**: Intuitive drag-and-drop interface with zero-learning curve and responsive design
5. **Code Quality**: 100% TypeScript coverage with comprehensive linting and formatting

## Technical Boundaries

- **Frontend Only**: This is the React frontend; backend API is separate and communicates via REST/WebSocket
- **Modern Browsers**: ES6+ support required for full functionality with WebSocket capabilities
- **Real-time Features**: Requires WebSocket connection for collaboration and presence features
- **File Storage**: Integrated with external media/file upload services via backend API
- **Authentication**: JWT-based with Google OAuth integration requiring proper domain configuration

## Project Scope

### In Scope

- Complete Trello-like board management (boards, columns, cards) with advanced customization
- Real-time multi-user collaboration with Socket.io room-based updates
- User authentication and authorization with JWT and OAuth support
- File attachments and rich content with markdown editor and live preview
- Responsive design for all screen sizes with Material-UI responsive breakpoints
- Dark/light theme switching with system preference detection
- Workspace management with board organization and team collaboration
- SEO optimization with react-helmet-async for metadata management
- Performance optimization with code splitting and lazy loading

### Out of Scope

- Backend API development (exists separately as Node.js/Express service)
- Mobile native applications (responsive web app only)
- Advanced project analytics/reporting beyond basic activity tracking
- Third-party integrations beyond Google OAuth (no calendar sync, etc.)
- Enterprise-level user management (basic role-based access only)

## Success Criteria

1. **Feature Completeness**: All core Trello features implemented with advanced enhancements
2. **Real-time Performance**: Instant updates across all connected users with <100ms latency
3. **User Experience**: Smooth, intuitive interface matching modern web app standards with accessibility
4. **Code Quality**: Maintainable, well-documented TypeScript codebase with 100% type coverage
5. **Browser Compatibility**: Works seamlessly on Chrome, Firefox, Safari, Edge with modern features
6. **Performance**: Optimized bundle sizes with lazy loading and efficient state management
7. **Security**: Secure authentication flows with input validation and XSS prevention

## Technical Foundation

- **Framework**: React 18.3.1 with TypeScript 5.7.2 and strict mode
- **UI Library**: Material-UI (MUI) 5.16.14 with custom theming and responsive design
- **State Management**: Redux Toolkit 2.6.0 with RTK Query for API state management
- **Real-time**: Socket.io-client 4.8.1 for WebSocket communication
- **Build Tool**: Vite 6.1.0 for fast development and optimized production builds
- **Form Management**: React Hook Form 7.54.2 with Zod 3.24.2 validation
- **Drag & Drop**: @dnd-kit 6.3.1 for accessible drag-and-drop interactions
- **Deployment**: Vercel-ready configuration with environment variable management
- **Code Quality**: ESLint 9.19.0 and Prettier 3.5.2 with comprehensive rules
