import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import WorkspaceAvatar from '~/components/Workspace/WorkspaceAvatar'
import { mockWorkspacesList } from '~/constants/mock-data'
import WorkspaceBoards from '~/pages/Workspaces/BoardsList/components/WorkspaceBoards'

export default function BoardsList() {
  return (
    <Stack spacing={4}>
      <Typography variant='h6' sx={{ pl: 1 }}>
        Your Workspaces
      </Typography>

      {mockWorkspacesList?.map((workspace) => (
        <Stack key={workspace._id} spacing={1}>
          <Stack alignItems='center' direction='row' spacing={1} sx={{ pl: 1 }}>
            <WorkspaceAvatar workspaceName={workspace.title} avatarSize={{ width: 25, height: 25 }} />
            <Typography variant='subtitle1'>Your Boards</Typography>
          </Stack>
          <WorkspaceBoards />
        </Stack>
      ))}
    </Stack>
  )
}
