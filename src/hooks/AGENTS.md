# Hooks - Agent Guide

## Package Identity

Custom React hooks for Trellone. Reusable hooks for debouncing, infinite scroll, query configuration, and URL parameter handling.

## Setup & Run

Hooks are imported directly. No separate build step needed.

```typescript
import { useDebounce, useInfiniteScroll } from '~/hooks'
```

## Patterns & Conventions

### File Organization

- **One hook per file**: Each hook has its own file with `use-` prefix
- **Naming**: Use kebab-case with `use-` prefix (e.g., `use-debounce.ts`)
- **Exports**: Named exports only (no default exports)

✅ **DO**: Follow `src/hooks/use-debounce.ts` pattern

- Export hook function directly
- Use descriptive names starting with `use`
- Include comprehensive TypeScript types

### Hook Structure

✅ **DO**: Use named exports with `export const`

```typescript
export const useDebounce = <T>(value: T, delay: number): T => {
  // implementation
}
```

✅ **DO**: Define comprehensive interfaces for options

```typescript
interface UseInfiniteScrollOptions {
  onLoadMore: () => void
  hasMore: boolean
  threshold?: number
  useWindowScroll?: boolean
}

export const useInfiniteScroll = ({
  onLoadMore,
  hasMore,
  threshold = 100,
  useWindowScroll = false
}: UseInfiniteScrollOptions) => {
  // implementation
}
```

### Input Validation

✅ **DO**: Validate hook parameters

```typescript
if (!onLoadMore || typeof onLoadMore !== 'function') {
  throw new Error('onLoadMore must be a function')
}

if (isNaN(delay)) {
  throw new Error('Delay value should be a number.')
}
```

### Default Parameters

✅ **DO**: Provide sensible defaults

```typescript
export const useInfiniteScroll = ({
  onLoadMore,
  hasMore,
  threshold = 100,
  useWindowScroll = false
}: UseInfiniteScrollOptions) => {
  // implementation
}
```

### Hook Composition

✅ **DO**: Use `useCallback` for memoization

```typescript
const handleScroll = useCallback(() => {
  // implementation
}, [onLoadMore, isLoading, hasMore, threshold])
```

✅ **DO**: Implement proper cleanup

```typescript
useEffect(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}, [handleScroll])
```

### Generic Types

✅ **DO**: Use generics for flexible hooks

```typescript
export const useQueryConfig = <T = CommonQueryParams>(): T => {
  // implementation
}
```

## Touch Points / Key Files

- **Debounce**: `src/hooks/use-debounce.ts` - Debounce functionality
- **Infinite Scroll**: `src/hooks/use-infinite-scroll.ts` - Infinite scroll implementation
- **Query Config**: `src/hooks/use-query-config.ts` - URL query parameter handling
- **Query Params**: `src/hooks/use-query-params.ts` - Search params management
- **Permissions**: `src/hooks/use-permissions.ts` - Permission checking
- **Categorize Workspaces**: `src/hooks/use-categorize-workspaces.ts` - Workspace categorization

## JIT Index Hints

```bash
# Find a hook definition
rg -n "export const use" src/hooks

# Find hook usage
rg -n "use[A-Z].*from '~/hooks" src

# Find hook options interfaces
rg -n "interface.*Options" src/hooks

# Find useCallback usage
rg -n "useCallback" src/hooks
```

## Common Gotchas

- **Named exports only** - Never use default exports for hooks
- **use prefix required** - All hooks must start with `use`
- **Cleanup functions** - Always return cleanup in useEffect
- **Dependency arrays** - Include all dependencies in useEffect/useCallback
- **Error handling** - Validate parameters and throw descriptive errors

## Pre-PR Checks

```bash
# Type check hooks
npm run build

# Verify hooks follow naming convention
rg -n "export const use" src/hooks
```
