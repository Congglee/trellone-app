import { zodResolver } from '@hookform/resolvers/zod'
import LockIcon from '@mui/icons-material/Lock'
import { Card as MuiCard } from '@mui/material'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import MuiLink from '@mui/material/Link'
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
import { useForgotPasswordMutation } from '~/queries/auth'
import { ForgotPasswordBody, ForgotPasswordBodyType } from '~/schemas/auth.schema'
import { isPasswordLoginNotEnabledError, isUnprocessableEntityError } from '~/utils/error-handlers'

export default function ForgotPassword() {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordBodyType>({
    resolver: zodResolver(ForgotPasswordBody),
    defaultValues: { email: '' }
  })

  const [forgotPasswordMutation, { isError, error }] = useForgotPasswordMutation()

  const isPasswordLoginDisabled = isError && isPasswordLoginNotEnabledError(error)

  const onSubmit = handleSubmit(async (values) => {
    await forgotPasswordMutation(values)
  })

  useEffect(() => {
    if (isError && isUnprocessableEntityError<ForgotPasswordBodyType>(error)) {
      const formError = error.data.errors

      if (formError) {
        for (const [key, value] of Object.entries(formError)) {
          setError(key as keyof ForgotPasswordBodyType, {
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
        title='Forgot Password'
        description='Recover your Trellone account password. Enter your email to receive instructions on how to reset your password.'
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
              Forgot your password?
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: '1.5em' }}>
              {isPasswordLoginDisabled && (
                <Alert severity='warning' sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                  <Typography component='span' sx={{ fontWeight: 'bold' }}>
                    This account currently uses Google login.
                  </Typography>
                  <br />
                  Please use the &quot;Sign in with Google&quot; option or set a password from your{' '}
                  <MuiLink component={Link} to={path.securitySettings} sx={{ fontWeight: 'bold' }}>
                    Security Settings
                  </MuiLink>{' '}
                  to enable email/password login before using forgot password.
                </Alert>
              )}

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
            </Box>

            <CardActions
              sx={{
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'center'
              }}
            >
              <Button
                className='interceptor-loading'
                type='submit'
                variant='contained'
                color='primary'
                size='large'
                fullWidth
              >
                Send reset instructions
              </Button>
            </CardActions>

            <Divider sx={{ marginY: 2 }}>Or continue with</Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography sx={{ textAlign: 'center' }}>
                Already have an account?{' '}
                <Link to={path.login} style={{ textDecoration: 'none' }}>
                  <Typography component='span' sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>
                    Log in!
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
