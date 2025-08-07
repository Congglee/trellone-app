import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupsIcon from '@mui/icons-material/Groups'
import SettingsIcon from '@mui/icons-material/Settings'
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
import { useGetWorkspaceQuery } from '~/queries/workspaces'

interface WorkspaceSidebarProps {
  workspaceId?: string
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
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText secondary='Boards' />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText secondary='Members' />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
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
        {boards?.length > 0 &&
          boards.map((board) => (
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
    </Box>
  )
}
