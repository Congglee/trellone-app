import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { useAppSelector } from '~/lib/redux/hooks'
import ChangePasswordForm from '~/pages/Settings/components/SecurityTab/ChangePasswordForm'
import EnablePasswordLoginForm from '~/pages/Settings/components/SecurityTab/EnablePasswordLoginForm'

export default function SecurityTab() {
  const profile = useAppSelector((state) => state.auth.profile)

  const hasPasswordLogin = profile?.auth_providers?.includes('password') && profile?.is_password_login_enabled
  const isGoogleOnly = profile?.auth_providers?.includes('google') && !hasPasswordLogin

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3
        }}
      >
        {isGoogleOnly && <EnablePasswordLoginForm />}

        {isGoogleOnly && hasPasswordLogin && <Divider sx={{ marginY: 3, width: '100%' }} />}

        {hasPasswordLogin && <ChangePasswordForm />}
      </Box>
    </Box>
  )
}
