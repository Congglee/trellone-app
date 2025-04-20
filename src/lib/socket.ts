import { io } from 'socket.io-client'
import { envConfig } from '~/constants/config'

const socket = io(envConfig.baseUrl, { withCredentials: true })

export default socket
