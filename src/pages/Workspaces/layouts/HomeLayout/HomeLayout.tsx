import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import { Outlet } from 'react-router-dom'
import NavBar from '~/components/NavBar'
import NavigationMenu from '~/pages/Workspaces/components/NavigationMenu'

export default function HomeLayout() {
  return (
    <Container disableGutters maxWidth={false}>
      <NavBar />
      <Container maxWidth='lg'>
        <Stack direction='row' useFlexGap={true} spacing={2}>
          <NavigationMenu />
          <Box
            py={5}
            sx={{
              overflowY: 'auto',
              maxHeight: (theme) => `calc(100vh - ${theme.trellone.navBarHeight})`,
              width: '100%',
              maxWidth: { sm: '70vw' }
            }}
          >
            <Outlet />
          </Box>
        </Stack>
      </Container>
    </Container>
  )
}
