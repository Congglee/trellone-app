import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import InputBase from '@mui/material/InputBase'
import List from '@mui/material/List'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Navigate, useParams } from 'react-router-dom'
import { WorkspaceRole } from '~/constants/type'
import path from '~/constants/path'
import { useWorkspacePermission } from '~/hooks/use-permissions'
import { useAppSelector } from '~/lib/redux/hooks'
import { useGetWorkspaceQuery } from '~/queries/workspaces'
import RoleSelect from '~/pages/Workspaces/pages/WorkspaceMembers/components/RoleSelect'

export default function WorkspaceMembers() {
  const { workspaceId } = useParams()
  const { profile } = useAppSelector((state) => state.auth)

  const { data: workspaceData, isLoading } = useGetWorkspaceQuery(workspaceId!)
  const workspace = workspaceData?.result
  const members = workspace?.members || []
  const guests = workspace?.guests || []

  const totalCollaborators = members.length + guests.length

  const { isGuest } = useWorkspacePermission(workspace)

  if (isGuest) {
    return <Navigate to={path.boardsList} replace />
  }

  if (!workspace && !isLoading) {
    return <Navigate to={path.boardsList} />
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        gap: 3,
        p: { xs: 2, md: 3 },
        width: { xs: '100vw', sm: '100%' },
        height: '100%'
      }}
    >
      <Box
        sx={{
          width: 280,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Stack direction='row' alignItems='center' gap={1}>
          <Typography variant='h6'>Collaborators</Typography>
          <Chip size='small' label={`${totalCollaborators}`} />
        </Stack>

        <Stack component='nav' gap={0.5}>
          <Button
            fullWidth
            startIcon={<PeopleAltOutlinedIcon />}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: (t) => (t.palette.mode === 'dark' ? 'primary.dark' : 'primary.light'),
              color: (t) => (t.palette.mode === 'dark' ? 'primary.contrastText' : 'primary.contrastText'),
              '&:hover': {
                bgcolor: (t) => (t.palette.mode === 'dark' ? 'primary.dark' : 'primary.light')
              },
              borderRadius: 1,
              px: 1.25,
              py: 1
            }}
          >
            Workspace members ({members.length})
          </Button>

          <Button
            fullWidth
            startIcon={<PersonOutlineOutlinedIcon />}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              color: 'text.secondary',
              borderRadius: 1,
              px: 1.25,
              py: 1
            }}
          >
            Guests ({guests.length})
          </Button>

          <Button
            fullWidth
            startIcon={<MailOutlineOutlinedIcon />}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              color: 'text.secondary',
              borderRadius: 1,
              px: 1.25,
              py: 1
            }}
          >
            Join requests (0)
          </Button>

          <Divider sx={{ my: 2 }} />
        </Stack>

        <Paper
          variant='outlined'
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(120, 81, 169, 0.25)' : 'rgba(120, 81, 169, 0.1)'),
            borderColor: (t) => (t.palette.mode === 'dark' ? 'primary.dark' : 'primary.light')
          }}
        >
          <Typography fontWeight={700} gutterBottom>
            Upgrade for more permissions controls
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Decide who can send invitations, edit Workspace settings, and more with Premium.
          </Typography>
          <Box sx={{ mt: 1.5 }}>
            <Button
              variant='text'
              color='primary'
              sx={{
                textTransform: 'none',
                px: 0,
                '&:hover': {
                  textDecoration: 'underline',
                  bgcolor: 'transparent'
                }
              }}
            >
              Try Premium free for 14 days
            </Button>
          </Box>
        </Paper>
      </Box>

      <Divider orientation='vertical' flexItem />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ textAlign: 'right', mb: 2 }}>
          <Button
            variant='contained'
            startIcon={<PeopleAltOutlinedIcon />}
            sx={{ textTransform: 'none', borderRadius: 1 }}
          >
            Invite Workspace members
          </Button>
        </Box>

        <Stack direction='row' alignItems='center' justifyContent='space-between' gap={2} sx={{ mb: 1.5 }}>
          <Typography variant='h6' sx={{ fontWeight: 700 }}>
            Workspace members ({members.length})
          </Typography>
        </Stack>

        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          Workspace members can view and join all Workspace visible boards and create new boards in the Workspace.
        </Typography>

        <Divider />

        <Paper
          variant='outlined'
          sx={{
            mt: 3,
            mb: 2,
            px: 2,
            borderRadius: 1,
            bgcolor: 'transparent'
          }}
        >
          <InputBase
            placeholder='Filter by name'
            sx={{
              py: 1.25,
              width: '100%',
              color: 'text.primary'
            }}
            inputProps={{ 'aria-label': 'filter by name' }}
          />
        </Paper>

        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {members.length > 0 &&
            members.map((member) => {
              const isCurrentUser = member.user_id === profile?._id
              const currentUserMember = members.find((m) => m.user_id === profile?._id)
              const currentUserRole = currentUserMember?.role

              let buttonText = 'Remove'
              let isDisabled = false

              if (isCurrentUser) {
                buttonText = 'Leave'
              } else if (currentUserRole === WorkspaceRole.Admin) {
                buttonText = 'Remove'
                isDisabled = false
              } else if (currentUserRole === WorkspaceRole.Normal) {
                buttonText = 'Remove'
                isDisabled = true
              }

              return (
                <Paper
                  key={member._id}
                  variant='outlined'
                  sx={{
                    p: 1.25,
                    borderRadius: 1,
                    bgcolor: 'transparent'
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    justifyContent='space-between'
                    gap={2}
                  >
                    <Stack direction='row' alignItems='center' gap={1.5} sx={{ minWidth: 0 }}>
                      <Avatar
                        src={member.avatar}
                        alt='User avatar'
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: (t) => (t.palette.mode === 'dark' ? 'grey.800' : 'grey.400'),
                          color: (t) => (t.palette.mode === 'dark' ? 'grey.100' : 'white')
                        }}
                      />

                      <Box sx={{ minWidth: 0 }}>
                        <Typography noWrap fontWeight={700}>
                          {member.display_name}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {member.username}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction='row' alignItems='center' gap={1} flexWrap='wrap'>
                      <Button
                        size='small'
                        variant='outlined'
                        disabled
                        sx={{ borderRadius: 1, textTransform: 'none', minWidth: 120 }}
                      >
                        View boards (0)
                      </Button>
                      <RoleSelect
                        currentRole={member.role}
                        disabled={currentUserRole !== WorkspaceRole.Admin || isCurrentUser}
                        onRoleChange={(newRole) => {
                          console.log(`Changing role from ${member.role} to ${newRole}`)
                        }}
                      />
                      <Button
                        size='small'
                        variant='outlined'
                        disabled={isDisabled}
                        sx={{ borderRadius: 1, textTransform: 'none', minWidth: 120 }}
                      >
                        {buttonText}
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              )
            })}
        </List>
      </Box>
    </Box>
  )
}
