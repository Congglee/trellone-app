# Store - Agent Guide

## Package Identity

Redux Toolkit state management for Trellone. Uses `createSlice` for state slices, RTK Query for API calls, and Redux Persist for authentication persistence. Socket.IO instance managed globally in app slice.

## Setup & Run

Store is configured in `src/lib/redux/store.ts`. No separate build step needed.

```typescript
// Access store
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
```

## Patterns & Conventions

### File Organization

- **Slices**: All slices in `src/store/slices/` with `.slice.ts` suffix
- **Root reducer**: `src/store/root.reducer.ts` combines all slices and RTK Query reducers
- **Store config**: `src/lib/redux/store.ts` - Store setup with middleware

```
src/store/
├── root.reducer.ts
└── slices/
    ├── app.slice.ts
    ├── auth.slice.ts
    ├── board.slice.ts
    ├── card.slice.ts
    ├── notification.slice.ts
    └── workspace.slice.ts
```

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

export const { setAuthenticated, setProfile, reset } = authSlice.actions
export default authSlice.reducer
```

✅ **DO**: Use descriptive action names

- `setAuthenticated` - Simple assignment
- `setProfile` - Set user profile
- `updateActiveCard` - Modification
- `clearAndHideActiveCardModal` - Reset/clear
- `disconnectSocket` - Side effect action

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

### State Selectors

✅ **DO**: Use typed hooks from `~/lib/redux/hooks`

```typescript
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'

const { isAuthenticated, profile } = useAppSelector((state) => state.auth)
const dispatch = useAppDispatch()
```

✅ **DO**: Destructure specific state properties

```typescript
// ✅ Good - only re-renders when specific values change
const { activeBoard } = useAppSelector((state) => state.board)

// ❌ Bad - causes unnecessary re-renders
const boardState = useAppSelector((state) => state.board)
```

### Socket Instance Management

✅ **DO**: Store Socket.io instance in app slice

```typescript
// src/store/slices/app.slice.ts
interface AppSliceState {
  socket: Socket | null
}

const initialState: AppSliceState = {
  socket: null
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload
    },
    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect()
        state.socket = null
      }
    }
  }
})
```

✅ **DO**: Socket lifecycle managed in `App.tsx`

```typescript
// Socket created when user authenticates
useEffect(() => {
  const accessToken = getAccessTokenFromLS()
  if (isAuthenticated && profile) {
    dispatch(setSocket(generateSocketInstace(accessToken)))
  }
}, [isAuthenticated, profile, dispatch])

// Socket disconnected on logout
useEffect(() => {
  const onReset = () => {
    dispatch(reset())
    dispatch(disconnectSocket())
  }
  LocalStorageEventTarget.addEventListener('clearLS', onReset)
  return () => {
    LocalStorageEventTarget.removeEventListener('clearLS', onReset)
  }
}, [dispatch])
```

✅ **DO**: Access socket from Redux store in components

```typescript
import { useAppSelector } from '~/lib/redux/hooks'

const { socket } = useAppSelector((state) => state.app)

// Use socket for real-time events
socket?.emit('CLIENT_JOIN_BOARD', boardId)
socket?.on('SERVER_BOARD_UPDATED', (board) => {
  dispatch(updateActiveBoard(board))
})
```

### Authentication State Management

✅ **DO**: Manage authentication state in dedicated slice

```typescript
// src/store/slices/auth.slice.ts
interface AuthSliceState {
  isAuthenticated: boolean
  profile: UserType | null
}
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

❌ **DON'T**: Persist socket instance or other non-serializable data

## Touch Points / Key Files

- **Store Configuration**: `src/lib/redux/store.ts` - Store setup with middleware
- **Root Reducer**: `src/store/root.reducer.ts` - Combines all slices and RTK Query reducers
- **Auth Slice**: `src/store/slices/auth.slice.ts` - Authentication state (isAuthenticated, profile)
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
rg -n "dispatch\(" src

# Find socket actions
rg -n "setSocket|disconnectSocket" src
```

## Common Gotchas

- **Direct mutation** - Mutate state directly in reducers (Immer handles immutability)
- **Action naming** - Use clear, descriptive names: `set`, `update`, `clear`, `reset` prefixes
- **Persistence** - Only persist `auth` slice, not entire state (socket is not persisted)
- **Type safety** - Always use typed hooks (`useAppSelector`, `useAppDispatch`)
- **Socket instance** - Socket is singleton stored in `app` slice, accessed via `state.app.socket`
- **Socket lifecycle** - Socket created in `App.tsx` on login, disconnected on logout
- **Socket cleanup** - Always disconnect socket in logout actions via `disconnectSocket()`
- **Serializable check** - Socket instances bypass serializableCheck in middleware config

## Pre-PR Checks

```bash
# Type check store
npm run build

# Verify no circular dependencies
npm run lint
```
