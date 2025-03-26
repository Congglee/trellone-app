import { zodResolver } from '@hookform/resolvers/zod'
import LockIcon from '@mui/icons-material/Lock'
import { Card as MuiCard } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import Zoom from '@mui/material/Zoom'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import TrelloneIcon from '~/assets/trello.svg?react'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import TextFieldInput from '~/components/Form/TextFieldInput'
import { RegisterBody, RegisterBodyType } from '~/schemas/auth.schema'
import { Link as MuiLink } from '@mui/material'
import Divider from '@mui/material/Divider'
import GoogleIcon from '@mui/icons-material/Google'
import { useRegisterMutation } from '~/queries/auth'
import { isUnprocessableEntityError } from '~/utils/error-handlers'
import { useEffect } from 'react'
import path from '~/constants/path'

export default function Register() {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: { email: '', password: '', confirm_password: '' }
  })

  const navigate = useNavigate()

  const [registerMutation, { isError, error }] = useRegisterMutation()

  const onSubmit = handleSubmit((values) => {
    registerMutation(values).then((res) => {
      if (!res.error) {
        navigate(`${path.login}?registered_email=${values.email}`)
      }
    })
  })

  useEffect(() => {
    if (isError && isUnprocessableEntityError<RegisterBodyType>(error)) {
      const formError = error.data.errors

      if (formError) {
        for (const [key, value] of Object.entries(formError)) {
          setError(key as keyof RegisterBodyType, {
            type: value.type,
            message: value.msg
          })
        }
      }
    }
  }, [isError, error, setError])

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
          <Box
            sx={{
              marginTop: '1em',
              display: 'flex',
              justifyContent: 'center',
              color: (theme) => theme.palette.grey[500]
            }}
          >
            Author: Conggglee
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextFieldInput
                name='email'
                register={register}
                type='email'
                label='Enter Email...'
                error={!!errors['email']}
              />
              <FieldErrorAlert errorMessage={errors.email?.message} />
            </Box>
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
              Register
            </Button>
            <MuiLink component='button' type='button' variant='body2'>
              Forgot your password?
            </MuiLink>
          </CardActions>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '1em' }}>
            <Button
              fullWidth
              variant='outlined'
              onClick={() => alert('Sign in with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link to='/login' style={{ textDecoration: 'none' }}>
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
