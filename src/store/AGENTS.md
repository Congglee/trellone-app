# Store - Agent Guide

## Package Identity

Redux Toolkit state management for Trellone. Uses `createSlice` for state slices, RTK Query for API calls, and Redux Persist for authentication persistence.

## Setup & Run

Store is configured in `src/lib/redux/store.ts`. No separate build step needed.

```typescript
// Access store
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
```

## Patterns & Conventions

### File Organization

- **Slices**: All slices in `src/store/slices/` with `.slice.ts` suffix
- **Root reducer**: `src/store/root.reducer.ts` combines all slices
- **Store config**: `src/lib/redux/store.ts` - Store setup with middleware

✅ **DO**: Follow `src/store/slices/auth.slice.ts` pattern
- Define `SliceState` interface
- Create `initialState` object
- Use `createSlice` from Redux Toolkit
- Export reducer as default, actions as named exports

### Slice Structure

✅ **DO**: Use consistent slice structure
```typescript
interface AuthSliceState {
  isAuthenticated: boolean
  profile: UserType | null
}

const initialState: AuthSliceState = {
  profile: null,
  isAuthenticated: false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload
    }
  }
})

export const { setAuthenticated } = authSlice.actions
export default authSlice.reducer
```

✅ **DO**: Use descriptive action names
- `setAuthenticated` - Simple assignment
- `updateActiveCard` - Modification
- `clearAndHideActiveCardModal` - Reset/clear

✅ **DO**: Mutate state directly (Immer handles immutability)
```typescript
reducers: {
  updateCard: (state, action) => {
    state.activeCard = { ...state.activeCard, ...action.payload }
  }
}
```

### Initial State Patterns

✅ **DO**: Define explicit initialState with TypeScript typing
✅ **DO**: Initialize arrays as `[]` and objects as `null`
✅ **DO**: Use descriptive property names

### Async Thunks

✅ **DO**: Use `createAsyncThunk` for complex async operations
```typescript
export const getBoardDetails = createAsyncThunk(
  'board/getBoardDetails',
  async (boardId: string, thunkAPI) => {
    // implementation
  }
)
```

### State Selectors

✅ **DO**: Use typed hooks from `~/lib/redux/hooks`
```typescript
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'

const { isAuthenticated, profile } = useAppSelector((state) => state.auth)
const dispatch = useAppDispatch()
```

✅ **DO**: Destructure specific state properties
```typescript
// ✅ Good
const { activeBoard } = useAppSelector((state) => state.board)

// ❌ Bad - causes unnecessary re-renders
const boardState = useAppSelector((state) => state.board)
```

### Real-time Integration

✅ **DO**: Store Socket.io instance in app slice
```typescript
// In app.slice.ts
interface AppSliceState {
  socket: Socket | null
}

// Connect socket
dispatch(setSocket(socketInstance))

// Disconnect socket
dispatch(disconnectSocket())
```

### Authentication State Management

✅ **DO**: Manage authentication state in dedicated slice
```typescript
// src/store/slices/auth.slice.ts
interface AuthSliceState {
  isAuthenticated: boolean
  profile: UserType | null
}

const initialState: AuthSliceState = {
  profile: null,
  isAuthenticated: false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload
    },
    setProfile: (state, action) => {
      state.profile = action.payload
    },
    reset: (state) => {
      state.isAuthenticated = false
      state.profile = null
    }
  }
})
```

✅ **DO**: Update auth state after successful login
```typescript
// In queries/auth.ts onQueryStarted
dispatch(userApi.endpoints.getMe.initiate(undefined)).then((res) => {
  if (!res.error) {
    dispatch(setAuthenticated(true))
    dispatch(setProfile(res.data?.result))
  }
})
```

✅ **DO**: Reset auth state on logout
```typescript
// In queries/auth.ts logout onQueryStarted
dispatch(reset())
dispatch(disconnectSocket())
```

### State Persistence

✅ **DO**: Only persist essential state (auth)
```typescript
// In store.ts
whitelist: ['auth'] // Only persist auth slice
```

## Touch Points / Key Files

- **Store Configuration**: `src/lib/redux/store.ts` - Store setup with middleware
- **Root Reducer**: `src/store/root.reducer.ts` - Combines all slices
- **Auth Slice**: `src/store/slices/auth.slice.ts` - Authentication state
- **App Slice**: `src/store/slices/app.slice.ts` - Application-wide state (socket)
- **Board Slice**: `src/store/slices/board.slice.ts` - Active board state
- **Card Slice**: `src/store/slices/card.slice.ts` - Active card state
- **Workspace Slice**: `src/store/slices/workspace.slice.ts` - Workspace state
- **Notification Slice**: `src/store/slices/notification.slice.ts` - Notifications

## JIT Index Hints

```bash
# Find a slice
rg -n "createSlice" src/store/slices

# Find an action
rg -n "export const.*=.*\.actions" src/store/slices

# Find state selectors
rg -n "useAppSelector.*state\." src

# Find dispatch calls
rg -n "dispatch\(.*\)" src
```

## Common Gotchas

- **Direct mutation** - Mutate state directly in reducers (Immer handles immutability)
- **Action naming** - Use clear, descriptive names: `set`, `update`, `clear` prefixes
- **Persistence** - Only persist `auth` slice, not entire state
- **Type safety** - Always use typed hooks (`useAppSelector`, `useAppDispatch`)
- **Socket cleanup** - Always disconnect socket in logout actions

## Pre-PR Checks

```bash
# Type check store
npm run build

# Verify no circular dependencies
npm run lint
```

