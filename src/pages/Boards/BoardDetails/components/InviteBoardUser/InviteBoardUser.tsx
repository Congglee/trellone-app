import { zodResolver } from '@hookform/resolvers/zod'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CreateNewBoardInvitationBody, CreateNewBoardInvitationBodyType } from '~/schemas/invitation.schema'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import TextFieldInput from '~/components/Form/TextFieldInput'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useAddNewBoardInvitationMutation } from '~/queries/invitations'
import { isUnprocessableEntityError } from '~/utils/error-handlers'
import socket from '~/lib/socket'

interface InviteBoardUserProps {
  boardId: string
}

export default function InviteBoardUser({ boardId }: InviteBoardUserProps) {
  const [anchorPopoverElement, setAnchorPopoverElement] = useState<HTMLElement | null>(null)
  const isOpenPopover = Boolean(anchorPopoverElement)

  const popoverId = isOpenPopover ? 'invite-board-user-popover' : undefined

  const togglePopover = (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => {
    if (!anchorPopoverElement) {
      setAnchorPopoverElement(event.currentTarget)
    } else {
      setAnchorPopoverElement(null)
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
    if (isOpenPopover) {
      reset()
    }
  }, [isOpenPopover, reset])

  const [addNewBoardInvitationMutation, { isError, error }] = useAddNewBoardInvitationMutation()

  const onSubmit = handleSubmit(async (values) => {
    addNewBoardInvitationMutation({ ...values, board_id: boardId }).then((res) => {
      if (!res.error) {
        reset()
        setAnchorPopoverElement(null)

        const invitation = res.data?.result

        socket.emit('CLIENT_USER_INVITED_TO_BOARD', invitation)
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
          onClick={togglePopover}
        >
          Invite
        </Button>
      </Tooltip>
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={togglePopover}
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
