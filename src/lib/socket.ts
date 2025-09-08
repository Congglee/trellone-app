import { io } from 'socket.io-client'
import { envConfig } from '~/constants/config'

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

  // On reconnect, refresh auth header from latest storage token in case it changed
  socket.io.on('reconnect_attempt', () => {
    try {
      const latestToken = localStorage.getItem('access_token') || accessToken
      socket.auth = { Authorization: `Bearer ${latestToken}` }
    } catch {
      console.log('Error refreshing auth header on reconnect')
    }
  })

  return socket
}
