# Components - Agent Guide

## Package Identity

UI component library for Trellone. All reusable React components organized by feature. Uses Material-UI as base, React Hook Form for forms, and follows strict TypeScript patterns.

## Setup & Run

Components are automatically available via `~` alias. No separate build step needed.

```bash
# Import pattern
import ComponentName from '~/components/ComponentName'
```

## Patterns & Conventions

### File Organization

- **Component Structure**: Each component has its own directory with `ComponentName/ComponentName.tsx` and `ComponentName/index.ts`
- **Barrel Exports**: Use `index.ts` for clean imports
- **Sub-components**: Place in subdirectories (e.g., `ActiveCard/CardAttachments/`)

✅ **DO**: Follow `src/components/Form/TextFieldInput/` pattern

- `TextFieldInput.tsx` - Main component
- `index.ts` - Barrel export

❌ **DON'T**: Create components without directory structure

- ❌ `src/components/Button.tsx` (missing directory)

### Component Structure

✅ **DO**: Use default export with PascalCase naming

```typescript
// src/components/Form/TextFieldInput/TextFieldInput.tsx
export default function TextFieldInput<TFieldValues extends FieldValues>({...}) {
  // implementation
}
```

✅ **DO**: Define props interface directly above component

```typescript
interface TextFieldInputProps<TFieldValues extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  register?: UseFormRegister<TFieldValues>
  name?: FieldPath<TFieldValues>
}

export default function TextFieldInput<TFieldValues extends FieldValues>({...}: TextFieldInputProps<TFieldValues>) {
  // implementation
}
```

### Material-UI Integration

✅ **DO**: Use `sx` prop for styling (prefer over `styled`)

```typescript
<Box sx={{ display: 'flex', gap: 2, p: 2 }}>
```

✅ **DO**: Import Material-UI components individually for tree-shaking

```typescript
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
```

✅ **DO**: Use theme-aware styling with callbacks

```typescript
sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff' }}
```

✅ **DO**: Use Grid2 for responsive layouts

```typescript
import Grid from '@mui/material/Unstable_Grid2'
```

### Form Components

✅ **DO**: Use custom `TextFieldInput` with React Hook Form

```typescript
import TextFieldInput from '~/components/Form/TextFieldInput'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'

<TextFieldInput
  name='title'
  register={register}
  label='Board Title'
  error={!!errors['title']}
/>
<FieldErrorAlert errorMessage={errors.title?.message} />
```

✅ **DO**: Use `Controller` for complex Material-UI controls

```typescript
import { Controller } from 'react-hook-form'

<Controller
  name='workspace_id'
  control={control}
  render={({ field }) => (
    <Select {...field} value={field.value || ''}>
      {/* options */}
    </Select>
  )}
/>
```

### Component Composition

✅ **DO**: Use `Box` as primary layout container
✅ **DO**: Use `Stack` for consistent spacing
✅ **DO**: Use `Card` with proper elevation for content groups
✅ **DO**: Use `Tooltip` for interactive elements
✅ **DO**: Use `IconButton` for clickable icons

### Responsive Design

✅ **DO**: Use Material-UI breakpoints consistently

```typescript
sx={{
  display: { xs: 'none', md: 'flex' },
  width: { xs: 'auto', sm: 520 },
  gap: { xs: 1, md: 2 }
}}
```

## Touch Points / Key Files

- **Form Components**: `src/components/Form/` - TextFieldInput, FieldErrorAlert, ToggleFocusInput
- **Modal Components**: `src/components/Modal/ActiveCard/` - Complex card modal with attachments, comments
- **Dialog Components**: `src/components/Dialog/` - NewBoardDialog, NewWorkspaceDialog
- **Loading States**: `src/components/Loading/PageLoadingSpinner/`
- **Error Handling**: `src/components/ErrorBoundary/`
- **SEO**: `src/components/SEO/`

## JIT Index Hints

```bash
# Find a component by name
rg -n "export default function ComponentName" src/components

# Find Material-UI component usage
rg -n "from '@mui/material" src/components

# Find form components
rg -n "TextFieldInput|FieldErrorAlert" src/components

# Find component props interfaces
rg -n "interface.*Props" src/components
```

## Common Gotchas

- **Always use `sx` prop** - Prefer over `styled` components (see memory ID: 8973239)
- **Import path alias** - Use `~` not relative paths (`~/components/` not `../../components/`)
- **Default exports only** - Components use default exports, utilities use named exports
- **Type generics** - Form components use generics: `TextFieldInput<TFieldValues>`
- **Error prop pattern** - Use double negation: `error={!!errors['field']}`

## Pre-PR Checks

```bash
# Type check components
npm run build

# Lint components
npm run lint

# Format components
npm run prettier:fix
```
