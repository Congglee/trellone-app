# Queries - Agent Guide

## Package Identity

RTK Query API layer for Trellone. All API endpoints defined using `createApi` with custom `axiosBaseQuery`. Handles caching, invalidation, and side effects.

## Setup & Run

Queries are automatically available via RTK Query hooks. No separate build step needed.

```typescript
// Use query hooks
import { useGetBoardsQuery, useAddBoardMutation } from '~/queries/boards'
```

## Patterns & Conventions

### File Organization

- **One file per domain**: Each API domain has its own file (e.g., `boards.ts`, `auth.ts`)
- **Naming**: Use kebab-case for files matching domain name
- **Exports**: Export API instance, hooks, and reducer

```
src/queries/
├── auth.ts         # Authentication (login, register, logout, OAuth, password reset)
├── boards.ts       # Board CRUD operations
├── cards.ts        # Card operations
├── columns.ts      # Column management
├── invitations.ts  # Board/Workspace invitations
├── medias.ts       # File uploads
├── users.ts        # User management (getMe, update profile)
└── workspaces.ts   # Workspace management
```

✅ **DO**: Follow `src/queries/boards.ts` pattern

- Define constants: `reducerPath`, `tagTypes`, `API_URL`
- Use `createApi` with `axiosBaseQuery()`
- Export hooks and reducer

### API Slice Structure

✅ **DO**: Use consistent API slice structure

```typescript
const BOARD_API_URL = '/boards' as const
const reducerPath = 'board/api' as const
const tagTypes = ['Board'] as const

export const boardApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    // endpoints
  })
})

export const { useGetBoardsQuery, useAddBoardMutation } = boardApi

const boardApiReducer = boardApi.reducer
export default boardApiReducer
```

### Endpoint Patterns

✅ **DO**: Use descriptive endpoint names

```typescript
addBoard: build.mutation<BoardResType, CreateBoardBodyType>({
  query: (body) => ({ url: BOARD_API_URL, method: 'POST', data: body })
})

getBoards: build.query<BoardListResType, BoardQueryParams>({
  query: (params) => ({ url: BOARD_API_URL, method: 'GET', params })
})

updateBoard: build.mutation<BoardResType, { id: string; body: UpdateBoardBodyType }>({
  query: ({ id, body }) => ({ url: `${BOARD_API_URL}/${id}`, method: 'PUT', data: body })
})
```

✅ **DO**: Use proper TypeScript generics

```typescript
build.mutation<ResponseType, RequestType>
build.query<ResponseType, QueryParamsType>
```

✅ **DO**: Use `onQueryStarted` for side effects

```typescript
async onQueryStarted(_args, { dispatch, queryFulfilled }) {
  try {
    const { data } = await queryFulfilled
    // Handle success (toast, navigation, invalidate related tags)
    dispatch(workspaceApi.util.invalidateTags([
      { type: 'Workspace', id: data.result?.workspace_id }
    ]))
  } catch (error) {
    toast.error('Error message')
    console.error(error)
  }
}
```

### Cache Invalidation

✅ **DO**: Use `providesTags` for queries

```typescript
providesTags: (result) =>
  result
    ? [
        ...result.result.boards.map(({ _id }) => ({ type: 'Board' as const, id: _id })),
        { type: 'Board' as const, id: 'LIST' }
      ]
    : [{ type: 'Board' as const, id: 'LIST' }]
```

✅ **DO**: Use `invalidatesTags` for mutations

```typescript
invalidatesTags: (_result, _error, { id }) => [
  { type: 'Board', id },
  { type: 'Board', id: 'LIST' }
]
```

✅ **DO**: Invalidate related entities across APIs

```typescript
dispatch(
  workspaceApi.util.invalidateTags([
    { type: 'Workspace', id: workspaceId },
    { type: 'Workspace', id: 'LIST' }
  ])
)
```

✅ **DO**: Conditionally skip invalidation for specific updates

```typescript
invalidatesTags: (_result, _error, { id, body }) => {
  const ignoreTags = ['column_order_ids']
  if (ignoreTags.some((tag) => tag in body)) {
    return []  // Skip invalidation for column reordering
  }
  return [{ type: 'Board', id }, { type: 'Board', id: 'LIST' }]
}
```

### Authentication Endpoints

✅ **DO**: Handle authentication state updates in `onQueryStarted`

```typescript
login: build.mutation<AuthResType, LoginBodyType>({
  query: (body) => ({ url: `${AUTH_API_URL}/login`, method: 'POST', data: body }),
  async onQueryStarted(_args, { dispatch, queryFulfilled }) {
    try {
      await queryFulfilled
      // Fetch user profile after successful login
      dispatch(userApi.endpoints.getMe.initiate(undefined)).then((res) => {
        if (!res.error) {
          dispatch(setAuthenticated(true))
          dispatch(setProfile(res.data?.result))
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
})
```

