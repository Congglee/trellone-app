import DashboardIcon from '@mui/icons-material/Dashboard'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import GroupsIcon from '@mui/icons-material/Groups'
import SettingsIcon from '@mui/icons-material/Settings'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import WorkspaceAvatar from '~/components/Workspace/WorkspaceAvatar'
import { mockWorkspacesList } from '~/constants/mock-data'

interface CollapseListProps {
  activeMenu: string
  onActiveMenuChange: (menuItem: string) => void
}

export default function CollapseList({ activeMenu }: CollapseListProps) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>([])

  const { workspaceId } = useParams()

  useEffect(() => {
    setVisibleItems(Array(mockWorkspacesList.length).fill(false))
  }, [])

  const handleWorkspaceClick = (index: number) => {
    setVisibleItems(visibleItems.map((item, idx) => (idx === index ? !item : item)))
  }

  const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const targetTextContent = event.currentTarget.textContent
    console.log(targetTextContent)
    // onActiveMenuChange(`${workspaceId}${targetTextContent}`)
  }

  return (
    <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 254px)' }}>
      {mockWorkspacesList.length > 0 &&
        mockWorkspacesList?.map((workspace, index) => (
          <div key={workspace._id}>
            <ListItemButton
              selected={!visibleItems[index] && workspaceId === workspace._id}
              onClick={() => handleWorkspaceClick(index)}
            >
              <ListItemIcon>
                <WorkspaceAvatar workspaceName={workspace.title} avatarSize={{ width: 25, height: 25 }} />
              </ListItemIcon>
              <ListItemText primary={workspace.title} />
              {visibleItems[index] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={visibleItems[index]} timeout='auto' unmountOnExit>
              <List component='div' disablePadding sx={{ fontSize: '15px' }}>
                <ListItemButton
                  selected={activeMenu === `${workspaceId}Boards`}
                  onClick={handleListItemClick}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText disableTypography primary='Boards' />
                </ListItemButton>

                <ListItemButton
                  selected={activeMenu === `${workspaceId}Highlights`}
                  onClick={handleListItemClick}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <FavoriteBorderIcon />
                  </ListItemIcon>
                  <ListItemText disableTypography primary='Highlights' />
                </ListItemButton>

                <ListItemButton
                  selected={activeMenu === `${workspaceId}Members`}
                  onClick={handleListItemClick}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <GroupsIcon />
                  </ListItemIcon>
                  <ListItemText disableTypography primary='Members' />
                </ListItemButton>

                <ListItemButton
                  selected={activeMenu === `${workspaceId}Settings`}
                  onClick={handleListItemClick}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText disableTypography primary='Settings' />
                </ListItemButton>
              </List>
            </Collapse>
          </div>
        ))}
    </Box>
  )
}
