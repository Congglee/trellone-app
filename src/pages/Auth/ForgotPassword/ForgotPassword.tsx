import { zodResolver } from '@hookform/resolvers/zod'
import LockIcon from '@mui/icons-material/Lock'
import { Card as MuiCard } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Zoom from '@mui/material/Zoom'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import TrelloneIcon from '~/assets/trello.svg?react'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import TextFieldInput from '~/components/Form/TextFieldInput'
import path from '~/constants/path'
import { useForgotPasswordMutation } from '~/queries/auth'
import { ForgotPasswordBody, ForgotPasswordBodyType } from '~/schemas/auth.schema'
import { isUnprocessableEntityError } from '~/utils/error-handlers'

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
            Forgot your password?
          </Typography>
          <Box sx={{ padding: '1em' }}>
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
              Send reset instructions
            </Button>
          </CardActions>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '1em' }}>
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
      </Zoom>
    </form>
  )
}
