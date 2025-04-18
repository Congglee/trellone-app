import { styled } from '@mui/material/styles'

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'workspaceDrawerOpen' && prop !== 'boardDrawerOpen'
})<{ workspaceDrawerOpen?: boolean; boardDrawerOpen?: boolean }>(({ theme, workspaceDrawerOpen, boardDrawerOpen }) => ({
  flexGrow: 1,

  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),

  marginLeft: `-${theme.trellone.workspaceDrawerWidth}`,
  ...(workspaceDrawerOpen && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }),

  marginRight: `-${theme.trellone.boardDrawerWidth}`,
  ...(boardDrawerOpen && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: 0
  }),

  position: 'relative'
}))

export default Main
