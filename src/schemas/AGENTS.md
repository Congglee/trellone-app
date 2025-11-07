# Schemas - Agent Guide

## Package Identity

Zod validation schemas for Trellone. Used for form validation with React Hook Form and type inference for TypeScript. One schema file per domain.

## Setup & Run

Schemas are imported directly. No separate build step needed.

```typescript
import { LoginBody, LoginBodyType } from '~/schemas/auth.schema'
```

## Patterns & Conventions

### File Organization

- **One file per domain**: Each domain has its own schema file (e.g., `auth.schema.ts`, `board.schema.ts`)
- **Naming**: Use kebab-case matching domain name with `.schema.ts` suffix
- **Exports**: Export schemas and inferred types

✅ **DO**: Follow `src/schemas/auth.schema.ts` pattern
- Define Zod schemas
- Export schema and inferred type: `export type LoginBodyType = z.infer<typeof LoginBody>`
- Export response types if needed

### Schema Definition

✅ **DO**: Use Zod for all validation
```typescript
import { z } from 'zod'

export const CreateBoardBody = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  visibility: z.enum([BoardVisibility.Public, BoardVisibility.Private])
})
```

✅ **DO**: Export inferred types
```typescript
export type CreateBoardBodyType = z.infer<typeof CreateBoardBody>
```

✅ **DO**: Use enums from constants
```typescript
import { BoardVisibility } from '~/constants/type'

z.enum([BoardVisibility.Public, BoardVisibility.Private])
```

### Form Integration

✅ **DO**: Use schemas with React Hook Form
```typescript
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateBoardBody, CreateBoardBodyType } from '~/schemas/board.schema'

const { register, handleSubmit } = useForm<CreateBoardBodyType>({
  resolver: zodResolver(CreateBoardBody),
  defaultValues: { title: '', description: '', visibility: BoardVisibility.Public }
})
```

### Response Types

✅ **DO**: Define response types for API responses
```typescript
export const BoardResSchema = z.object({
  message: z.string(),
  result: BoardSchema
})

export type BoardResType = z.infer<typeof BoardResSchema>
```

### Validation Messages

✅ **DO**: Provide clear error messages
```typescript
z.string().min(1, 'Title is required')
z.string().email('Invalid email address')
z.string().min(8, 'Password must be at least 8 characters')
```

## Touch Points / Key Files

- **Auth Schemas**: `src/schemas/auth.schema.ts` - Login, Register, OAuth schemas
- **Board Schemas**: `src/schemas/board.schema.ts` - Board CRUD schemas
- **Card Schemas**: `src/schemas/card.schema.ts` - Card operation schemas
- **Column Schemas**: `src/schemas/column.schema.ts` - Column management schemas
- **Workspace Schemas**: `src/schemas/workspace.schema.ts` - Workspace schemas
- **User Schemas**: `src/schemas/user.schema.ts` - User management schemas
- **Media Schemas**: `src/schemas/media.schema.ts` - File upload schemas
- **Invitation Schemas**: `src/schemas/invitation.schema.ts` - Invitation schemas

## JIT Index Hints

```bash
# Find a schema definition
rg -n "z\.object|z\.string|z\.enum" src/schemas

# Find schema type exports
rg -n "export type.*Type.*z\.infer" src/schemas

# Find schema usage in forms
rg -n "zodResolver.*schema" src

# Find schema usage in queries
rg -n "from '~/schemas" src/queries
```

## Common Gotchas

- **Type inference** - Always export both schema and inferred type
- **Enum usage** - Import enums from `~/constants/type`, don't redefine
- **Error messages** - Provide clear, user-friendly validation messages
- **Optional fields** - Use `.optional()` for non-required fields
- **Default values** - Match schema structure in form `defaultValues`

## Pre-PR Checks

```bash
# Type check schemas
npm run build

# Verify schema types are exported
rg -n "export type.*Type" src/schemas
```

