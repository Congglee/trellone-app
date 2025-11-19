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

✅ **DO**: Use socket instance from lib

```typescript
import { socket } from '~/lib/socket'

socket.emit('join-board', { boardId })
socket.on('card-updated', (data) => {
  // Handle event
})
```

✅ **DO**: Configure socket with JWT auth

```typescript
// Socket connects with auth token
const socket = io(SOCKET_URL, {
  auth: { token: getToken() }
})
```

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
- **Socket.IO**: `src/lib/socket.ts` - Socket client with JWT auth
- **Redux Store**: `src/lib/redux/store.ts` - Store configuration with persistence
- **Redux Hooks**: `src/lib/redux/hooks.ts` - Typed Redux hooks
- **Redux Helpers**: `src/lib/redux/helpers.ts` - Custom axios base query
- **Sensors**: `src/lib/sensors.ts` - Drag-and-drop sensor configuration
- **JWT Decode**: `src/lib/jwt-decode.ts` - Token decoding utilities
- **TipTap**: `src/lib/tiptap.ts` - Rich text editor configuration

## JIT Index Hints

```bash
# Find HTTP client usage
rg -n "from '~/lib/http" src

# Find socket usage
rg -n "from '~/lib/socket" src

# Find Redux hooks usage
rg -n "from '~/lib/redux/hooks" src

# Find base query usage
rg -n "axiosBaseQuery" src/queries
```

## Common Gotchas

- **HTTP interceptors** - Auth tokens added automatically via interceptors
- **Socket auth** - Socket connects with JWT token from auth state
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
