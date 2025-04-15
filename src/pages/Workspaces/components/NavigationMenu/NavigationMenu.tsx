import AddSharpIcon from '@mui/icons-material/AddSharp'
import DashboardIcon from '@mui/icons-material/Dashboard'
import HomeIcon from '@mui/icons-material/Home'
import { useTheme } from '@mui/material/styles'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import path from '~/constants/path'
import CollapseList from '~/pages/Workspaces/components/NavigationMenu/CollapseList'
import { useMediaQuery } from '@mui/material'

const getActiveMenuFromPath = (pathname: string) => {
  switch (true) {
    case pathname === path.home:
      return 'Home'
    case pathname.startsWith(path.boardsList):
      return 'Boards'
    default:
      return ''
  }
}

export default function NavigationMenu() {
  const theme = useTheme()
  const isScreenAboveMobileScreen = useMediaQuery(theme.breakpoints.up('sm'))

  const navigate = useNavigate()
  const location = useLocation()

  const [activeMenu, setActiveMenu] = useState(() => getActiveMenuFromPath(location.pathname))

  useEffect(() => {
    setActiveMenu(getActiveMenuFromPath(location.pathname))
  }, [location.pathname])

  const handleListItemClick = (targetPath: string) => {
    navigate(targetPath)
  }

  const onActiveMenuChange = (menuItem: string) => {
    if (getActiveMenuFromPath(location.pathname) !== menuItem) {
      setActiveMenu(menuItem)
    }
  }

  return (
    <List
      sx={{
        pt: 5,
        // display: { xs: 'none', sm: 'block' },
        width: '100%',
        maxWidth: { xs: '100%', sm: 250 },
        bgcolor: 'background.paper'
      }}
      component='nav'
      aria-labelledby='nested-list-subheader'
    >
      <ListItemButton selected={activeMenu === 'Home'} onClick={() => handleListItemClick(path.home)}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary='Home' />
      </ListItemButton>

      <ListItemButton selected={activeMenu === 'Boards'} onClick={() => handleListItemClick(path.boardsList)}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary='Boards' />
      </ListItemButton>

      {isScreenAboveMobileScreen && (
        <>
          <Divider component='li' sx={{ my: '10px' }} />
          <ListItemButton>
            <ListItemText primary='Workspaces' />
            <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
              <AddSharpIcon />
            </ListItemIcon>
          </ListItemButton>
          <CollapseList activeMenu={activeMenu} onActiveMenuChange={onActiveMenuChange} />
        </>
      )}
    </List>
  )
}
