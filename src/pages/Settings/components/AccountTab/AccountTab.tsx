import { zodResolver } from '@hookform/resolvers/zod'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import MailIcon from '@mui/icons-material/Mail'
import RestartAltSharpIcon from '@mui/icons-material/RestartAltSharp'
import VerifiedIcon from '@mui/icons-material/Verified'
import { useMediaQuery } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import TextFieldInput from '~/components/Form/TextFieldInput'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { config } from '~/constants/config'
import { useAppSelector } from '~/lib/redux/hooks'
import { useResendVerifyEmailMutation } from '~/queries/auth'
import { useUploadImageMutation } from '~/queries/medias'
import { useUpdateMeMutation } from '~/queries/users'
import { UpdateMeBody, UpdateMeBodyType } from '~/schemas/user.schema'
import { isUnprocessableEntityError } from '~/utils/error-handlers'

export default function AccountTab() {
  const theme = useTheme()
  const isScreenAboveMobileScreen = useMediaQuery(theme.breakpoints.up(480))

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: { display_name: '', avatar: undefined }
  })

  const avatar = watch('avatar')

  const [file, setFile] = useState<File | null>(null)

  const previewAvatar = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }

    return avatar
  }, [avatar, file])

  const { profile } = useAppSelector((state) => state.auth)

  const isEmailVerified = Boolean(profile?.verify)

  const [updateMeMutation, { isError, error }] = useUpdateMeMutation()
  const [uploadImageMutation] = useUploadImageMutation()
  const [resendVerifyEmailMutation] = useResendVerifyEmailMutation()

  useEffect(() => {
    if (profile) {
      const { display_name, avatar } = profile
      reset({
        display_name,
        avatar: Boolean(avatar) ? avatar : undefined
      })
    }
  }, [profile, reset])

  const resendVerifyEmail = async () => {
    await resendVerifyEmailMutation({ email: profile?.email as string })
  }

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file && (file.size >= config.maxSizeUploadAvatar || !file.type.includes('image'))) {
      toast.error('Maximum file size is 3MB and file type must be an image.', { position: 'top-center' })
    } else {
      setFile(file || null)
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    let body = values

    if (file) {
      const formData = new FormData()

      formData.append('image', file)

      const uploadImageRes = await uploadImageMutation(formData).unwrap()
      const imageUrl = uploadImageRes.result[0].url

      body = { ...values, avatar: imageUrl }
    }

    await updateMeMutation(body)
  })

  useEffect(() => {
    if (isError && isUnprocessableEntityError<UpdateMeBodyType>(error)) {
      const formError = error.data.errors

      if (formError) {
        for (const [key, value] of Object.entries(formError)) {
          setError(key as keyof UpdateMeBodyType, {
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 84, height: 84, mb: 1 }} alt={profile?.display_name} src={previewAvatar} />
            <Box>
              <Typography variant='h6'>{profile?.display_name}</Typography>
              <Typography sx={{ color: 'grey' }}>@{profile?.username}</Typography>
            </Box>
          </Box>

          <Tooltip title='Upload a new image to update your avatar immediately.'>
            <Button component='label' variant='contained' size='small' startIcon={<CloudUploadIcon />}>
              Upload
              <VisuallyHiddenInput type='file' accept='image/*' onChange={handleChangeFile} />
            </Button>
          </Tooltip>
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
                disabled
                defaultValue={profile?.email}
                fullWidth
                type='text'
                label='Your Email'
                variant='filled'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <MailIcon fontSize='small' />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='start'>
                      {isEmailVerified ? (
                        <Tooltip title='Email verified'>
                          <IconButton edge='end'>
                            <VerifiedIcon fontSize='small' color='success' />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title='Resend verification email'>
                          <IconButton edge='end' onClick={resendVerifyEmail}>
                            <RestartAltSharpIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      )}
                    </InputAdornment>
                  )
                }}
              />
            </Box>
            <Box>
              <TextFieldInput
                disabled
                defaultValue={profile?.username}
                fullWidth
                type='text'
                label='Your Username'
                variant='filled'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AccountBoxIcon fontSize='small' />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Box>
              <TextFieldInput
                name='display_name'
                register={register}
                fullWidth
                type='text'
                label='Your Display Name'
                error={!!errors['display_name']}
                variant='outlined'
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AssignmentIndIcon fontSize='small' />
                    </InputAdornment>
                  )
                }}
              />
              <FieldErrorAlert errorMessage={errors.display_name?.message} />
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
