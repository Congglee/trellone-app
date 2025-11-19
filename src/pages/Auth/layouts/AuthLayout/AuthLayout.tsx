import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import LoginBackground from '~/assets/auth/login-register-bg.jpg'

export default function AuthLayout() {
  return (
    <Box
      sx={{
        backgroundImage: `url(${LoginBackground})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        width: '100%',
        position: 'relative'
      }}
    >
      <Outlet />
    </Box>
  )
}
