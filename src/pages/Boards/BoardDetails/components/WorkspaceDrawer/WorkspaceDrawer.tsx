import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupsIcon from '@mui/icons-material/Groups'
import SettingsIcon from '@mui/icons-material/Settings'
import { useTheme } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
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
import { useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useNavigate } from 'react-router-dom'
import DrawerHeader from '~/components/DrawerHeader'
import WorkspaceAvatar from '~/components/Workspace/WorkspaceAvatar'
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_PAGE } from '~/constants/pagination'
import { useGetBoardsQuery } from '~/queries/boards'
import { BoardResType } from '~/schemas/board.schema'

interface WorkspaceDrawerProps {
  open: boolean
  onOpen: (open: boolean) => void
  boardId?: string
}

type BoardItem = BoardResType['result']

export default function WorkspaceDrawer({ open, onOpen, boardId }: WorkspaceDrawerProps) {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const scrollableRef = useRef<HTMLDivElement | null>(null)

  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGINATION_PAGE,
    total_page: 0
  })
  const [boards, setBoards] = useState<BoardItem[]>([])

  const navigate = useNavigate()

  const { data: boardsData, isLoading } = useGetBoardsQuery({ page: pagination.page, limit: DEFAULT_PAGINATION_LIMIT })

  useEffect(() => {
    const checkIfMoreContentNeeded = () => {
      if (!scrollableRef.current) return

      const { scrollHeight, clientHeight } = scrollableRef.current

      // If there's no scrollbar (content fits entirely in the container) and we have more pages to fetch
      if (scrollHeight <= clientHeight && pagination.page < pagination.total_page && !isLoading) {
        setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
      }
    }

    // Use setTimeout to ensure DOM has been updated
    const timer = setTimeout(() => {
      checkIfMoreContentNeeded()
    }, 300)

    return () => clearTimeout(timer)
  }, [boards, pagination.page, pagination.total_page, open, isLoading])

  useEffect(() => {
    if (boardsData) {
      const { boards: boardsList, page, total_page } = boardsData.result

      setPagination({ page, total_page })

      if (page === DEFAULT_PAGINATION_PAGE) {
        setBoards(boardsList)
      } else {
        const newBoards = boardsList.filter((newBoard) => !boards.some((oldBoard) => oldBoard._id === newBoard._id))
        setBoards((prev) => [...prev, ...newBoards])
      }
    }
  }, [boardsData])

  const getMoreBoards = () => {
    if (pagination.page < pagination.total_page) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
    }
  }

  const handleListBoardItemClick = (id: string) => {
    navigate(`/boards/${id}`)
  }

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
          top: `calc(${theme.trellone.navBarHeight} + 1px)`
          // height: `calc(100% - ${theme.trellone.navBarHeight})`
        }
      }}
      variant='persistent'
      anchor='left'
      open={open}
    >
      <Box
        ref={scrollableRef}
        sx={{
          overflowY: 'auto',
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            borderRadius: '4px'
          }
        }}
        id='scrollableDiv'
      >
        <DrawerHeader sx={{ justifyContent: 'space-between', minHeight: '49px!important' }}>
          <Stack ml={1} gap={1} alignItems='center' direction='row'>
            <WorkspaceAvatar workspaceName='My Project' avatarSize={{ width: 30, height: 30 }} />
            <Typography variant='subtitle1'>My Project</Typography>
          </Stack>
          <IconButton color='inherit' onClick={() => onOpen(false)}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>

        <Divider />

        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => {}}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText secondary='Boards' />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => {}}>
              <ListItemIcon>
                <GroupsIcon />
              </ListItemIcon>
              <ListItemText secondary='Members' />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => {}}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText secondary='Workspace Settings' />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider />

        <Typography variant='subtitle1' p={2} pb={1}>
          Your Boards
        </Typography>

        <InfiniteScroll
          dataLength={boards.length}
          next={getMoreBoards}
          hasMore={pagination.page < pagination.total_page}
          loader={
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          }
          scrollableTarget='scrollableDiv'
        >
          <List>
            {boards?.length > 0 &&
              boards.map((board) => (
                <ListItem key={board._id} disablePadding>
                  <ListItemButton onClick={() => handleListBoardItemClick(board._id)} selected={boardId === board._id}>
                    <ListItemIcon>
                      <Avatar sx={{ width: 24, height: 24 }} variant='square' src={board?.cover_photo} />
                    </ListItemIcon>
                    <ListItemText secondary={board?.title} />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </InfiniteScroll>
      </Box>
    </Drawer>
  )
}
