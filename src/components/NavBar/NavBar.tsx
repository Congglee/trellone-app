import AppsIcon from '@mui/icons-material/Apps'
import CloseIcon from '@mui/icons-material/Close'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import SearchIcon from '@mui/icons-material/Search'
import { alpha, useMediaQuery } from '@mui/material'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import TrelloneIcon from '~/assets/trello.svg?react'
import ModeSelect from '~/components/ModeSelect'
import MenuDrawer from '~/components/NavBar/MenuDrawer'
import Profiles from '~/components/NavBar/Profiles'
import Recent from '~/components/NavBar/Recent'
import Starred from '~/components/NavBar/Starred'
import Templates from '~/components/NavBar/Templates'
import Workspaces from '~/components/NavBar/Workspaces'
import { useTheme } from '@mui/material/styles'

export default function NavBar() {
  const [searchValue, setSearchValue] = useState('')
  const [open, setOpen] = useState(false)

  const theme = useTheme()
  const isScreenMedium = useMediaQuery(theme.breakpoints.down('md'))

  const toggleDrawer = (newOpen: boolean) => {
    if (isScreenMedium) {
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
          <Link to='/'>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SvgIcon
                component={TrelloneIcon}
                inheritViewBox
                fontSize='small'
                sx={{ color: (theme) => theme.palette.primary.main }}
              />
              <Typography
                variant='inherit'
                sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: (theme) => theme.palette.secondary.main }}
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
            <Button variant='contained' fullWidth startIcon={<LibraryAddIcon />}>
              Create
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            id='outlined-search'
            label='Search...'
            type='text'
            size='small'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon className='search-icon' />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position='end'>
                  <CloseIcon
                    fontSize='small'
                    sx={{
                      color: searchValue ? 'inherit' : 'transparent',
                      cursor: searchValue ? 'pointer' : 'default'
                    }}
                    onClick={() => setSearchValue('')}
                  />
                </InputAdornment>
              )
            }}
            sx={{
              minWidth: '120px',
              maxWidth: '180px',
              backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.15),
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.25)
              }
            }}
          />
          {!isScreenMedium && <ModeSelect />}
          <Tooltip title='Notifications'>
            <Badge color='error' variant='dot' sx={{ cursor: 'pointer' }}>
              <NotificationsNoneIcon />
            </Badge>
          </Tooltip>
          <Tooltip title='Help'>
            <HelpOutlineIcon sx={{ cursor: 'pointer' }} />
          </Tooltip>
          <Profiles />
        </Box>
      </Box>
      <Drawer open={open} onClose={() => toggleDrawer(false)}>
        <MenuDrawer onToggleDrawer={toggleDrawer} />
      </Drawer>
    </>
  )
}
