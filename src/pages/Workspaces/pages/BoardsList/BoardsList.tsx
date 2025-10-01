import CloseIcon from '@mui/icons-material/Close'
import InfoIcon from '@mui/icons-material/Info'
import { Link as MuiLink } from '@mui/material'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
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
import BoardGrid from '~/pages/Workspaces/pages/BoardsList/components/BoardGrid'
import ClosedBoards from '~/pages/Workspaces/pages/BoardsList/components/ClosedBoards'
import { useGetWorkspacesQuery, workspaceApi } from '~/queries/workspaces'
import { WorkspaceResType } from '~/schemas/workspace.schema'
import { appendWorkspaces, clearWorkspaces, setWorkspaces } from '~/store/slices/workspace.slice'

export default function BoardsList() {
  const dispatch = useAppDispatch()
  const { workspaces } = useAppSelector((state) => state.workspace)
  const { socket } = useAppSelector((state) => state.app)

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

  const allWorkspaces = useMemo(() => [...memberWorkspaces, ...guestWorkspaces], [memberWorkspaces, guestWorkspaces])

  // Realtime: listen to workspace updates and refresh list
  useEffect(() => {
    if (!socket) return

    socket.emit('CLIENT_JOIN_WORKSPACES_INDEX')

    let timer: ReturnType<typeof setTimeout> | null = null

    const scheduleRefresh = () => {
      if (timer) return
      timer = setTimeout(() => {
        dispatch(workspaceApi.util.invalidateTags([{ type: 'Workspace', id: 'LIST' }]))
        timer = null
      }, 200)
    }

    const onUpdateWorkspace = () => scheduleRefresh()

    const onReconnect = () => {
      socket.emit('CLIENT_JOIN_WORKSPACES_INDEX')
      scheduleRefresh()
    }

    socket.on('SERVER_WORKSPACE_UPDATED', onUpdateWorkspace)
    socket.on('reconnect', onReconnect)

    return () => {
      socket.emit('CLIENT_LEAVE_WORKSPACES_INDEX')
      socket.off('SERVER_WORKSPACE_UPDATED', onUpdateWorkspace)
      socket.off('reconnect', onReconnect)

      if (timer) clearTimeout(timer)
    }
  }, [socket, dispatch])

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
                <BoardGrid workspace={generateSkeletonWorkspace(index)} isLoading={true} />
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

              <BoardGrid workspace={workspace} isLoading={false} />
            </Stack>
          ))}

        {guestWorkspaces.length > 0 && (
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

            {guestWorkspaces.map((workspace) => (
              <Stack key={workspace._id} spacing={2} mb={4.5}>
                <Stack alignItems='center' direction='row' spacing={2} pl={1}>
                  <WorkspaceAvatar title={workspace.title} logo={workspace.logo} size={{ width: 32, height: 32 }} />
                  <Typography variant='h6' fontWeight={600}>
                    {workspace.title}
                  </Typography>
                </Stack>

                <BoardGrid workspace={workspace} isLoading={false} showNewBoardCard={false} />
              </Stack>
            ))}
          </>
        )}

        {isLoadingMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>

      <ClosedBoards workspaces={allWorkspaces} />
    </Box>
  )
}
