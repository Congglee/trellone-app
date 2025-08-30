import CloseIcon from '@mui/icons-material/Close'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CreateNewWorkspaceInvitationBodyType } from '~/schemas/invitation.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateNewWorkspaceInvitationBody } from '~/schemas/invitation.schema'
import { WorkspaceRole } from '~/constants/type'
import { useAddNewWorkspaceInvitationMutation } from '~/queries/invitations'
import { isUnprocessableEntityError } from '~/utils/error-handlers'
import TextFieldInput from '~/components/Form/TextFieldInput'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'

interface InviteWorkspaceMembersDialogProps {
  workspaceId: string
}

export default function InviteWorkspaceMembersDialog({ workspaceId }: InviteWorkspaceMembersDialogProps) {
  const [inviteWorkspaceMemberOpen, setInviteWorkspaceMemberOpen] = useState(false)

  const handleInviteWorkspaceMemberOpen = () => {
    setInviteWorkspaceMemberOpen(true)
  }

  const handleInviteWorkspaceMemberClose = () => {
    setInviteWorkspaceMemberOpen(false)
  }

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateNewWorkspaceInvitationBodyType>({
    resolver: zodResolver(CreateNewWorkspaceInvitationBody),
    defaultValues: { invitee_email: '', role: WorkspaceRole.Normal }
  })

  useEffect(() => {
    if (inviteWorkspaceMemberOpen) {
      reset()
    }
  }, [inviteWorkspaceMemberOpen, reset])

  const [addNewWorkspaceInvitationMutation, { isError, error }] = useAddNewWorkspaceInvitationMutation()

  const onSubmit = handleSubmit(async (values) => {
    addNewWorkspaceInvitationMutation({ ...values, workspace_id: workspaceId }).then((res) => {
      if (!res.error) {
        reset()

        // TODO: Handle socket realtime event when user is invited to workspace
      }
    })
  })

  useEffect(() => {
    if (isError && isUnprocessableEntityError<CreateNewWorkspaceInvitationBodyType>(error)) {
      const formError = error.data.errors

      if (formError) {
        for (const [key, value] of Object.entries(formError)) {
          setError(key as keyof CreateNewWorkspaceInvitationBodyType, {
            type: value.type,
            message: value.msg
          })
        }
      }
    }
  }, [isError, error, setError])

  return (
    <Box sx={{ textAlign: 'right', mb: 2.5 }}>
      <Button
        variant='contained'
        startIcon={<PeopleAltOutlinedIcon />}
        sx={{ textTransform: 'none', borderRadius: 1 }}
        onClick={handleInviteWorkspaceMemberOpen}
      >
        Invite Workspace members
      </Button>

      <Dialog
        open={inviteWorkspaceMemberOpen}
        onClose={handleInviteWorkspaceMemberClose}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            color: (theme) => (theme.palette.mode === 'dark' ? '#ffffff' : '#000000')
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 2,
            px: 3,
            pt: 3
          }}
        >
          <Typography variant='h6' component='h2' sx={{ fontWeight: 600 }}>
            Invite to Workspace
          </Typography>
          <IconButton
            onClick={handleInviteWorkspaceMemberClose}
            size='small'
            sx={{
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 3 }}>
          <form onSubmit={onSubmit}>
            <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextFieldInput
                name='invitee_email'
                register={register}
                type='email'
                placeholder='Email address or name'
                variant='outlined'
                error={!!errors['invitee_email']}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'transparent'),
                    '& fieldset': {
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)'
                    },
                    '&:hover fieldset': {
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.87)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main'
                    }
                  },
                  '& .MuiInputBase-input': {
                    py: 1.5,
                    color: (theme) => (theme.palette.mode === 'dark' ? '#ffffff' : '#000000')
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                    opacity: 1
                  }
                }}
              />
              <Button
                type='submit'
                variant='contained'
                sx={{
                  textTransform: 'none',
                  borderRadius: 1,
                  px: 2.5,
                  minWidth: 'auto',
                  whiteSpace: 'nowrap'
                }}
                className='interceptor-loading'
              >
                Send invite
              </Button>
            </Box>
            <FieldErrorAlert errorMessage={errors.invitee_email?.message} />
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
