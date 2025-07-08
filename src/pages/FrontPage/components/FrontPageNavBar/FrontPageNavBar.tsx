import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import { Link as MuiLink, useColorScheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import TrelloneIcon from '~/assets/trello.svg?react'
import AppBar from '~/components/AppBar'
import path from '~/constants/path'
import { siteConfig } from '~/constants/site'
import { useAppSelector } from '~/lib/redux/hooks'

const menuItems = [
  { title: 'Features', href: '#' },
  { title: 'Solutions', href: '#' },
  { title: 'Plans', href: '#' },
  { title: 'Pricing', href: '#' },
  { title: 'Resources', href: '#' }
]

export default function FrontPageNavBar() {
  const { mode, setMode } = useColorScheme()
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false)

  const { isAuthenticated, profile } = useAppSelector((state) => state.auth)

  const isLoggedIn = Boolean(isAuthenticated && profile)

  const toggleMenuDrawer = () => {
    setMenuDrawerOpen(!menuDrawerOpen)
  }

  const handleModeChange = () => {
    setMode(mode === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <AppBar
        sx={(theme) => ({
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar + 1,
          background: theme.palette.mode === 'dark' ? 'rgba(26, 26, 46, 0.95)' : 'rgba(245, 247, 250, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
          boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease-in-out',
          // Ensure navbar stays on top on mobile devices
          '@supports (position: -webkit-sticky) or (position: sticky)': {
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)'
          }
        })}
      >
        <Container maxWidth='lg' disableGutters>
          <Toolbar
            sx={{
              height: (theme) => `calc(${theme.trellone.frontPageNavBarHeight} - 1px)`
            }}
            disableGutters
          >
            <MuiLink p={2} component={NavLink} to={path.frontPage}>
              <Stack direction='row' alignItems='center'>
                <SvgIcon component={TrelloneIcon} inheritViewBox sx={{ color: '#0052cc' }} />
                <Typography
                  variant='inherit'
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: (theme) => theme.palette.text.primary
                  }}
                  pl={1}
                  lineHeight={1}
                >
                  {siteConfig.name}
                </Typography>
              </Stack>
            </MuiLink>

            <Box
              sx={(theme) => ({
                flexGrow: 1,
                display: 'none',
                [theme.breakpoints.up(990)]: { display: 'flex' },
                gap: 1
              })}
            >
              {menuItems.map((item) => (
                <Button
                  key={item.title}
                  component={NavLink}
                  to={item.href}
                  sx={{
                    fontSize: '1rem',
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  {item.title}
                </Button>
              ))}
            </Box>

            <Drawer
              anchor='top'
              open={menuDrawerOpen}
              onClose={toggleMenuDrawer}
              sx={{
                '& .MuiDrawer-paper': {
                  background: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(26, 26, 46, 0.98)' : 'rgba(245, 247, 250, 0.98)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }
              }}
            >
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Stack direction='row' alignItems='center'>
                      <SvgIcon component={TrelloneIcon} inheritViewBox sx={{ color: '#0052cc' }} />
                      <Typography
                        variant='inherit'
                        sx={{
                          fontSize: '1.5rem',
                          fontWeight: 600,
                          color: (theme) => theme.palette.text.primary
                        }}
                        pl={1}
                        lineHeight={1}
                      >
                        {siteConfig.name}
                      </Typography>
                    </Stack>
                  </Box>
                  <IconButton onClick={toggleMenuDrawer} color='inherit'>
                    <CloseIcon />
                  </IconButton>
                </Box>

                <List disablePadding>
                  {menuItems.map((item) => (
                    <ListItem key={item.title} disablePadding>
                      <ListItemButton
                        component={NavLink}
                        to={item.href}
                        sx={{
                          py: 2,
                          borderRadius: 1,
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          }
                        }}
                      >
                        <ListItemText
                          primary={item.title}
                          primaryTypographyProps={{
                            fontWeight: 500,
                            fontSize: '1.1rem'
                          }}
                        />
                        {item.title !== 'Pricing' && <ChevronRightIcon sx={{ color: 'text.secondary' }} />}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    component={NavLink}
                    to={isLoggedIn ? path.boardsList : path.register}
                    fullWidth
                    variant='contained'
                    size='large'
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: 1,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                      },
                      color: '#ffffff'
                    }}
                  >
                    {isLoggedIn ? 'Go to your boards' : `Get ${siteConfig.name} for free`}
                  </Button>

                  {!isLoggedIn && (
                    <Button
                      component={NavLink}
                      to={path.login}
                      fullWidth
                      variant='outlined'
                      size='large'
                      sx={{
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: 1,
                        borderColor: 'text.primary',
                        color: 'text.primary',
                        '&:hover': {
                          borderColor: 'text.primary',
                          backgroundColor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      Log in
                    </Button>
                  )}
                </Box>
              </Box>
            </Drawer>

            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', ml: 'auto' }}>
              <IconButton
                onClick={handleModeChange}
                size='large'
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              <IconButton
                size='large'
                onClick={toggleMenuDrawer}
                sx={(theme) => ({
                  [theme.breakpoints.up(990)]: { display: 'none' },
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                })}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            <Box
              sx={(theme) => ({
                display: 'none',
                [theme.breakpoints.up(990)]: { display: 'flex' },
                height: '100%',
                ml: 'auto'
              })}
            >
              {!isLoggedIn && (
                <Button
                  component={NavLink}
                  to={path.login}
                  sx={{
                    mx: 1,
                    fontSize: '19.2px',
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'transparent'
                    }
                  }}
                >
                  Login
                </Button>
              )}

              <Button
                component={NavLink}
                to={isLoggedIn ? path.boardsList : path.register}
                sx={{
                  py: 1,
                  px: 3,
                  borderRadius: 0,
                  fontSize: '19.2px',
                  height: '100%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                  },
                  color: '#ffffff',
                  ml: 1
                }}
                variant='contained'
              >
                {isLoggedIn ? 'Go to your boards' : `Get ${siteConfig.name} for free`}
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <Box
        sx={{
          height: (theme) => theme.trellone.frontPageNavBarHeight,
          flexShrink: 0
        }}
      />
    </>
  )
}
