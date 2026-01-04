# Types - Agent Guide

## Package Identity

TypeScript type definitions for Trellone. Utility types, JWT payload types, and query parameter types. Domain-specific entity types are in `src/schemas/` (inferred from Zod schemas).

## Setup & Run

Types are imported directly. No separate build step needed.

```typescript
import type { TokenPayload, InviteTokenPayload } from '~/types/jwt.type'
import type { CommonQueryParams, BoardQueryParams } from '~/types/query-params.type'
import type { EntityError } from '~/types/utils.type'
```

## Patterns & Conventions

### File Organization

- **One file per domain**: Each domain has its own type file
- **Naming**: Use kebab-case with `.type.ts` suffix
- **Exports**: Named exports only (no default exports)

```
src/types/
├── jwt.type.ts           # Token payload types
├── query-params.type.ts  # URL query parameter types
└── utils.type.ts         # Error handling and utility types
```

✅ **DO**: Follow `src/types/jwt.type.ts` pattern

- Group related interfaces in same file
- Use descriptive interface names
- Export all types for external use

### Entity Types vs Utility Types

**Entity types** (User, Board, Card, etc.) are defined in `src/schemas/` and inferred from Zod schemas:

```typescript
// In src/schemas/user.schema.ts
export type UserType = z.infer<typeof UserSchema>

// Import in components
import type { UserType } from '~/schemas/user.schema'
```

**Utility types** (error types, query params, JWT payloads) are defined in `src/types/`:

```typescript
// In src/types/utils.type.ts
export interface EntityError<T = Record<string, any>> {
  status: number
  data: EntityValidationErrors<T>
}
```

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

export interface EntityValidationErrors<T> {
  message: string
  errors?: Record<keyof T, { type: string; msg: string }>
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
import type { UserType } from '~/schemas/user.schema'

export interface UserQueryParams extends CommonQueryParams {
  verify?: UserType['verify']  // Reuse property type from entity
}
```

### Import Type

✅ **DO**: Use `import type` for type-only imports

```typescript
import type { TokenPayload } from '~/types/jwt.type'
import type { UserType } from '~/schemas/user.schema'
```

## Touch Points / Key Files

- **JWT Types**: `src/types/jwt.type.ts` - Token payload types (TokenPayload, InviteTokenPayload)
- **Query Params**: `src/types/query-params.type.ts` - URL query parameter types (CommonQueryParams, BoardQueryParams)
- **Utils Types**: `src/types/utils.type.ts` - Error handling types (EntityError, EntityValidationErrors)

### Entity Types (in src/schemas/)

- **UserType**: `src/schemas/user.schema.ts`
- **BoardType**: `src/schemas/board.schema.ts`
- **CardType**: `src/schemas/card.schema.ts`
- **ColumnType**: `src/schemas/column.schema.ts`
- **WorkspaceType**: `src/schemas/workspace.schema.ts`

## JIT Index Hints

```bash
# Find a type definition in src/types
rg -n "export (interface|type)" src/types

# Find entity types in src/schemas
rg -n "export type.*Type.*z\.infer" src/schemas

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
- **Entity types in schemas** - Domain entities are in `src/schemas/`, not `src/types/`

## Pre-PR Checks

```bash
# Type check types
npm run build

# Verify all types are exported
rg -n "export (interface|type)" src/types
```
