import { zodResolver } from '@hookform/resolvers/zod'
import GoogleIcon from '@mui/icons-material/Google'
import LockIcon from '@mui/icons-material/Lock'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Card as MuiCard, Link as MuiLink } from '@mui/material'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CardActions from '@mui/material/CardActions'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Zoom from '@mui/material/Zoom'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import TrelloneIcon from '~/assets/trello.svg?react'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import TextFieldInput from '~/components/Form/TextFieldInput'
import SEO from '~/components/SEO'
import path from '~/constants/path'
import { useQueryConfig } from '~/hooks/use-query-config'
import { useLoginMutation, useResendVerifyEmailMutation } from '~/queries/auth'
import { LoginBody, LoginBodyType } from '~/schemas/auth.schema'
import { AuthQueryParams } from '~/types/query-params.type'
import { isPasswordLoginNotEnabledError, isUnprocessableEntityError } from '~/utils/error-handlers'
import { getGoogleAuthUrl } from '~/utils/oauth'

export default function Login() {
  const { registered_email, verified_email, password_reset_success } = useQueryConfig<AuthQueryParams>()

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: { email: registered_email || '', password: '' }
  })

  const [loginMutation, { isError, error }] = useLoginMutation()
  const [resendVerifyEmailMutation] = useResendVerifyEmailMutation()

  const googleOAuthUrl = getGoogleAuthUrl()
  const isPasswordLoginDisabled = isError && isPasswordLoginNotEnabledError(error)

  const onSubmit = handleSubmit(async (values) => {
    await loginMutation(values)
  })

  const resendVerifyEmail = async () => {
    if (registered_email) {
      await resendVerifyEmailMutation({ email: registered_email })
    }
  }

  useEffect(() => {
    if (isError && isUnprocessableEntityError<LoginBodyType>(error)) {
      const formError = error.data.errors

      if (formError) {
        for (const [key, value] of Object.entries(formError)) {
          setError(key as keyof LoginBodyType, {
            type: value.type,
            message: value.msg
          })
        }
      }
    }
  }, [isError, error, setError])

  return (
    <form onSubmit={onSubmit}>
      <SEO
        title='Login'
        description='Log in to your Trellone account to continue managing your projects, tasks, and team collaboration.'
        noIndex
        noFollow
      />

      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <Container
          maxWidth={false}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
        >
          <MuiCard
            sx={{
              width: '100%',
              maxWidth: '450px',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              '&.MuiCard-root': {
                padding: { xs: '1em', sm: '1.5em' }
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, marginBottom: '1em' }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <LockIcon />
              </Avatar>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <TrelloneIcon />
              </Avatar>
            </Box>

            <Typography
              sx={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'medium', marginBottom: '1.5em' }}
              variant='h1'
            >
              Sign in to your account
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                marginBottom: '1.5em'
              }}
            >
              {verified_email && (
                <Alert severity='success' sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                  Your email&nbsp;
                  <Typography component='span' sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>
                    {verified_email}
                  </Typography>
                  &nbsp;has been verified.
                  <br />
                  Now you can login to enjoy our services! Have a good day! 😊
                </Alert>
              )}

              {registered_email && (
                <Alert
                  severity='info'
                  sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}
                  action={
                    <IconButton
                      aria-label='resend'
                      color='inherit'
                      size='small'
                      onClick={resendVerifyEmail}
                      title='Resend verification email'
                    >
                      <RefreshIcon fontSize='inherit' />
                    </IconButton>
                  }
                >
                  An email has been sent to&nbsp;
                  <Typography component='span' sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>
                    {registered_email}
                  </Typography>
                  <br />
                  Please check and verify your account before logging in!
                </Alert>
              )}

              {password_reset_success && (
                <Alert severity='success' sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                  Your password has been reset successfully. You can now sign in with your email and password.
                </Alert>
              )}

              {isPasswordLoginDisabled && (
                <Alert severity='warning' sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                  <Typography component='span' sx={{ fontWeight: 'bold' }}>
                    This account currently uses Google login.
                  </Typography>
                  <br />
                  Please use the &quot;Sign in with Google&quot; button below to continue, or set a password from your{' '}
                  <MuiLink component={Link} to={path.securitySettings} sx={{ fontWeight: 'bold' }}>
                    Security Settings
                  </MuiLink>{' '}
                  to enable email/password login.
                </Alert>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <TextFieldInput
                  name='email'
                  register={register}
                  type='email'
                  label='Enter Email...'
                  error={!!errors['email']}
                  autoFocus
                />
                <FieldErrorAlert errorMessage={errors.email?.message} />
              </Box>

              <Box>
                <TextFieldInput
                  name='password'
                  register={register}
                  type='password'
                  label='Enter Password...'
                  error={!!errors['password']}
                />
                <FieldErrorAlert errorMessage={errors.password?.message} />
              </Box>
            </Box>

            <CardActions
              sx={{
                padding: 0,
                marginTop: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'center'
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap'
                }}
              >
                <FormControlLabel
                  value='remember-me'
                  control={<Checkbox />}
                  label='Remember me'
                  labelPlacement='end'
                  sx={{
                    '& span': {
                      fontSize: '0.875rem',
                      '& .MuiSvgIcon-root': {
                        fontSize: '1.25rem'
                      }
                    }
                  }}
                />
                <MuiLink component={Link} to={path.forgotPassword} variant='body2' sx={{ fontSize: '0.75rem' }}>
                  Forgot your password?
                </MuiLink>
              </Box>

              <Button
                className='interceptor-loading'
                type='submit'
                variant='contained'
                color='primary'
                size='large'
                fullWidth
              >
                Login
              </Button>
            </CardActions>

            <Divider sx={{ marginY: 2 }}>Or continue with</Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button fullWidth variant='outlined' startIcon={<GoogleIcon />} href={googleOAuthUrl}>
                Sign in with Google
              </Button>

              <Typography sx={{ textAlign: 'center' }}>
                Don&apos;t have an account?{' '}
                <Link to='/register' style={{ textDecoration: 'none' }}>
                  <Typography component='span' sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>
                    Create account!
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </MuiCard>
        </Container>
      </Zoom>
    </form>
  )
}
