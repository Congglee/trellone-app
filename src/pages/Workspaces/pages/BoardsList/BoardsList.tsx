import CloseIcon from '@mui/icons-material/Close'
import InfoIcon from '@mui/icons-material/Info'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Button, CircularProgress, Link as MuiLink } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import WorkspaceAvatar from '~/components/Workspace/WorkspaceAvatar'
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_PAGE } from '~/constants/pagination'
import { useCategorizeWorkspaces } from '~/hooks/use-categorize-workspaces'
import { useInfiniteScroll } from '~/hooks/use-infinite-scroll'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import WorkspaceBoards from '~/pages/Workspaces/pages/BoardsList/components/WorkspaceBoards'
import { useGetWorkspacesQuery } from '~/queries/workspaces'
import { WorkspaceResType } from '~/schemas/workspace.schema'
import { appendWorkspaces, clearWorkspaces, setWorkspaces } from '~/store/slices/workspace.slice'

export default function BoardsList() {
  const dispatch = useAppDispatch()
  const { workspaces } = useAppSelector((state) => state.workspace)

  const [anchorGuestWorkspaceInfoPopoverElement, setAnchorGuestWorkspaceInfoPopoverElement] =
    useState<HTMLElement | null>(null)

  const isGuestWorkspaceInfoPopoverOpen = Boolean(anchorGuestWorkspaceInfoPopoverElement)

  const guestWorkspaceInfoPopoverId = 'guest-workspace-info-popover'

  const toggleGuestWorkspaceInfoPopover = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (isGuestWorkspaceInfoPopoverOpen) {
      setAnchorGuestWorkspaceInfoPopoverElement(null)
    } else {
      setAnchorGuestWorkspaceInfoPopoverElement(event.currentTarget)
    }
  }

  // Create skeleton workspace for loading state
  const generateSkeletonWorkspace = (index: number): WorkspaceResType['result'] => ({
    _id: `skeleton-${index}`,
    title: '',
    description: '',
    type: 'Public',
    logo: '',
    members: [],
    guests: [],
    boards: [],
    _destroy: false,
    created_at: new Date(),
    updated_at: new Date()
  })

  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGINATION_PAGE,
    total_page: 0
  })
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const {
    data: workspacesData,
    isLoading,
    isFetching,
    isError
  } = useGetWorkspacesQuery({ page: pagination.page, limit: DEFAULT_PAGINATION_LIMIT })

  // Clear workspaces on component unmount
  useEffect(() => {
    return () => {
      dispatch(clearWorkspaces())
    }
  }, [dispatch])

  // Handle workspace data updates
  useEffect(() => {
    if (workspacesData) {
      const { workspaces: workspacesList, page, total_page } = workspacesData.result

      setPagination({ page, total_page })

      if (page === DEFAULT_PAGINATION_PAGE) {
        // First page - replace workspaces
        dispatch(setWorkspaces(workspacesList))
      } else {
        // Subsequent pages - append new workspaces
        dispatch(appendWorkspaces(workspacesList))
      }

      setIsLoadingMore(false)
    }
  }, [workspacesData, dispatch])

  const loadMoreWorkspaces = () => {
    if (pagination.page < pagination.total_page && !isFetching) {
      setIsLoadingMore(true)
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
    }
  }

  // Infinite scroll hook - using window scroll instead of container scroll
  useInfiniteScroll({
    onLoadMore: loadMoreWorkspaces,
    hasMore: pagination.page < pagination.total_page,
    isLoading: isFetching || isLoadingMore,
    threshold: 200, // Trigger when 200px from bottom
    useWindowScroll: true // Use window scroll instead of container scroll
  })

  const { memberWorkspaces, guestWorkspaces } = useCategorizeWorkspaces(workspaces)

  const hasClosedBoards = useMemo(
    () => workspaces.some((workspace) => workspace.boards.some((board) => board._destroy)),
    [workspaces]
  )

  return (
    <Box>
      <Helmet>
        <title>Boards | Trellone</title>
        <meta
          name='description'
          content="Organize anything, together. Trellone is a collaboration tool that organizes your projects into boards. In one glance, know what's being worked on, who's working on what, and where something is in a process"
        />
      </Helmet>

      <Typography variant='h6' sx={{ pl: 1, mb: 2.5 }}>
        Your Workspaces
      </Typography>

      <Box>
        {isLoading && workspaces.length === 0 && !isError && (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <Stack key={`skeleton-${index}`} spacing={2} mb={4.5}>
                <Stack alignItems='center' direction='row' spacing={2} pl={1}>
                  <Skeleton
                    animation='wave'
                    variant='circular'
                    width={32}
                    height={32}
                    sx={{
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300')
                    }}
                  />
                  <Skeleton
                    animation='wave'
                    variant='rectangular'
                    width={180}
                    height={24}
                    sx={{
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300'),
                      borderRadius: 1
                    }}
                  />
                </Stack>
                <WorkspaceBoards workspace={generateSkeletonWorkspace(index)} isLoading={true} />
              </Stack>
            ))}
          </>
        )}

        {(isError || (!isLoading && memberWorkspaces.length === 0)) && (
          <Box sx={{ pl: 1, mb: 2.5 }}>
            <Typography variant='body1' color='text.secondary'>
              You are not a member of any workspace. Create a Workspace
            </Typography>
          </Box>
        )}

        {memberWorkspaces.length > 0 &&
          memberWorkspaces.map((workspace) => (
            <Stack key={workspace._id} spacing={2} mb={4.5}>
              <Stack alignItems='center' direction='row' spacing={2} pl={1}>
                <WorkspaceAvatar title={workspace.title} logo={workspace.logo} size={{ width: 32, height: 32 }} />
                <Typography variant='h6' fontWeight={600}>
                  {workspace.title}
                </Typography>
              </Stack>

              <WorkspaceBoards workspace={workspace} isLoading={false} />
            </Stack>
          ))}

        {guestWorkspaces.length > 0 &&
          guestWorkspaces.map((workspace) => (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, mb: 2.5, gap: 1 }}>
                <Typography variant='h6'>Guest Workspaces</Typography>
                <IconButton size='small' disableRipple sx={{ p: 0 }} onClick={toggleGuestWorkspaceInfoPopover}>
                  <InfoIcon />
                </IconButton>

                <Popover
                  id={guestWorkspaceInfoPopoverId}
                  open={isGuestWorkspaceInfoPopoverOpen}
                  anchorEl={anchorGuestWorkspaceInfoPopoverElement}
                  onClose={toggleGuestWorkspaceInfoPopover}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  slotProps={{
                    paper: { sx: { borderRadius: 2 } }
                  }}
                >
                  <Box sx={{ p: 1.5, maxWidth: '300px', width: '100%' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        position: 'relative'
                      }}
                    >
                      <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
                        Guest Workspaces
                      </Typography>
                      <IconButton
                        size='small'
                        onClick={toggleGuestWorkspaceInfoPopover}
                        sx={{ position: 'absolute', right: 0 }}
                      >
                        <CloseIcon fontSize='small' />
                      </IconButton>
                    </Box>

                    <Typography variant='body2' sx={{ mb: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                      You’re a member of these boards, but not a member of the Workspace the boards are in.{' '}
                      <MuiLink href='#' sx={{ textDecoration: 'underline' }}>
                        Learn more
                      </MuiLink>
                    </Typography>
                  </Box>
                </Popover>
              </Box>

              <Stack key={workspace._id} spacing={2} mb={4.5}>
                <Stack alignItems='center' direction='row' spacing={2} pl={1}>
                  <WorkspaceAvatar title={workspace.title} logo={workspace.logo} size={{ width: 32, height: 32 }} />
                  <Typography variant='h6' fontWeight={600}>
                    {workspace.title}
                  </Typography>
                </Stack>

                <WorkspaceBoards workspace={workspace} isLoading={false} />
              </Stack>
            </>
          ))}

        {isLoadingMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>

      {!hasClosedBoards && workspaces.length > 0 && (
        <Box sx={{ mt: 6, pl: 1 }}>
          <Button
            variant='outlined'
            startIcon={<VisibilityOffIcon />}
            onClick={() => console.log('View all closed boards clicked')}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              color: (theme) => (theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2'),
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#525252' : '#e0e0e0'),
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'transparent' : '#fafafa'),
              '&:hover': {
                borderColor: (theme) => theme.palette.primary.main,
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#33485D' : '#e3f2fd'),
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            View all closed boards
          </Button>
        </Box>
      )}
    </Box>
  )
}
