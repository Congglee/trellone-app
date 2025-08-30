import AddIcon from '@mui/icons-material/Add'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupsIcon from '@mui/icons-material/Groups'
import SettingsIcon from '@mui/icons-material/Settings'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import { useTheme } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'
import DrawerHeader from '~/components/DrawerHeader'
import WorkspaceAvatar from '~/components/Workspace/WorkspaceAvatar'
import path from '~/constants/path'
import { WorkspacePermission } from '~/constants/permissions'
import { useWorkspacePermission } from '~/hooks/use-permissions'
import { useInfiniteScroll } from '~/hooks/use-infinite-scroll'
import { useGetJoinedWorkspaceBoardsQuery } from '~/queries/boards'
import { WorkspaceResType } from '~/schemas/workspace.schema'
import { BoardResType } from '~/schemas/board.schema'
import { useEffect, useRef, useState } from 'react'
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_PAGE } from '~/constants/pagination'
import CircularProgress from '@mui/material/CircularProgress'

interface WorkspaceDrawerProps {
  open: boolean
  onOpen: (open: boolean) => void
  boardId?: string
  workspace?: WorkspaceResType['result']
}

export default function WorkspaceDrawer({ open, onOpen, boardId, workspace }: WorkspaceDrawerProps) {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGINATION_PAGE,
    total_page: 0
  })
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const workspaceId = workspace?._id

  const {
    data: joinedWorkspaceBoardsData,
    isLoading,
    isFetching
  } = useGetJoinedWorkspaceBoardsQuery(
    {
      page: pagination.page,
      limit: DEFAULT_PAGINATION_LIMIT,
      workspace_id: workspaceId as string
    },
    { skip: !workspaceId }
  )

  const [allJoinedBoards, setAllJoinedBoards] = useState<BoardResType['result'][]>([])

  // Update boards list and pagination when data changes
  useEffect(() => {
    if (joinedWorkspaceBoardsData) {
      const { boards, page, total_page } = joinedWorkspaceBoardsData.result
      setPagination({ page, total_page })

      if (page === DEFAULT_PAGINATION_PAGE) {
        setAllJoinedBoards(boards)
      } else {
        setAllJoinedBoards((prev) => [...prev, ...boards])
      }

      setIsLoadingMore(false)
    }
  }, [joinedWorkspaceBoardsData])

  // Reset when workspace changes (but ignore initial undefined -> defined)
  const prevWorkspaceIdRef = useRef<string | undefined>(undefined)
  useEffect(() => {
    if (workspaceId && prevWorkspaceIdRef.current && prevWorkspaceIdRef.current !== workspaceId) {
      setAllJoinedBoards([])
      setPagination({ page: DEFAULT_PAGINATION_PAGE, total_page: 0 })
    }

    prevWorkspaceIdRef.current = workspaceId
  }, [workspaceId])

  const loadMoreBoards = () => {
    if (pagination.page < pagination.total_page && !isFetching) {
      setIsLoadingMore(true)
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
    }
  }

  const { containerRef } = useInfiniteScroll({
    onLoadMore: loadMoreBoards,
    hasMore: pagination.page < pagination.total_page,
    isLoading: isFetching || isLoadingMore,
    threshold: 200
  })

  const { hasPermission } = useWorkspacePermission(workspace)

  return (
    <Drawer
      sx={{
        width: theme.trellone.workspaceDrawerWidth,
        flexShrink: 0,
        '& .MuiPaper-root': {
          backgroundColor: isDarkMode ? 'rgb(0 0 0 / 70%)' : 'rgb(255 255 255 / 70%)'
        },
        '& .MuiDrawer-paper': {
          backdropFilter: 'blur(16px)',
          width: theme.trellone.workspaceDrawerWidth,
          boxSizing: 'border-box',
          top: 'auto',
          height: `calc(100% - ${theme.trellone.navBarHeight})`
        }
      }}
      variant='persistent'
      anchor='left'
      open={open}
      PaperProps={{ ref: containerRef, sx: { overflowY: 'auto' } }}
    >
      <DrawerHeader sx={{ justifyContent: 'space-between', minHeight: '49px!important' }}>
        <Stack ml={1} gap={1} alignItems='center' direction='row'>
          <WorkspaceAvatar logo={workspace?.logo} title={workspace?.title || ''} size={{ width: 30, height: 30 }} />
          <Typography
            variant='subtitle1'
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.4'
            }}
          >
            {workspace?.title}
          </Typography>
        </Stack>
        <IconButton color='inherit' onClick={() => onOpen(false)}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to={path.workspaceBoards.replace(':workspaceId', workspace?._id as string)}
            disabled={!hasPermission(WorkspacePermission.ViewWorkspace)}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText>Boards</ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem
          disablePadding
          secondaryAction={
            <IconButton
              edge='end'
              aria-label='add'
              size='small'
              sx={{ borderRadius: 0.5 }}
              disabled={!hasPermission(WorkspacePermission.ViewWorkspace)}
            >
              <AddIcon />
            </IconButton>
          }
        >
          <ListItemButton
            component={Link}
            to={path.workspaceMembers.replace(':workspaceId', workspace?._id as string)}
            disabled={!hasPermission(WorkspacePermission.ViewWorkspace)}
          >
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText>Members</ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton disabled={!hasPermission(WorkspacePermission.ViewWorkspace)}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText>Workspace Settings</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />

      <Typography variant='subtitle1' p={2} pb={1}>
        Your Boards
      </Typography>

      {isLoading && (
        <List>
          {Array.from({ length: 5 }).map((_, idx) => (
            <ListItem key={idx} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Skeleton variant='rounded' width={24} height={24} />
                </ListItemIcon>
                <ListItemText primary={<Skeleton variant='text' width='70%' />} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      {!isLoading && allJoinedBoards.length > 0 && (
        <List>
          {allJoinedBoards.map((board) => (
            <ListItem key={board._id} disablePadding>
              <ListItemButton
                component={Link}
                to={`/boards/${board._id}`}
                selected={boardId === board._id}
                sx={{
                  '&.Mui-selected': {
                    color: (theme) => (theme.palette.mode === 'dark' ? 'primary.contrastText' : 'primary.contrastText')
                  }
                }}
              >
                <ListItemIcon>
                  <Avatar sx={{ width: 24, height: 24 }} variant='rounded' src={board?.cover_photo}>
                    {board?.title.charAt(0)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText>{board?.title}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      {!isLoading && allJoinedBoards.length === 0 && (
        <Box
          sx={{
            mx: 2,
            mb: 2,
            p: 3,
            borderRadius: 1,
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
            border: (theme) =>
              `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
            textAlign: 'center'
          }}
        >
          <Stack alignItems='center' spacing={2}>
            <ViewKanbanIcon
              sx={{
                fontSize: 48,
                color: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)')
              }}
            />
            <Stack spacing={1}>
              <Typography
                variant='body2'
                sx={{
                  color: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'),
                  fontWeight: 500
                }}
              >
                No boards yet
              </Typography>
              <Typography
                variant='caption'
                sx={{
                  color: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'),
                  lineHeight: 1.4
                }}
              >
                Create your first board or join any board to get started
              </Typography>
            </Stack>
          </Stack>
        </Box>
      )}

      {isLoadingMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Drawer>
  )
}
