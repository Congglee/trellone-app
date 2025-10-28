import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import Grow from '@mui/material/Grow'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import { alpha, useColorScheme } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import TrelloneIcon from '~/assets/trello.svg?react'
import path from '~/constants/path'
import { useAppSelector } from '~/lib/redux/hooks'
import { Mode } from '~/types/utils.type'

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Highlights', href: '#highlights' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Blog', href: '#blog' }
]

export default function Header() {
  const { mode, setMode } = useColorScheme()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [anchorModeMenuOpen, setAnchorModeMenuOpen] = useState(false)

  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const { isAuthenticated, profile } = useAppSelector((state) => state.auth)

  const isLoggedIn = Boolean(isAuthenticated && profile)

  const handleModeMenuToggle = () => {
    setAnchorModeMenuOpen((prevOpen) => !prevOpen)
  }

  const handleModeMenuClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setAnchorModeMenuOpen(false)
  }

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode)
    setAnchorModeMenuOpen(false)
  }

  const handleMobileMenuOpen = () => {
    setMobileMenuOpen(true)
  }

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false)
  }

  const renderModeIcon = () => {
    if (mode === 'light') return <Brightness7Icon />
    if (mode === 'dark') return <Brightness4Icon />
    return <BrightnessAutoIcon />
  }

  const scrollToSection = (href: string) => {
    handleMobileMenuClose()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      setAnchorModeMenuOpen(false)
    } else if (event.key === 'Escape') {
      setAnchorModeMenuOpen(false)
    }
  }

  useEffect(() => {
    if (mobileMenuOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus()
    }
  }, [mobileMenuOpen])

  // Return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(anchorModeMenuOpen)

  useEffect(() => {
    if (prevOpen.current === true && anchorModeMenuOpen === false) {
      anchorRef.current?.focus()
    }

    prevOpen.current = anchorModeMenuOpen
  }, [anchorModeMenuOpen])

  return (
    <>
      <AppBar
        position='fixed'
        enableColorOnDark
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 3.5
        }}
      >
        <Container maxWidth='lg'>
          <Toolbar
            variant='dense'
            disableGutters
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              borderRadius: (theme) => `calc(${theme.shape.borderRadius}px + 8px)`,
              backdropFilter: 'blur(24px)',
              border: '1px solid',
              borderColor: (theme) => theme.palette.divider,
              backgroundColor: (theme) => alpha(theme.palette.background.default, 0.4),
              boxShadow: (theme) => theme.shadows[1],
              padding: '8px 12px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrelloneIcon style={{ width: 24, height: 24, color: '#4876ee' }} />
              <Typography
                variant='h6'
                sx={{
                  fontWeight: 700,
                  color: '#4876ee',
                  fontSize: 18
                }}
              >
                Trellone
              </Typography>
            </Box>

            <Box
              sx={{
                display: { xs: 'none', lg: 'flex' },
                gap: 1.5,
                alignItems: 'center'
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  sx={{
                    color: 'info.main',
                    textTransform: 'uppercase',
                    fontSize: '0.9rem',
                    px: 1.5,
                    minWidth: 'auto',
                    fontWeight: 500,
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isLoggedIn && (
                <Button
                  variant='outlined'
                  size='small'
                  component={Link}
                  to={path.boardsList}
                  sx={{
                    display: { xs: 'none', lg: 'inline-flex' },
                    height: 32,
                    px: 2,
                    textTransform: 'uppercase'
                  }}
                >
                  Go to your boards
                </Button>
              )}

              {!isLoggedIn && (
                <>
                  <Button
                    variant='outlined'
                    size='small'
                    component={Link}
                    to={path.login}
                    sx={{
                      display: { xs: 'none', lg: 'inline-flex' },
                      height: 32,
                      px: 2,
                      textTransform: 'uppercase'
                    }}
                  >
                    Sign in
                  </Button>
                  <Button
                    variant='contained'
                    size='small'
                    component={Link}
                    to={path.register}
                    sx={{
                      display: { xs: 'none', lg: 'inline-flex' },
                      height: 32,
                      px: 2,
                      textTransform: 'uppercase'
                    }}
                  >
                    Sign up
                  </Button>
                </>
              )}

              <IconButton
                onClick={handleMobileMenuOpen}
                size='small'
                color='inherit'
                sx={{
                  display: { xs: 'inline-flex', lg: 'none' },
                  ml: 1
                }}
                aria-label='Open navigation menu'
                aria-expanded={mobileMenuOpen}
                aria-controls='mobile-menu'
              >
                <MenuIcon />
              </IconButton>

              <IconButton
                ref={anchorRef}
                id='composition-button'
                aria-controls={anchorModeMenuOpen ? 'composition-menu' : undefined}
                aria-expanded={anchorModeMenuOpen ? 'true' : undefined}
                aria-haspopup='true'
                onClick={handleModeMenuToggle}
                size='small'
                color='inherit'
                sx={{ display: 'flex' }}
                aria-label='Toggle theme mode'
              >
                {renderModeIcon()}
              </IconButton>

              <Popper
                open={anchorModeMenuOpen}
                anchorEl={anchorRef.current}
                role={undefined}
                placement='bottom-end'
                transition
                disablePortal
                sx={{ zIndex: 1 }}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === 'bottom-end' ? 'right top' : 'right bottom'
                    }}
                  >
                    <Paper sx={{ boxShadow: 'none', background: 'transparent' }}>
                      <ClickAwayListener onClickAway={handleModeMenuClose}>
                        <MenuList
                          autoFocusItem={anchorModeMenuOpen}
                          id='composition-menu'
                          aria-labelledby='composition-button'
                          onKeyDown={handleListKeyDown}
                          sx={{
                            backgroundColor: 'background.paper',
                            borderRadius: (theme) => `calc(${theme.shape.borderRadius}px + 8px)`,
                            border: '1px solid',
                            borderColor: (theme) => theme.palette.divider,
                            boxShadow: (theme) => theme.shadows[2],
                            minWidth: 140
                          }}
                        >
                          <MenuItem
                            onClick={() => handleModeChange('light')}
                            selected={mode === 'light'}
                            sx={{ gap: 1.5 }}
                          >
                            <Brightness7Icon fontSize='small' />
                            Light
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleModeChange('dark')}
                            selected={mode === 'dark'}
                            sx={{ gap: 1.5 }}
                          >
                            <Brightness4Icon fontSize='small' />
                            Dark
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleModeChange('system')}
                            selected={mode === 'system'}
                            sx={{ gap: 1.5 }}
                          >
                            <BrightnessAutoIcon fontSize='small' />
                            System
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor='top'
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        id='mobile-menu'
        role='navigation'
        aria-label='Mobile navigation menu'
      >
        <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              ref={firstFocusableRef}
              onClick={handleMobileMenuClose}
              aria-label='Close navigation menu'
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {navItems.map((item) => (
            <MenuItem key={item.label} onClick={() => scrollToSection(item.href)}>
              {item.label}
            </MenuItem>
          ))}

          <Divider sx={{ my: 3 }} />

          {isLoggedIn && (
            <>
              <MenuItem sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                <Button component={Link} to={path.boardsList} color='primary' variant='outlined' fullWidth>
                  Go to your boards
                </Button>
              </MenuItem>
            </>
          )}

          {!isLoggedIn && (
            <>
              <MenuItem sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                <Button 
                  component={Link} 
                  to={path.register} 
                  color='primary' 
                  variant='contained' 
                  fullWidth
                  onClick={handleMobileMenuClose}
                >
                  Sign up
                </Button>
              </MenuItem>
              <MenuItem sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                <Button 
                  component={Link} 
                  to={path.login} 
                  color='primary' 
                  variant='outlined' 
                  fullWidth
                  onClick={handleMobileMenuClose}
                >
                  Sign in
                </Button>
              </MenuItem>
            </>
          )}
        </Box>
      </Drawer>
    </>
  )
}
