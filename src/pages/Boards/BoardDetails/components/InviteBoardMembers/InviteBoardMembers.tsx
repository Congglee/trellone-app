import { zodResolver } from '@hookform/resolvers/zod'
import CloseIcon from '@mui/icons-material/Close'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import TextFieldInput from '~/components/Form/TextFieldInput'
import { BoardRole, BoardRoleValues, WorkspaceRole } from '~/constants/type'
import { useAppSelector } from '~/lib/redux/hooks'
import { useAddNewBoardInvitationMutation } from '~/queries/invitations'
import { BoardResType } from '~/schemas/board.schema'
import { CreateNewBoardInvitationBody, CreateNewBoardInvitationBodyType } from '~/schemas/invitation.schema'
import { UserType } from '~/schemas/user.schema'
import { isUnprocessableEntityError } from '~/utils/error-handlers'

interface InviteBoardMembersProps {
  boardId: string
  workspaceId: string
}

type WorkspaceItem = BoardResType['result']['workspace']

const getWorkspaceRole = (userId: string, workspace?: WorkspaceItem) => {
  if (!workspace) return 'Workspace member'

  // Check if user is in workspace members
  const workspaceMember = workspace.members.find((member) => member.user_id === userId)

  if (workspaceMember) {
    return workspaceMember.role === WorkspaceRole.Admin ? 'Workspace admin' : 'Workspace member'
  }

  // Check if user is in workspace guests
  const isGuest = workspace.guests.some((guest: string | UserType) => {
    // Handle both string and object formats for guests
    if (typeof guest === 'string') {
      return guest === userId
    }

    return guest._id === userId
  })

  if (isGuest) {
    return 'Workspace guest'
  }

  // Default fallback
  return 'Workspace member'
}

export default function InviteBoardMembers({ boardId, workspaceId }: InviteBoardMembersProps) {
  const [inviteBoardMemberOpen, setInviteBoardMemberOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  const { activeBoard } = useAppSelector((state) => state.board)
  const { profile } = useAppSelector((state) => state.auth)

  const boardMembers = activeBoard?.members || []
  const workspace = activeBoard?.workspace

  const handleInviteBoardMemberOpen = () => {
    setInviteBoardMemberOpen(true)
  }

  const handleInviteBoardMemberClose = () => {
    setInviteBoardMemberOpen(false)
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const {
    register,
    control,
    setError,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateNewBoardInvitationBodyType>({
    resolver: zodResolver(CreateNewBoardInvitationBody),
    defaultValues: { invitee_email: '', role: BoardRole.Member }
  })

  useEffect(() => {
    if (inviteBoardMemberOpen) {
      reset()
    }
  }, [inviteBoardMemberOpen, reset])

  const { socket } = useAppSelector((state) => state.app)

  const [addNewBoardInvitationMutation, { isError, error }] = useAddNewBoardInvitationMutation()

  const onSubmit = handleSubmit(async (values) => {
    addNewBoardInvitationMutation({ ...values, board_id: boardId, workspace_id: workspaceId }).then((res) => {
      if (!res.error) {
        reset()
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
      <Tooltip title='Share this board'>
        <Button
          size='small'
          color='secondary'
          variant='contained'
          startIcon={<PersonAddAltIcon />}
          onClick={handleInviteBoardMemberOpen}
        >
          Invite
        </Button>
      </Tooltip>

      <Dialog
        open={inviteBoardMemberOpen}
        onClose={handleInviteBoardMemberClose}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: {
            color: (theme) => (theme.palette.mode === 'dark' ? '#ffffff' : '#000000'),
            borderRadius: '12px',
            maxWidth: '600px'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1.5,
            fontSize: '18px',
            fontWeight: 600
          }}
        >
          Share board
          <IconButton
            onClick={handleInviteBoardMemberClose}
            sx={{
              color: (theme) => (theme.palette.mode === 'dark' ? '#ffffff' : '#666666'),
              '&:hover': {
                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#f5f5f5')
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 0 }}>
          <Box sx={{ mb: 3 }}>
            <form onSubmit={onSubmit}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <TextFieldInput
                  fullWidth
                  name='invitee_email'
                  register={register}
                  type='email'
                  placeholder='Email address'
                  variant='outlined'
                  error={!!errors['invitee_email']}
                />
                <FormControl sx={{ minWidth: 120 }}>
                  <Controller
                    name='role'
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value || ''}
                        onChange={(event) => field.onChange(event.target.value)}
                      >
                        <MenuItem value={BoardRole.Member}>Member</MenuItem>
                        <MenuItem value={BoardRole.Observer}>Observer</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
                <Button type='submit' variant='contained' className='interceptor-loading' sx={{ minWidth: '80px' }}>
                  Share
                </Button>
              </Box>
              <FieldErrorAlert errorMessage={errors.invitee_email?.message} />
            </form>
          </Box>

          <Divider sx={{ borderColor: (theme) => (theme.palette.mode === 'dark' ? '#4a5568' : '#e2e8f0') }} />

          <Box sx={{ mt: 1 }}>
            <Tabs
              variant='scrollable'
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                mb: 2,
                '& .MuiTab-root': {
                  color: (theme) => (theme.palette.mode === 'dark' ? '#a0aec0' : '#4a5568'),
                  textTransform: 'none',
                  fontSize: '14px',
                  fontWeight: 600
                },
                '& .Mui-selected': {
                  color: (theme) => (theme.palette.mode === 'dark' ? '#ffffff' : '#000000')
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#60a5fa' : '#3b82f6')
                }
              }}
            >
              <Tab label={`Board members ${boardMembers.length}`} />
            </Tabs>

            {activeTab === 0 && (
              <Box>
                {boardMembers.map((member) => {
                  const isCurrentUser = member.user_id === profile?._id

                  return (
                    <Box
                      key={member._id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        py: 2,
                        borderBottom: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#4a5568' : '#e2e8f0'}`,
                        '&:last-child': {
                          borderBottom: 'none'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#4a5568' : '#e2e8f0'),
                            color: (theme) => (theme.palette.mode === 'dark' ? '#ffffff' : '#000000'),
                            fontSize: '14px'
                          }}
                          src={member.avatar}
                          alt={member.display_name}
                        />
                        <Box>
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: 500,
                              color: (theme) => (theme.palette.mode === 'dark' ? '#ffffff' : '#000000')
                            }}
                          >
                            {member.display_name} {isCurrentUser && '(you)'}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '12px',
                              color: (theme) => (theme.palette.mode === 'dark' ? '#a0aec0' : '#4a5568')
                            }}
                          >
                            @{member.username} • {getWorkspaceRole(member.user_id, workspace)}
                          </Typography>
                        </Box>
                      </Box>
                      <FormControl size='small' sx={{ width: { xs: '60px', sm: '100px' }, flexShrink: 0 }}>
                        <Select value={member.role} disabled>
                          {BoardRoleValues.map((role) => (
                            <MenuItem key={role} value={role}>
                              <Typography
                                variant='body2'
                                sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                              >
                                {role}
                              </Typography>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  )
                })}
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
