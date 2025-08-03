# Redux Toolkit Patterns

## Brief overview

This rule documents the established Redux Toolkit patterns, conventions, and architectural best practices specifically identified from the Trellone React codebase. These guidelines ensure consistent state management, proper RTK Query usage, and maintainable Redux architecture across the application.

## Slice structure and organization

- Use `createSlice` from Redux Toolkit for all state slices with consistent naming: `entitySlice`
- Define TypeScript interfaces for slice state with descriptive names ending in `SliceState`
- Place all slice files in `src/store/slices/` directory with `.slice.ts` suffix
- Use default export for the reducer and named exports for actions: `export default entityReducer`
- Export actions using destructuring: `export const { action1, action2 } = entitySlice.actions`

## Initial state patterns

- Always define explicit `initialState` objects with proper TypeScript typing
- Use descriptive property names that clearly indicate the data they hold
- Initialize arrays as empty arrays `[]` and objects as `null` for single entities
- Include loading states for async operations: `loading: 'idle'`, `currentRequestId: undefined`, `error: null`

## Reducer implementation conventions

- Use descriptive action names that clearly indicate their purpose: `setAuthenticated`, `updateActiveCard`, `clearAndHideActiveCardModal`
- Leverage Immer's immutability through Redux Toolkit - directly mutate state in reducers
- Implement proper state updates using object property assignment and array methods
- Use `PayloadAction<T>` typing for actions that carry data with proper generic constraints

## Async thunk patterns

- Use `createAsyncThunk` for complex async operations that require loading states and error handling
- Follow naming convention: `entity/actionName` for thunk names (e.g., `'board/getBoardDetails'`)
- Implement proper error handling in rejected cases with meaningful error messages
- Use `thunkAPI.dispatch` to trigger other actions during async operations
- Handle request cancellation with `thunkAPI.signal` for HTTP requests

## RTK Query API slice structure

- Use `createApi` from `@reduxjs/toolkit/query/react` for all API interactions
- Define consistent constants: `reducerPath`, `tagTypes`, and `API_URL` at the top of each file
- Use custom `axiosBaseQuery()` helper for consistent HTTP client configuration
- Export both individual hooks and the reducer: `export const { useEntityMutation } = entityApi`

## RTK Query endpoint patterns

- Use descriptive endpoint names that clearly indicate the operation: `addBoard`, `updateCard`, `getBoards`
- Implement proper TypeScript generics: `build.mutation<ResponseType, RequestType>`
- Use `onQueryStarted` for side effects like toast notifications and state updates
- Handle errors consistently with try-catch blocks and user feedback via toast notifications

## Cache invalidation and tags

- Define meaningful tag types as const arrays: `const tagTypes = ['Board'] as const`
- Use `providesTags` for queries to mark what data they provide to the cache
- Use `invalidatesTags` for mutations to specify what cache data should be refreshed
- Implement both specific entity tags `{ type: 'Board', id: boardId }` and list tags `{ type: 'Board', id: 'LIST' }`

## State selector patterns

- Use typed Redux hooks from `~/lib/redux/hooks`: `useAppSelector`, `useAppDispatch`
- Destructure specific state properties in selectors: `const { isAuthenticated, profile } = useAppSelector((state) => state.auth)`
- Access nested state properties directly: `const { activeBoard } = useAppSelector((state) => state.board)`
- Use consistent selector patterns across components for the same data

## Real-time integration patterns

- Store Socket.io instances in Redux state using app slice: `socket: Socket | null`
- Implement socket connection management through Redux actions: `setSocket`, `disconnectSocket`
- Emit socket events after successful mutations to broadcast changes to other users
- Handle socket cleanup properly in disconnection actions with null checks

## Error handling conventions

- Use consistent error state structure: `error: string | null` in slice state
- Implement proper error handling in async thunks with meaningful error messages
- Clear errors when starting new operations or resetting state
- Use toast notifications for user feedback on both success and error cases

## State persistence patterns

- Use Redux Persist selectively - only persist essential state like authentication
- Configure persistence with whitelist approach: `whitelist: ['auth']`
- Implement proper store configuration with persistence middleware
- Handle rehydration properly with serializable check disabled for non-serializable data

## Component integration patterns

- Use RTK Query hooks directly in components: `const [updateCardMutation] = useUpdateCardMutation()`
- Implement optimistic updates by dispatching slice actions before API calls
- Handle loading states from RTK Query hooks: `const { data, isLoading, error } = useGetBoardsQuery()`
- Use mutation results with `.unwrap()` for error handling: `const result = await mutation(data).unwrap()`

## Store configuration best practices

- Combine all reducers in `root.reducer.ts` using `combineReducers`
- Include all RTK Query API reducers using dynamic keys: `[entityApi.reducerPath]: entityApiReducer`
- Configure middleware to include all RTK Query middleware: `entityApi.middleware`
- Disable serializable check for Redux Persist compatibility: `serializableCheck: false`

## Action naming conventions

- Use clear, descriptive action names that indicate the operation: `setAuthenticated`, `updateActiveBoard`
- Follow consistent patterns: `set` for simple assignments, `update` for modifications, `clear` for resets
- Use entity-specific prefixes when actions operate on specific data types
- Implement both singular and plural operations: `addWorkspace` vs `appendWorkspaces`

## Type safety patterns

- Define proper TypeScript interfaces for all state shapes and action payloads
- Use schema-derived types for API data: `BoardResType['result']`
- Export proper store types: `RootState`, `AppDispatch` from store configuration
- Implement typed hooks that provide proper IntelliSense and type checking

## Side effect management

- Use `onQueryStarted` in RTK Query for side effects like navigation and state updates
- Implement proper cleanup in logout actions: reset state, disconnect sockets, clear API cache
- Handle authentication state updates through RTK Query side effects
- Use `api.util.resetApiState()` to clear cached data when appropriate

## Performance optimization patterns

- Use selective state updates to minimize re-renders
- Implement proper memoization in selectors when needed
- Use RTK Query's built-in caching to avoid unnecessary API calls
- Handle duplicate prevention in array operations: filter existing items before appending
