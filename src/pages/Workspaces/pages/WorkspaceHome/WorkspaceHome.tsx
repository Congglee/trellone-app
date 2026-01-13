import EditIcon from '@mui/icons-material/Edit'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import PersonIcon from '@mui/icons-material/Person'
import PublicIcon from '@mui/icons-material/Public'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import NewBoardDialog from '~/components/Dialog/NewBoardDialog'
import SEO from '~/components/SEO'
import WorkspaceAvatar from '~/components/Workspace/WorkspaceAvatar'
import path from '~/constants/path'
import { WorkspacePermission } from '~/constants/permissions'
import { useWorkspacePermission } from '~/hooks/use-permissions'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import BoardCard from '~/pages/Workspaces/components/BoardCard'
import NewBoardCard from '~/pages/Workspaces/components/NewBoardCard'
import WorkspaceClosedBoards from '~/pages/Workspaces/components/WorkspaceClosedBoards'
import WorkspaceLogo from '~/pages/Workspaces/components/WorkspaceLogo'
import EditWorkspaceDialog from '~/pages/Workspaces/pages/WorkspaceHome/components/EditWorkspaceDialog'

import { useGetWorkspaceQuery, workspaceApi } from '~/queries/workspaces'
import { useSocketAutoRejoin } from '~/hooks/use-sockets'

