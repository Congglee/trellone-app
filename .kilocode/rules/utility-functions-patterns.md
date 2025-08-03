# Utility Functions Patterns

## Brief overview

This rule documents the established patterns, conventions, and best practices for defining, organizing, and consuming utility functions within the Trellone React codebase. These guidelines ensure consistent utility development, proper TypeScript integration, reusability, and maintainable code architecture.

## File organization and naming

- Organize utility files by domain or functionality in `src/utils/` directory with descriptive kebab-case names
- Use specific file names that clearly indicate purpose: `error-handlers.ts`, `formatters.ts`, `validators.ts`, `storage.ts`
- Group related functions in the same file when they share a common domain or data type
- Use `.ts` extension for all utility files to maintain TypeScript consistency
- Avoid generic names like `helpers.ts` or `common.ts` in favor of specific domain names

## Function naming conventions

- Use camelCase for all function names with descriptive, action-oriented names
- Follow consistent patterns for similar function types: `get[Resource]FromLS()`, `set[Resource]ToLS()`, `is[Type]Error()`
- Use verb-noun pattern for action functions: `generateColorFromString()`, `extractDomain()`, `capitalizeFirstLetter()`
- Use `is` prefix for type guard functions: `isAxiosError()`, `isUnprocessableEntityError()`
- Include domain context in function names when needed: `getGoogleAuthUrl()`, `singleFileValidator()`

## Export and import patterns

- Use named exports exclusively for all utility functions to maintain explicit import patterns
- Import utilities using the `~` path alias: `import { generateColorFromString } from '~/utils/utils'`
- Import external dependencies at the top of files before internal imports
- Group imports logically: external libraries first, then internal constants, types, and schemas

## TypeScript integration and generics

- Use comprehensive TypeScript generics for reusable functions with proper constraints
- Define generic functions with descriptive type parameters: `<T extends Record<K, V>, K extends string | number | symbol, V>`
- Implement proper type guards with type narrowing for error handling functions
- Use union types for flexible parameter acceptance: `T[] | undefined | null`
- Apply proper return type annotations for complex functions

```typescript
export const mapOrder = <T extends Record<K, V>, K extends string | number | symbol, V>(
  originalArray: T[] | undefined | null,
  orderArray: V[] | undefined | null,
  key: K
): T[] => {
  if (!originalArray || !orderArray || !key) return []
  return [...originalArray].sort((a, b) => orderArray.indexOf(a[key]) - orderArray.indexOf(b[key]))
}
```

## Error handling and validation patterns

- Implement comprehensive type guards for different error scenarios with proper type narrowing
- Use consistent error checking patterns with early returns for invalid inputs
- Provide meaningful error messages and fallback values for edge cases
- Handle URL parsing errors with try-catch blocks and return empty strings as fallbacks
- Validate function parameters and throw descriptive errors for invalid inputs

```typescript
export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}
```

## Documentation and JSDoc patterns

- Add comprehensive JSDoc comments for complex utility functions with generic parameters
- Include `@template` tags for generic type parameters with clear descriptions
- Provide `@param` descriptions for all parameters including types and constraints
- Include `@returns` documentation with specific return type information
- Add practical `@example` usage demonstrations for complex functions

```typescript
/**
 * Maps an array of objects to a new array sorted based on a specified order.
 *
 * @template T - Type of the objects in the array extending Record<K, V>
 * @template K - Type of the key in the object (string | number | symbol)
 * @template V - Type of the value associated with the key
 *
 * @param {T[] | undefined | null} originalArray - The original array to be sorted
 * @param {V[] | undefined | null} orderArray - Array that defines the desired order of elements
 * @param {K} key - The key in the objects whose value is used for ordering
 *
 * @returns {T[]} A new sorted array based on the order specified in orderArray
 *
 * @example
 * // Sorting cards based on columnId order
 * const sortedCards = mapOrder(cards, columnOrder, 'columnId');
 */
```

## Pure function design principles

- Design utility functions as pure functions without side effects when possible
- Use immutable operations with spread operator for array manipulations: `[...originalArray].sort()`
- Avoid direct DOM manipulation in utility functions except for specific UI utilities
- Return new objects/arrays instead of mutating input parameters
- Handle null/undefined inputs gracefully with early returns and default values

## Configuration and constants integration

- Import configuration values from `~/constants/config` for validation thresholds and limits
- Use configuration constants instead of hardcoded values in validation functions
- Reference HTTP status codes from `~/constants/http-status-code` for consistent error handling
- Leverage environment configuration from `~/constants/config` for external service URLs

## Local storage and state management patterns

- Create dedicated functions for each storage operation with descriptive names
- Use EventTarget pattern for cross-component storage event communication
- Implement consistent token management with separate functions for access and refresh tokens
- Provide getter functions that return empty strings as fallbacks for missing values
- Use custom events for storage clearing operations to notify other components

```typescript
export const LocalStorageEventTarget = new EventTarget()

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('profile')

  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}
```

## Validation function patterns

- Create specific validation functions for different file types and use cases
- Return `null` for valid inputs and descriptive error strings for invalid inputs
- Use configuration constants for file size limits and allowed types
- Implement comprehensive validation including file count, size, type, and total size checks
- Provide specific error messages that include the problematic file name and limits

## URL and domain manipulation utilities

- Use native URL constructor for robust URL parsing with proper error handling
- Implement try-catch blocks for URL operations with meaningful fallback values
- Create specific functions for different URL operations: domain extraction, favicon generation
- Handle invalid URLs gracefully by returning empty strings or the original input
- Use consistent error logging patterns for debugging URL parsing issues

## Performance and reusability considerations

- Design functions to be easily testable with clear inputs and outputs
- Use memoization patterns when appropriate for expensive calculations
- Avoid creating utility functions that are too specific to a single component
- Implement functions that can handle edge cases and various input types
- Use efficient algorithms and avoid unnecessary iterations or object creations

## Integration with external libraries

- Leverage axios utilities for error type checking: `axios.isAxiosError(error)`
- Use lodash functions when appropriate but import specific functions to avoid bundle bloat
- Integrate with Redux Toolkit Query error types: `FetchBaseQueryError`
- Use native browser APIs (URL, URLSearchParams) for standard operations
- Maintain compatibility with Material-UI and other UI library patterns
