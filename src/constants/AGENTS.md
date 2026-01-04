# Constants - Agent Guide

## Package Identity

Application constants for Trellone. Configuration values, enums, route paths, pagination settings, HTTP status codes, permissions, and site metadata.

## Setup & Run

Constants are imported directly. No separate build step needed.

```typescript
import { envConfig } from '~/constants/config'
import { BoardVisibility } from '~/constants/type'
import path from '~/constants/path'
import HttpStatusCode from '~/constants/http-status-code'
```

## Patterns & Conventions

### File Organization

```
src/constants/
├── config.ts           # Environment and app configuration
├── error-codes.ts      # Error code constants
├── http-status-code.ts # HTTP status codes enum
├── mock-data.ts        # Development mock data
├── pagination.ts       # Pagination constants
├── path.ts             # Route path definitions
├── permissions.ts      # Permission constants
├── site.ts             # Site metadata (name, description, URLs)
└── type.ts             # Enums and type definitions
```

✅ **DO**: Follow `src/constants/type.ts` pattern

- Use const objects for enums
- Export types extracted from constants
- Use descriptive constant names

### Constant Definition

✅ **DO**: Use const objects for enums

```typescript
export const BoardVisibility = {
  Public: 'Public',
  Private: 'Private'
} as const

export const TokenType = {
  AccessToken: 0,
  RefreshToken: 1,
  ResetPasswordToken: 2,
  VerifyEmailToken: 3
} as const

export const UserVerifyStatus = {
  Unverified: 0,
  Verified: 1
} as const
```

✅ **DO**: Export type from constants

```typescript
export type BoardVisibilityValue = (typeof BoardVisibility)[keyof typeof BoardVisibility]
export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType]
```

✅ **DO**: Use descriptive constant names

```typescript
export const DEFAULT_PAGE_SIZE = 10
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const BOARD_DEFAULT_COVER_PHOTO = 'https://...'
```

### Route Paths

✅ **DO**: Define paths as const object with default export

```typescript
// src/constants/path.ts
const path = {
  // Front Landing Page
  landing: '/',

  // Workspace Pages
  home: '/home',
  boardsList: '/boards',
  workspaceHome: '/workspaces/:workspaceId/home',
  workspaceBoards: '/workspaces/:workspaceId/boards',
  workspaceMembers: '/workspaces/:workspaceId/members',
  workspaceGuests: '/workspaces/:workspaceId/members/guests',
  workspaceSettings: '/workspaces/:workspaceId/settings',

  // Board Details Page
  boardDetails: '/boards/:boardId',

  // Auth Pages
  login: '/login',
  oauth: '/login/oauth',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',

  // Settings Pages
  accountSettings: '/settings/account',
  securitySettings: '/settings/security',

  // Verification Pages
  accountVerification: '/account/verification',
  boardInvitationVerification: '/board-invitation/verification',
  workspaceInvitationVerification: '/workspace-invitation/verification',

  // Access Control
  accessDenied: '/access-denied'
} as const

export default path
```

### Environment Configuration

✅ **DO**: Use environment variables for config

```typescript
// src/constants/config.ts
export const envConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000'
}
```

### HTTP Status Codes

✅ **DO**: Define HTTP status codes as enum

```typescript
// src/constants/http-status-code.ts
const HttpStatusCode = {
  Ok: 200,
  Created: 201,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  UnprocessableEntity: 422,
  InternalServerError: 500
} as const

export default HttpStatusCode
```

### Site Metadata

✅ **DO**: Centralize site metadata

```typescript
// src/constants/site.ts
export const SITE_CONFIG = {
  name: 'Trellone',
  description: 'Trello-style project management',
  url: {
    base: import.meta.env.VITE_APP_URL || 'http://localhost:3000'
  }
} as const
```

## Touch Points / Key Files

- **Config**: `src/constants/config.ts` - API URLs, environment config
- **Types**: `src/constants/type.ts` - BoardVisibility, TokenType, UserVerifyStatus
- **Paths**: `src/constants/path.ts` - Route path constants
- **Pagination**: `src/constants/pagination.ts` - Default page size, limits
- **HTTP Status**: `src/constants/http-status-code.ts` - HTTP status code enum
- **Site**: `src/constants/site.ts` - Site metadata (name, description, URLs)
- **Permissions**: `src/constants/permissions.ts` - Permission constants for RBAC
- **Error Codes**: `src/constants/error-codes.ts` - Error code constants
- **Mock Data**: `src/constants/mock-data.ts` - Development mock data (default cover photo, etc.)

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

# Find path usage
rg -n "path\." src/App.tsx
```

## Common Gotchas

- **Const assertions** - Use `as const` for enum-like objects
- **Type extraction** - Export types using `typeof` and `keyof`
- **Environment variables** - Use `import.meta.env.VITE_*` for client-side vars
- **Path import** - Use default import: `import path from '~/constants/path'`
- **Single source of truth** - Don't duplicate constants, import from here
- **HttpStatusCode** - Use instead of magic numbers in error handling

## Pre-PR Checks

```bash
# Type check constants
npm run build

# Verify constants are used (not hardcoded values)
rg -n "BoardVisibility\.|path\." src
```
