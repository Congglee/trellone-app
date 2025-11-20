import { useEffect } from 'react'
import { Socket } from 'socket.io-client'

/**
 * Hook to automatically rejoin a room when the socket reconnects.
 * @param socket The socket instance
 * @param joinAction The action to perform to join the room (e.g., emitting an event)
 * @param dependencies Dependencies that should trigger a re-join if changed (e.g. ID)
 */
export const useSocketAutoRejoin = (
  socket: Socket | null,
  joinAction: (socket: Socket) => void,
  dependencies: any[] = []
) => {
  useEffect(() => {
    if (!socket) return

    // Initial join
    if (socket.connected) {
      joinAction(socket)
    }

    const onConnect = () => {
      joinAction(socket)
    }

    const onReconnect = () => {
      joinAction(socket)
    }

    socket.on('connect', onConnect)
    socket.on('reconnect', onReconnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('reconnect', onReconnect)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, ...dependencies])
}
