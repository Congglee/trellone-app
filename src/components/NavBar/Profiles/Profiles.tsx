import { useState } from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import { Link } from 'react-router-dom'
import Divider from '@mui/material/Divider'
import Logout from '@mui/icons-material/Logout'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import { useLogoutMutation } from '~/queries/auth'
import { useConfirm } from 'material-ui-confirm'
import { useAppSelector } from '~/lib/redux/hooks'
import path from '~/constants/path'

export default function Profiles() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const { profile } = useAppSelector((state) => state.auth)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const [logoutMutation] = useLogoutMutation()

  const confirmLogout = useConfirm()

  const logout = async () => {
    try {
      handleClose()

      const { confirmed } = await confirmLogout({
        title: 'Are you sure you want to logout?',
        confirmationText: 'Confirm',
        cancellationText: 'Cancel'
      })

      if (confirmed) {
        await logoutMutation()
      }
    } catch (error: any) {
      console.log('Logout canceled or failed', error)
    }
  }

  return (
    <Box>
      <Tooltip title='Account settings' placement='bottom-start'>
        <IconButton
          onClick={handleClick}
          size='small'
          sx={{ padding: 0 }}
          aria-controls={open ? 'basic-menu-profiles' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={{ width: 36, height: 36 }} alt={profile?.display_name} src={profile?.avatar} />
        </IconButton>
      </Tooltip>
      <Menu
        id='basic-menu-profiles'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-profiles' }}
      >
        <Link to={path.accountSettings} style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem sx={{ '&:hover': { color: 'success.light' } }}>
            <Avatar sx={{ width: 28, height: 28, mr: 2 }} alt={profile?.display_name} src={profile?.avatar} />
            <span>{profile?.display_name}</span>
          </MenuItem>
        </Link>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize='small' />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize='small' />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem
          onClick={logout}
          sx={{
            '&:hover': {
              color: 'warning.dark',
              '& .logout-icon': { color: 'warning.dark' }
            }
          }}
        >
          <ListItemIcon>
            <Logout className='logout-icon' fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}
