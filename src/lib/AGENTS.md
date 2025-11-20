# Lib - Agent Guide

## Package Identity

Library configurations and integrations for Trellone. Contains HTTP client, Socket.IO setup, Redux store configuration, and drag-and-drop sensors.

## Setup & Run

Library configs are imported directly. No separate build step needed.

```typescript
import { httpClient } from '~/lib/http'
import { socket } from '~/lib/socket'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
```

## Patterns & Conventions

### File Organization

- **HTTP Client**: `src/lib/http.ts` - Axios configuration
- **Socket.IO**: `src/lib/socket.ts` - Socket client setup
- **Redux**: `src/lib/redux/` - Store configuration
- **Drag & Drop**: `src/lib/sensors.ts` - @dnd-kit sensor config
- **JWT Decode**: `src/lib/jwt-decode.ts` - Token decoding utilities
- **TipTap**: `src/lib/tiptap.ts` - Rich text editor configuration

✅ **DO**: Follow `src/lib/http.ts` pattern

- Export configured instances
- Handle interceptors for auth, errors
- Use environment variables for base URLs

### HTTP Client

✅ **DO**: Use centralized HTTP client with automatic token management

```typescript
import http from '~/lib/http'

// GET request
const response = await http.get('/api/boards')

// POST request
const response = await http.post('/api/boards', data)
```

✅ **DO**: HTTP client automatically handles token refresh

```typescript
// Request interceptor adds access token from localStorage
this.instance.interceptors.request.use((config) => {
  const accessToken = this.accessToken || getAccessTokenFromLS()
  if (accessToken && config.headers) {
    config.headers.authorization = accessToken
  }
  return config
})

// Response interceptor handles token refresh on 401
this.instance.interceptors.response.use(
  (response) => {
    // Store tokens on login
    if (url === `${AUTH_API_URL}/login`) {
      const result = response.data as AuthResType
      this.accessToken = result.result.access_token
      this.refreshToken = result.result.refresh_token
      setAccessTokenToLS(this.accessToken)
      setRefreshTokenToLS(this.refreshToken)
    }
    return response
  },
  (error: AxiosError) => {
    // Auto-refresh token on expiration
    if (isAxiosExpiredTokenError(error) && url !== `${AUTH_API_URL}/refresh-token`) {
      this.refreshTokenRequest = this.refreshTokenRequest || this.handleRefreshToken()
      return this.refreshTokenRequest.then((access_token) => {
        return this.instance({
          ...config,
          headers: { ...config.headers, authorization: access_token }
        })
      })
    }
    // Logout on unauthorized
    if (isAxiosUnauthorizedError(error)) {
      clearLS()
      axiosReduxStore.dispatch(authApi.endpoints.logout.initiate(undefined))
    }
    return Promise.reject(error)
  }
)
```

✅ **DO**: Configure HTTP client with credentials for cookies

```typescript
this.instance = axios.create({
  baseURL: envConfig.baseUrl,
  timeout: 1000 * 60 * 10, // 10 minutes
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true // Required for httpOnly cookies
})
```

### Socket.IO

✅ **DO**: Use socket instance from Redux store (not direct import)

```typescript
import { useAppSelector } from '~/lib/redux/hooks'

const { socket } = useAppSelector((state) => state.app)

// Socket is automatically created in App.tsx when user logs in
// Socket is stored in Redux store for global access
```

✅ **DO**: Generate socket instance using `generateSocketInstace` function

```typescript
import { generateSocketInstace } from '~/lib/socket'

// Socket is created with access token and auto-reconnection enabled
const socket = generateSocketInstace(accessToken)
```

✅ **DO**: Socket automatically handles token refresh on Unauthorized errors

```typescript
// Socket listens for 'connect_error' and refreshes token automatically
socket.on('connect_error', async (err) => {
  if (err.message === 'Unauthorized') {
    // Automatically refreshes token and reconnects
  }
})
```

✅ **DO**: Socket syncs auth header on reconnect attempts

```typescript
// Socket.io automatically updates auth header before reconnect
socket.io.on('reconnect_attempt', () => {
  const latestToken = localStorage.getItem('access_token')
  socket.auth = { Authorization: `Bearer ${latestToken}` }
})
```

✅ **DO**: Socket listens for token refresh events from HTTP client

```typescript
// Socket automatically updates auth when HTTP client refreshes token
LocalStorageEventTarget.addEventListener('token-refreshed', () => {
  const latestToken = localStorage.getItem('access_token')
  socket.auth = { Authorization: `Bearer ${latestToken}` }
})
```

✅ **DO**: Use socket events with CLIENT*/SERVER* prefix convention

```typescript
// Client emits events with CLIENT_ prefix
socket.emit('CLIENT_JOIN_BOARD', boardId)
socket.emit('CLIENT_USER_UPDATED_BOARD', board)

// Server events use SERVER_ prefix
socket.on('SERVER_BOARD_UPDATED', (board) => {
  // Handle board update
})
socket.on('SERVER_CARD_UPDATED', (card) => {
  // Handle card update
})
```

✅ **DO**: Clean up socket listeners in useEffect cleanup

