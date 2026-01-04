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

```
src/schemas/
├── auth.schema.ts        # Login, Register, OAuth, password reset
├── board.schema.ts       # Board CRUD, member management
├── card.schema.ts        # Card operations, attachments, comments
├── column.schema.ts      # Column CRUD
├── invitation.schema.ts  # Board/Workspace invitations
├── media.schema.ts       # File uploads
├── user.schema.ts        # User profile, UserType
└── workspace.schema.ts   # Workspace CRUD, members
```

✅ **DO**: Follow `src/schemas/auth.schema.ts` pattern

- Define Zod schemas for request bodies
- Export schema and inferred type: `export type LoginBodyType = z.infer<typeof LoginBody>`
- Export response types for API responses

### Schema Definition

✅ **DO**: Use Zod for all validation

```typescript
import { z } from 'zod'

export const CreateBoardBody = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  visibility: z.enum([BoardVisibility.Public, BoardVisibility.Private]),
  workspace_id: z.string().min(1, 'Workspace is required')
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

### Request Body Schemas

✅ **DO**: Define schemas for API request bodies

```typescript
// Login request body
export const LoginBody = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

// Update board request body
export const UpdateBoardBody = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  visibility: z.enum([BoardVisibility.Public, BoardVisibility.Private]).optional(),
  cover_photo: z.string().optional()
})
```

### Response Schemas

✅ **DO**: Define response schemas for API responses

```typescript
export const BoardSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  visibility: z.enum([BoardVisibility.Public, BoardVisibility.Private]),
  workspace_id: z.string(),
  created_at: z.string(),
  updated_at: z.string()
})

export const BoardResSchema = z.object({
  message: z.string(),
  result: BoardSchema
})

export type BoardResType = z.infer<typeof BoardResSchema>
export type BoardType = z.infer<typeof BoardSchema>
```

### Entity Schemas

✅ **DO**: Define reusable entity schemas

```typescript
// User entity schema (used in many places)
export const UserSchema = z.object({
  _id: z.string(),
  email: z.string(),
  display_name: z.string(),
  avatar: z.string().optional(),
  verify: z.number()
})

export type UserType = z.infer<typeof UserSchema>
```

### Form Integration

✅ **DO**: Use schemas with React Hook Form

```typescript
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateBoardBody, CreateBoardBodyType } from '~/schemas/board.schema'

const { register, handleSubmit } = useForm<CreateBoardBodyType>({
  resolver: zodResolver(CreateBoardBody),
  defaultValues: {
    title: '',
    description: '',
    visibility: BoardVisibility.Public,
    workspace_id: ''
  }
})
```

### Validation Messages

✅ **DO**: Provide clear error messages

```typescript
z.string().min(1, 'Title is required')
z.string().email('Invalid email address')
z.string().min(8, 'Password must be at least 8 characters')
z.string().regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed')
```

### Partial and Optional Schemas

✅ **DO**: Use `.partial()` for update schemas

```typescript
export const UpdateBoardBody = CreateBoardBody.partial()
```

✅ **DO**: Use `.optional()` for non-required fields

```typescript
export const CreateBoardBody = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),  // Not required
  cover_photo: z.string().optional()   // Not required
})
```

### Nested Schemas

✅ **DO**: Compose schemas for complex types

```typescript
export const CardSchema = z.object({
  _id: z.string(),
  title: z.string(),
  members: z.array(UserSchema),  // Nested schema
  attachments: z.array(AttachmentSchema)  // Nested schema
})
```

## Touch Points / Key Files

- **Auth Schemas**: `src/schemas/auth.schema.ts` - Login, Register, OAuth, password reset
- **Board Schemas**: `src/schemas/board.schema.ts` - Board CRUD, member management
- **Card Schemas**: `src/schemas/card.schema.ts` - Card operations, attachments, comments
- **Column Schemas**: `src/schemas/column.schema.ts` - Column management
- **Workspace Schemas**: `src/schemas/workspace.schema.ts` - Workspace management
- **User Schemas**: `src/schemas/user.schema.ts` - User profile, UserType entity
- **Media Schemas**: `src/schemas/media.schema.ts` - File upload schemas
- **Invitation Schemas**: `src/schemas/invitation.schema.ts` - Invitation schemas

## JIT Index Hints

```bash
# Find a schema definition
rg -n "z\.object|z\.string|z\.enum" src/schemas

# Find schema type exports
rg -n "export type.*Type.*z\.infer" src/schemas

# Find schema usage in forms
rg -n "zodResolver" src

# Find schema usage in queries
rg -n "from '~/schemas" src/queries
```

## Common Gotchas

- **Type inference** - Always export both schema and inferred type
- **Enum usage** - Import enums from `~/constants/type`, don't redefine
- **Error messages** - Provide clear, user-friendly validation messages
- **Optional fields** - Use `.optional()` for non-required fields
- **Default values** - Match schema structure in form `defaultValues`
- **Partial updates** - Use `.partial()` for update request bodies
- **Entity types** - Export entity types (e.g., `UserType`, `BoardType`) for reuse

## Pre-PR Checks

```bash
# Type check schemas
npm run build

# Verify schema types are exported
rg -n "export type.*Type" src/schemas
```
