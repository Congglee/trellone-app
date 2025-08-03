# TypeScript Types

## Brief overview

This rule defines TypeScript type definition patterns and conventions for the Trellone project based on the established patterns in `src/types/`. These guidelines ensure consistent, maintainable, and type-safe TypeScript code across the application.

## File naming and organization

- Use kebab-case for type definition files with `.type.ts` suffix (e.g., `jwt.type.ts`, `query-params.type.ts`)
- Organize types by domain or feature area rather than by type category
- Place all type definitions in `src/types/` directory for centralized access
- Use descriptive filenames that clearly indicate the domain (e.g., `jwt.type.ts` for JWT-related types)

## Import patterns

- Use the `~` path alias for importing from src directory: `import { TokenType } from '~/constants/type'`
- Import types from their logical source (constants, schemas, other type files)
- Use `import type` syntax when importing only for type annotations to optimize bundle size
- Group imports logically: external libraries first, then internal imports

## Type extraction from constants

- Extract type values from const objects using `typeof` and `keyof` pattern:
  ```typescript
  export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType]
  ```
- This pattern ensures type safety when constants change and provides better IntelliSense
- Use this approach for enum-like constant objects to maintain single source of truth

## Interface definitions

- Use PascalCase for interface names: `TokenPayload`, `InviteTokenPayload`
- Define interfaces for structured data objects with clear, descriptive property names
- Use snake_case for property names to match backend API conventions: `user_id`, `token_type`
- Group related interfaces in the same file when they share a common domain

## Interface extension patterns

- Use interface extension for related types that share common properties:
  ```typescript
  export interface InviteTokenPayload extends TokenPayload {
    inviter_id: string
    invitation_id: string
  }
  ```
- Prefer interface extension over intersection types for better error messages and IntelliSense

## Optional properties and flexibility

- Use optional properties (`?`) for parameters that may not always be present:
  ```typescript
  export interface CommonQueryParams {
    page?: number | string
    limit?: number | string
  }
  ```
- Use union types for flexible typing when multiple types are acceptable: `number | string`

## Generic types and constraints

- Use generic types with sensible defaults for reusable type definitions:
  ```typescript
  type EntityValidationErrors<T = Record<string, any>> = {
    message: string
    errors?: {
      [K in keyof T]?: {
        type: string
        value: string
        msg: string
        path: string
        location: string
      }
    }
  }
  ```
- Apply mapped types with `keyof` for dynamic property generation based on input types

## Type references and indexed access

- Use indexed access types to reference properties from existing types:
  ```typescript
  new_user?: number
  verify?: UserType['verify']
  ```
- This maintains type safety and automatically updates when source types change

## Union types for controlled values

- Use string literal union types for controlled vocabularies:
  ```typescript
  export type Mode = 'light' | 'dark' | 'system'
  ```
- This provides better type safety than generic strings while maintaining readability

## Complex nested structures

- Define complex nested interfaces with clear hierarchy and meaningful property names:
  ```typescript
  export interface SiteConfig {
    name: string
    author: string
    description: string
    keywords: Array<string>
    url: {
      base: string
      author: string
    }
    links: {
      github: string
    }
    ogImage: string
  }
  ```
- Use nested objects to group related properties logically

## Error handling types

- Define specific error types for different error scenarios with generic support:
  ```typescript
  export interface EntityError<T = Record<string, any>> {
    status: number
    data: EntityValidationErrors<T>
  }
  ```
- Include both the error structure and the entity type for comprehensive error handling

## Type exports and barrel patterns

- Export all types from their respective files for external consumption
- Use clear, descriptive export names that indicate the type's purpose
- Avoid default exports for types to maintain explicit import patterns

## Documentation and comments

- Use TypeScript's built-in type system for self-documenting code
- Add JSDoc comments only when the type's purpose isn't immediately clear from its name and structure
- Rely on meaningful property names and interface names for clarity
