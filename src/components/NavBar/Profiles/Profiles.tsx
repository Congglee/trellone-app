import Logout from '@mui/icons-material/Logout'
import Settings from '@mui/icons-material/Settings'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { useConfirm } from 'material-ui-confirm'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import path from '~/constants/path'
import { useAppSelector } from '~/lib/redux/hooks'
import { useLogoutMutation } from '~/queries/auth'

export default function Profiles() {
  const [anchorProfilesMenuElement, setAnchorProfilesMenuElement] = useState<null | HTMLElement>(null)
  const isProfilesMenuOpen = Boolean(anchorProfilesMenuElement)

  const { profile } = useAppSelector((state) => state.auth)

  const handleProfilesMenuClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorProfilesMenuElement(event.currentTarget)
  }

  const handleProfilesMenuClose = () => {
    setAnchorProfilesMenuElement(null)
  }

  const [logoutMutation] = useLogoutMutation()

  const confirmLogout = useConfirm()

  const logout = async () => {
    try {
      handleProfilesMenuClose()

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
          onClick={handleProfilesMenuClick}
          size='small'
          sx={{ padding: 0 }}
          aria-controls={isProfilesMenuOpen ? 'basic-menu-profiles' : undefined}
          aria-haspopup='true'
          aria-expanded={isProfilesMenuOpen ? 'true' : undefined}
        >
          <Avatar sx={{ width: 36, height: 36 }} alt={profile?.display_name} src={profile?.avatar} />
        </IconButton>
      </Tooltip>

      <Menu
        id='basic-menu-profiles'
        anchorEl={anchorProfilesMenuElement}
        open={isProfilesMenuOpen}
        onClose={handleProfilesMenuClose}
        onClick={handleProfilesMenuClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-profiles' }}
      >
        <MenuItem sx={{ '&:hover': { color: 'success.light' } }}>
          <Avatar sx={{ width: 28, height: 28, mr: 2 }} alt={profile?.display_name} src={profile?.avatar} />
          <span>{profile?.display_name}</span>
        </MenuItem>
        <Divider />
        <MenuItem component={Link} to={path.accountSettings}>
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
