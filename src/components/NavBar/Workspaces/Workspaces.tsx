import Cloud from '@mui/icons-material/Cloud'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentPaste from '@mui/icons-material/ContentPaste'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

export default function Workspaces() {
  const [anchorWorkspacesMenuElement, setAnchorWorkspacesMenuElement] = useState<null | HTMLElement>(null)
  const isWorkspacesMenuOpen = Boolean(anchorWorkspacesMenuElement)

  const handleWorkspacesMenuClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorWorkspacesMenuElement(event.currentTarget)
  }

  const handleWorkspacesMenuClose = () => {
    setAnchorWorkspacesMenuElement(null)
  }

  return (
    <Box>
      <Button
        color='inherit'
        id='basic-button-workspaces'
        aria-controls={isWorkspacesMenuOpen ? 'basic-menu-workspaces' : undefined}
        aria-haspopup='true'
        aria-expanded={isWorkspacesMenuOpen ? 'true' : undefined}
        onClick={handleWorkspacesMenuClick}
        endIcon={<ExpandMoreIcon />}
      >
        Workspaces
      </Button>

      <Menu
        id='basic-menu-workspaces'
        anchorEl={anchorWorkspacesMenuElement}
        open={isWorkspacesMenuOpen}
        onClose={handleWorkspacesMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-workspaces'
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <ContentCut fontSize='small' />
          </ListItemIcon>
          <ListItemText>Cut</ListItemText>
          <Typography variant='body2' color='text.secondary'>
            ⌘X
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ContentCopy fontSize='small' />
          </ListItemIcon>
          <ListItemText>Copy</ListItemText>
          <Typography variant='body2' color='text.secondary'>
            ⌘C
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ContentPaste fontSize='small' />
          </ListItemIcon>
          <ListItemText>Paste</ListItemText>
          <Typography variant='body2' color='text.secondary'>
            ⌘V
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <Cloud fontSize='small' />
          </ListItemIcon>
          <ListItemText>Web Clipboard</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}
