import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import TrelloneIcon from '~/assets/trello.svg?react'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import Button from '@mui/material/Button'
import StarBorder from '@mui/icons-material/StarBorder'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import Cloud from '@mui/icons-material/Cloud'
import Check from '@mui/icons-material/Check'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import HistoryIcon from '@mui/icons-material/History'
import ModeSelect from '~/components/ModeSelect'

interface MenuDrawerProps {
  onToggleDrawer: (open: boolean) => void
}

export default function MenuDrawer({ onToggleDrawer }: MenuDrawerProps) {
  // Separate state for each section
  const [openWorkspaces, setOpenWorkspaces] = useState(false)
  const [openRecent, setOpenRecent] = useState(false)
  const [openStarred, setOpenStarred] = useState(false)
  const [openTemplates, setOpenTemplates] = useState(false)

  // Handle click for each section
  const handleWorkspacesClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent drawer from closing
    setOpenWorkspaces(!openWorkspaces)
  }

  const handleRecentClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent drawer from closing
    setOpenRecent(!openRecent)
  }

  const handleStarredClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent drawer from closing
    setOpenStarred(!openStarred)
  }

  const handleTemplatesClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent drawer from closing
    setOpenTemplates(!openTemplates)
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

        {/* Workspaces Section */}
        <ListItemButton onClick={handleWorkspacesClick}>
          <ListItemIcon>
            <WorkspacesIcon />
          </ListItemIcon>
          <ListItemText primary='Workspaces' />
          {openWorkspaces ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openWorkspaces} timeout='auto' unmountOnExit>
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

        {/* Recent Section */}
        <ListItemButton onClick={handleRecentClick}>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary='Recent' />
          {openRecent ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openRecent} timeout='auto' unmountOnExit>
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

        {/* Starred Section */}
        <ListItemButton onClick={handleStarredClick}>
          <ListItemIcon>
            <StarBorder />
          </ListItemIcon>
          <ListItemText primary='Starred' />
          {openStarred ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openStarred} timeout='auto' unmountOnExit>
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

        {/* Templates Section */}
        <ListItemButton onClick={handleTemplatesClick}>
          <ListItemIcon>
            <ContentCopy />
          </ListItemIcon>
          <ListItemText primary='Templates' />
          {openTemplates ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openTemplates} timeout='auto' unmountOnExit>
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

        {/* Create Button */}
        <ListItem sx={{ mt: 1 }}>
          <Button variant='contained' fullWidth startIcon={<LibraryAddIcon />}>
            Create
          </Button>
        </ListItem>

        <ListItem>
          <ModeSelect styles={{ minWidth: '100%' }} />
        </ListItem>
      </List>
    </Box>
  )
}
