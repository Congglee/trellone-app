# Utils - Agent Guide

## Package Identity

Utility functions for Trellone. Pure functions for common operations like validation, formatting, error handling, storage management, and data manipulation.

## Setup & Run

Utils are imported directly. No separate build step needed.

```typescript
import { generateColorFromString } from '~/utils/utils'
import { isUnprocessableEntityError } from '~/utils/error-handlers'
import { getAccessTokenFromLS, setAccessTokenToLS } from '~/utils/storage'
```

## Patterns & Conventions

### File Organization

- **One file per domain**: Each utility domain has its own file
- **Naming**: Use kebab-case with descriptive names
- **Exports**: Named exports only (no default exports)

```
src/utils/
├── error-handlers.ts    # Error type checking
├── formatters.ts        # String and data formatting
├── html-sanitizer.ts    # HTML sanitization (DOMPurify)
├── markdown-to-html.ts  # Markdown conversion
├── oauth.ts             # OAuth utilities
├── sorts.ts             # Array sorting utilities
├── storage.ts           # LocalStorage management
├── url.ts               # URL manipulation
├── utils.ts             # General utilities (color generation, etc.)
└── validators.ts        # File and data validation
```

✅ **DO**: Follow `src/utils/error-handlers.ts` pattern

- Export individual functions
- Use descriptive function names
- Include comprehensive TypeScript types

### Function Structure

✅ **DO**: Use named exports

```typescript
export const generateColorFromString = (str: string): string => {
  // implementation
}
```

✅ **DO**: Use explicit TypeScript types

```typescript
export const isUnprocessableEntityError = <T>(error: unknown): error is EntityError<T> => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'data' in error &&
    (error as EntityError<T>).status === 422
  )
}
```

### Pure Functions

✅ **DO**: Keep functions pure (no side effects) where possible

```typescript
// ✅ Good - pure function
export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd')
}

// ❌ Bad - side effect
export const formatDate = (date: Date): string => {
  console.log(date) // Side effect!
  return format(date, 'yyyy-MM-dd')
}
```

### Error Handling Utilities

✅ **DO**: Create type guards for error checking

```typescript
import type { EntityError } from '~/types/utils.type'

export const isUnprocessableEntityError = <T>(error: unknown): error is EntityError<T> => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'data' in error &&
    (error as EntityError<T>).status === 422
  )
}

export const isAxiosUnauthorizedError = (error: unknown): boolean => {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export const isAxiosExpiredTokenError = (error: unknown): boolean => {
  return (
    isAxiosUnauthorizedError(error) &&
    (error as AxiosError<{ name?: string }>).response?.data?.name === 'EXPIRED_TOKEN'
  )
}

export const isAxiosUnverifiedError = (error: unknown): boolean => {
  return (
    isAxiosError(error) &&
    error.response?.status === HttpStatusCode.Forbidden &&
    (error as AxiosError<{ name?: string }>).response?.data?.name === 'USER_NOT_VERIFIED'
  )
}
```

### Storage Utilities

✅ **DO**: Centralize localStorage management

```typescript
// src/utils/storage.ts
export const LocalStorageEventTarget = new EventTarget()

export const getAccessTokenFromLS = (): string => {
  return localStorage.getItem('access_token') || ''
}

export const setAccessTokenToLS = (access_token: string): void => {
  localStorage.setItem('access_token', access_token)
}

export const getRefreshTokenFromLS = (): string => {
  return localStorage.getItem('refresh_token') || ''
}

export const setRefreshTokenToLS = (refresh_token: string): void => {
  localStorage.setItem('refresh_token', refresh_token)
}

export const clearLS = (): void => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  LocalStorageEventTarget.dispatchEvent(new Event('clearLS'))
}
```

### Validation Functions

✅ **DO**: Validate inputs and throw descriptive errors

```typescript
export const validateFile = (file: File): void => {
  if (!file) {
    throw new Error('File is required')
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size must be less than ${MAX_FILE_SIZE} bytes`)
  }
}
```

### HTML Sanitization

✅ **DO**: Use DOMPurify for HTML sanitization

```typescript
import DOMPurify from 'dompurify'

export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'img'],
    ALLOWED_ATTR: ['href', 'src', 'alt']
  })
}
```

### Loading State Utilities

✅ **DO**: Use interceptor loading helpers

```typescript
// src/utils/utils.ts
export const interceptorLoadingElements = (calling: boolean): void => {
  const elements = document.querySelectorAll('.interceptor-loading')
  
  elements.forEach((element) => {
    if (calling) {
      element.setAttribute('disabled', 'true')
    } else {
      element.removeAttribute('disabled')
    }
  })
}
```

### Type Safety

✅ **DO**: Use proper TypeScript types

```typescript
export const sortByOrder = <T extends { order: number }>(items: T[]): T[] => {
  return [...items].sort((a, b) => a.order - b.order)
}
```

## Touch Points / Key Files

- **Error Handlers**: `src/utils/error-handlers.ts` - Error type checking (isUnprocessableEntityError, isAxiosUnauthorizedError, etc.)
- **Formatters**: `src/utils/formatters.ts` - String and data formatting
- **Validators**: `src/utils/validators.ts` - File and data validation
- **Storage**: `src/utils/storage.ts` - LocalStorage management (tokens, clearLS, LocalStorageEventTarget)
- **Utils**: `src/utils/utils.ts` - General utilities (color generation, interceptorLoadingElements)
- **Sorts**: `src/utils/sorts.ts` - Array sorting utilities
- **OAuth**: `src/utils/oauth.ts` - OAuth utilities (getGoogleAuthUrl)
- **URL**: `src/utils/url.ts` - URL manipulation utilities
- **HTML Sanitizer**: `src/utils/html-sanitizer.ts` - HTML sanitization (DOMPurify)
- **Markdown to HTML**: `src/utils/markdown-to-html.ts` - Markdown conversion

## JIT Index Hints

```bash
# Find a utility function
rg -n "export const" src/utils

# Find type guards
rg -n "is.*Error|is.*Type" src/utils

# Find validation functions
rg -n "validate|check" src/utils

# Find formatter functions
rg -n "format|parse" src/utils

# Find storage functions
rg -n "getAccessToken|setAccessToken|clearLS" src
```

## Common Gotchas

- **Named exports only** - Never use default exports for utilities
- **Pure functions** - Avoid side effects where possible (no console.log, no mutations)
- **Type guards** - Use proper type narrowing for error handling
- **Error messages** - Provide clear, actionable error messages
- **Input validation** - Always validate inputs and throw descriptive errors
- **LocalStorageEventTarget** - Use for cross-component communication (token refresh, logout)
- **interceptor-loading class** - Add to submit buttons for automatic disable during API calls

## Pre-PR Checks

```bash
# Type check utils
npm run build

# Verify functions are pure (no side effects)
rg -n "console\." src/utils
```
