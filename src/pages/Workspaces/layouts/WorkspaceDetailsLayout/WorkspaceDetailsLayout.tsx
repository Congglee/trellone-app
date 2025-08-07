import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { Outlet, useParams } from 'react-router-dom'
import NavBar from '~/components/NavBar'
import WorkspaceSidebar from '~/pages/Workspaces/components/WorkspaceSidebar'

export default function WorkspaceDetailsLayout() {
  const { workspaceId } = useParams()

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
