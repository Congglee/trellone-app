import Drawer from '@mui/material/Drawer'
import DrawerHeader from '~/components/DrawerHeader'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupsIcon from '@mui/icons-material/Groups'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
import ChangeBackgroundDrawer from '~/pages/Boards/BoardDetails/components/ChangeBackgroundDrawer'

interface BoardDrawerProps {
  open: boolean
  onOpen: (open: boolean) => void
  totalMembers: number
}

export default function BoardDrawer({ open, onOpen, totalMembers }: BoardDrawerProps) {
  const theme = useTheme()

  const [changeBackgroundDrawer, setChangeBackgroundDrawer] = useState(false)

  const onOpenChangeBackgroundDrawer = (open: boolean) => {
    setChangeBackgroundDrawer(open)
  }

  return (
    <Drawer
      sx={{
        width: theme.trellone.boardDrawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: theme.trellone.boardDrawerWidth,
          boxSizing: 'border-box',
          top: 'auto',
          height: `calc(100% - ${theme.trellone.navBarHeight})`
        }
      }}
      variant='persistent'
      anchor='right'
      open={open}
    >
      <DrawerHeader sx={{ justifyContent: 'space-between', minHeight: `${theme.trellone.navBarHeight}px!important` }}>
        <IconButton color='inherit' onClick={() => onOpen(false)}>
          {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>

        <Typography variant='subtitle1'>Menu</Typography>
        <Box sx={{ width: 40, height: 40 }} />
      </DrawerHeader>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText secondary='About this board' />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => onOpenChangeBackgroundDrawer(true)}>
            <ListItemIcon>
              <FavoriteBorderIcon />
            </ListItemIcon>
            <ListItemText secondary='Change background' />
          </ListItemButton>
        </ListItem>

        <ChangeBackgroundDrawer open={changeBackgroundDrawer} onOpen={onOpenChangeBackgroundDrawer} />

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText secondary={`Members (${totalMembers})`} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText secondary='Delete this board' />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  )
}
