import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupsIcon from '@mui/icons-material/Groups'
import SettingsIcon from '@mui/icons-material/Settings'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import WorkspaceAvatar from '~/components/Workspace/WorkspaceAvatar'
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_PAGE } from '~/constants/pagination'
import path from '~/constants/path'
import { useInfiniteScroll } from '~/hooks/use-infinite-scroll'
import { useGetJoinedWorkspaceBoardsQuery } from '~/queries/boards'
import { useGetWorkspaceQuery } from '~/queries/workspaces'
import type { BoardType } from '~/schemas/board.schema'

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

  const [isWorkspaceSidebarExpanded, setIsWorkspaceSidebarExpanded] = useState(true)

  const handleWorkspaceSidebarToggle = () => {
    setIsWorkspaceSidebarExpanded((prev) => !prev)
  }

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

  const [allJoinedBoards, setAllJoinedBoards] = useState<BoardType[]>([])

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

  const handleLoadMoreBoards = () => {
    if (pagination.page < pagination.total_page && !isFetching) {
      setIsLoadingMore(true)
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
    }
  }

  const { containerRef } = useInfiniteScroll({
    onLoadMore: handleLoadMoreBoards,
    hasMore: pagination.page < pagination.total_page,
    isLoading: isFetching || isLoadingMore,
    threshold: 200
  })

  return (
    <Box
      sx={{
        width: (theme) => (isWorkspaceSidebarExpanded ? theme.trellone.workspaceDrawerWidth : '70px'),
        height: (theme) => `calc(100vh - ${theme.trellone.navBarHeight})`,
        flexShrink: 0,
        boxSizing: 'border-box',
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 70%)' : 'rgb(255 255 255 / 70%)'),
        backdropFilter: 'blur(16px)',
        position: 'relative',
        overflow: 'visible'
      }}
    >
      <IconButton
        onClick={handleWorkspaceSidebarToggle}
        size='small'
        sx={{
          p: 0.5,
          position: 'absolute',
          top: 49,
          right: -15,
          transform: 'translateY(-50%)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : 'background.paper'),
          '&:hover': {
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100')
          }
        }}
      >
        <ChevronLeftIcon
          sx={{
            transform: isWorkspaceSidebarExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.3s'
          }}
        />
      </IconButton>

      <Box
        ref={containerRef}
        sx={{
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        <Stack sx={{ p: isWorkspaceSidebarExpanded ? 2 : 0.5, height: '49px', justifyContent: 'center' }}>
          <Stack
            gap={isWorkspaceSidebarExpanded ? 1 : 0.5}
            alignItems='center'
            direction='row'
            justifyContent={isWorkspaceSidebarExpanded ? 'space-between' : 'center'}
          >
            <Stack gap={1} direction='row' alignItems='center'>
              <Box>
                <WorkspaceAvatar
                  logo={workspace?.logo}
                  title={workspace?.title || ''}
                  size={{ width: 30, height: 30 }}
                />
              </Box>
              <Box
                sx={{
                  display: isWorkspaceSidebarExpanded ? 'block' : 'none',
                  opacity: isWorkspaceSidebarExpanded ? 1 : 0,
                  transition: 'opacity 0.2s'
                }}
              >
                <Typography variant='subtitle1' noWrap>
                  {workspace?.title}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>

        <Divider />

        <List>
          <Tooltip title='Boards' placement='right' disableHoverListener={isWorkspaceSidebarExpanded} arrow>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                component={Link}
                to={path.workspaceBoards.replace(':workspaceId', workspace?._id as string)}
                selected={isMenuItemActive(workspace?._id as string, 'boards', location.pathname)}
                sx={{
                  minHeight: 48,
                  justifyContent: isWorkspaceSidebarExpanded ? 'initial' : 'center',
                  px: 2.5,
                  '&.Mui-selected': {
                    color: (theme) => (theme.palette.mode === 'dark' ? 'primary.contrastText' : 'primary.contrastText')
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isWorkspaceSidebarExpanded ? 3 : 'auto',
                    justifyContent: 'center'
                  }}
                >
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText
                  primary='Boards'
                  sx={{
                    opacity: isWorkspaceSidebarExpanded ? 1 : 0,
                    display: isWorkspaceSidebarExpanded ? 'block' : 'none'
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Tooltip>

          <Tooltip title='Members' placement='right' disableHoverListener={isWorkspaceSidebarExpanded} arrow>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                component={Link}
                to={path.workspaceMembers.replace(':workspaceId', workspace?._id as string)}
                selected={isMenuItemActive(workspace?._id as string, 'members', location.pathname)}
                sx={{
                  minHeight: 48,
                  justifyContent: isWorkspaceSidebarExpanded ? 'initial' : 'center',
                  px: 2.5,
                  '&.Mui-selected': {
                    color: (theme) => (theme.palette.mode === 'dark' ? 'primary.contrastText' : 'primary.contrastText')
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isWorkspaceSidebarExpanded ? 3 : 'auto',
                    justifyContent: 'center'
                  }}
                >
                  <GroupsIcon />
                </ListItemIcon>
                <ListItemText
                  primary='Members'
                  sx={{
                    opacity: isWorkspaceSidebarExpanded ? 1 : 0,
                    display: isWorkspaceSidebarExpanded ? 'block' : 'none'
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Tooltip>

          <Tooltip title='Settings' placement='right' disableHoverListener={isWorkspaceSidebarExpanded} arrow>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                component={Link}
                to={path.workspaceSettings.replace(':workspaceId', workspace?._id as string)}
                selected={isMenuItemActive(workspace?._id as string, 'settings', location.pathname)}
                sx={{
                  minHeight: 48,
                  justifyContent: isWorkspaceSidebarExpanded ? 'initial' : 'center',
                  px: 2.5,
                  '&.Mui-selected': {
                    color: (theme) => (theme.palette.mode === 'dark' ? 'primary.contrastText' : 'primary.contrastText')
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isWorkspaceSidebarExpanded ? 3 : 'auto',
                    justifyContent: 'center'
                  }}
                >
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText
                  primary='Settings'
                  sx={{
                    opacity: isWorkspaceSidebarExpanded ? 1 : 0,
                    display: isWorkspaceSidebarExpanded ? 'block' : 'none'
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        </List>

        <Divider />

        <Typography variant='subtitle1' p={2} pb={1}>
          {isWorkspaceSidebarExpanded ? 'Your Boards' : ''}
        </Typography>

        {isLoading && (
          <List>
            {Array.from({ length: 5 }).map((_, idx) => (
              <ListItem key={idx} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: isWorkspaceSidebarExpanded ? 'initial' : 'center',
                    px: 2.5
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isWorkspaceSidebarExpanded ? 3 : 'auto',
                      justifyContent: 'center'
                    }}
                  >
                    <Skeleton variant='rounded' width={24} height={24} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Skeleton variant='text' width='70%' />}
                    sx={{
                      opacity: isWorkspaceSidebarExpanded ? 1 : 0,
                      display: isWorkspaceSidebarExpanded ? 'block' : 'none'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}

        {!isLoading && allJoinedBoards.length > 0 && (
          <List>
            {allJoinedBoards.map((board) => {
              const hasCoverPhoto = board?.cover_photo && board.cover_photo.trim() !== ''
              const hasBackgroundColor = board?.background_color && board.background_color.trim() !== ''
              const isGradient = hasBackgroundColor && board.background_color!.includes('gradient')

              return (
                <Tooltip
                  key={board._id}
                  title={board?.title}
                  placement='right'
                  disableHoverListener={isWorkspaceSidebarExpanded}
                  arrow
                >
                  <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                      component={Link}
                      to={`/boards/${board._id}`}
                      sx={{
                        minHeight: 48,
                        justifyContent: isWorkspaceSidebarExpanded ? 'initial' : 'center',
                        px: 2.5
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: isWorkspaceSidebarExpanded ? 3 : 'auto',
                          justifyContent: 'center'
                        }}
                      >
                        {hasCoverPhoto ? (
                          <Avatar sx={{ width: 24, height: 24 }} variant='rounded' src={board.cover_photo}>
                            {board?.title.charAt(0)}
                          </Avatar>
                        ) : hasBackgroundColor ? (
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: 1,
                              ...(isGradient
                                ? { background: board.background_color!, backgroundSize: 'cover' }
                                : { bgcolor: board.background_color! })
                            }}
                          />
                        ) : (
                          <Avatar sx={{ width: 24, height: 24 }} variant='rounded'>
                            {board?.title.charAt(0)}
                          </Avatar>
                        )}
                      </ListItemIcon>
                      <ListItemText
                        secondary={board?.title}
                        sx={{
                          opacity: isWorkspaceSidebarExpanded ? 1 : 0,
                          display: isWorkspaceSidebarExpanded ? 'block' : 'none'
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              )
            })}
          </List>
        )}

        {!isLoading && allJoinedBoards.length === 0 && (
          <Box
            sx={{
              mx: 2,
              mb: 2,
              p: isWorkspaceSidebarExpanded ? 3 : 1,
              borderRadius: 1,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
              border: (theme) =>
                `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: isWorkspaceSidebarExpanded ? 'auto' : 80
            }}
          >
            <ViewKanbanIcon
              sx={{
                fontSize: isWorkspaceSidebarExpanded ? 48 : 32,
                color: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)')
              }}
            />
            {isWorkspaceSidebarExpanded && (
              <Stack spacing={1} mt={2}>
                <Typography
                  variant='body2'
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                    fontWeight: 500
                  }}
                >
                  No boards yet
                </Typography>
                <Typography
                  variant='caption'
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                    lineHeight: 1.4
                  }}
                >
                  Create your first board or join any board to get started
                </Typography>
              </Stack>
            )}
          </Box>
        )}

        {isLoadingMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>
    </Box>
  )
}
