import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupsIcon from '@mui/icons-material/Groups'
import SettingsIcon from '@mui/icons-material/Settings'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import WorkspaceAvatar from '~/components/Workspace/WorkspaceAvatar'
import path from '~/constants/path'
import { useGetWorkspaceQuery } from '~/queries/workspaces'

interface WorkspaceSidebarProps {
  workspaceId?: string
}

// Helper function to determine if a specific menu item should be active
const isMenuItemActive = (workspaceId: string, menuType: string, pathname: string) => {
  switch (menuType) {
    case 'boards': {
      const workspaceBoardsPath = path.workspaceBoardsList.replace(':workspaceId', workspaceId)
      return pathname === workspaceBoardsPath
    }

    case 'members': {
      const workspaceMembersPath = path.workspaceMembers.replace(':workspaceId', workspaceId)
      const workspaceGuestsPath = path.workspaceGuests.replace(':workspaceId', workspaceId)
      return pathname === workspaceMembersPath || pathname === workspaceGuestsPath
    }

    case 'settings': {
      const workspaceSettingsPath = path.workspaceSettings.replace(':workspaceId', workspaceId)
      return pathname === workspaceSettingsPath
    }

    default:
      return false
  }
}

export default function WorkspaceSidebar({ workspaceId }: WorkspaceSidebarProps) {
  const { data: workspaceData } = useGetWorkspaceQuery(workspaceId!)
  const workspace = workspaceData?.result
  const boards = workspace?.boards || []

  return (
    <Box
      sx={{
        width: (theme) => theme.trellone.workspaceDrawerWidth,
        height: (theme) => `calc(100vh - ${theme.trellone.navBarHeight})`,
        overflowY: 'auto',
        flexShrink: 0,
        boxSizing: 'border-box',
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 70%)' : 'rgb(255 255 255 / 70%)'),
        backdropFilter: 'blur(16px)'
      }}
    >
      <Stack sx={{ p: 2, height: '49px', justifyContent: 'center' }}>
        <Stack gap={1} alignItems='center' direction='row'>
          <WorkspaceAvatar logo={workspace?.logo} title={workspace?.title || ''} size={{ width: 30, height: 30 }} />
          <Typography variant='subtitle1'>{workspace?.title}</Typography>
        </Stack>
      </Stack>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              '&.Mui-selected': {
                color: (theme) => (theme.palette.mode === 'dark' ? 'primary.contrastText' : 'primary.contrastText')
              }
            }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText>Boards</ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to={path.workspaceMembers.replace(':workspaceId', workspace?._id as string)}
            selected={isMenuItemActive(workspace?._id as string, 'members', location.pathname)}
            sx={{
              '&.Mui-selected': {
                color: (theme) => (theme.palette.mode === 'dark' ? 'primary.contrastText' : 'primary.contrastText')
              }
            }}
          >
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText>Members</ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            sx={{
              '&.Mui-selected': {
                color: (theme) => (theme.palette.mode === 'dark' ? 'primary.contrastText' : 'primary.contrastText')
              }
            }}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />

      <Typography variant='subtitle1' p={2} pb={1}>
        Your Boards
      </Typography>

      {boards.length > 0 && (
        <List>
          {boards.map((board) => (
            <ListItem key={board._id} disablePadding>
              <ListItemButton component={Link} to={`/boards/${board._id}`}>
                <ListItemIcon>
                  <Avatar sx={{ width: 24, height: 24 }} variant='rounded' src={board?.cover_photo}>
                    {board?.title.charAt(0)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText secondary={board?.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      {boards.length === 0 && (
        <Box
          sx={{
            mx: 2,
            mb: 2,
            p: 3,
            borderRadius: 1,
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
            border: (theme) =>
              `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
            textAlign: 'center'
          }}
        >
          <Stack alignItems='center' spacing={2}>
            <ViewKanbanIcon
              sx={{
                fontSize: 48,
                color: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)')
              }}
            />
            <Stack spacing={1}>
              <Typography
                variant='body2'
                sx={{
                  color: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'),
                  fontWeight: 500
                }}
              >
                No boards yet
              </Typography>
              <Typography
                variant='caption'
                sx={{
                  color: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'),
                  lineHeight: 1.4
                }}
              >
                Create your first board to get started
              </Typography>
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
