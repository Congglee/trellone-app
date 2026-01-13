import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import InputBase from '@mui/material/InputBase'
import List from '@mui/material/List'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useMemo, useState, type ChangeEvent } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import SEO from '~/components/SEO'
import path from '~/constants/path'
import { WorkspacePermission } from '~/constants/permissions'
import { WorkspaceRole } from '~/constants/type'
import { useWorkspacePermission } from '~/hooks/use-permissions'
import { useDebounce } from '~/hooks/use-debounce'
import { useAppSelector } from '~/lib/redux/hooks'
import MemberItemSkeleton from '~/pages/Workspaces/components/SkeletonLoading/MemberItemSkeleton'
import WorkspaceCollaboratorsHeader from '~/pages/Workspaces/components/WorkspaceCollaboratorsHeader'
import LeaveWorkspace from '~/pages/Workspaces/pages/WorkspaceMembers/components/LeaveWorkspace'
import RemoveMemberWorkspace from '~/pages/Workspaces/pages/WorkspaceMembers/components/RemoveMemberWorkspace'
import RoleSelect from '~/pages/Workspaces/pages/WorkspaceMembers/components/RoleSelect'
import ViewMemberBoards from '~/pages/Workspaces/pages/WorkspaceMembers/components/ViewMemberBoards'
import { useGetWorkspaceQuery } from '~/queries/workspaces'

export default function WorkspaceMembers() {
  const { workspaceId } = useParams()

  const { profile } = useAppSelector((state) => state.auth)

  const { data: workspaceData, isLoading, isError } = useGetWorkspaceQuery(workspaceId!)
  const workspace = workspaceData?.result

  const members = useMemo(() => workspace?.members || [], [workspace?.members])

  const { hasPermission } = useWorkspacePermission(workspace)

  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')

  const debounceWorkspaceMembersSearch = useDebounce((value: string) => {
    setDebouncedSearchText(value)
  }, 500)

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    setSearchText(value)
    // Normalize once here to avoid repeating in filter
    debounceWorkspaceMembersSearch(value.trim().toLowerCase())
  }

  // Memoized filtering by username and display name (case-insensitive)
  const filteredMembers = useMemo(() => {
    if (!debouncedSearchText) {
      return members
    }

    return members.filter((member) => {
      const username = (member.username || '').toLowerCase()
      const displayName = (member.display_name || '').toLowerCase()

      return username.includes(debouncedSearchText) || displayName.includes(debouncedSearchText)
    })
  }, [members, debouncedSearchText])

  if (isError) {
    return <Navigate to={path.boardsList} />
  }

  return (
    <Box>
      <SEO
        title={workspace?.title ? `${workspace.title} - Members` : 'Workspace Members'}
        description={`Manage workspace members for ${workspace?.title || 'your workspace'} in Trellone.`}
        noIndex
        noFollow
      />

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
          value={searchText}
          onChange={handleSearchChange}
          inputProps={{ 'aria-label': 'filter by name' }}
        />
      </Paper>

      <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => <MemberItemSkeleton key={`skeleton-${index}`} />)
          : filteredMembers.length > 0 &&
            filteredMembers.map((member) => {
              const isCurrentUser = member.user_id === profile?._id
              const currentUserMember = members.find((m) => m.user_id === profile?._id)
              const currentUserRole = currentUserMember?.role

              let buttonText = 'Remove'

              if (isCurrentUser) {
                buttonText = 'Leave'
              } else if (currentUserRole === WorkspaceRole.Admin) {
                buttonText = 'Remove...'
              } else if (currentUserRole === WorkspaceRole.Normal) {
                buttonText = 'Remove...'
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
                          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.400'),
                          color: (theme) => (theme.palette.mode === 'dark' ? 'grey.100' : 'white')
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
                        workspaceId={workspaceId as string}
                        userId={member.user_id}
                        memberDisplayName={member.display_name}
                        showRemoveButton={!isCurrentUser && hasPermission(WorkspacePermission.ManageMembers)}
                      />
                      <RoleSelect
                        currentRole={member.role}
                        disabled={!hasPermission(WorkspacePermission.ManageMembers) || isCurrentUser}
                        userId={member.user_id}
                        workspaceId={workspaceId as string}
                      />
                      {buttonText === 'Remove...' && (
                        <RemoveMemberWorkspace
                          isDisabled={!hasPermission(WorkspacePermission.ManageMembers)}
                          buttonText={buttonText}
                          workspaceId={workspaceId as string}
                          userId={member.user_id}
                        />
                      )}
                      {buttonText === 'Leave' && (
                        <LeaveWorkspace buttonText={buttonText} workspaceId={workspaceId as string} />
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
