import { zodResolver } from '@hookform/resolvers/zod'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import TextFieldInput from '~/components/Form/TextFieldInput'
import { useAppSelector } from '~/lib/redux/hooks'
import { useAddNewBoardInvitationMutation } from '~/queries/invitations'
import { CreateNewBoardInvitationBody, CreateNewBoardInvitationBodyType } from '~/schemas/invitation.schema'
import { isUnprocessableEntityError } from '~/utils/error-handlers'

interface InviteBoardUserProps {
  boardId: string
}

export default function InviteBoardUser({ boardId }: InviteBoardUserProps) {
  const [anchorInviteUserPopoverElement, setAnchorInviteUserPopoverElement] = useState<HTMLElement | null>(null)
  const isInviteUserPopoverOpen = Boolean(anchorInviteUserPopoverElement)

  const inviteUserPopoverId = isInviteUserPopoverOpen ? 'invite-board-user-popover' : undefined

  const toggleInviteUserPopover = (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => {
    if (!anchorInviteUserPopoverElement) {
      setAnchorInviteUserPopoverElement(event.currentTarget)
    } else {
      setAnchorInviteUserPopoverElement(null)
    }
  }

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateNewBoardInvitationBodyType>({
    resolver: zodResolver(CreateNewBoardInvitationBody),
    defaultValues: { invitee_email: '' }
  })

  useEffect(() => {
    if (isInviteUserPopoverOpen) {
      reset()
    }
  }, [isInviteUserPopoverOpen, reset])

  const { socket } = useAppSelector((state) => state.app)

  const [addNewBoardInvitationMutation, { isError, error }] = useAddNewBoardInvitationMutation()

  const onSubmit = handleSubmit(async (values) => {
    addNewBoardInvitationMutation({ ...values, board_id: boardId }).then((res) => {
      if (!res.error) {
        reset()
        setAnchorInviteUserPopoverElement(null)

        const invitation = res.data?.result

        socket?.emit('CLIENT_USER_INVITED_TO_BOARD', invitation)
      }
    })
  })

  useEffect(() => {
    if (isError && isUnprocessableEntityError<CreateNewBoardInvitationBodyType>(error)) {
      const formError = error.data.errors

      if (formError) {
        for (const [key, value] of Object.entries(formError)) {
          setError(key as keyof CreateNewBoardInvitationBodyType, {
            type: value.type,
            message: value.msg
          })
        }
      }
    }
  }, [isError, error, setError])

  return (
    <Box>
      <Tooltip title='Invite user to this board!'>
        <Button
          size='small'
          color='secondary'
          variant='contained'
          startIcon={<PersonAddAltIcon />}
          onClick={toggleInviteUserPopover}
        >
          Invite
        </Button>
      </Tooltip>
      <Popover
        id={inviteUserPopoverId}
        open={isInviteUserPopoverOpen}
        anchorEl={anchorInviteUserPopoverElement}
        onClose={toggleInviteUserPopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <form onSubmit={onSubmit}>
          <Box
            sx={{
              p: '15px 20px 20px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Typography component='span' sx={{ fontWeight: 600, fontSize: '16px' }}>
              Invite User To This Board!
            </Typography>
            <Box>
              <TextFieldInput
                fullWidth
                name='invitee_email'
                register={register}
                type='email'
                label='Enter email to invite...'
                variant='outlined'
                error={!!errors['invitee_email']}
              />
              <FieldErrorAlert errorMessage={errors.invitee_email?.message} />
            </Box>
            <Box sx={{ alignSelf: 'flex-end' }}>
              <Button className='interceptor-loading' type='submit' variant='contained' color='info'>
                Invite
              </Button>
            </Box>
          </Box>
        </form>
      </Popover>
    </Box>
  )
}
