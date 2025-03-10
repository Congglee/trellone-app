import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'

interface AppBarProps extends MuiAppBarProps {
  workspaceDrawerOpen?: boolean
  boardDrawerOpen?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'workspaceDrawerOpen' && prop !== 'boardDrawerOpen'
})<AppBarProps>(({ theme, workspaceDrawerOpen, boardDrawerOpen }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),

  ...(workspaceDrawerOpen && {
    width: `calc(100% - ${theme.trellone.workspaceDrawerWidth})`,
    marginLeft: theme.trellone.workspaceDrawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  }),

  ...(boardDrawerOpen && {
    width: workspaceDrawerOpen
      ? `calc(100% - ${theme.trellone.workspaceDrawerWidth} - ${theme.trellone.boardDrawerWidth})`
      : `calc(100% - ${theme.trellone.boardDrawerWidth})`,
    marginRight: theme.trellone.boardDrawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

export default AppBar
