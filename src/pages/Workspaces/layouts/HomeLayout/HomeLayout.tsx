import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import { Outlet } from 'react-router-dom'
import NavBar from '~/components/NavBar'
import NavigationMenu from '~/pages/Workspaces/components/NavigationMenu'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'

export default function HomeLayout() {
  const theme = useTheme()
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Container disableGutters maxWidth={false}>
      <NavBar />
      <Container maxWidth='lg'>
        <Stack direction={isMobileScreen ? 'column' : 'row'} useFlexGap={true} spacing={2}>
          <NavigationMenu />
          <Box
            sx={{
              py: { xs: 0, sm: 5 },
              overflowY: 'auto',
              maxHeight: (theme) => `calc(100vh - ${theme.trellone.navBarHeight})`,
              width: '100%',
              maxWidth: { xs: '100%', sm: '70vw' }
            }}
          >
            <Outlet />
          </Box>
        </Stack>
      </Container>
    </Container>
  )
}
