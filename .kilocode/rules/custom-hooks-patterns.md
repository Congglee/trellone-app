# Custom Hooks Patterns

## Brief overview

This rule defines the established patterns, conventions, and best practices for creating and utilizing custom React hooks within the Trellone project. These guidelines ensure consistent hook implementation, proper TypeScript integration, and maintainable code across the application.

## File naming and organization

- Use kebab-case for hook filenames with `use-` prefix: `use-debounce.ts`, `use-infinite-scroll.ts`
- Place all custom hooks in `src/hooks/` directory for centralized access
- Use descriptive names that clearly indicate the hook's functionality
- Always use `.ts` extension for TypeScript hook files

## Export patterns

- Use named exports with `export const` pattern: `export const useDebounce = (...) => { ... }`
- Avoid default exports to maintain explicit import patterns
- Export hook function directly without intermediate variables or wrappers

## TypeScript integration

- Define comprehensive interfaces for hook options with JSDoc comments for complex parameters
- Use generic types for flexible reusability: `useQueryConfig<T = CommonQueryParams>()`
- Provide sensible default values for generic types to reduce boilerplate
- Use proper typing for return values and parameters with descriptive property names

```typescript
interface UseInfiniteScrollOptions {
  /**
   * Function to call when the user scrolls near the bottom
   */
  onLoadMore: () => void
  /**
   * Whether there are more items to load
   */
  hasMore: boolean
  /**
   * Distance from bottom (in pixels) to trigger loading more items
   * @default 100
   */
  threshold?: number
}
```

## Input validation and error handling

- Implement comprehensive input validation with descriptive error messages
- Throw errors for invalid parameters using clear, actionable messages
- Validate function parameters, boolean flags, and numeric values
- Use early returns and guard clauses for validation logic

```typescript
if (!onLoadMore || typeof onLoadMore !== 'function') {
  throw new Error('onLoadMore must be a function')
}

if (isNaN(delay)) {
  throw new Error('Delay value should be a number.')
}
```

## Default parameters and configuration

- Provide sensible default values for optional parameters
- Use object destructuring with defaults for complex configuration options
- Document default values in JSDoc comments using `@default` tag
- Make commonly used parameters optional with reasonable fallbacks

```typescript
export const useInfiniteScroll = ({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 100,
  useWindowScroll = false
}: UseInfiniteScrollOptions) => {
```

## Documentation patterns

- Add comprehensive JSDoc comments for complex hooks with usage examples
- Include `@param` descriptions for all parameters
- Provide `@returns` documentation for return values
- Include practical usage examples in JSDoc using `@example` tag

````typescript
/**
 * Custom hook for implementing infinite scroll functionality
 *
 * @param options Configuration options for infinite scroll behavior
 * @returns Object containing ref to attach to the container element
 *
 * @example
 * ```typescript
 * const { containerRef } = useInfiniteScroll({
 *   onLoadMore: loadMoreItems,
 *   hasMore: pagination.page < pagination.total_page,
 *   isLoading: isLoadingMore
 * })
 * ```
 */
````

## Lodash integration patterns

- Import specific lodash functions to avoid bundle bloat: `import debounce from 'lodash/debounce'`
- Use lodash utilities for common operations like `omitBy`, `isUndefined`
- Leverage lodash functions within `useCallback` for performance optimization
- Prefer lodash utilities over custom implementations for well-established patterns

## Hook composition and dependencies

- Use `useCallback` for function memoization with proper dependency arrays
- Include all dependencies in `useEffect` dependency arrays for correctness
- Use `useRef` for mutable values that don't trigger re-renders
- Implement proper cleanup functions in `useEffect` for event listeners and subscriptions

```typescript
const handleScroll = useCallback(() => {
  // Implementation
}, [onLoadMore, isLoading, hasMore, threshold, useWindowScroll])

useEffect(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}, [handleScroll, useWindowScroll])
```

## Usage patterns in components

- Use consistent delay values for debouncing: 1500ms for search, 2000ms for autocomplete
- Configure infinite scroll with appropriate thresholds and scroll modes
- Apply generic types when using hooks with specific data structures
- Pass hook options as objects for better readability and maintainability

```typescript
// Debouncing with consistent delays
const debounceSearchPhotos = useDebounce(onSearchQueryChange, 1500)

// Infinite scroll with window scroll for page-level scrolling
useInfiniteScroll({
  onLoadMore: loadMoreWorkspaces,
  hasMore: pagination.page < pagination.total_page,
  isLoading: isFetching || isLoadingMore,
  threshold: 200,
  useWindowScroll: true
})

// Generic type usage for specific query parameters
const { token, email } = useQueryConfig<AuthQueryParams>()
```

## Performance considerations

- Use `useCallback` for functions passed to hooks to prevent unnecessary re-renders
- Implement proper memoization for expensive calculations within hooks
- Add passive event listeners for scroll events to improve performance
- Use refs for values that don't need to trigger component re-renders

## Error boundaries and edge cases

- Handle edge cases like missing DOM elements or invalid configurations
- Provide fallback behavior for optional dependencies
- Use conditional logic to prevent errors when required elements are not available
- Implement proper cleanup to prevent memory leaks and event listener accumulation

## Hook testing and validation

- Validate hook behavior with different parameter combinations
- Test error conditions and edge cases thoroughly
- Ensure proper cleanup and memory management
- Verify TypeScript types work correctly with different generic parameters
