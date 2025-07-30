import DashboardIcon from '@mui/icons-material/Dashboard'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import GroupsIcon from '@mui/icons-material/Groups'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SettingsIcon from '@mui/icons-material/Settings'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import WorkspaceAvatar from '~/components/Workspace/WorkspaceAvatar'
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_PAGE } from '~/constants/pagination'
import path from '~/constants/path'
import { useGetWorkspacesQuery } from '~/queries/workspaces'
import { WorkspaceResType } from '~/schemas/workspace.schema'

// Helper function to determine if a workspace should be active/selected
const isWorkspaceActive = (workspaceId: string, currentWorkspaceId: string | undefined, pathname: string) => {
  // Check if we're on a workspace-specific route
  const workspaceBoardsPath = path.workspaceBoardsList.replace(':workspaceId', workspaceId)

  return (
    currentWorkspaceId === workspaceId &&
    (pathname === workspaceBoardsPath || pathname.startsWith(`/workspaces/${workspaceId}`))
  )
}

// Helper function to determine if a specific menu item should be active
const isMenuItemActive = (workspaceId: string, menuType: string, pathname: string) => {
  switch (menuType) {
    case 'boards': {
      const workspaceBoardsPath = path.workspaceBoardsList.replace(':workspaceId', workspaceId)
      return pathname === workspaceBoardsPath
    }

    case 'highlights': {
      const workspaceHighlightsPath = path.workspaceHighlights.replace(':workspaceId', workspaceId)
      return pathname === workspaceHighlightsPath
    }

    default:
      return false
  }
}

// Helper function to determine if workspace should be auto-expanded on initial load
const shouldAutoExpandWorkspace = (
  workspaceId: string,
  currentWorkspaceId: string | undefined,
  pathname: string
): boolean => {
  // Auto-expand if we're on a workspace-specific route
  return isWorkspaceActive(workspaceId, currentWorkspaceId, pathname)
}

type WorkspaceItem = WorkspaceResType['result']

export default function CollapseList() {
  const [visibleItems, setVisibleItems] = useState<boolean[]>([])
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGINATION_PAGE,
    total_page: 0
  })
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([])

  const location = useLocation()
  const { workspaceId } = useParams()

  const { data: workspacesData } = useGetWorkspacesQuery({
    page: pagination.page,
    limit: DEFAULT_PAGINATION_LIMIT
  })

  useEffect(() => {
    if (workspacesData) {
      const { workspaces: workspacesList, page, total_page } = workspacesData.result

      setPagination({ page, total_page })

      if (page === DEFAULT_PAGINATION_PAGE) {
        // First page - replace workspaces
        setWorkspaces(workspacesList)
      } else {
        // Subsequent pages - append new workspaces, avoiding duplicates
        setWorkspaces((prev) => {
          const newWorkspaces = workspacesList.filter(
            (newWorkspace) => !prev.some((oldWorkspace) => oldWorkspace._id === newWorkspace._id)
          )
          return [...prev, ...newWorkspaces]
        })
      }
    }
  }, [workspacesData])

  // Initialize visible items when workspaces first load
  useEffect(() => {
    if (workspaces.length > 0) {
      setVisibleItems((prevItems) => {
        // If we already have items for this workspace count, keep them
        if (prevItems.length === workspaces.length) {
          return prevItems
        }

        // Otherwise, initialize with auto-expansion for active workspace
        return workspaces.map((workspace) => shouldAutoExpandWorkspace(workspace._id, workspaceId, location.pathname))
      })
    }
  }, [workspaces, workspaceId, location.pathname])

  const handleWorkspaceClick = (index: number) => {
    setVisibleItems((prevItems) => prevItems.map((item, idx) => (idx === index ? !item : item)))
  }

  const getMoreWorkspaces = () => {
    if (pagination.page < pagination.total_page) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
    }
  }

  const showMoreButton = pagination.page < pagination.total_page

  return (
    <Box
      sx={{
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 254px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5
      }}
    >
      {workspaces?.length > 0 &&
        workspaces?.map((workspace, index) => {
          const isActive = isWorkspaceActive(workspace._id, workspaceId, location.pathname)
          const isExpanded = visibleItems[index]

          return (
            <div key={workspace._id}>
              <ListItemButton
                selected={isActive && !isExpanded}
                onClick={() => handleWorkspaceClick(index)}
                sx={{ gap: 0.5 }}
              >
                <ListItemIcon>
                  <WorkspaceAvatar title={workspace.title} logo={workspace.logo} size={{ width: 25, height: 25 }} />
                </ListItemIcon>
                <ListItemText
                  primary={workspace.title}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical'
                  }}
                />
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={isExpanded} timeout='auto' unmountOnExit>
                <List component='div' disablePadding sx={{ fontSize: '15px' }}>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to={path.workspaceBoardsList.replace(':workspaceId', workspace._id)}
                    selected={isMenuItemActive(workspace._id, 'boards', location.pathname)}
                  >
                    <ListItemIcon>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText disableTypography primary='Boards' />
                  </ListItemButton>

                  <ListItemButton
                    sx={{ pl: 4 }}
                    selected={isMenuItemActive(workspace._id, 'highlights', location.pathname)}
                  >
                    <ListItemIcon>
                      <FavoriteBorderIcon />
                    </ListItemIcon>
                    <ListItemText disableTypography primary='Highlights' />
                  </ListItemButton>

                  <ListItemButton
                    sx={{ pl: 4 }}
                    selected={isMenuItemActive(workspace._id, 'members', location.pathname)}
                  >
                    <ListItemIcon>
                      <GroupsIcon />
                    </ListItemIcon>
                    <ListItemText disableTypography primary='Members' />
                  </ListItemButton>

                  <ListItemButton
                    sx={{ pl: 4 }}
                    selected={isMenuItemActive(workspace._id, 'settings', location.pathname)}
                  >
                    <ListItemIcon>
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText disableTypography primary='Settings' />
                  </ListItemButton>
                </List>
              </Collapse>
            </div>
          )
        })}

      {showMoreButton && (
        <Button
          variant='text'
          size='medium'
          fullWidth
          color='primary'
          endIcon={<MoreHorizIcon />}
          sx={{
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.04)'
            }
          }}
          onClick={getMoreWorkspaces}
        >
          Show more workspaces
        </Button>
      )}
    </Box>
  )
}
