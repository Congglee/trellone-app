import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import NavBar from '~/components/NavBar'
import { useQueryConfig } from '~/hooks/use-query-config'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import WorkspaceSidebar from '~/pages/Workspaces/components/WorkspaceSidebar'
import { boardApi } from '~/queries/boards'
import { workspaceApi } from '~/queries/workspaces'
import { getBoardDetails } from '~/store/slices/board.slice'

export default function WorkspaceDetailsLayout() {
  const { workspaceId } = useParams()
  const queryConfig = useQueryConfig()

  const dispatch = useAppDispatch()

  const { socket } = useAppSelector((state) => state.app)

  // Join/leave workspace room lifecycle
  useEffect(() => {
    if (!workspaceId || !socket) return

    socket.emit('CLIENT_JOIN_WORKSPACE', workspaceId)

    return () => {
      socket.emit('CLIENT_LEAVE_WORKSPACE', workspaceId)
    }
  }, [socket, workspaceId])

  // Rejoin on reconnect
  useEffect(() => {
    if (!socket || !workspaceId) return

    const onReconnect = () => {
      socket.emit('CLIENT_JOIN_WORKSPACE', workspaceId)
    }

    socket.on('reconnect', onReconnect)

    return () => {
      socket.off('reconnect', onReconnect)
    }
  }, [socket, workspaceId])

  useEffect(() => {
    if (!socket || !workspaceId) return

    const onUpdateWorkspace = (workspaceId: string, boardId?: string) => {
      // Invalidate getWorkspaces list item and the workspace item if present
      dispatch(
        workspaceApi.util.invalidateTags([
          { type: 'Workspace', id: workspaceId },
          { type: 'Workspace', id: 'LIST' }
        ])
      )

      if (boardId) {
        dispatch(getBoardDetails(boardId))
        dispatch(
          boardApi.util.prefetch(
            'getJoinedWorkspaceBoards',
            { workspace_id: workspaceId, ...queryConfig },
            { force: true }
          )
        )
      }
    }

    const onCreateWorkspaceBoard = (workspaceId: string) => {
      dispatch(workspaceApi.util.invalidateTags([{ type: 'Workspace', id: workspaceId }]))
    }

    socket.on('SERVER_WORKSPACE_UPDATED', onUpdateWorkspace)
    socket.on('SERVER_WORKSPACE_BOARD_CREATED', onCreateWorkspaceBoard)

    return () => {
      socket.off('SERVER_WORKSPACE_UPDATED', onUpdateWorkspace)
      socket.off('SERVER_WORKSPACE_BOARD_CREATED', onCreateWorkspaceBoard)
    }
  }, [socket, workspaceId, dispatch, queryConfig])

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh', overflow: 'hidden' }}>
      <NavBar />
      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100')
        }}
      >
        <WorkspaceSidebar workspaceId={workspaceId} />

        <Box
          component='main'
          sx={{
            flexGrow: 1,
            height: (theme) => `calc(100vh - ${theme.trellone.navBarHeight})`,
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Container>
  )
}
