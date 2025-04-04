import Check from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import Cloud from '@mui/icons-material/Cloud'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentPaste from '@mui/icons-material/ContentPaste'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import HistoryIcon from '@mui/icons-material/History'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import StarBorder from '@mui/icons-material/StarBorder'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import { IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import TrelloneIcon from '~/assets/trello.svg?react'
import ModeSelect from '~/components/ModeSelect'
import SearchBar from '~/components/NavBar/SearchBar'

interface MenuDrawerProps {
  onToggleDrawer: (open: boolean) => void
}

export default function MenuDrawer({ onToggleDrawer }: MenuDrawerProps) {
  // Separate state for each section
  const [workspacesOpen, setWorkspacesOpen] = useState(false)
  const [recentOpen, setRecentOpen] = useState(false)
  const [starredOpen, setStarredOpen] = useState(false)
  const [templatesOpen, setTemplatesOpen] = useState(false)

  // Handle click for each section
  const handleWorkspacesClick = (event: React.MouseEvent) => {
    event.stopPropagation() // Prevent drawer from closing
    setWorkspacesOpen(!workspacesOpen)
  }

  const handleRecentClick = (event: React.MouseEvent) => {
    event.stopPropagation() // Prevent drawer from closing
    setRecentOpen(!recentOpen)
  }

  const handleStarredClick = (event: React.MouseEvent) => {
    event.stopPropagation() // Prevent drawer from closing
    setStarredOpen(!starredOpen)
  }

  const handleTemplatesClick = (event: React.MouseEvent) => {
    event.stopPropagation() // Prevent drawer from closing
    setTemplatesOpen(!templatesOpen)
  }

  return (
    <Box
      sx={{
        width: { xs: 250, sm: 350 },
        height: '100%',
        display: 'grid'
      }}
      role='presentation'
      // onClick={(e) => {
      //   e.stopPropagation()
      //   onToggleDrawer(false)
      // }}
    >
      <List
        sx={{ width: '100%', height: '100%', bgcolor: 'background.paper' }}
        component='nav'
        aria-labelledby='nested-list-subheader'
        subheader={
          <ListSubheader component='div' id='nested-list-subheader' sx={{ py: 1.5 }}>
            <Link to='/' onClick={(e) => e.stopPropagation()}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <SvgIcon
                  component={TrelloneIcon}
                  inheritViewBox
                  fontSize='small'
                  sx={{ color: (theme) => theme.palette.primary.main }}
                />
                <Typography
                  variant='body1'
                  sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: (theme) => theme.palette.secondary.main }}
                >
                  Trellone
                </Typography>
              </Box>
            </Link>
            <IconButton
              size='small'
              sx={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)'
              }}
              onClick={() => onToggleDrawer(false)}
            >
              <CloseIcon />
            </IconButton>
          </ListSubheader>
        }
      >
        <Divider sx={{ my: 0.25 }} />
        <ListItemButton onClick={handleWorkspacesClick}>
          <ListItemIcon>
            <WorkspacesIcon />
          </ListItemIcon>
          <ListItemText primary='Workspaces' />
          {workspacesOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={workspacesOpen} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <ContentCut fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Project Alpha' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <ContentCopy fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Team Workspace' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <ContentPaste fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Personal Tasks' />
            </ListItemButton>
            <Divider />
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <Cloud fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Create New Workspace' />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton onClick={handleRecentClick}>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary='Recent' />
          {recentOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={recentOpen} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText inset primary='Marketing Campaign' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText inset primary='Website Redesign' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText inset primary='Product Launch' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <Check />
              </ListItemIcon>
              <ListItemText primary='Sprint Planning' />
            </ListItemButton>
            <Divider />
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary='View All Recent Boards' />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton onClick={handleStarredClick}>
          <ListItemIcon>
            <StarBorder />
          </ListItemIcon>
          <ListItemText primary='Starred' />
          {starredOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={starredOpen} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText inset primary='Important Project' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText inset primary='Client Dashboard' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText inset primary='Development Roadmap' />
            </ListItemButton>
            <Divider />
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary='View All Starred Boards' />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton onClick={handleTemplatesClick}>
          <ListItemIcon>
            <ContentCopy />
          </ListItemIcon>
          <ListItemText primary='Templates' />
          {templatesOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={templatesOpen} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText inset primary='Project Management' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText inset primary='Kanban Template' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText inset primary='Remote Team Hub' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <Check />
              </ListItemIcon>
              <ListItemText primary='Simple Project Board' />
            </ListItemButton>
            <Divider />
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary='Browse All Templates' />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItem sx={{ mt: 1 }}>
          <Button variant='contained' fullWidth startIcon={<LibraryAddIcon />}>
            Create
          </Button>
        </ListItem>
        <ListItem>
          <ModeSelect styles={{ minWidth: '100%' }} />
        </ListItem>
        <ListItem>
          <SearchBar styles={{ minWidth: '100%' }} />
        </ListItem>
      </List>
    </Box>
  )
}