```typescript
useEffect(() => {
  const onUpdateBoard = (board: BoardType) => {
    dispatch(updateActiveBoard(board))
  }

  socket?.on('SERVER_BOARD_UPDATED', onUpdateBoard)

  return () => {
    socket?.off('SERVER_BOARD_UPDATED', onUpdateBoard)
  }
}, [socket, dispatch])
```

✅ **DO**: Leave rooms when component unmounts

```typescript
useEffect(() => {
  if (boardId) {
    socket?.emit('CLIENT_JOIN_BOARD', boardId)
  }

  return () => {
    if (boardId) {
      socket?.emit('CLIENT_LEAVE_BOARD', boardId)
    }
  }
}, [socket, boardId])
```

❌ **DON'T**: Import socket directly from `~/lib/socket` - use Redux store instead

❌ **DON'T**: Create multiple socket instances - socket is singleton managed in Redux

❌ **DON'T**: Forget to clean up event listeners - always use `socket.off()` in cleanup

### Redux Configuration

✅ **DO**: Use typed hooks from redux lib

```typescript
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'

const dispatch = useAppDispatch()
const { isAuthenticated } = useAppSelector((state) => state.auth)
```

✅ **DO**: Use custom base query for RTK Query

```typescript
import axiosBaseQuery from '~/lib/redux/helpers'

export const boardApi = createApi({
  baseQuery: axiosBaseQuery()
  // ...
})
```

### Drag & Drop Sensors

✅ **DO**: Use configured sensors from lib

```typescript
import { sensors } from '~/lib/sensors'

<DndContext sensors={sensors}>
  {/* drag and drop content */}
</DndContext>
```

## Touch Points / Key Files

- **HTTP Client**: `src/lib/http.ts` - Axios HTTP client with interceptors
- **Socket.IO**: `src/lib/socket.ts` - Socket client factory with auto token refresh
- **Redux Store**: `src/lib/redux/store.ts` - Store configuration with persistence
- **Redux Hooks**: `src/lib/redux/hooks.ts` - Typed Redux hooks
- **Redux Helpers**: `src/lib/redux/helpers.ts` - Custom axios base query
- **Sensors**: `src/lib/sensors.ts` - Drag-and-drop sensor configuration
- **JWT Decode**: `src/lib/jwt-decode.ts` - Token decoding utilities
- **TipTap**: `src/lib/tiptap.ts` - Rich text editor configuration

### Socket Architecture

**Socket Lifecycle**:

1. Socket instance created in `App.tsx` when user logs in via `generateSocketInstace(accessToken)`
2. Socket stored in Redux store (`app.slice.ts`) for global access
3. Socket automatically handles token refresh on Unauthorized errors
4. Socket syncs auth header on reconnect attempts
5. Socket listens for token refresh events from HTTP client
6. Socket disconnected when user logs out via `disconnectSocket()` action

**Socket Events Convention**:

- **Client events**: `CLIENT_JOIN_BOARD`, `CLIENT_LEAVE_BOARD`, `CLIENT_USER_UPDATED_BOARD`
- **Server events**: `SERVER_BOARD_UPDATED`, `SERVER_CARD_UPDATED`, `SERVER_USER_INVITED_TO_BOARD`

**Socket Rooms**:

- Board rooms: `board-${boardId}` - Users viewing a specific board
- Workspace rooms: `workspace-${workspaceId}` - Users in a workspace
- Global index: `workspaces-index` - Users on boards list page

**Key Socket Features**:

- Auto-reconnection with exponential backoff
- Token refresh on authentication errors
- Room-based broadcasting for efficient updates
- User-specific notifications via socket_id targeting

## JIT Index Hints

```bash
# Find HTTP client usage
rg -n "from '~/lib/http" src

# Find socket instance creation
rg -n "generateSocketInstace" src

# Find socket from Redux store
rg -n "socket.*useAppSelector.*state.app" src

# Find socket event handlers
rg -n "socket\?\.(on|emit|off)" src

# Find CLIENT_ event emissions
rg -n "CLIENT_" src

# Find SERVER_ event listeners
rg -n "SERVER_" src

# Find Redux hooks usage
rg -n "from '~/lib/redux/hooks" src

# Find base query usage
rg -n "axiosBaseQuery" src/queries
```

## Common Gotchas

- **HTTP interceptors** - Auth tokens added automatically via interceptors
- **Socket instance** - Get socket from Redux store (`state.app.socket`), not direct import
- **Socket lifecycle** - Socket created in `App.tsx` on login, disconnected on logout
- **Socket auth** - Socket uses access token in `auth` object, auto-refreshes on Unauthorized
- **Socket events** - Always use CLIENT*/SERVER* prefix convention for events
- **Socket cleanup** - Always remove event listeners with `socket.off()` in useEffect cleanup
- **Socket rooms** - Leave rooms (`CLIENT_LEAVE_BOARD`) when component unmounts
- **Redux hooks** - Always use typed hooks, not raw `useDispatch`/`useSelector`
- **Base query** - RTK Query uses custom `axiosBaseQuery()` from helpers
- **Environment variables** - Use `VITE_` prefix for client-side env vars

## Pre-PR Checks

```bash
# Type check lib
npm run build

# Verify HTTP client is used (not raw fetch)
rg -n "fetch\(|axios\(" src
```
