import { io } from 'socket.io-client'
import { envConfig } from '~/constants/config'
import {
  getRefreshTokenFromLS,
  LocalStorageEventTarget,
  setAccessTokenToLS,
  setRefreshTokenToLS
} from '~/utils/storage'
import http from '~/lib/http'

export const generateSocketInstace = (accessToken: string) => {
  const socket = io(envConfig.baseUrl, {
    auth: { Authorization: `Bearer ${accessToken}` },
    withCredentials: true,
    // Improve reconnection stability on background tabs / flaky networks
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 30000,
    autoConnect: true
    // If your infra supports websocket-only, uncomment below for stability
    // transports: ['websocket']
  })

  // Handle connection error (e.g. Unauthorized)
  socket.on('connect_error', async (err) => {
    if (err.message === 'Unauthorized') {
      try {
        const refresh_token = getRefreshTokenFromLS()
        if (!refresh_token) return

        // Attempt to refresh token
        const res = await http.post('/auth/refresh-token', { refresh_token })
        const { access_token, refresh_token: new_refresh_token } = res.data.result

        // Update Local Storage
        setAccessTokenToLS(access_token)
        setRefreshTokenToLS(new_refresh_token)

        // Update socket auth and reconnect
        socket.auth = { Authorization: `Bearer ${access_token}` }
        socket.connect()
      } catch (error) {
        console.error('Socket refresh auth failed', error)
      }
    }
  })

  // On reconnect, refresh auth header from latest storage token in case it changed
  socket.io.on('reconnect_attempt', () => {
    try {
      const latestToken = localStorage.getItem('access_token') || accessToken
      socket.auth = { Authorization: `Bearer ${latestToken}` }
    } catch {
      console.log('Error refreshing auth header on reconnect')
    }
  })

  // Listen for token refresh events from HTTP client
  const onTokenRefresh = () => {
    const latestToken = localStorage.getItem('access_token')

    if (latestToken) {
      socket.auth = { Authorization: `Bearer ${latestToken}` }
      // If socket is disconnected, this might help, but usually it's for when it's connected/reconnecting
      if (!socket.connected) {
        socket.connect()
      }
    }
  }

  LocalStorageEventTarget.addEventListener('token-refreshed', onTokenRefresh)

  // Cleanup listener when socket is destroyed/disconnected?
  // Socket instance might live long, but we should be careful.
  // Since generateSocketInstace returns the socket, we can't easily attach cleanup.
  // However, in App.tsx, we disconnect socket on unmount or logout.
  const originalDisconnect = socket.disconnect.bind(socket)
  socket.disconnect = () => {
    LocalStorageEventTarget.removeEventListener('token-refreshed', onTokenRefresh)
    return originalDisconnect()
  }

  return socket
}
