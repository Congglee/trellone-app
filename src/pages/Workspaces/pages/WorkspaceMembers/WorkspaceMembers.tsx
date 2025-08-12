import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import InputBase from '@mui/material/InputBase'
import List from '@mui/material/List'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import path from '~/constants/path'
import { WorkspaceMemberAction, WorkspaceRole } from '~/constants/type'
import { useAppSelector } from '~/lib/redux/hooks'
import WorkspaceCollaboratorsHeader from '~/pages/Workspaces/components/WorkspaceCollaboratorsHeader'
import LeaveWorkspace from '~/pages/Workspaces/pages/WorkspaceMembers/components/LeaveWorkspace'
import MemberItemSkeleton from '~/pages/Workspaces/components/SkeletonLoading/MemberItemSkeleton'
import RemoveMemberWorkspace from '~/pages/Workspaces/pages/WorkspaceMembers/components/RemoveMemberWorkspace'
import RoleSelect from '~/pages/Workspaces/pages/WorkspaceMembers/components/RoleSelect'
import ViewMemberBoards from '~/pages/Workspaces/pages/WorkspaceMembers/components/ViewMemberBoards'
import { useGetWorkspaceQuery, useUpdateWorkspaceMutation } from '~/queries/workspaces'
import { WorkspaceMemberRoleType } from '~/schemas/workspace.schema'

export default function WorkspaceMembers() {
  const { workspaceId } = useParams()

  const { profile } = useAppSelector((state) => state.auth)

  const navigate = useNavigate()

  const { data: workspaceData, isLoading } = useGetWorkspaceQuery(workspaceId!)
  const workspace = workspaceData?.result
  const members = workspace?.members || []

  const [updateWorkspaceMutation, { isError }] = useUpdateWorkspaceMutation()

  const onLeaveWorkspace = async (userId: string) => {
    const payload = {
      action: WorkspaceMemberAction.Leave,
      user_id: userId
    }

    await updateWorkspaceMutation({ id: workspaceId as string, body: { member: payload } }).then((res) => {
      if (!res.error) {
        navigate(path.boardsList)
      }
    })
  }

  const onMemberWorkspaceRoleChange = async (userId: string, newRole: WorkspaceMemberRoleType) => {
    const payload = {
      action: WorkspaceMemberAction.EditRole,
      user_id: userId,
      role: newRole
    }

    await updateWorkspaceMutation({ id: workspaceId as string, body: { member: payload } })
  }

  const onRemoveMemberFromWorkspace = async (userId: string) => {
    const payload = {
      action: WorkspaceMemberAction.RemoveFromWorkspace,
      user_id: userId
    }

    await updateWorkspaceMutation({ id: workspaceId as string, body: { member: payload } })
  }

  const onRemoveMemberFromWorkspaceBoard = async (userId: string, boardId: string) => {
    const payload = {
      action: WorkspaceMemberAction.RemoveFromBoard,
      user_id: userId,
      board_id: boardId
    }

    await updateWorkspaceMutation({ id: workspaceId as string, body: { member: payload } })
  }

  useEffect(() => {
    if (isError) {
      toast.error('Not enough admins')
    }
  }, [isError])

  if (!workspace && !isLoading) {
    return <Navigate to={path.boardsList} />
  }

  return (
    <Box>
      <Helmet>
        <title>{workspace?.title ? `${workspace.title} | Members | Trellone` : 'Workspace | Members | Trellone'}</title>
        <meta
          name='description'
          content='Organize anything, together. Trellone is a collaboration tool that organizes your projects into boards.'
        />
      </Helmet>

      <WorkspaceCollaboratorsHeader
        heading={isLoading ? 'Workspace members' : `Workspace members (${members.length})`}
        description='Workspace members can view and join all Workspace visible boards and create new boards in the Workspace.'
      />

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
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => <MemberItemSkeleton key={`skeleton-${index}`} />)
          : members.length > 0 &&
            members.map((member) => {
              const isCurrentUser = member.user_id === profile?._id
              const currentUserMember = members.find((m) => m.user_id === profile?._id)
              const currentUserRole = currentUserMember?.role

              let buttonText = 'Remove'
              let isDisabled = false

              if (isCurrentUser) {
                buttonText = 'Leave'
              } else if (currentUserRole === WorkspaceRole.Admin) {
                buttonText = 'Remove...'
                isDisabled = false
              } else if (currentUserRole === WorkspaceRole.Normal) {
                buttonText = 'Remove...'
                isDisabled = true
              }

              const memberBoards =
                workspace?.boards.filter((board) => board.members?.some((m) => m.user_id === member.user_id)) || []

              const totalMemberBoardCounts = memberBoards.length

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
                      <ViewMemberBoards
                        totalMemberBoardCounts={totalMemberBoardCounts}
                        memberBoards={memberBoards}
                        member={member}
                        showRemoveButton={!isCurrentUser && currentUserRole === WorkspaceRole.Admin}
                        onRemoveMemberFromWorkspaceBoard={onRemoveMemberFromWorkspaceBoard}
                      />
                      <RoleSelect
                        currentRole={member.role}
                        disabled={currentUserRole !== WorkspaceRole.Admin || isCurrentUser}
                        onRoleChange={(newRole) => onMemberWorkspaceRoleChange(member.user_id, newRole)}
                      />
                      {buttonText === 'Remove...' && (
                        <RemoveMemberWorkspace
                          isDisabled={isDisabled}
                          buttonText={buttonText}
                          onRemoveMemberFromWorkspace={onRemoveMemberFromWorkspace}
                          userId={member.user_id}
                        />
                      )}
                      {buttonText === 'Leave' && (
                        <LeaveWorkspace
                          isDisabled={isDisabled}
                          buttonText={buttonText}
                          onLeaveWorkspace={onLeaveWorkspace}
                          userId={member.user_id}
                        />
                      )}
                    </Stack>
                  </Stack>
                </Paper>
              )
            })}
      </List>
    </Box>
  )
}
