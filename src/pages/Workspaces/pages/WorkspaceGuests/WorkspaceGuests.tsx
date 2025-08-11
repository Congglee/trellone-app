import ClearIcon from '@mui/icons-material/Clear'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import InputBase from '@mui/material/InputBase'
import List from '@mui/material/List'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Navigate, useParams } from 'react-router-dom'
import path from '~/constants/path'
import MemberItemSkeleton from '~/pages/Workspaces/components/SkeletonLoading/MemberItemSkeleton'
import WorkspaceCollaboratorsHeader from '~/pages/Workspaces/components/WorkspaceCollaboratorsHeader'
import { useGetWorkspaceQuery } from '~/queries/workspaces'
import { UserType } from '~/schemas/user.schema'

export default function WorkspaceGuests() {
  const { workspaceId } = useParams()

  const { data: workspaceData, isLoading } = useGetWorkspaceQuery(workspaceId!)
  const workspace = workspaceData?.result

  const guests = useMemo(() => {
    return (workspace?.guests || []) as UserType[]
  }, [workspace?.guests])

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
                inputProps={{ 'aria-label': 'filter by name' }}
              />
            </Paper>
          </Box>

          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => <MemberItemSkeleton key={`skeleton-${index}`} />)
              : guests.map((guest) => {
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
                              bgcolor: (t) => (t.palette.mode === 'dark' ? 'grey.800' : 'grey.400'),
                              color: (t) => (t.palette.mode === 'dark' ? 'grey.100' : 'white')
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
                          <Button
                            size='small'
                            variant='outlined'
                            disabled={totalGuestBoardCounts === 0}
                            sx={{ borderRadius: 1, textTransform: 'none', minWidth: 120 }}
                          >
                            View boards ({totalGuestBoardCounts})
                          </Button>
                          <Button
                            size='small'
                            variant='outlined'
                            disabled
                            sx={{ borderRadius: 1, textTransform: 'none', minWidth: 120 }}
                          >
                            Add to Workspace
                          </Button>
                          <Button
                            size='small'
                            variant='outlined'
                            sx={{ borderRadius: 1, textTransform: 'none', minWidth: 120 }}
                            startIcon={<ClearIcon />}
                          >
                            Remove...
                          </Button>
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
