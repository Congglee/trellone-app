import { zodResolver } from '@hookform/resolvers/zod'
import LockIcon from '@mui/icons-material/Lock'
import LockResetIcon from '@mui/icons-material/LockReset'
import LogoutIcon from '@mui/icons-material/Logout'
import PasswordIcon from '@mui/icons-material/Password'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import { useConfirm } from 'material-ui-confirm'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import TextFieldInput from '~/components/Form/TextFieldInput'
import { useChangePasswordMutation } from '~/queries/users'
import { ChangePasswordBody, ChangePasswordBodyType } from '~/schemas/user.schema'
import { isUnprocessableEntityError } from '~/utils/error-handlers'

export default function ChangePasswordForm() {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: { old_password: '', password: '', confirm_password: '' }
  })

  const [changePasswordMutation, { isError, error }] = useChangePasswordMutation()
  const confirmChangePassword = useConfirm()

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { confirmed } = await confirmChangePassword({
        title: (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LogoutIcon sx={{ color: 'warning.dark' }} /> Change Password
          </Box>
        ),
        description: 'You have to login again after successfully changing your password. Do you want to continue?',
        confirmationText: 'Confirm',
        cancellationText: 'Cancel'
      })

      if (confirmed) {
        await changePasswordMutation(values)
        reset()
      }
    } catch (error: unknown) {
      console.log('Change password canceled or failed', error)
    }
  })

  useEffect(() => {
    if (isError && isUnprocessableEntityError<ChangePasswordBodyType>(error)) {
      const formError = error.data.errors
      if (formError) {
        for (const [key, value] of Object.entries(formError)) {
          setError(key as keyof ChangePasswordBodyType, {
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
          gap: 3
        }}
      >
        <Box>
          <Typography variant='h6' gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
            Change Password
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
            Update your password to keep your account secure.
          </Typography>
        </Box>

        <Box>
          <TextFieldInput
            name='old_password'
            register={register}
            fullWidth
            type='password'
            label='Current Password'
            error={!!errors['old_password']}
            variant='outlined'
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <PasswordIcon fontSize='small' />
                </InputAdornment>
              )
            }}
          />
          <FieldErrorAlert errorMessage={errors.old_password?.message} />
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
            label='New Password Confirmation'
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
            Save
          </Button>
        </Box>
      </Box>
    </form>
  )
}
