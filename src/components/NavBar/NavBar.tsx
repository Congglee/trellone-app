import AppsIcon from '@mui/icons-material/Apps'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'
import SvgIcon from '@mui/material/SvgIcon'
import Tooltip from '@mui/material/Tooltip'
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
import Recent from '~/components/NavBar/Recent'
import Starred from '~/components/NavBar/Starred'
import Templates from '~/components/NavBar/Templates'
import Workspaces from '~/components/NavBar/Workspaces'
import path from '~/constants/path'

export default function NavBar() {
  const [open, setOpen] = useState(false)

  const theme = useTheme()
  const isScreenBelowMedium = useMediaQuery(theme.breakpoints.down('md'))

  const toggleDrawer = (newOpen: boolean) => {
    if (isScreenBelowMedium) {
      setOpen(newOpen)
    }
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
          <IconButton size='small' sx={{ padding: 0 }} onClick={() => toggleDrawer(true)}>
            <AppsIcon />
          </IconButton>
          <Link to={path.home}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
          </Link>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Workspaces />
            <Recent />
            <Starred />
            <Templates />
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
          <Tooltip title='Help'>
            <HelpOutlineIcon sx={{ cursor: 'pointer' }} />
          </Tooltip>
          <Profiles />
        </Box>
      </Box>
      <Divider />
      <Drawer open={open} onClose={() => toggleDrawer(false)}>
        <MenuDrawer onToggleDrawer={toggleDrawer} />
      </Drawer>
    </>
  )
}
