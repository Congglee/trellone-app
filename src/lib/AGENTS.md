# Lib - Agent Guide

## Package Identity

Library configurations and integrations for Trellone. Contains HTTP client with auto token refresh, Socket.IO setup with reconnection handling, Redux store configuration, drag-and-drop sensors, and TipTap editor setup.

## Setup & Run

Library configs are imported directly. No separate build step needed.

```typescript
import http from '~/lib/http'
import { generateSocketInstace } from '~/lib/socket'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { sensors } from '~/lib/sensors'
```

## Patterns & Conventions

### File Organization

```
src/lib/
├── http.ts           # Axios HTTP client with interceptors
├── jwt-decode.ts     # Token decoding utilities
├── sensors.ts        # @dnd-kit sensor configuration
├── socket.ts         # Socket.IO client factory
├── tiptap.ts         # TipTap editor configuration
└── redux/
    ├── helpers.ts    # axiosBaseQuery for RTK Query
    ├── hooks.ts      # Typed Redux hooks
    └── store.ts      # Store configuration
```

### HTTP Client

✅ **DO**: Use centralized HTTP client with automatic token management

```typescript
import http from '~/lib/http'

// GET request
const response = await http.get('/api/boards')

// POST request
const response = await http.post('/api/boards', data)
```

✅ **DO**: HTTP client automatically handles:

- **Request interceptor**: Adds access token to Authorization header
- **Response interceptor**: Stores tokens on login, clears on logout
- **Token refresh**: Automatically refreshes expired access tokens
- **Error handling**: Shows toast for errors (except 401, 422)
- **Loading states**: Enables/disables `.interceptor-loading` elements

```typescript
// src/lib/http.ts - Request interceptor
this.instance.interceptors.request.use((config) => {
  interceptorLoadingElements(true)
  const accessToken = this.accessToken || getAccessTokenFromLS()
  if (accessToken && config.headers) {
    config.headers.authorization = accessToken
  }
  return config
})

// Response interceptor - Token refresh on expiration
if (isAxiosExpiredTokenError(error) && url !== `${AUTH_API_URL}/refresh-token`) {
  return this.callRefreshToken().then((access_token) => {
    return this.instance({
      ...config,
      headers: { ...config.headers, authorization: access_token }
    })
  })
}
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

### Socket.IO Client

✅ **DO**: Get socket from Redux store, not direct import

```typescript
import { useAppSelector } from '~/lib/redux/hooks'

const { socket } = useAppSelector((state) => state.app)
```

✅ **DO**: Generate socket instance using `generateSocketInstace` function

```typescript
import { generateSocketInstace } from '~/lib/socket'

// Socket is created with access token and auto-reconnection enabled
const socket = generateSocketInstace(accessToken)
```

✅ **DO**: Socket automatically handles:

- **Token refresh on Unauthorized**: Listens for `connect_error` and refreshes token
- **Auth header sync**: Updates auth header on `reconnect_attempt`
- **Token refresh events**: Listens for `token-refreshed` from HTTP client
- **Cleanup on disconnect**: Removes event listeners when socket disconnects

```typescript
// src/lib/socket.ts
export const generateSocketInstace = (accessToken: string) => {
  const socket = io(envConfig.baseUrl, {
    auth: { Authorization: `Bearer ${accessToken}` },
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 30000,
    autoConnect: true
  })

  // Handle Unauthorized errors
  socket.on('connect_error', async (err) => {
    if (err.message === 'Unauthorized') {
      await httpUtils.callRefreshToken()
    }
  })

  // Sync auth header on reconnect
  socket.io.on('reconnect_attempt', () => {
    const latestToken = localStorage.getItem('access_token')
    socket.auth = { Authorization: `Bearer ${latestToken}` }
  })

  // Listen for token refresh from HTTP client
  LocalStorageEventTarget.addEventListener('token-refreshed', () => {
    const latestToken = localStorage.getItem('access_token')
    socket.auth = { Authorization: `Bearer ${latestToken}` }
    if (!socket.connected) socket.connect()
  })

  return socket
}
```

✅ **DO**: Use socket events with CLIENT_/SERVER_ prefix convention

```typescript
// Client emits events with CLIENT_ prefix
socket.emit('CLIENT_JOIN_BOARD', boardId)
socket.emit('CLIENT_USER_UPDATED_BOARD', board)
socket.emit('CLIENT_LEAVE_BOARD', boardId)

// Server events use SERVER_ prefix
socket.on('SERVER_BOARD_UPDATED', (board) => {
  dispatch(updateActiveBoard(board))
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
  baseQuery: axiosBaseQuery(),
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

### TipTap Editor

✅ **DO**: Use TipTap configuration from lib

```typescript
import { extensions, editorProps } from '~/lib/tiptap'

const editor = useEditor({
  extensions,
  editorProps,
  content: initialContent
})
```

## Touch Points / Key Files

- **HTTP Client**: `src/lib/http.ts` - Axios HTTP client with interceptors and token refresh
- **Socket.IO**: `src/lib/socket.ts` - Socket client factory with auto token refresh
- **Redux Store**: `src/lib/redux/store.ts` - Store configuration with persistence
- **Redux Hooks**: `src/lib/redux/hooks.ts` - Typed Redux hooks (useAppDispatch, useAppSelector)
- **Redux Helpers**: `src/lib/redux/helpers.ts` - Custom axiosBaseQuery for RTK Query
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

- **Client events**: `CLIENT_JOIN_BOARD`, `CLIENT_LEAVE_BOARD`, `CLIENT_USER_UPDATED_BOARD`, `CLIENT_USER_CREATED_WORKSPACE_BOARD`
- **Server events**: `SERVER_BOARD_UPDATED`, `SERVER_CARD_UPDATED`, `SERVER_USER_INVITED_TO_BOARD`

**Socket Rooms**:

- Board rooms: `board-${boardId}` - Users viewing a specific board
- Workspace rooms: `workspace-${workspaceId}` - Users in a workspace
- Global index: `workspaces-index` - Users on boards list page

## JIT Index Hints

```bash
# Find HTTP client usage
rg -n "from '~/lib/http" src

# Find socket instance creation
rg -n "generateSocketInstace" src

# Find socket from Redux store
rg -n "socket.*useAppSelector" src

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
- **Socket events** - Always use CLIENT_/SERVER_ prefix convention for events
- **Socket cleanup** - Always remove event listeners with `socket.off()` in useEffect cleanup
- **Socket rooms** - Leave rooms (`CLIENT_LEAVE_BOARD`) when component unmounts
- **Redux hooks** - Always use typed hooks, not raw `useDispatch`/`useSelector`
- **Base query** - RTK Query uses custom `axiosBaseQuery()` from helpers
- **Environment variables** - Use `VITE_` prefix for client-side env vars
- **interceptor-loading** - Add this class to submit buttons for auto-disable during API calls

## Pre-PR Checks

```bash
# Type check lib
npm run build

# Verify HTTP client is used (not raw fetch)
rg -n "fetch\(|axios\(" src
```
