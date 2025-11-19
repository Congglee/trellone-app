import { zodResolver } from '@hookform/resolvers/zod'
import LockIcon from '@mui/icons-material/Lock'
import LockResetIcon from '@mui/icons-material/LockReset'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import { useConfirm } from 'material-ui-confirm'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import TextFieldInput from '~/components/Form/TextFieldInput'
import { useEnablePasswordLoginMutation } from '~/queries/users'
import { EnablePasswordLoginBody, EnablePasswordLoginBodyType } from '~/schemas/user.schema'
import { isUnprocessableEntityError } from '~/utils/error-handlers'

export default function EnablePasswordLoginForm() {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EnablePasswordLoginBodyType>({
    resolver: zodResolver(EnablePasswordLoginBody),
    defaultValues: { password: '', confirm_password: '' }
  })

  const [enablePasswordLoginMutation, { isError, error }] = useEnablePasswordLoginMutation()
  const confirmEnablePassword = useConfirm()

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { confirmed } = await confirmEnablePassword({
        title: (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockIcon sx={{ color: 'primary.main' }} /> Enable Password Login
          </Box>
        ),
        description: 'You have to login again after successfully enabling password login. Do you want to continue?',
        confirmationText: 'Confirm',
        cancellationText: 'Cancel'
      })

      if (confirmed) {
        await enablePasswordLoginMutation(values)
        reset()
      }
    } catch (error: unknown) {
      console.log('Enable password login canceled or failed', error)
    }
  })

  useEffect(() => {
    if (isError && isUnprocessableEntityError<EnablePasswordLoginBodyType>(error)) {
      const formError = error.data.errors

      if (formError) {
        for (const [key, value] of Object.entries(formError)) {
          setError(key as keyof EnablePasswordLoginBodyType, {
            type: value.type,
            message: value.msg
          })
        }
      }
    }
  }, [isError, error, setError])

  return (
    <form onSubmit={onSubmit}>
      <Box
        sx={{
          width: { xs: '100%', sm: '400px' },
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          marginBottom: 3
        }}
      >
        <Box>
          <Typography variant='h6' gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
            Enable Password Login
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
            Set up a password to enable email/password login for your account.
          </Typography>
        </Box>

        <Box>
          <TextFieldInput
            name='password'
            register={register}
            fullWidth
            type='password'
            label='New Password'
            error={!!errors['password']}
            variant='outlined'
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <LockIcon fontSize='small' />
                </InputAdornment>
              )
            }}
          />
          <FieldErrorAlert errorMessage={errors.password?.message} />
        </Box>

        <Box>
          <TextFieldInput
            name='confirm_password'
            register={register}
            fullWidth
            type='password'
            label='Confirm Password'
            error={!!errors['confirm_password']}
            variant='outlined'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <LockResetIcon fontSize='small' />
                </InputAdornment>
              )
            }}
          />
          <FieldErrorAlert errorMessage={errors.confirm_password?.message} />
        </Box>

        <Box>
          <Button className='interceptor-loading' type='submit' variant='contained' color='primary' fullWidth>
            Set Password
          </Button>
        </Box>
      </Box>
    </form>
  )
}
