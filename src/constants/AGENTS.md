# Constants - Agent Guide

## Package Identity

Application constants for Trellone. Configuration values, enums, route paths, pagination settings, and site metadata.

## Setup & Run

Constants are imported directly. No separate build step needed.

```typescript
import { API_URL, SITE_CONFIG } from '~/constants/config'
import { BoardType } from '~/constants/type'
import { PATH } from '~/constants/path'
```

## Patterns & Conventions

### File Organization

- **Config**: `src/constants/config.ts` - Environment and app configuration
- **Types**: `src/constants/type.ts` - Enums and type definitions
- **Paths**: `src/constants/path.ts` - Route path definitions
- **Pagination**: `src/constants/pagination.ts` - Pagination constants
- **HTTP Status**: `src/constants/http-status-code.ts` - HTTP status codes
- **Site**: `src/constants/site.ts` - Site metadata
- **Permissions**: `src/constants/permissions.ts` - Permission constants
- **Mock Data**: `src/constants/mock-data.ts` - Development mock data

✅ **DO**: Follow `src/constants/type.ts` pattern

- Use const objects for enums
- Export types extracted from constants
- Use descriptive constant names

### Constant Definition

✅ **DO**: Use const objects for enums

```typescript
export const BoardType = {
  Public: 'public',
  Private: 'private'
} as const
```

✅ **DO**: Export type from constants

```typescript
export type BoardTypeValue = (typeof BoardType)[keyof typeof BoardType]
```

✅ **DO**: Use descriptive constant names

```typescript
export const DEFAULT_PAGE_SIZE = 10
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
```

### Route Paths

✅ **DO**: Define paths as constants

```typescript
export const PATH = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  BOARDS: '/boards',
  BOARD_DETAILS: (id: string) => `/boards/${id}`
} as const
```

### Configuration

✅ **DO**: Use environment variables for config

```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000'
```

## Touch Points / Key Files

- **Config**: `src/constants/config.ts` - API URLs, environment config
- **Types**: `src/constants/type.ts` - BoardType, UserType, etc.
- **Paths**: `src/constants/path.ts` - Route path constants
- **Pagination**: `src/constants/pagination.ts` - Default page size, limits
- **HTTP Status**: `src/constants/http-status-code.ts` - HTTP status code enum
- **Site**: `src/constants/site.ts` - Site metadata (name, description, URLs)
- **Permissions**: `src/constants/permissions.ts` - Permission constants

## JIT Index Hints

```bash
# Find a constant definition
rg -n "export const.*=" src/constants

# Find constant usage
rg -n "from '~/constants" src

# Find enum-like constants
rg -n "as const" src/constants

# Find type exports from constants
rg -n "export type.*typeof" src/constants
```

## Common Gotchas

- **Const assertions** - Use `as const` for enum-like objects
- **Type extraction** - Export types using `typeof` and `keyof`
- **Environment variables** - Use `import.meta.env.VITE_*` for client-side vars
- **Path functions** - Use functions for dynamic paths: `PATH.BOARD_DETAILS(id)`
- **Single source of truth** - Don't duplicate constants, import from here

## Pre-PR Checks

```bash
# Type check constants
npm run build

# Verify constants are used (not hardcoded values)
rg -n "BoardType\.|PATH\." src
```
