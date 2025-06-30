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

export default function Templates() {
  const [anchorTemplatesMenuElement, setAnchorTemplatesMenuElement] = useState<null | HTMLElement>(null)
  const isTemplatesMenuOpen = Boolean(anchorTemplatesMenuElement)

  const handleTemplatesMenuClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorTemplatesMenuElement(event.currentTarget)
  }

  const handleTemplatesMenuClose = () => {
    setAnchorTemplatesMenuElement(null)
  }

  return (
    <Box>
      <Button
        color='inherit'
        id='basic-button-templates'
        aria-controls={isTemplatesMenuOpen ? 'basic-menu-templates' : undefined}
        aria-haspopup='true'
        aria-expanded={isTemplatesMenuOpen ? 'true' : undefined}
        onClick={handleTemplatesMenuClick}
        endIcon={<ExpandMoreIcon />}
      >
        Templates
      </Button>

      <Menu
        id='basic-menu-templates'
        anchorEl={anchorTemplatesMenuElement}
        open={isTemplatesMenuOpen}
        onClose={handleTemplatesMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-templates'
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
