import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'

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
        background: 'url("src/assets/auth/login-register-bg.jpg")',
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
