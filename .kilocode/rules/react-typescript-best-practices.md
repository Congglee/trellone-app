# React TypeScript Best Practices

## Brief overview

This rule documents the established React TypeScript patterns, conventions, and best practices specifically identified from the Trellone codebase. These guidelines ensure consistent component development, proper TypeScript integration, and maintainable code architecture across the React application.

## Component structure and organization

- Use default exports for all React components with PascalCase naming: `export default function ComponentName()`
- Organize components in feature-based directories with dedicated folders for each component
- Include `index.ts` barrel exports in component directories for clean import paths
- Place component-specific files (styles, types, sub-components) within the component's directory
- Use the pattern `ComponentName/ComponentName.tsx` and `ComponentName/index.ts` for consistency

## TypeScript interface definitions

- Define component props interfaces directly above the component with descriptive names ending in `Props`
- Use optional properties (`?`) for non-required props with clear default handling
- Extend Material-UI component props when creating wrapper components: `extends Omit<TextFieldProps, 'name'>`
- Use generic constraints for reusable components: `<TFieldValues extends FieldValues = FieldValues>`
- Place interface definitions immediately before the component that uses them

```typescript
interface TextFieldInputProps<TFieldValues extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  register?: UseFormRegister<TFieldValues>
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>
  name?: FieldPath<TFieldValues>
}
```

## Import and export patterns

- Use the `~` path alias consistently for all internal imports: `import Component from '~/components/Component'`
- Group imports logically: React/external libraries first, then internal imports
- Use named imports for Material-UI components: `import { Box, Typography } from '@mui/material'`
- Import SVG assets as React components: `import TrelloneIcon from '~/assets/trello.svg?react'`
- Use `import type` for type-only imports to optimize bundle size
- Follow consistent import ordering: external libraries, internal components, types, utilities

## Component function patterns

- Use function declarations with default export pattern: `export default function ComponentName()`
- Destructure props in function parameters with TypeScript generics when applicable
- Use early returns for conditional rendering: `if (!errorMessage) return null`
- Implement proper prop spreading with rest parameters: `{...rest}` for Material-UI integration

## State management integration

- Use typed Redux hooks from `~/lib/redux/hooks`: `useAppDispatch`, `useAppSelector`
- Destructure specific state slices in selectors: `const { isAuthenticated, profile } = useAppSelector((state) => state.auth)`
- Use RTK Query mutations with proper error handling and loading states
- Implement optimistic updates followed by server synchronization for real-time features

## Form handling patterns

- Always use React Hook Form with Zod resolver for type-safe form validation
- Destructure form methods consistently: `register`, `handleSubmit`, `formState: { errors }`, `setError`
- Use schema-derived types for form data: `useForm<LoginBodyType>`
- Implement server-side error handling with `useEffect` and `isUnprocessableEntityError` type guard
- Use bracket notation for error field access: `errors['field_name']`

```typescript
const {
  register,
  setError,
  handleSubmit,
  formState: { errors }
} = useForm<LoginBodyType>({
  resolver: zodResolver(LoginBody),
  defaultValues: { email: '', password: '' }
})
```

## Material-UI integration

- Use `sx` prop consistently for styling instead of styled components
- Leverage theme-aware styling with callback functions: `sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff' }}`
- Use Material-UI Grid2 for responsive layouts: `import Grid from '@mui/material/Unstable_Grid2'`
- Apply consistent spacing patterns with theme spacing units
- Use Material-UI icons with proper tree-shaking imports: `import IconName from '@mui/icons-material/IconName'`

## Drag and drop implementation

- Use @dnd-kit with proper TypeScript integration and accessibility features
- Implement `useSortable` hook with unique IDs and custom data: `id: card._id, data: { ...card }`
- Apply proper CSS transforms: `transform: CSS.Translate.toString(transform)`
- Use `touchAction: 'none'` for pointer sensor compatibility
- Implement visual feedback during drag operations with opacity and border changes

## Error handling and validation

- Create type guards for different error scenarios: `isUnprocessableEntityError<FormError>`
- Use Zod schemas for comprehensive validation with custom error messages
- Implement proper error boundaries with fallback UI components
- Handle async operations with proper try-catch patterns and user feedback

## Lazy loading and code splitting

- Use React.lazy() for route-level components: `const Login = lazy(() => import('~/pages/Auth/Login'))`
- Wrap lazy components with Suspense boundaries and loading spinners
- Implement proper fallback components: `<Suspense fallback={<PageLoadingSpinner />}>`
- Use dynamic imports for large feature modules to optimize bundle size

## Custom hooks integration

- Use custom hooks with proper TypeScript generics: `useQueryConfig<AuthQueryParams>()`
- Implement hooks with comprehensive options interfaces and default values
- Use proper dependency arrays in useEffect hooks within custom hooks
- Export hooks with named exports and descriptive names starting with `use`

## SEO and metadata management

- Use react-helmet-async for dynamic metadata management with proper TypeScript integration
- Implement SEO component with optional props and sensible defaults
- Structure metadata objects with proper typing and theme-aware URL construction
- Include comprehensive Open Graph and Twitter meta tags

## Real-time features

- Integrate Socket.io with Redux state management and proper TypeScript typing
- Use room-based collaboration with proper connection lifecycle management
- Implement optimistic updates followed by socket event emission
- Handle socket events with proper error handling and state synchronization

## Performance optimization

- Use React.memo strategically for expensive components with proper comparison functions
- Implement proper useCallback and useMemo for expensive operations
- Use proper key props for list rendering with stable, unique identifiers
- Leverage Material-UI's built-in performance optimizations with sx prop

## Testing and development patterns

- Use className='interceptor-loading' for consistent loading state indicators
- Implement proper TypeScript strict mode compliance with comprehensive type coverage
- Use proper error boundaries for graceful error handling in production
- Implement proper cleanup functions in useEffect hooks for subscriptions and event listeners
