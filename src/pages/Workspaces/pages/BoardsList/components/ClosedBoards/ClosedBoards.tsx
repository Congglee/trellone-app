import ArchiveIcon from '@mui/icons-material/Archive'
import CloseIcon from '@mui/icons-material/Close'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import { alpha } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_PAGE } from '~/constants/pagination'
import { useInfiniteScroll } from '~/hooks/use-infinite-scroll'
import { useAppSelector } from '~/lib/redux/hooks'
import ClosedBoardsListRow from '~/pages/Workspaces/pages/BoardsList/components/ClosedBoardsListRow'
import { useLazyGetBoardsQuery, useLeaveBoardMutation, useUpdateBoardMutation } from '~/queries/boards'
import { BoardResType } from '~/schemas/board.schema'
import { WorkspaceResType } from '~/schemas/workspace.schema'

interface ClosedBoardsProps {
  workspaces: WorkspaceResType['result'][]
}

export default function ClosedBoards({ workspaces }: ClosedBoardsProps) {
  const [closedBoardsOpen, setClosedBoardsOpen] = useState(false)
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGINATION_PAGE,
    total_page: 0
  })
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const [triggerGetBoards, { data: boardsData, isFetching }] = useLazyGetBoardsQuery()

  const [updateBoardMutation] = useUpdateBoardMutation()
  const [leaveBoardMutation] = useLeaveBoardMutation()

  const [allClosedBoards, setAllClosedBoards] = useState<BoardResType['result'][]>([])
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('')

  const { socket } = useAppSelector((state) => state.app)

  useEffect(() => {
    if (!closedBoardsOpen || !boardsData) return

    const { boards, page, total_page } = boardsData.result
    setPagination({ page, total_page })

    if (page === DEFAULT_PAGINATION_PAGE) {
      setAllClosedBoards(boards)
    } else {
      setAllClosedBoards((prev) => [...prev, ...boards])
    }

    setIsLoadingMore(false)
  }, [boardsData, closedBoardsOpen])

  const handleClosedBoardsOpen = () => {
    setAllClosedBoards([])
    setPagination({ page: DEFAULT_PAGINATION_PAGE, total_page: 0 })
    setIsLoadingMore(false)
    setSelectedWorkspaceId('')
    setClosedBoardsOpen(true)

    // Trigger initial fetch for page 1
    triggerGetBoards({
      page: DEFAULT_PAGINATION_PAGE,
      limit: DEFAULT_PAGINATION_LIMIT,
      state: 'closed'
    })
  }

  const loadMoreBoards = () => {
    if (pagination.page < pagination.total_page && !isFetching) {
      setIsLoadingMore(true)
      const nextPage = pagination.page + 1
      triggerGetBoards({
        page: nextPage,
        limit: DEFAULT_PAGINATION_LIMIT,
        state: 'closed',
        ...(selectedWorkspaceId ? { workspace: selectedWorkspaceId } : {})
      })
    }
  }

  const { containerRef } = useInfiniteScroll({
    onLoadMore: loadMoreBoards,
    hasMore: pagination.page < pagination.total_page,
    isLoading: isFetching || isLoadingMore,
    threshold: 200
  })

  const boards = allClosedBoards

  const handleClosedBoardsClose = () => {
    setClosedBoardsOpen(false)
  }

  const handleWorkspaceChange = (event: SelectChangeEvent<string>) => {
    const workspaceId = event.target.value as string

    setSelectedWorkspaceId(workspaceId)
    setAllClosedBoards([])
    setPagination({ page: DEFAULT_PAGINATION_PAGE, total_page: 0 })
    setIsLoadingMore(false)

    triggerGetBoards({
      page: DEFAULT_PAGINATION_PAGE,
      limit: DEFAULT_PAGINATION_LIMIT,
      state: 'closed',
      ...(workspaceId ? { workspace: workspaceId } : {})
    })
  }

  const onReopenBoard = (boardId: string, workspaceId: string) => {
    updateBoardMutation({
      id: boardId,
      body: { _destroy: false }
    }).then((res) => {
      if (!res.error) {
        if (boards.length === 1) {
          handleClosedBoardsClose()
        }

        socket?.emit('CLIENT_USER_UPDATED_WORKSPACE', workspaceId)
      }
    })
  }

  const onLeaveBoard = (boardId: string, workspaceId: string) => {
    leaveBoardMutation(boardId).then((res) => {
      if (!res.error) {
        if (boards.length === 1) {
          handleClosedBoardsClose()
        }

        socket?.emit('CLIENT_USER_UPDATED_WORKSPACE', workspaceId, boardId)
      }
    })
  }

  return (
    <Box sx={{ mt: 6, pl: 1 }}>
      <Button
        variant='outlined'
        startIcon={<VisibilityOffIcon />}
        onClick={handleClosedBoardsOpen}
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

      <Dialog keepMounted open={closedBoardsOpen} onClose={handleClosedBoardsClose} fullWidth maxWidth='md'>
        <DialogTitle sx={{ p: 2.5 }}>
          <Stack direction='row' alignItems='center' spacing={1.5}>
            <Stack
              direction='row'
              alignItems='center'
              useFlexGap
              spacing={1.25}
              sx={{ flexGrow: 1, minWidth: 0, flexWrap: 'wrap' }}
            >
              <ArchiveIcon color='primary' fontSize='large' />
              <Typography variant='h6' noWrap sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Closed boards
              </Typography>
              <Select
                size='small'
                sx={{ minWidth: 160, flexShrink: 0 }}
                value={selectedWorkspaceId}
                onChange={handleWorkspaceChange}
                displayEmpty
              >
                <MenuItem value=''>All boards</MenuItem>
                {workspaces.map((workspace) => (
                  <MenuItem key={workspace._id} value={workspace._id}>
                    {workspace.title}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <IconButton onClick={handleClosedBoardsClose} aria-label='Close' sx={{ ml: 'auto', flexShrink: 0 }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }} ref={containerRef}>
          <Box role='list' sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {boards.length === 0 && isFetching && (
              <Box>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <Box key={idx}>
                    <Stack
                      direction='row'
                      alignItems='center'
                      justifyContent='space-between'
                      sx={{ px: 2, py: 1.5, gap: 2, minWidth: 'max-content' }}
                    >
                      <Stack direction='row' alignItems='center' spacing={2} sx={{ minWidth: 0 }}>
                        <Skeleton variant='rounded' width={44} height={44} sx={{ borderRadius: 1.25 }} />
                        <Box sx={{ minWidth: 0, width: 240 }}>
                          <Skeleton variant='text' width='80%' height={20} />
                          <Skeleton variant='text' width='50%' height={16} />
                        </Box>
                      </Stack>

                      <Stack direction='row' alignItems='center' spacing={1.25} flexShrink={0}>
                        <Skeleton variant='rounded' width={72} height={32} />
                        <Skeleton variant='rounded' width={96} height={32} />
                      </Stack>
                    </Stack>
                    {idx < 2 && <Divider />}
                  </Box>
                ))}
              </Box>
            )}

            {boards.length === 0 && !isFetching && (
              <Box sx={{ px: 2, py: 2 }}>
                <Box
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 4,
                    mx: 1.5,
                    textAlign: 'center',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.common.white, 0.06)
                        : alpha(theme.palette.common.black, 0.04)
                  }}
                >
                  <Stack alignItems='center' spacing={1.25}>
                    <ArchiveIcon color='action' sx={{ fontSize: 36 }} />
                    <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                      No boards have been closed
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ maxWidth: 520 }}>
                      Try selecting a different workspace or choose ‘All boards’. Closed boards will appear here when
                      available.
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            )}

            {boards.length > 0 &&
              boards.map((board, index) => (
                <ClosedBoardsListRow
                  key={board._id}
                  board={board}
                  isLast={index === boards.length - 1}
                  onReopenBoard={onReopenBoard}
                  onLeaveBoard={onLeaveBoard}
                />
              ))}
          </Box>

          {isLoadingMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClosedBoardsClose}
            variant='outlined'
            sx={{ textTransform: 'none', fontWeight: 600, px: 2.5, borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
