import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Button, CircularProgress } from '@mui/material'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import WorkspaceAvatar from '~/components/Workspace/WorkspaceAvatar'
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_PAGE } from '~/constants/pagination'
import { useInfiniteScroll } from '~/hooks/use-infinite-scroll'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import WorkspaceBoards from '~/pages/Workspaces/pages/BoardsList/components/WorkspaceBoards'
import { useGetWorkspacesQuery } from '~/queries/workspaces'
import { appendWorkspaces, clearWorkspaces, setWorkspaces } from '~/store/slices/workspace.slice'
import { WorkspaceResType } from '~/schemas/workspace.schema'

export default function BoardsList() {
  const dispatch = useAppDispatch()
  const { workspaces } = useAppSelector((state) => state.workspace)

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

      // Reset loading more state after data is loaded
      setIsLoadingMore(false)
    }
  }, [workspacesData, dispatch])

  // Load more workspaces function
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
        {isError && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color='error' variant='body1'>
              Failed to load workspaces. Please try again.
            </Typography>
            <Button variant='outlined' onClick={() => window.location.reload()} sx={{ mt: 2 }}>
              Retry
            </Button>
          </Box>
        )}

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

        {!isLoading && !isError && workspaces.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant='body1' color='text.secondary'>
              No workspaces found. Create your first workspace to get started.
            </Typography>
          </Box>
        )}

        {workspaces?.map((workspace) => (
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
