import AppsIcon from '@mui/icons-material/Apps'
import MenuIcon from '@mui/icons-material/Menu'
import { useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import TrelloneIcon from '~/assets/trello.svg?react'
import AutoCompleteSearchBoard from '~/components/NavBar/AutoCompleteSearchBoard'
import Create from '~/components/NavBar/Create'
import MenuDrawer from '~/components/NavBar/MenuDrawer'
import ModeSelect from '~/components/NavBar/ModeSelect'
import Notifications from '~/components/NavBar/Notifications'
import Profiles from '~/components/NavBar/Profiles'
import path from '~/constants/path'

export default function NavBar() {
  const [open, setOpen] = useState(false)

  const theme = useTheme()
  const isScreenBelowMedium = useMediaQuery(theme.breakpoints.down('md'))

  const handleMenuDrawerToggle = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: (theme) => theme.trellone.navBarHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          paddingX: 2,
          overflowX: 'auto'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            size='small'
            sx={{ padding: 0, display: { xs: 'inline-flex', md: 'none' } }}
            onClick={() => handleMenuDrawerToggle(true)}
          >
            <MenuIcon />
          </IconButton>

          <IconButton
            component={Link}
            to={path.boardsList}
            size='small'
            sx={{ padding: 0, display: { xs: 'none', md: 'inline-flex' } }}
          >
            <AppsIcon />
          </IconButton>

          <Box component={Link} to={path.home} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon
              component={TrelloneIcon}
              inheritViewBox
              fontSize='small'
              sx={{ color: (theme) => theme.palette.primary.main }}
            />
            <Typography
              variant='inherit'
              sx={{ fontSize: '1.2rem', fontWeight: 600, color: (theme) => theme.palette.secondary.main }}
            >
              Trellone
            </Typography>
          </Box>

          <Box sx={{ ml: 0.5, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Create />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!isScreenBelowMedium && (
            <>
              <AutoCompleteSearchBoard />
              <ModeSelect />
            </>
          )}
          <Notifications />
          <Profiles />
        </Box>
      </Box>

      <Divider />

      <Drawer open={open} onClose={() => handleMenuDrawerToggle(false)}>
        <MenuDrawer onToggleDrawer={handleMenuDrawerToggle} />
      </Drawer>
    </>
  )
}
