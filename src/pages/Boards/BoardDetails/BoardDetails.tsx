import { useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import DrawerHeader from '~/components/DrawerHeader'
import Main from '~/components/Main'
import NavBar from '~/components/NavBar'
import BoardBar from '~/pages/Boards/components/BoardBar'
import BoardDrawer from '~/pages/Boards/components/BoardDrawer'
import WorkspaceDrawer from '~/pages/Boards/components/WorkspaceDrawer'

export default function BoardDetails() {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const isScreenBelowMedium = useMediaQuery(theme.breakpoints.down('md'))

  const [workspaceDrawerOpen, setWorkspaceDrawerOpen] = useState(true)
  const [boardDrawerOpen, setBoardDrawerOpen] = useState(false)

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <NavBar />
      <Box
        sx={{
          position: 'relative',
          backgroundImage: 'url(https://images6.alphacoders.com/138/thumbbig-1386838.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex'
        }}
      >
        {isDarkMode && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              mixBlendMode: 'multiply'
            }}
          />
        )}
        <Box sx={{ display: 'flex' }}>
          <WorkspaceDrawer open={workspaceDrawerOpen} onOpen={setWorkspaceDrawerOpen} />
          <BoardBar
            workspaceDrawerOpen={workspaceDrawerOpen}
            onWorkspaceDrawerOpen={setWorkspaceDrawerOpen}
            boardDrawerOpen={boardDrawerOpen}
            onBoardDrawerOpen={setBoardDrawerOpen}
          />
          <Main
            workspaceDrawerOpen={workspaceDrawerOpen}
            boardDrawerOpen={boardDrawerOpen}
            sx={{
              overflowX: 'auto',
              height: theme.trellone.boardContentHeight
            }}
          >
            <DrawerHeader />
            {isScreenBelowMedium && <DrawerHeader />}
            <Typography paragraph sx={{ p: '10px' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices
              mi tempus imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis
              tellus id interdum velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing.
              Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
              Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis imperdiet massa
              tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget arcu dictum varius duis at
              consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie
              ac.
            </Typography>
          </Main>
          <BoardDrawer open={boardDrawerOpen} onOpen={setBoardDrawerOpen} />
        </Box>
      </Box>
    </Container>
  )
}