✅ **DO**: Reset API state on logout

```typescript
logout: build.mutation<LogoutResType, void>({
  query: () => ({ url: `${AUTH_API_URL}/logout`, method: 'POST' }),
  async onQueryStarted(_args, { dispatch, queryFulfilled }) {
    try {
      await queryFulfilled
      dispatch(reset())
      dispatch(disconnectSocket())
      dispatch(authApi.util.resetApiState())
      resetApiState(dispatch) // Reset related API slices
    } catch (error) {
      console.error(error)
    }
  }
})
```

### Error Handling

✅ **DO**: Handle errors consistently with try-catch

```typescript
async onQueryStarted(_args, { queryFulfilled }) {
  try {
    await queryFulfilled
    toast.success('Success message')
  } catch (error) {
    toast.error('Error message')
    console.error(error)
  }
}
```

### Component Integration

✅ **DO**: Use hooks directly in components

```typescript
const { data, isLoading, error, isFetching } = useGetBoardsQuery(params)
const [addBoardMutation, { isError, error }] = useAddBoardMutation()
```

✅ **DO**: Use `.unwrap()` for error handling in mutations

```typescript
const result = await addBoardMutation(values).unwrap()
if (result) {
  navigate(`/boards/${result.result._id}`)
}
```

✅ **DO**: Use `.then()` pattern for handling responses

```typescript
addBoardMutation(payload).then((res) => {
  if (!res.error) {
    const board = res.data?.result
    socket?.emit('CLIENT_USER_CREATED_WORKSPACE_BOARD', values.workspace_id)
    navigate(`/boards/${board?._id}`)
  }
})
```

## Touch Points / Key Files

- **Base Query**: `src/lib/redux/helpers.ts` - Custom `axiosBaseQuery()` implementation
- **Auth API**: `src/queries/auth.ts` - Authentication endpoints (login, register, logout, OAuth, password reset, refresh token)
- **Boards API**: `src/queries/boards.ts` - Board management (CRUD, archive, reopen, members)
- **Cards API**: `src/queries/cards.ts` - Card operations (CRUD, archive, attachments, comments)
- **Columns API**: `src/queries/columns.ts` - Column management (CRUD, reorder)
- **Workspaces API**: `src/queries/workspaces.ts` - Workspace management (CRUD, members, invitations)
- **Users API**: `src/queries/users.ts` - User management (getMe, update profile)
- **Medias API**: `src/queries/medias.ts` - File upload endpoints
- **Invitations API**: `src/queries/invitations.ts` - Board/Workspace invitation endpoints

## Authentication Flow

### Login Flow

1. User submits login form → `useLoginMutation()` called
2. RTK Query sends POST to `/auth/login`
3. HTTP interceptor adds access token to Authorization header
4. Backend validates credentials, sets httpOnly cookies
5. Response contains tokens → stored in localStorage via HTTP interceptor
6. `onQueryStarted` fetches user profile via `getMe`
7. Redux state updated: `setAuthenticated(true)`, `setProfile(profile)`

### Token Refresh Flow

1. Access token expires → HTTP interceptor detects 401
2. Interceptor checks for expired token error
3. Calls `/auth/refresh-token` with refresh token from cookies
4. Backend validates refresh token, issues new tokens
5. New tokens stored in localStorage and cookies
6. Original request retried with new access token

### Logout Flow

1. User clicks logout → `useLogoutMutation()` called
2. POST to `/auth/logout` clears refresh token from database
3. HTTP interceptor clears localStorage tokens
4. `onQueryStarted` resets auth state, disconnects socket
5. All API slices reset via `resetApiState()`
6. User redirected to login page

## JIT Index Hints

```bash
# Find an API endpoint
rg -n "build\.(query|mutation)" src/queries

# Find a query hook usage
rg -n "use.*Query|use.*Mutation" src

# Find cache invalidation
rg -n "invalidatesTags|providesTags" src/queries

# Find onQueryStarted handlers
rg -n "onQueryStarted" src/queries

# Find cross-API invalidation
rg -n "\.util\.invalidateTags" src/queries
```

## Common Gotchas

- **Tag types** - Always define `tagTypes` as const array: `['Board'] as const`
- **Cache invalidation** - Invalidate both specific entity and LIST tags
- **Side effects** - Use `onQueryStarted` for navigation, toasts, not in components
- **Error handling** - Always wrap `queryFulfilled` in try-catch
- **Type safety** - Use schema-derived types for Request/Response types
- **Cross-API invalidation** - Import other APIs and use `otherApi.util.invalidateTags()`
- **Conditional invalidation** - Return empty array `[]` to skip invalidation

## Pre-PR Checks

```bash
# Type check queries
npm run build

# Verify API calls work
npm run dev
```
