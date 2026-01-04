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
- **Sub-components**: Place in subdirectories (e.g., `Modal/ActiveCard/CardAttachments/`)

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

### Naming Conventions (CRITICAL)

Follow `.cursor/rules/react-naming-conventions.mdc`:

#### Handler Functions

✅ **DO**: Use `handle` + `DataModel` + `Action` for UI events

```typescript
// Click, Change, Toggle, Open, Close, Select events
const handleCardModalClose = () => { ... }
const handleDatesMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => { ... }
const handleCardCoverPopoverToggle = (event: React.MouseEvent<HTMLButtonElement>) => { ... }
```

✅ **DO**: Use `handle` + `Action` + `DataModel` for logic/data handlers

```typescript
// Update, Add, Remove, Reset, Submit operations
const handleUpdateCardTitle = (title: string) => { ... }
const handleAddListItem = (item: ItemType) => { ... }
const handleResetFormData = () => { ... }
```

❌ **DON'T**: Mix up the formats

```typescript
// ❌ BAD: Action comes before DataModel for UI events
const handleCloseCardModal = () => { ... }

// ✅ GOOD:
const handleCardModalClose = () => { ... }
```

#### API Functions (No handle prefix)

✅ **DO**: Use `verb` + `DataModel` directly

```typescript
const archiveCard = () => { ... }
const addCardMember = (userId: string) => { ... }
const deleteBoard = async (boardId: string) => { ... }
```

❌ **DON'T**: Use `handle` prefix for API calls

```typescript
// ❌ BAD
const handleArchiveCard = () => { ... }
```

#### Props Interface

✅ **DO**: Use descriptive state prop names

```typescript
interface NewBoardDialogProps {
  newBoardDialogOpen: boolean  // ✅ Clear context
  defaultWorkspaceId?: string  // ✅ Clear context
}
```

❌ **DON'T**: Use generic prop names

```typescript
interface NewBoardDialogProps {
  open: boolean  // ❌ Too generic
  id?: string    // ❌ Unclear context
}
```

✅ **DO**: Use `on` prefix for callback props

```typescript
interface NewBoardDialogProps {
  newBoardDialogOpen: boolean
  onNewBoardDialogClose: () => void  // ✅ on prefix
  onUpdateCardDescription: (description: string) => void  // ✅ on prefix
}
```

❌ **DON'T**: Use `handle` prefix for callback props

```typescript
// ❌ BAD
handleNewBoardDialogClose: () => void
updateCardDescription: (description: string) => void
```

#### Form Submit Handler

✅ **DO**: Name the function `onSubmit`

```typescript
const onSubmit = handleSubmit((values) => {
  addBoardMutation(payload).then((res) => {
    // handle response
  })
})

<form onSubmit={onSubmit}>
```

### Material-UI Integration

Follow `.cursor/rules/material-ui-guidelines.mdc`:

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

✅ **DO**: Use responsive object syntax

```typescript
sx={{
  display: { xs: 'none', md: 'flex' },
  width: { xs: 'auto', sm: 520 },
  gap: { xs: 1, md: 2 }
}}
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

## Touch Points / Key Files

- **Form Components**: `src/components/Form/` - TextFieldInput, FieldErrorAlert, ToggleFocusInput, VisuallyHiddenInput
- **Modal Components**: `src/components/Modal/ActiveCard/` - Complex card modal with attachments, comments, due dates
- **Dialog Components**: `src/components/Dialog/` - NewBoardDialog, NewWorkspaceDialog
- **NavBar Components**: `src/components/NavBar/` - Navigation, search, notifications, profiles
- **Loading States**: `src/components/Loading/PageLoadingSpinner/`
- **Error Handling**: `src/components/ErrorBoundary/`
- **SEO**: `src/components/SEO/`
- **Rich Text Editor**: `src/components/RichTextEditor/` - TipTap integration
- **Workspace**: `src/components/Workspace/WorkspaceAvatar/`

## JIT Index Hints

```bash
# Find a component by name
rg -n "export default function" src/components

# Find Material-UI component usage
rg -n "from '@mui/material" src/components

# Find form components
rg -n "TextFieldInput|FieldErrorAlert" src/components

# Find component props interfaces
rg -n "interface.*Props" src/components

# Find handler functions
rg -n "const handle" src/components

# Find callback props definitions
rg -n "on[A-Z].*:" src/components
```

## Common Gotchas

- **Always use `sx` prop** - Prefer over `styled` components
- **Import path alias** - Use `~` not relative paths (`~/components/` not `../../components/`)
- **Default exports only** - Components use default exports, utilities use named exports
- **Type generics** - Form components use generics: `TextFieldInput<TFieldValues>`
- **Error prop pattern** - Use double negation: `error={!!errors['field']}`
- **Naming conventions** - Follow `.cursor/rules/react-naming-conventions.mdc` strictly
- **Form submit** - Always name the function `onSubmit`
- **Callback props** - Always use `on` prefix, never `handle`

## Pre-PR Checks

```bash
# Type check components
npm run build

# Lint components
npm run lint

# Format components
npm run prettier:fix
```
