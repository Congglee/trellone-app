import { io } from 'socket.io-client'
import { envConfig } from '~/constants/config'

export const socket = io(envConfig.baseUrl, {
  withCredentials: true
})

export const generateSocketInstace = (accessToken: string) => {
  return io(envConfig.baseUrl, {
    auth: { Authorization: `Bearer ${accessToken}` },
    withCredentials: true
  })
}
