import EditIcon from '@mui/icons-material/Edit'
import PersonIcon from '@mui/icons-material/Person'
import PublicIcon from '@mui/icons-material/Public'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Navigate, useParams } from 'react-router-dom'
import NewBoardDialog from '~/components/Dialog/NewBoardDialog'
import WorkspaceAvatar from '~/components/Workspace/WorkspaceAvatar'
import path from '~/constants/path'
import { WorkspacePermission } from '~/constants/permissions'
import { useWorkspacePermission } from '~/hooks/use-permissions'
import BoardCard from '~/pages/Workspaces/components/BoardCard'
import NewBoardCard from '~/pages/Workspaces/components/NewBoardCard'
import WorkspaceLogo from '~/pages/Workspaces/components/WorkspaceLogo'
import EditWorkspaceDialog from '~/pages/Workspaces/pages/WorkspaceHome/components/EditWorkspaceDialog'

import { useGetWorkspaceQuery } from '~/queries/workspaces'

export default function WorkspaceHome() {
  const { workspaceId } = useParams()

  const [newBoardOpen, setNewBoardOpen] = useState(false)
  const [editWorkspaceOpen, setEditWorkspaceOpen] = useState(false)

  const { data: workspaceData, isLoading } = useGetWorkspaceQuery(workspaceId!)
  const workspace = workspaceData?.result
  const boards = workspace?.boards || []

  const hasClosedBoards = boards.some((board) => board._destroy)

  const { hasPermission } = useWorkspacePermission(workspace)

  if (!workspace && !isLoading) {
    return <Navigate to={path.boardsList} />
  }

  return (
    <Box>
      <Helmet>
        <title>{workspace?.title ? `${workspace.title} | Trellone` : 'Workspace | Trellone'}</title>
        <meta
          name='description'
          content='Organize anything, together. Trellone is a collaboration tool that organizes your projects into boards.'
        />
      </Helmet>

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
                  {workspace?.type}
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
                  <Card variant='outlined' sx={{ height: 100 }}>
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
              <NewBoardCard onNewBoardOpen={() => setNewBoardOpen(true)} />
            </>
          ) : (
            <>
              {boards.length > 0 && boards.map((board) => <BoardCard key={board._id} board={board} />)}
              <NewBoardCard onNewBoardOpen={() => setNewBoardOpen(true)} />
            </>
          )}
        </Grid>

        {hasClosedBoards && (
          <Box sx={{ mt: 6 }}>
            <Button
              variant='outlined'
              startIcon={<VisibilityOffIcon />}
              onClick={() => console.log('View all closed boards clicked')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                color: (theme) => (theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2'),
                borderColor: (theme) => (theme.palette.mode === 'dark' ? '#525252' : '#e0e0e0'),
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'transparent' : '#fafafa'),
                '&:hover': {
                  borderColor: (theme) => theme.palette.primary.main,
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#33485D' : '#e3f2fd'),
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              View closed boards
            </Button>
          </Box>
        )}
      </Box>

      <NewBoardDialog
        open={newBoardOpen}
        onNewBoardClose={() => setNewBoardOpen(false)}
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
