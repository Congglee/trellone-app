import { zodResolver } from '@hookform/resolvers/zod'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useForm } from 'react-hook-form'
import { useChangePasswordMutation } from '~/queries/users'
import { ChangePasswordBody, ChangePasswordBodyType } from '~/schemas/user.schema'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import TextFieldInput from '~/components/Form/TextFieldInput'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import PasswordIcon from '@mui/icons-material/Password'
import InputAdornment from '@mui/material/InputAdornment'
import LockIcon from '@mui/icons-material/Lock'
import LockResetIcon from '@mui/icons-material/LockReset'
import Button from '@mui/material/Button'
import { useConfirm } from 'material-ui-confirm'
import LogoutIcon from '@mui/icons-material/Logout'
import { useEffect } from 'react'
import { isUnprocessableEntityError } from '~/utils/error-handlers'

export default function SecurityTab() {
  const theme = useTheme()
  const isScreenAboveMobileScreen = useMediaQuery(theme.breakpoints.up(480))

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
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
        description: 'You have to login again after successfully changing your password. Continue?',
        confirmationText: 'Confirm',
        cancellationText: 'Cancel'
      })

      if (confirmed) {
        await changePasswordMutation(values)
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
        <Box>
          <Typography variant='h5'>Security Dashboard</Typography>
        </Box>
        <form onSubmit={onSubmit}>
          <Box
            sx={{
              width: isScreenAboveMobileScreen ? '400px' : '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
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
      </Box>
    </Box>
  )
}
