import Check from '@mui/icons-material/Check'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'

export default function Recent() {
  const [anchorRecentMenuElement, setAnchorRecentMenuElement] = useState<null | HTMLElement>(null)
  const isRecentMenuOpen = Boolean(anchorRecentMenuElement)

  const handleRecentMenuClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorRecentMenuElement(event.currentTarget)
  }

  const handleRecentMenuClose = () => {
    setAnchorRecentMenuElement(null)
  }

  return (
    <Box>
      <Button
        color='inherit'
        id='basic-button-recent'
        aria-controls={isRecentMenuOpen ? 'basic-menu-recent' : undefined}
        aria-haspopup='true'
        aria-expanded={isRecentMenuOpen ? 'true' : undefined}
        onClick={handleRecentMenuClick}
        endIcon={<ExpandMoreIcon />}
      >
        Recent
      </Button>

      <Menu
        id='basic-menu-recent'
        anchorEl={anchorRecentMenuElement}
        open={isRecentMenuOpen}
        onClose={handleRecentMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-recent'
        }}
      >
        <MenuItem>
          <ListItemText inset>Single</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText inset>1.15</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText inset>Double</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Check />
          </ListItemIcon>
          Custom: 1.2
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText>Add space before paragraph</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText>Add space after paragraph</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText>Custom spacing...</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}
