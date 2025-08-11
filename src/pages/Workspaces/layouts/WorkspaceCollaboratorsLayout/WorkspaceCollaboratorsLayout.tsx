import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { Outlet, useParams } from 'react-router-dom'
import WorkspaceCollaboratorsMenu from '~/pages/Workspaces/components/WorkspaceCollaboratorsMenu'
import InviteWorkspaceMembersDialog from '~/pages/Workspaces/pages/WorkspaceMembers/components/InviteWorkspaceMembersDialog'

export default function WorkspaceCollaboratorsLayout() {
  const { workspaceId } = useParams()

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
      <WorkspaceCollaboratorsMenu />

      <Divider orientation='vertical' flexItem />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <InviteWorkspaceMembersDialog workspaceId={workspaceId as string} />
        <Outlet />
      </Box>
    </Box>
  )
}
