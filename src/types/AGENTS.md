# Types - Agent Guide

## Package Identity

TypeScript type definitions for Trellone. Domain-specific types organized by feature. Used for API request/response types, utility types, and error handling.

## Setup & Run

Types are imported directly. No separate build step needed.

```typescript
import { TokenPayload, InviteTokenPayload } from '~/types/jwt.type'
```

## Patterns & Conventions

### File Organization

- **One file per domain**: Each domain has its own type file (e.g., `jwt.type.ts`, `query-params.type.ts`)
- **Naming**: Use kebab-case with `.type.ts` suffix
- **Exports**: Named exports only (no default exports)

✅ **DO**: Follow `src/types/jwt.type.ts` pattern
- Group related interfaces in same file
- Use descriptive interface names
- Export all types for external use

### Type Definition Patterns

✅ **DO**: Use PascalCase for interface names
```typescript
export interface TokenPayload {
  user_id: string
  token_type: TokenTypeValue
}
```

✅ **DO**: Use snake_case for property names (matches backend API)
```typescript
export interface CommonQueryParams {
  page?: number | string
  limit?: number | string
}
```

✅ **DO**: Use interface extension for related types
```typescript
export interface InviteTokenPayload extends TokenPayload {
  inviter_id: string
  invitation_id: string
}
```

### Type Extraction from Constants

✅ **DO**: Extract types from const objects
```typescript
import { TokenType } from '~/constants/type'

export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType]
```

### Generic Types

✅ **DO**: Use generics for reusable types
```typescript
export interface EntityError<T = Record<string, any>> {
  status: number
  data: EntityValidationErrors<T>
}
```

### Union Types

✅ **DO**: Use string literal unions for controlled values
```typescript
export type Mode = 'light' | 'dark' | 'system'
```

### Indexed Access Types

✅ **DO**: Use indexed access for type references
```typescript
export interface UserQueryParams extends CommonQueryParams {
  verify?: UserType['verify']
}
```

## Touch Points / Key Files

- **JWT Types**: `src/types/jwt.type.ts` - Token payload types
- **Query Params**: `src/types/query-params.type.ts` - URL query parameter types
- **Utils Types**: `src/types/utils.type.ts` - Error handling and utility types

## JIT Index Hints

```bash
# Find a type definition
rg -n "export (interface|type)" src/types

# Find type usage
rg -n "from '~/types" src

# Find generic types
rg -n "<T.*>" src/types

# Find union types
rg -n "type.*=.*\|" src/types
```

## Common Gotchas

- **Named exports only** - Never use default exports for types
- **Snake case properties** - Match backend API conventions
- **Type extraction** - Use `typeof` and `keyof` for const object types
- **Interface over type** - Prefer interfaces for object shapes, types for unions/primitives
- **Import type** - Use `import type` for type-only imports to optimize bundle

## Pre-PR Checks

```bash
# Type check types
npm run build

# Verify all types are exported
rg -n "export (interface|type)" src/types
```

