import DashboardIcon from '@mui/icons-material/Dashboard'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import { SxProps } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import NewBoardDialog from '~/components/Dialog/NewBoardDialog'

const MENU_ITEM_STYLES = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '350px',
  whiteSpace: 'pre-line'
}

interface CreateProps {
  styles?: SxProps
}

export default function Create({ styles }: CreateProps) {
  const [anchorCreateMenuElement, setAnchorCreateMenuElement] = useState<null | HTMLElement>(null)
  const [newBoardOpen, setNewBoardOpen] = useState(false)

  const isCreateMenuOpen = Boolean(anchorCreateMenuElement)

  const handleCreateMenuClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorCreateMenuElement(event.currentTarget)
  }

  const handleCreateMenuClose = () => {
    setAnchorCreateMenuElement(null)
  }

  const handleNewBoardOpen = () => {
    setNewBoardOpen(true)
    handleCreateMenuClose()
  }

  const onNewBoardClose = () => {
    setNewBoardOpen(false)
  }

  return (
    <Box sx={styles}>
      <Button
        fullWidth
        variant='contained'
        id='basic-button-create'
        aria-controls={isCreateMenuOpen ? 'basic-menu-create' : undefined}
        aria-haspopup='true'
        aria-expanded={isCreateMenuOpen ? 'true' : undefined}
        onClick={handleCreateMenuClick}
        startIcon={<LibraryAddIcon />}
      >
        Create
      </Button>

      <Menu
        id='basic-menu-create'
        anchorEl={anchorCreateMenuElement}
        open={isCreateMenuOpen}
        onClose={handleCreateMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-create'
        }}
      >
        <MenuItem sx={MENU_ITEM_STYLES}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <WorkspacesIcon />
            <Typography variant='subtitle1'>Create Workspace</Typography>
          </div>
          <Typography variant='caption'>
            A Workspace is a group of boards and people. Use it to organize your company, side hustle, family, or
            friends.{' '}
          </Typography>
        </MenuItem>

        <MenuItem onClick={handleNewBoardOpen} sx={MENU_ITEM_STYLES}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <DashboardIcon />
            <Typography variant='subtitle1'>Create Board</Typography>
          </div>
          <Typography variant='caption'>
            A board is made up of cards ordered on columns. Use it to manage projects, track information, or organize
            anything.
          </Typography>
        </MenuItem>
      </Menu>

      {newBoardOpen && <NewBoardDialog open={newBoardOpen} onNewBoardClose={onNewBoardClose} />}
    </Box>
  )
}
