import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
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
import { useWorkspacePermission } from '~/hooks/use-permissions'
import { useAppSelector } from '~/lib/redux/hooks'
import MemberItemSkeleton from '~/pages/Workspaces/components/SkeletonLoading/MemberItemSkeleton'
import WorkspaceCollaboratorsHeader from '~/pages/Workspaces/components/WorkspaceCollaboratorsHeader'
import RemoveGuestWorkspace from '~/pages/Workspaces/pages/WorkspaceGuests/components/RemoveGuestWorkspace'
import ViewGuestBoards from '~/pages/Workspaces/pages/WorkspaceGuests/components/ViewGuestBoards'
import { useAddGuestToWorkspaceMutation, useGetWorkspaceQuery } from '~/queries/workspaces'
import { UserType } from '~/schemas/user.schema'
import { useDebounce } from '~/hooks/use-debounce'

export default function WorkspaceGuests() {
  const { workspaceId } = useParams()

  const { profile } = useAppSelector((state) => state.auth)

  const { data: workspaceData, isLoading, isError } = useGetWorkspaceQuery(workspaceId!)
  const workspace = workspaceData?.result

  const guests = useMemo(() => {
    return (workspace?.guests || []) as UserType[]
  }, [workspace?.guests])

  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')

  const debounceWorkspaceGuestsSearch = useDebounce((value: string) => {
    setDebouncedSearchText(value)
  }, 500)

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    setSearchText(value)
    debounceWorkspaceGuestsSearch(value.trim().toLowerCase())
  }

  const filteredGuests = useMemo(() => {
    if (!debouncedSearchText) {
      return guests
    }

    return guests.filter((guest) => {
      const username = (guest.username || '').toLowerCase()
      const displayName = (guest.display_name || '').toLowerCase()

      return username.includes(debouncedSearchText) || displayName.includes(debouncedSearchText)
    })
  }, [guests, debouncedSearchText])

  // Calculate guest board counts and single-board guests
  const { singleBoardGuestCount } = useMemo(() => {
    if (!workspace?.boards) {
      return { singleBoardGuestCount: 0 }
    }

    // Create a map to count how many boards each guest is a member of
    const boardCounts = new Map<string, number>()

    // Initialize all guests with 0 count
    guests.forEach((guest) => {
      boardCounts.set(guest._id, 0)
    })

    // Count board memberships for each guest
    workspace.boards.forEach((board) => {
      if (board.members) {
        board.members.forEach((member) => {
          // Check if this member is a guest (not a workspace member)
          const isGuest = guests.some((guest) => guest._id === member.user_id)

          if (isGuest) {
            const guestId = member.user_id
            const currentCount = boardCounts.get(guestId) || 0
            boardCounts.set(guestId, currentCount + 1)
          }
        })
      }
    })

    // Count single-board guests (guests who are members of exactly 1 board)
    const singleBoardCount = Array.from(boardCounts.values()).filter((count) => count === 1).length

    return { singleBoardGuestCount: singleBoardCount }
  }, [workspace?.boards, guests])

  const { socket } = useAppSelector((state) => state.app)

  const [addGuestToWorkspaceMutation] = useAddGuestToWorkspaceMutation()

  const addGuestToWorkspace = (userId: string) => {
    addGuestToWorkspaceMutation({ workspace_id: workspaceId as string, user_id: userId }).then((res) => {
      if (!res.error) {
        socket?.emit('CLIENT_USER_UPDATED_WORKSPACE', workspaceId)
      }
    })
  }

  const { hasPermission } = useWorkspacePermission(workspace)

  if (isError) {
    return <Navigate to={path.boardsList} />
  }

  return (
    <Box>
      <SEO
        title={workspace?.title ? `${workspace.title} - Guests` : 'Workspace Guests'}
        description={`Manage workspace guests for ${workspace?.title || 'your workspace'} in Trellone.`}
        noIndex
        noFollow
      />

      <WorkspaceCollaboratorsHeader
        heading={`Guests (${guests.length})`}
        description="Guests can only view and edit the boards to which they've been added."
      />

      {(!guests || guests.length === 0) && (
        <>
          <Box sx={{ py: 2, textAlign: 'center', fontStyle: 'italic' }}>
            <Typography variant='body1' color='text.secondary'>
              There are no guests in this Workspace.
            </Typography>
          </Box>

          <Divider />
        </>
      )}

      {guests.length > 0 && (
        <>
          <Box sx={{ my: 2 }}>
            <Typography variant='h6' sx={{ fontSize: 18, mb: 1 }}>
              Single-board guests ({singleBoardGuestCount})
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
              Single-board guests are members of only one Workspace board.
            </Typography>
            <Paper
              variant='outlined'
              sx={{
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
          </Box>

          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => <MemberItemSkeleton key={`skeleton-${index}`} />)
              : filteredGuests.map((guest) => {
                  const isCurrentGuestUser = guest._id === profile?._id

                  const guestBoards =
                    workspace?.boards.filter((board) => board.members?.some((m) => m.user_id === guest._id)) || []
                  const totalGuestBoardCounts = guestBoards.length

                  return (
                    <Paper
                      key={guest._id}
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
                            src={guest.avatar}
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
                              {guest.display_name}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                              {guest.username}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack direction='row' alignItems='center' gap={1} flexWrap='wrap'>
                          <ViewGuestBoards
                            totalGuestBoardCounts={totalGuestBoardCounts}
                            guestBoards={guestBoards}
                            guest={guest}
                            showRemoveButton={!isCurrentGuestUser && hasPermission(WorkspacePermission.ManageGuests)}
                            workspaceId={workspaceId as string}
                          />
                          <Button
                            size='small'
                            variant='outlined'
                            onClick={() => addGuestToWorkspace(guest._id)}
                            sx={{ borderRadius: 1, textTransform: 'none', minWidth: 120 }}
                            disabled={!hasPermission(WorkspacePermission.ManageGuests)}
                          >
                            Add to Workspace
                          </Button>
                          <RemoveGuestWorkspace
                            userId={guest._id}
                            workspaceId={workspaceId as string}
                            isDisabled={!hasPermission(WorkspacePermission.ManageGuests)}
                          />
                        </Stack>
                      </Stack>
                    </Paper>
                  )
                })}
          </List>
        </>
      )}
    </Box>
  )
}
