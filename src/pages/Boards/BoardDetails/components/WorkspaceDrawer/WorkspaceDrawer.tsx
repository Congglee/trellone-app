import AddIcon from '@mui/icons-material/Add'
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
import { Link } from 'react-router-dom'
import DrawerHeader from '~/components/DrawerHeader'
import WorkspaceAvatar from '~/components/Workspace/WorkspaceAvatar'
import path from '~/constants/path'
import { WorkspaceResType } from '~/schemas/workspace.schema'

interface WorkspaceDrawerProps {
  open: boolean
  onOpen: (open: boolean) => void
  boardId?: string
  workspace?: WorkspaceResType['result']
}

export default function WorkspaceDrawer({ open, onOpen, boardId, workspace }: WorkspaceDrawerProps) {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const boards = workspace?.boards || []

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
          <WorkspaceAvatar logo={workspace?.logo} title={workspace?.title || ''} size={{ width: 30, height: 30 }} />
          <Typography variant='subtitle1'>{workspace?.title}</Typography>
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

        <ListItem
          disablePadding
          secondaryAction={
            <IconButton edge='end' aria-label='add' size='small' sx={{ borderRadius: 0.5 }}>
              <AddIcon />
            </IconButton>
          }
        >
          <ListItemButton component={Link} to={path.workspaceMembers.replace(':workspaceId', workspace?._id as string)}>
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
        {boards.map((board) => (
          <ListItem key={board._id} disablePadding>
            <ListItemButton
              component={Link}
              to={`/boards/${board._id}`}
              selected={boardId === board._id}
              sx={{
                '&.Mui-selected': {
                  color: (theme) => (theme.palette.mode === 'dark' ? 'primary.contrastText' : 'primary.contrastText')
                }
              }}
            >
              <ListItemIcon>
                <Avatar sx={{ width: 24, height: 24 }} variant='rounded' src={board?.cover_photo}>
                  {board?.title.charAt(0)}
                </Avatar>
              </ListItemIcon>
              <ListItemText>{board?.title}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}
