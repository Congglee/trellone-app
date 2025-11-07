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
- **Exports**: Export API instance and hooks

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
```

### Endpoint Patterns

✅ **DO**: Use descriptive endpoint names
```typescript
addBoard: build.mutation<BoardResType, CreateBoardBodyType>({
  query: (body) => ({ url: BOARD_API_URL, method: 'POST', data: body })
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
    // Handle success (toast, navigation, etc.)
  } catch (error) {
    toast.error('Error message')
  }
}
```

### Cache Invalidation

✅ **DO**: Use `providesTags` for queries
```typescript
providesTags: (result) =>
  result
    ? [
        ...result.result.map(({ _id }) => ({ type: 'Board', id: _id })),
        { type: 'Board', id: 'LIST' }
      ]
    : [{ type: 'Board', id: 'LIST' }]
```

✅ **DO**: Use `invalidatesTags` for mutations
```typescript
invalidatesTags: [
  { type: 'Board', id: 'LIST' },
  { type: 'Board', id: boardId }
]
```

✅ **DO**: Invalidate related entities
```typescript
dispatch(
  workspaceApi.util.invalidateTags([
    { type: 'Workspace', id: workspaceId },
    { type: 'Workspace', id: 'LIST' }
  ])
)
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
const { data, isLoading, error } = useGetBoardsQuery(params)
const [addBoardMutation] = useAddBoardMutation()
```

✅ **DO**: Use `.unwrap()` for error handling in mutations
```typescript
const result = await addBoardMutation(values).unwrap()
if (result) {
  navigate(`/boards/${result.result._id}`)
}
```

## Touch Points / Key Files

- **Base Query**: `src/lib/redux/helpers.ts` - Custom `axiosBaseQuery()` implementation
- **Auth API**: `src/queries/auth.ts` - Authentication endpoints
- **Boards API**: `src/queries/boards.ts` - Board management endpoints
- **Cards API**: `src/queries/cards.ts` - Card operations endpoints
- **Columns API**: `src/queries/columns.ts` - Column management endpoints
- **Workspaces API**: `src/queries/workspaces.ts` - Workspace management endpoints
- **Users API**: `src/queries/users.ts` - User management endpoints
- **Medias API**: `src/queries/medias.ts` - File upload endpoints
- **Invitations API**: `src/queries/invitations.ts` - Board invitation endpoints

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
```

## Common Gotchas

- **Tag types** - Always define `tagTypes` as const array: `['Board'] as const`
- **Cache invalidation** - Invalidate both specific entity and LIST tags
- **Side effects** - Use `onQueryStarted` for navigation, toasts, not in components
- **Error handling** - Always wrap `queryFulfilled` in try-catch
- **Type safety** - Use schema-derived types for Request/Response types

## Pre-PR Checks

```bash
# Type check queries
npm run build

# Verify API calls work
npm run dev
```

