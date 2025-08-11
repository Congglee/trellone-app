import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link, useLocation, useParams } from 'react-router-dom'
import path from '~/constants/path'
import { useGetWorkspaceQuery } from '~/queries/workspaces'

export default function WorkspaceCollaboratorsMenu() {
  const { workspaceId } = useParams()
  const location = useLocation()

  const { data: workspaceData } = useGetWorkspaceQuery(workspaceId!)
  const workspace = workspaceData?.result
  const members = workspace?.members || []
  const guests = workspace?.guests || []

  const totalCollaborators = members.length + guests.length

  const membersPath = path.workspaceMembers.replace(':workspaceId', workspaceId!)
  const guestsPath = path.workspaceGuests.replace(':workspaceId', workspaceId!)

  const isMembersActive = location.pathname === membersPath
  const isGuestsActive = location.pathname === guestsPath

  return (
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
          component={Link}
          to={path.workspaceMembers.replace(':workspaceId', workspaceId!)}
          fullWidth
          startIcon={<PeopleAltOutlinedIcon />}
          sx={{
            justifyContent: 'flex-start',
            textTransform: 'none',
            bgcolor: isMembersActive
              ? (t) => (t.palette.mode === 'dark' ? 'primary.dark' : 'primary.light')
              : 'transparent',
            color: isMembersActive
              ? (t) => (t.palette.mode === 'dark' ? 'primary.contrastText' : 'primary.contrastText')
              : 'text.secondary',
            '&:hover': {
              bgcolor: isMembersActive
                ? (t) => (t.palette.mode === 'dark' ? 'primary.dark' : 'primary.light')
                : 'action.hover'
            },
            borderRadius: 1,
            px: 1.25,
            py: 1
          }}
        >
          Workspace members ({members.length})
        </Button>

        <Button
          component={Link}
          to={path.workspaceGuests.replace(':workspaceId', workspaceId!)}
          fullWidth
          startIcon={<PersonOutlineOutlinedIcon />}
          sx={{
            justifyContent: 'flex-start',
            textTransform: 'none',
            bgcolor: isGuestsActive
              ? (t) => (t.palette.mode === 'dark' ? 'primary.dark' : 'primary.light')
              : 'transparent',
            color: isGuestsActive
              ? (t) => (t.palette.mode === 'dark' ? 'primary.contrastText' : 'primary.contrastText')
              : 'text.secondary',
            '&:hover': {
              bgcolor: isGuestsActive
                ? (t) => (t.palette.mode === 'dark' ? 'primary.dark' : 'primary.light')
                : 'action.hover'
            },
            borderRadius: 1,
            px: 1.25,
            py: 1
          }}
        >
          Guests ({guests.length})
        </Button>

        <Button
          disabled
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
            disabled
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
  )
}
