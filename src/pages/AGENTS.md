# Pages - Agent Guide

## Package Identity

Route-level page components for Trellone. Organized by feature (Auth, Boards, Workspaces, Settings, Landing). Uses React Router for navigation, lazy loading for code splitting, and Suspense boundaries.

## Setup & Run

Pages are automatically loaded via React Router in `src/App.tsx`. No separate build step needed.

```bash
# Development server
npm run dev
```

## Patterns & Conventions

### File Organization

- **Feature-based structure**: Group pages by domain (Auth, Boards, Workspaces, Landing, Settings)
- **Layout components**: Place in `layouts/` subdirectory (e.g., `Auth/layouts/AuthLayout/`)
- **Page components**: Main page component in feature directory (e.g., `Auth/Login/`)
- **Sub-pages**: Use `pages/` subdirectory for nested routes (e.g., `Workspaces/pages/WorkspaceHome/`)
- **Page-specific components**: Place in `components/` subdirectory (e.g., `Boards/BoardDetails/components/`)

✅ **DO**: Follow `src/pages/Auth/Login/` pattern

- `Login.tsx` - Main page component
- `index.ts` - Barrel export

✅ **DO**: Use layouts for shared page structure

- `src/pages/Auth/layouts/AuthLayout/`
- `src/pages/Workspaces/layouts/HomeLayout/`
- `src/pages/Workspaces/layouts/WorkspaceDetailsLayout/`
- `src/pages/Workspaces/layouts/WorkspaceCollaboratorsLayout/`

### Page Structure

```
src/pages/
├── 404/
│   └── NotFound/
├── AccessDenied/
├── Auth/
│   ├── layouts/
│   │   └── AuthLayout/
│   ├── Login/
│   ├── Register/
│   ├── OAuth/
│   ├── ForgotPassword/
│   ├── ForgotPasswordVerification/
│   ├── ResetPassword/
│   └── AccountVerification/
├── Boards/
│   ├── BoardDetails/
│   │   ├── components/
│   │   │   ├── BoardBar/
│   │   │   ├── BoardContent/
│   │   │   ├── BoardDrawer/
│   │   │   ├── Column/
│   │   │   ├── Card/
│   │   │   └── ...
│   │   └── BoardDetails.tsx
│   └── BoardInvitationVerification/
├── Landing/
│   └── components/
├── Settings/
│   └── components/
└── Workspaces/
    ├── layouts/
    ├── components/
    └── pages/
        ├── Home/
        ├── BoardsList/
        ├── WorkspaceHome/
        ├── WorkspaceBoards/
        ├── WorkspaceMembers/
        ├── WorkspaceGuests/
        └── WorkspaceSettings/
```

### Page Component Structure

✅ **DO**: Use default export with PascalCase naming

```typescript
export default function Login() {
  // implementation
}
```

✅ **DO**: Use lazy loading for route-level components

```typescript
// In App.tsx
const Login = lazy(() => import('~/pages/Auth/Login'))
const BoardDetails = lazy(() => import('~/pages/Boards/BoardDetails'))
```

✅ **DO**: Wrap lazy components with Suspense

```typescript
<Suspense fallback={<PageLoadingSpinner />}>
  <Routes>
    <Route path="/login" element={<Login />} />
  </Routes>
</Suspense>
```

### Route Protection

✅ **DO**: Use route protection components defined in `App.tsx`

```typescript
// Protected routes require authentication
<Route element={<ProtectedRoute isAuthenticated={isAuthenticated} profile={profile} />}>
  <Route path={path.home} element={<Home />} />
</Route>

// Rejected routes redirect if authenticated
<Route element={<RejectedRoute isAuthenticated={isAuthenticated} profile={profile} />}>
  <Route path={path.login} element={<Login />} />
</Route>

// Verified routes require email verification
<Route element={<VerifiedRoute profile={profile} />}>
  <Route path={path.boardDetails} element={<BoardDetails />} />
</Route>
```

### Authentication Pages

✅ **DO**: Use React Hook Form with Zod validation

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginBody, LoginBodyType } from '~/schemas/auth.schema'

const {
  register,
  handleSubmit,
  formState: { errors },
  setError
} = useForm<LoginBodyType>({
  resolver: zodResolver(LoginBody),
  defaultValues: { email: '', password: '' }
})
```

✅ **DO**: Handle server-side validation errors

```typescript
useEffect(() => {
  if (isError && isUnprocessableEntityError<LoginBodyType>(error)) {
    const formError = error.data.errors
    if (formError) {
      for (const [key, value] of Object.entries(formError)) {
        setError(key as keyof LoginBodyType, {
          type: value.type,
          message: value.msg
        })
      }
    }
  }
}, [isError, error, setError])
```

✅ **DO**: Handle OAuth callback flow

```typescript
// src/pages/Auth/OAuth/OAuth.tsx
export default function OAuth() {
  const { access_token, refresh_token, new_user, verify } = useQueryConfig<OAuthQueryParams>()
  
  useEffect(() => {
    if (access_token && refresh_token) {
      setAccessTokenToLS(access_token)
      setRefreshTokenToLS(refresh_token)
      // Fetch profile and update Redux state
      dispatch(userApi.endpoints.getMe.initiate(undefined)).then((res) => {
        if (!res.error) {
          dispatch(setAuthenticated(true))
          dispatch(setProfile(res.data?.result))
          navigate(path.home)
        }
      })
    }
  }, [access_token, refresh_token])
}
```

### Board Pages

✅ **DO**: Use drag-and-drop with @dnd-kit

```typescript
import { useSortable } from '@dnd-kit/sortable'

