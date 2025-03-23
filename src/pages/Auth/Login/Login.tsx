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
import { Link } from 'react-router-dom'
import TrelloneIcon from '~/assets/trello.svg?react'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import TextFieldInput from '~/components/Form/TextFieldInput'
import { LoginBody, LoginBodyType } from '~/schemas/auth.schema'

export default function Login() {
  const {
    register,
    // setError,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = handleSubmit((values) => {
    console.log('values', values)
  })

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
          <Box
            sx={{
              marginTop: '1em',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '0 1em'
            }}
          >
            {/* Send and verify email */}
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
          </Box>
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Button
              // className='interceptor-loading'
              type='submit'
              variant='contained'
              color='primary'
              size='large'
              fullWidth
            >
              Login
            </Button>
          </CardActions>
          <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
            <Typography>New to Trellone?</Typography>
            <Link to='/register' style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Create account!</Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}
