# Utils - Agent Guide

## Package Identity

Utility functions for Trellone. Pure functions for common operations like validation, formatting, error handling, and data manipulation.

## Setup & Run

Utils are imported directly. No separate build step needed.

```typescript
import { generateColorFromString, isUnprocessableEntityError } from '~/utils'
```

## Patterns & Conventions

### File Organization

- **One file per domain**: Each utility domain has its own file (e.g., `error-handlers.ts`, `formatters.ts`)
- **Naming**: Use kebab-case with descriptive names
- **Exports**: Named exports only (no default exports)

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
  // implementation
}
```

### Pure Functions

✅ **DO**: Keep functions pure (no side effects)

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

### Error Handling

✅ **DO**: Create type guards for error checking

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

### Type Safety

✅ **DO**: Use proper TypeScript types

```typescript
export const sortByOrder = <T extends { order: number }>(items: T[]): T[] => {
  return [...items].sort((a, b) => a.order - b.order)
}
```

## Touch Points / Key Files

- **Error Handlers**: `src/utils/error-handlers.ts` - Error type checking and handling
- **Formatters**: `src/utils/formatters.ts` - String and data formatting
- **Validators**: `src/utils/validators.ts` - File and data validation
- **Storage**: `src/utils/storage.ts` - Local storage management
- **Utils**: `src/utils/utils.ts` - General utilities (color generation, placeholders)
- **Sorts**: `src/utils/sorts.ts` - Array sorting utilities
- **OAuth**: `src/utils/oauth.ts` - OAuth utilities
- **URL**: `src/utils/url.ts` - URL manipulation utilities
- **HTML Sanitizer**: `src/utils/html-sanitizer.ts` - HTML sanitization
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
```

## Common Gotchas

- **Named exports only** - Never use default exports for utilities
- **Pure functions** - Avoid side effects (no console.log, no mutations)
- **Type guards** - Use proper type narrowing for error handling
- **Error messages** - Provide clear, actionable error messages
- **Input validation** - Always validate inputs and throw descriptive errors

## Pre-PR Checks

```bash
# Type check utils
npm run build

# Verify functions are pure (no side effects)
rg -n "console\.|localStorage\.|sessionStorage\." src/utils
```
