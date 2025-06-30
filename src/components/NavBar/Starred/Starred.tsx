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

export default function Starred() {
  const [anchorStarredMenuElement, setAnchorStarredMenuElement] = useState<null | HTMLElement>(null)
  const isStarredMenuOpen = Boolean(anchorStarredMenuElement)

  const handleStarredMenuClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorStarredMenuElement(event.currentTarget)
  }

  const handleStarredMenuClose = () => {
    setAnchorStarredMenuElement(null)
  }

  return (
    <Box>
      <Button
        color='inherit'
        id='basic-button-starred'
        aria-controls={isStarredMenuOpen ? 'basic-menu-starred' : undefined}
        aria-haspopup='true'
        aria-expanded={isStarredMenuOpen ? 'true' : undefined}
        onClick={handleStarredMenuClick}
        endIcon={<ExpandMoreIcon />}
      >
        Starred
      </Button>

      <Menu
        id='basic-menu-starred'
        anchorEl={anchorStarredMenuElement}
        open={isStarredMenuOpen}
        onClose={handleStarredMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-starred'
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
