import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
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
        gap: 2.5
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
              ? (theme) => (theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light')
              : 'transparent',
            color: isMembersActive
              ? (theme) => (theme.palette.mode === 'dark' ? 'primary.contrastText' : 'primary.contrastText')
              : 'text.secondary',
            '&:hover': {
              bgcolor: isMembersActive
                ? (theme) => (theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light')
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
              ? (theme) => (theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light')
              : 'transparent',
            color: isGuestsActive
              ? (theme) => (theme.palette.mode === 'dark' ? 'primary.contrastText' : 'primary.contrastText')
              : 'text.secondary',
            '&:hover': {
              bgcolor: isGuestsActive
                ? (theme) => (theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light')
                : 'action.hover'
            },
            borderRadius: 1,
            px: 1.25,
            py: 1
          }}
        >
          Guests ({guests.length})
        </Button>
      </Stack>
    </Box>
  )
}
