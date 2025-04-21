import { useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { Outlet } from 'react-router-dom'
import LoginRegisterBg from '~/assets/auth/login-register-bg.jpg'

export default function AuthLayout() {
  const theme = useTheme()
  const isScreenAboveMobileScreen = useMediaQuery(theme.breakpoints.up(480))

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: `url(${LoginRegisterBg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.2)'
      }}
    >
      <Box sx={{ width: isScreenAboveMobileScreen ? 380 : '100%' }}>
        <Outlet />
      </Box>
    </Box>
  )
}