export default function WorkspaceHome() {
  const { workspaceId } = useParams()

  const [newBoardDialogOpen, setNewBoardDialogOpen] = useState(false)
  const [editWorkspaceOpen, setEditWorkspaceOpen] = useState(false)

  const dispatch = useAppDispatch()

  const { profile } = useAppSelector((state) => state.auth)
  const { socket } = useAppSelector((state) => state.app)

  const { data: workspaceData, isLoading, isError } = useGetWorkspaceQuery(workspaceId!)
  const workspace = workspaceData?.result
  const allBoards = (workspace?.boards || []).filter((board) => !board._destroy)

  const joinedBoards = allBoards.filter((board) => board.members?.some((member) => member.user_id === profile?._id))
  const otherBoards = allBoards.filter((board) => !board.members?.some((member) => member.user_id === profile?._id))

  const hasClosedBoards = (workspace?.boards || []).some((board) => board._destroy)

  const { hasPermission } = useWorkspacePermission(workspace)

  // Join/leave workspace room lifecycle
  useEffect(() => {
    if (!workspaceId || !socket) return

    return () => {
      socket.emit('CLIENT_LEAVE_WORKSPACE', workspaceId)
    }
  }, [socket, workspaceId])

  // Rejoin on reconnect
  useSocketAutoRejoin(
    socket,
    (socketInstance) => {
      if (workspaceId) {
        socketInstance.emit('CLIENT_JOIN_WORKSPACE', workspaceId)
      }
    },
    [workspaceId]
  )

  useEffect(() => {
    if (!socket || !workspaceId) return

    const onUpdateWorkspace = (workspaceId: string) => {
      // Invalidate getWorkspaces list item and the workspace item if present
      dispatch(
        workspaceApi.util.invalidateTags([
          { type: 'Workspace', id: workspaceId },
          { type: 'Workspace', id: 'LIST' }
        ])
      )
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
  }, [socket, workspaceId, dispatch])

  if (isError) {
    return <Navigate to={path.boardsList} />
  }

  return (
    <Box>
      <SEO
        title={workspace?.title ? `${workspace.title} - Overview` : 'Workspace'}
        description={
          workspace?.description?.trim() ||
          'Workspace overview in Trellone: browse boards, create new boards, and manage collaboration.'
        }
        noIndex
        noFollow
      />

      <Stack spacing={3} sx={{ p: 4, pt: { xs: 0, sm: 4 } }}>
        {isLoading ? (
          <Stack alignItems='center' direction='row' spacing={2}>
            <Skeleton
              animation='wave'
              width={90}
              height={90}
              sx={{
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300')
              }}
            />
            <Stack spacing={1}>
              <Skeleton
                animation='wave'
                variant='rectangular'
                width={200}
                height={32}
                sx={{
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300'),
                  borderRadius: 1
                }}
              />
              <Skeleton
                animation='wave'
                variant='rectangular'
                width={100}
                height={20}
                sx={{
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300'),
                  borderRadius: 1
                }}
              />
            </Stack>
          </Stack>
        ) : (
          <Stack alignItems='center' direction='row' flexWrap='wrap' useFlexGap spacing={2}>
            {hasPermission(WorkspacePermission.ManageWorkspace) ? (
              <WorkspaceLogo workspace={workspace!} size={{ width: 80, height: 80 }} />
            ) : (
              <WorkspaceAvatar
                title={workspace?.title as string}
                logo={workspace?.logo}
                size={{ width: 80, height: 80 }}
              />
            )}

            <Stack spacing={0.5}>
              <Stack alignItems='center' direction='row' spacing={1}>
                <Typography
                  variant='h4'
                  fontWeight={600}
                  sx={{ whiteSpace: 'pre-wrap', wordBreak: { xs: 'break-all', sm: 'normal' } }}
                >
                  {workspace?.title}
                </Typography>
                {hasPermission(WorkspacePermission.ManageWorkspace) && (
                  <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => setEditWorkspaceOpen(true)}>
                    <EditIcon fontSize='small' />
                  </IconButton>
                )}
              </Stack>
              <Stack alignItems='center' direction='row' spacing={0.5}>
                <PublicIcon
                  fontSize='small'
                  sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2') }}
                />
                <Typography
                  variant='body2'
                  sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2') }}
                >
                  {workspace?.visibility}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        )}
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ pl: { xs: 0, sm: 1 } }}>
        <Stack alignItems='center' direction='row' spacing={1}>
          <PersonIcon sx={{ width: 32, height: 32 }} />
          <Typography variant='h6' fontWeight={600}>
            Your boards
          </Typography>
        </Stack>

        <Grid container spacing={2} mt={1}>
          {isLoading ? (
            <>
              {Array.from({ length: 4 }).map((_, index) => (
                <Grid xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card variant='outlined' sx={{ height: 120 }}>
                    <Skeleton
                      animation='wave'
                      variant='rectangular'
                      width='100%'
                      height='100%'
                      sx={{
                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300')
                      }}
                    />
                  </Card>
                </Grid>
              ))}
              <NewBoardCard onNewBoardOpen={() => setNewBoardDialogOpen(true)} />
            </>
          ) : (
            <>
              {joinedBoards.length > 0 && joinedBoards.map((board) => <BoardCard key={board._id} board={board} />)}
              <NewBoardCard onNewBoardOpen={() => setNewBoardDialogOpen(true)} />
            </>
          )}
        </Grid>

        <Stack alignItems='center' direction='row' spacing={1} sx={{ mt: 4 }}>
          <PeopleAltIcon sx={{ width: 32, height: 32 }} />
          <Typography variant='h6' fontWeight={600}>
            All boards in this Workspace
          </Typography>
        </Stack>

        <Grid container spacing={2} mt={1}>
          {isLoading ? (
            <>
              {Array.from({ length: 4 }).map((_, index) => (
                <Grid xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card variant='outlined' sx={{ height: 120 }}>
                    <Skeleton
                      animation='wave'
                      variant='rectangular'
                      width='100%'
                      height='100%'
                      sx={{
                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300')
                      }}
                    />
                  </Card>
                </Grid>
              ))}
              <NewBoardCard onNewBoardOpen={() => setNewBoardDialogOpen(true)} />
            </>
          ) : (
            <>
              {otherBoards.length > 0 && otherBoards.map((board) => <BoardCard key={board._id} board={board} />)}
              <NewBoardCard onNewBoardOpen={() => setNewBoardDialogOpen(true)} />
            </>
          )}
        </Grid>

        {hasClosedBoards && <WorkspaceClosedBoards workspaceId={workspaceId!} />}
      </Box>

      <NewBoardDialog
        newBoardDialogOpen={newBoardDialogOpen}
        onNewBoardDialogClose={() => setNewBoardDialogOpen(false)}
        defaultWorkspaceId={workspaceId}
      />

      {workspace && (
        <EditWorkspaceDialog
          open={editWorkspaceOpen}
          onEditWorkspaceClose={() => setEditWorkspaceOpen(false)}
          workspace={workspace}
        />
      )}
    </Box>
  )
}
