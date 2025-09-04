import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupsIcon from '@mui/icons-material/Groups'
import SettingsIcon from '@mui/icons-material/Settings'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import WorkspaceAvatar from '~/components/Workspace/WorkspaceAvatar'
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_PAGE } from '~/constants/pagination'
import path from '~/constants/path'
import { useInfiniteScroll } from '~/hooks/use-infinite-scroll'
import { useGetJoinedWorkspaceBoardsQuery } from '~/queries/boards'
import { useGetWorkspaceQuery } from '~/queries/workspaces'
import { BoardResType } from '~/schemas/board.schema'

interface WorkspaceSidebarProps {
  workspaceId?: string
}

// Helper function to determine if a specific menu item should be active
const isMenuItemActive = (workspaceId: string, menuType: string, pathname: string) => {
  switch (menuType) {
    case 'boards': {
      const workspaceBoardsPath = path.workspaceBoards.replace(':workspaceId', workspaceId)
      return pathname === workspaceBoardsPath
    }

    case 'members': {
      const workspaceMembersPath = path.workspaceMembers.replace(':workspaceId', workspaceId)
      const workspaceGuestsPath = path.workspaceGuests.replace(':workspaceId', workspaceId)
      return pathname === workspaceMembersPath || pathname === workspaceGuestsPath
    }

    case 'settings': {
      const workspaceSettingsPath = path.workspaceSettings.replace(':workspaceId', workspaceId)
      return pathname === workspaceSettingsPath
    }

    default:
      return false
  }
}

export default function WorkspaceSidebar({ workspaceId }: WorkspaceSidebarProps) {
  const { data: workspaceData } = useGetWorkspaceQuery(workspaceId!)
  const workspace = workspaceData?.result

  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGINATION_PAGE,
    total_page: 0
  })
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const currentWorkspaceId = workspaceId

  const {
    data: joinedWorkspaceBoardsData,
    isLoading,
    isFetching
  } = useGetJoinedWorkspaceBoardsQuery(
    {
      page: pagination.page,
      limit: DEFAULT_PAGINATION_LIMIT,
      workspace_id: currentWorkspaceId as string
    },
    { skip: !currentWorkspaceId }
  )

  const [allJoinedBoards, setAllJoinedBoards] = useState<BoardResType['result'][]>([])

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

  // Reset when workspace changes (ignore initial undefined -> defined)
  const prevWorkspaceIdRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (currentWorkspaceId && prevWorkspaceIdRef.current && prevWorkspaceIdRef.current !== currentWorkspaceId) {
      setAllJoinedBoards([])
      setPagination({ page: DEFAULT_PAGINATION_PAGE, total_page: 0 })
    }

    prevWorkspaceIdRef.current = currentWorkspaceId
  }, [currentWorkspaceId])

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

  return (
    <Box
      ref={containerRef}
      sx={{
        width: (theme) => theme.trellone.workspaceDrawerWidth,
        height: (theme) => `calc(100vh - ${theme.trellone.navBarHeight})`,
        overflowY: 'auto',
        flexShrink: 0,
        boxSizing: 'border-box',
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 70%)' : 'rgb(255 255 255 / 70%)'),
        backdropFilter: 'blur(16px)'
      }}
    >
      <Stack sx={{ p: 2, height: '49px', justifyContent: 'center' }}>
        <Stack gap={1} alignItems='center' direction='row'>
          <WorkspaceAvatar logo={workspace?.logo} title={workspace?.title || ''} size={{ width: 30, height: 30 }} />
          <Typography variant='subtitle1'>{workspace?.title}</Typography>
        </Stack>
      </Stack>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to={path.workspaceBoards.replace(':workspaceId', workspace?._id as string)}
            selected={isMenuItemActive(workspace?._id as string, 'boards', location.pathname)}
            sx={{
              '&.Mui-selected': {
                color: (theme) => (theme.palette.mode === 'dark' ? 'primary.contrastText' : 'primary.contrastText')
              }
            }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText>Boards</ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to={path.workspaceMembers.replace(':workspaceId', workspace?._id as string)}
            selected={isMenuItemActive(workspace?._id as string, 'members', location.pathname)}
            sx={{
              '&.Mui-selected': {
                color: (theme) => (theme.palette.mode === 'dark' ? 'primary.contrastText' : 'primary.contrastText')
              }
            }}
          >
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText>Members</ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to={path.workspaceSettings.replace(':workspaceId', workspace?._id as string)}
            selected={isMenuItemActive(workspace?._id as string, 'settings', location.pathname)}
            sx={{
              '&.Mui-selected': {
                color: (theme) => (theme.palette.mode === 'dark' ? 'primary.contrastText' : 'primary.contrastText')
              }
            }}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
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
              <ListItemButton component={Link} to={`/boards/${board._id}`}>
                <ListItemIcon>
                  <Avatar sx={{ width: 24, height: 24 }} variant='rounded' src={board?.cover_photo}>
                    {board?.title.charAt(0)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText secondary={board?.title} />
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
    </Box>
  )
}
