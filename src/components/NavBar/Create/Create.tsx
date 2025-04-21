import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import Typography from '@mui/material/Typography'
import DashboardIcon from '@mui/icons-material/Dashboard'
import NewBoardDialog from '~/components/Dialog/NewBoardDialog'
import { SxProps } from '@mui/material'

const menuItemStyles = {
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [newBoardOpen, setNewBoardOpen] = useState(false)

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNewBoardOpen = () => {
    setNewBoardOpen(true)
    handleClose()
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
        aria-controls={open ? 'basic-menu-create' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        startIcon={<LibraryAddIcon />}
      >
        Create
      </Button>
      <Menu
        id='basic-menu-create'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-create'
        }}
      >
        <MenuItem sx={menuItemStyles}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <WorkspacesIcon />
            <Typography variant='subtitle1'>Create Workspace</Typography>
          </div>
          <Typography variant='caption'>
            A Workspace is a group of boards and people. Use it to organize your company, side hustle, family, or
            friends.{' '}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleNewBoardOpen} sx={menuItemStyles}>
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
