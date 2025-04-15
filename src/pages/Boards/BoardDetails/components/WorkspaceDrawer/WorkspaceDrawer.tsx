import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupsIcon from '@mui/icons-material/Groups'
import SettingsIcon from '@mui/icons-material/Settings'
import { useTheme } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import DrawerHeader from '~/components/DrawerHeader'
import WorkspaceAvatar from '~/components/Workspace/WorkspaceAvatar'
import { mockBoardsList } from '~/constants/mock-data'

interface WorkspaceDrawerProps {
  open: boolean
  onOpen: (open: boolean) => void
}

export default function WorkspaceDrawer({ open, onOpen }: WorkspaceDrawerProps) {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  return (
    <Drawer
      sx={{
        width: theme.trellone.workspaceDrawerWidth,
        flexShrink: 0,
        '& .MuiPaper-root': {
          backgroundColor: isDarkMode ? 'rgb(0 0 0 / 70%)' : 'rgb(255 255 255 / 70%)'
        },
        '& .MuiDrawer-paper': {
          backdropFilter: 'blur(16px)',
          width: theme.trellone.workspaceDrawerWidth,
          boxSizing: 'border-box',
          top: 'auto',
          height: `calc(100% - ${theme.trellone.navBarHeight})`
        }
      }}
      variant='persistent'
      anchor='left'
      open={open}
    >
      <DrawerHeader sx={{ justifyContent: 'space-between', minHeight: '49px!important' }}>
        <Stack ml={1} gap={1} alignItems='center' direction='row'>
          <WorkspaceAvatar workspaceName='My Project' avatarSize={{ width: 30, height: 30 }} />
          <Typography variant='subtitle1'>My Project</Typography>
        </Stack>
        <IconButton color='inherit' onClick={() => onOpen(false)}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => {}}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText secondary='Boards' />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => {}}>
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText secondary='Members' />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => {}}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText secondary='Workspace Settings' />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <Typography variant='subtitle1' p={2} pb={1}>
        Your Boards
      </Typography>
      <List>
        {mockBoardsList.map((board) => (
          <ListItem key={board._id} disablePadding>
            <ListItemButton onClick={() => {}}>
              <ListItemIcon>
                <Avatar sx={{ width: 24, height: 24 }} variant='square' src={board.cover_photo} />
              </ListItemIcon>
              <ListItemText secondary={board.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}
