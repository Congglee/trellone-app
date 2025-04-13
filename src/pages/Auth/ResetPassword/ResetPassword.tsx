import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import useQueryConfig from '~/hooks/use-query-config'
import { useResetPasswordMutation, useVerifyForgotPasswordMutation } from '~/queries/auth'
import { ResetPasswordBody, ResetPasswordBodyType } from '~/schemas/auth.schema'
import { AuthQueryParams } from '~/types/query-params.type'
import { isUnprocessableEntityError } from '~/utils/error-handlers'
import LockIcon from '@mui/icons-material/Lock'
import { Card as MuiCard } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Zoom from '@mui/material/Zoom'
import { Link } from 'react-router-dom'
import TrelloneIcon from '~/assets/trello.svg?react'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import TextFieldInput from '~/components/Form/TextFieldInput'
import path from '~/constants/path'

export default function ResetPassword() {
  const { forgot_password_token } = useQueryConfig<AuthQueryParams>()
  const navigate = useNavigate()

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordBodyType>({
    resolver: zodResolver(ResetPasswordBody),
    defaultValues: { password: '', confirm_password: '' }
  })

  const [verifyForgotPasswordMutation] = useVerifyForgotPasswordMutation()
  const [resetPasswordMutation, { isError, error }] = useResetPasswordMutation()

  // Prevent users from accessing this page by entering the URL directly
  useEffect(() => {
    if (forgot_password_token) {
      verifyForgotPasswordMutation({ forgot_password_token }).then((res) => {
        if (res.error) {
          navigate('/404')
        }
      })
    }
  }, [forgot_password_token, navigate])

  const onSubmit = handleSubmit((values) => {
    resetPasswordMutation({
      ...values,
      forgot_password_token: forgot_password_token as string
    }).then((res) => {
      if (!res.error) {
        navigate(path.login)
      }
    })
  })

  useEffect(() => {
    if (isError && isUnprocessableEntityError<ResetPasswordBodyType>(error)) {
      const formError = error.data.errors

      if (formError) {
        for (const [key, value] of Object.entries(formError)) {
          setError(key as keyof ResetPasswordBodyType, {
            type: value.type,
            message: value.msg
          })
        }
      }
    }
  }, [isError, error, setError])

  if (!forgot_password_token) {
    return <Navigate to='/404' />
  }

  return (
    <form onSubmit={onSubmit}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ marginTop: '6em' }}>
          <Box sx={{ margin: '1em', display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <LockIcon />
            </Avatar>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <TrelloneIcon />
            </Avatar>
          </Box>
          <Typography sx={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'medium' }} variant='h1'>
            Reset your password
          </Typography>
          <Box sx={{ padding: '1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextFieldInput
                name='password'
                register={register}
                type='password'
                label='Enter Password...'
                error={!!errors['password']}
              />
              <FieldErrorAlert errorMessage={errors.password?.message} />
            </Box>
            <Box sx={{ marginTop: '1em' }}>
              <TextFieldInput
                name='confirm_password'
                register={register}
                type='password'
                label='Enter Password Confirmation...'
                error={!!errors['confirm_password']}
              />
              <FieldErrorAlert errorMessage={errors.confirm_password?.message} />
            </Box>
          </Box>
          <CardActions
            sx={{
              padding: '0 1em 1em 1em',
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
              Reset password
            </Button>
          </CardActions>
          <Divider>Or continue with</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '1em' }}>
            <Typography sx={{ textAlign: 'center' }}>
              Go back to{' '}
              <Link to={path.login} style={{ textDecoration: 'none' }}>
                <Typography component='span' sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>
                  Log in!
                </Typography>
              </Link>
            </Typography>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}
