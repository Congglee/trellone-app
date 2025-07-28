import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import { Helmet } from 'react-helmet-async'
import WorkspaceAvatar from '~/components/Workspace/WorkspaceAvatar'
import { useQueryConfig } from '~/hooks/use-query-config'
import WorkspaceBoards from '~/pages/Workspaces/BoardsList/components/WorkspaceBoards'
import { useGetWorkspacesQuery } from '~/queries/workspaces'

export default function BoardsList() {
  const queryConfig = useQueryConfig()

  const { data: workspacesData, isLoading } = useGetWorkspacesQuery(queryConfig)
  const workspaces = workspacesData?.result.workspaces || []

  return (
    <Box>
      <Helmet>
        <title>Boards | Trellone</title>
        <meta
          name='description'
          content="Organize anything, together. Trellone is a collaboration tool that organizes your projects into boards. In one glance, know what's being worked on, who's working on what, and where something is in a process"
        />
      </Helmet>

      <Typography variant='h6' sx={{ pl: 1, mb: 2.5 }}>
        Your Workspaces
      </Typography>

      {workspaces?.map((workspace) => (
        <Stack key={workspace._id} spacing={2} mb={4.5}>
          {isLoading ? (
            <Stack alignItems='center' direction='row' spacing={2} pl={1}>
              <Skeleton
                animation='wave'
                variant='circular'
                width={32}
                height={32}
                sx={{
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300')
                }}
              />
              <Skeleton
                animation='wave'
                variant='rectangular'
                width={180}
                height={24}
                sx={{
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300'),
                  borderRadius: 1
                }}
              />
            </Stack>
          ) : (
            <Stack alignItems='center' direction='row' spacing={2} pl={1}>
              <WorkspaceAvatar title={workspace.title} logo={workspace.logo} size={{ width: 32, height: 32 }} />
              <Typography variant='h6' fontWeight={600}>
                {workspace.title}
              </Typography>
            </Stack>
          )}

          <WorkspaceBoards workspace={workspace} isLoading={isLoading} />
        </Stack>
      ))}
    </Box>
  )
}