const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
  id: card._id,
  data: { ...card }
})
```

✅ **DO**: Implement optimistic updates for real-time features

```typescript
// Update local state first
dispatch(updateCard({ cardId, updates }))
// Then sync with server
updateCardMutation(updates)
```

✅ **DO**: Use socket events for real-time collaboration

```typescript
// Join board room
socket?.emit('CLIENT_JOIN_BOARD', boardId)

// Listen for updates
socket?.on('SERVER_BOARD_UPDATED', (board) => {
  dispatch(updateActiveBoard(board))
})

// Cleanup on unmount
return () => {
  socket?.emit('CLIENT_LEAVE_BOARD', boardId)
  socket?.off('SERVER_BOARD_UPDATED', onUpdateBoard)
}
```

### Workspace Pages

✅ **DO**: Use infinite scroll for paginated lists

```typescript
import { useInfiniteScroll } from '~/hooks/use-infinite-scroll'

useInfiniteScroll({
  onLoadMore: loadMoreWorkspaces,
  hasMore: pagination.page < pagination.total_page,
  isLoading: isFetching || isLoadingMore,
  threshold: 200,
  useWindowScroll: true
})
```

### SEO Integration

✅ **DO**: Use SEO component for metadata

```typescript
import SEO from '~/components/SEO'

<SEO
  title="Board Title"
  description="Board description"
  url={`${SITE_CONFIG.url.base}/boards/${boardId}`}
/>
```

### Naming Conventions (CRITICAL)

Follow `.cursor/rules/react-naming-conventions.mdc`:

✅ **DO**: Use correct handler naming in pages

```typescript
// UI events: handle + DataModel + Action
const handleBoardDrawerToggle = () => { ... }
const handleDeleteBoardPopoverClose = () => { ... }

// Logic/Data: handle + Action + DataModel
const handleUpdateBoardTitle = (title: string) => { ... }
const handleResetFilters = () => { ... }

// API functions: verb + DataModel (no handle)
const archiveBoard = () => { ... }
const deleteBoard = async () => { ... }

// Form submit
const onSubmit = handleSubmit((values) => { ... })
```

## Touch Points / Key Files

- **App Routing**: `src/App.tsx` - Main routing configuration with route protection
- **Auth Pages**: `src/pages/Auth/` - Login, Register, OAuth, ForgotPassword, ResetPassword, AccountVerification
- **Auth Layout**: `src/pages/Auth/layouts/AuthLayout/` - Shared layout for auth pages
- **OAuth Handler**: `src/pages/Auth/OAuth/OAuth.tsx` - Google OAuth callback handler
- **Board Pages**: `src/pages/Boards/BoardDetails/` - Main board view with drag-and-drop
- **Board Components**: `src/pages/Boards/BoardDetails/components/` - BoardBar, BoardContent, BoardDrawer, Column, Card, etc.
- **Workspace Pages**: `src/pages/Workspaces/` - Dashboard and board organization
- **Workspace Layouts**: `src/pages/Workspaces/layouts/` - HomeLayout, WorkspaceDetailsLayout
- **Settings**: `src/pages/Settings/` - User settings and account management
- **Landing**: `src/pages/Landing/` - Marketing/landing page
- **404**: `src/pages/404/NotFound/` - Error page
- **Access Denied**: `src/pages/AccessDenied/` - Access denied page

## JIT Index Hints

```bash
# Find a page component
rg -n "export default function" src/pages

# Find route definitions
rg -n "path=.*element=" src/App.tsx

# Find lazy imports
rg -n "lazy.*import.*pages" src/App.tsx

# Find form usage in pages
rg -n "useForm" src/pages

# Find RTK Query hooks in pages
rg -n "use.*Mutation|use.*Query" src/pages

# Find socket usage in pages
rg -n "socket\?\.(emit|on|off)" src/pages

# Find handler functions
rg -n "const handle" src/pages
```

## Common Gotchas

- **Lazy loading required** - All route-level pages must use `React.lazy()`
- **Suspense boundaries** - Always wrap lazy routes with Suspense and PageLoadingSpinner
- **Form validation** - Always use Zod schemas, never inline validation
- **Error handling** - Use `isUnprocessableEntityError` type guard for server errors
- **Navigation** - Use `useNavigate` from react-router-dom, not direct window.location
- **Loading states** - Add `className='interceptor-loading'` to submit buttons
- **Route paths** - Import from `~/constants/path`, don't hardcode
- **Socket cleanup** - Always remove event listeners and leave rooms on unmount
- **Naming conventions** - Follow `.cursor/rules/react-naming-conventions.mdc`

## Pre-PR Checks

```bash
# Type check pages
npm run build

# Lint pages
npm run lint

# Verify routes work in dev server
npm run dev
```
