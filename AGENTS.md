# Trellone - AI Agent Guide

## Project Snapshot

Trellone is a React 18 + TypeScript SPA for Trello-style project management. Built with Material-UI, Redux Toolkit, RTK Query, Socket.IO, and Vite. Single project structure (not monorepo). Each `src/` subdirectory has its own detailed AGENTS.md file.

**Tech Stack**: React 18.3.1, TypeScript 5.7.2, Material-UI 5.16.14, Redux Toolkit 2.6.0, RTK Query, Socket.IO Client 4.8.1, Vite 6.1.0, React Hook Form 7.54.2, Zod 3.24.2, TipTap 3.6.2

## Root Setup Commands

```bash
# Install dependencies
npm install

# Development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run build  # (includes tsc -b)

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run prettier
npm run prettier:fix
```

## Universal Conventions

- **Code Style**: TypeScript strict mode, ESLint 9.19.0, Prettier
- **Import Paths**: Use `~` alias for `src/` directory (e.g., `import Component from '~/components/Component'`)
- **File Naming**:
  - Components: PascalCase (`ComponentName/ComponentName.tsx`)
  - Utilities/Hooks: kebab-case (`use-debounce.ts`, `error-handlers.ts`)
  - Types: kebab-case with `.type.ts` suffix (`jwt.type.ts`)
  - Schemas: kebab-case with `.schema.ts` suffix (`auth.schema.ts`)
- **Component Exports**: Default exports for components, named exports for utilities/types
- **Type Imports**: Use `import type` for type-only imports
- **MUI Imports**: Tree-shaking friendly, one-per-line (`import Box from '@mui/material/Box'`)

## Naming Conventions (CRITICAL)

Follow the naming conventions defined in `.cursor/rules/react-naming-conventions.mdc`:

### Handler Functions

| Type | Format | Example |
|------|--------|---------|
| Logic/Data handler | `handle` + `Action` + `DataModel` | `handleUpdateCardTitle` |
| UI event (click, change, toggle, open, close, select) | `handle` + `DataModel` + `Action` | `handleCardModalClose` |
| API function | `verb` + `DataModel` | `addCardMember`, `deleteBoard` |
| Form submit | `onSubmit` | `const onSubmit = handleSubmit(...)` |

### Props

| Type | Format | Example |
|------|--------|---------|
| State prop | Descriptive name | `newBoardDialogOpen`, `cardDescription` |
| Callback prop | `on` + `Action` + `DataModel` | `onUpdateCardDescription`, `onNewBoardDialogClose` |

## Material-UI Guidelines

Follow the guidelines defined in `.cursor/rules/material-ui-guidelines.mdc`:

- **Styling**: Prefer `sx` prop over `styled` components
- **Imports**: Tree-shaking imports (`import Box from '@mui/material/Box'`)
- **Icons**: Import individually (`import GoogleIcon from '@mui/icons-material/Google'`)
- **Grid**: Use Grid v2 (`import Grid from '@mui/material/Unstable_Grid2'`)
- **Theme**: Use `experimental_extendTheme` with light/dark color schemes
- **Responsive**: Use MUI breakpoints (`{ xs, sm, md, lg, xl }`)

## Security & Secrets

- Never commit `.env` files or API keys
- Environment variables must use `VITE_` prefix for client-side access
- JWT tokens stored in httpOnly cookies (handled by backend) and localStorage (for client-side access)
- Access tokens sent via Authorization header, refresh tokens via cookies
- Never log sensitive data (passwords, tokens) to console
- Token refresh handled automatically by HTTP interceptor when access token expires

## JIT Index - Directory Map

### Source Structure (`src/`)

Each directory has detailed patterns in its own AGENTS.md:

- **Components**: `src/components/` → [see src/components/AGENTS.md](src/components/AGENTS.md)
- **Pages**: `src/pages/` → [see src/pages/AGENTS.md](src/pages/AGENTS.md)
- **State Management**: `src/store/` → [see src/store/AGENTS.md](src/store/AGENTS.md)
- **API Layer**: `src/queries/` → [see src/queries/AGENTS.md](src/queries/AGENTS.md)
- **Validation**: `src/schemas/` → [see src/schemas/AGENTS.md](src/schemas/AGENTS.md)
- **Type Definitions**: `src/types/` → [see src/types/AGENTS.md](src/types/AGENTS.md)
- **Custom Hooks**: `src/hooks/` → [see src/hooks/AGENTS.md](src/hooks/AGENTS.md)
- **Utilities**: `src/utils/` → [see src/utils/AGENTS.md](src/utils/AGENTS.md)
- **Library Configs**: `src/lib/` → [see src/lib/AGENTS.md](src/lib/AGENTS.md)
- **Constants**: `src/constants/` → [see src/constants/AGENTS.md](src/constants/AGENTS.md)

### Cursor Rules

- **React Naming Conventions**: `.cursor/rules/react-naming-conventions.mdc`
- **Material-UI Guidelines**: `.cursor/rules/material-ui-guidelines.mdc`
- **General Restrictions**: `.cursor/rules/general-restrictions.mdc`

### Quick Find Commands

```bash
# Find a React component
rg -n "export default function" src/components src/pages

# Find a custom hook
rg -n "export const use" src/hooks

# Find RTK Query endpoints
rg -n "build\.(query|mutation)" src/queries

# Find a Redux slice
rg -n "createSlice" src/store/slices

# Find a Zod schema
rg -n "z\.object" src/schemas

# Find a type definition
rg -n "export (interface|type)" src/types

# Find Material-UI component usage
rg -n "from '@mui/material" src

# Find handler functions
rg -n "const handle" src/components src/pages

# Find callback props
rg -n "on[A-Z].*:" src/components

# Find socket events
rg -n "socket\?\.(emit|on|off)" src
```

## Definition of Done

Before creating a PR:

- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Prettier formatting applied (`npm run prettier:fix`)
- [ ] No console errors in browser dev tools
- [ ] Follows patterns from relevant `src/*/AGENTS.md` file
- [ ] Uses `~` alias for imports (not relative `../../`)
- [ ] Follows naming conventions from `.cursor/rules/react-naming-conventions.mdc`
- [ ] Follows Material-UI guidelines from `.cursor/rules/material-ui-guidelines.mdc`
- [ ] Proper error handling for async operations
- [ ] Loading states implemented where needed
