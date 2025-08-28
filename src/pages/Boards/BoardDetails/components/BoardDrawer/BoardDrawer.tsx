import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DeleteIcon from '@mui/icons-material/Delete'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import GroupsIcon from '@mui/icons-material/Groups'
import LogoutIcon from '@mui/icons-material/Logout'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import DrawerHeader from '~/components/DrawerHeader'
import ChangeBackgroundDrawer from '~/pages/Boards/BoardDetails/components/ChangeBackgroundDrawer'
import { BoardRole } from '~/constants/type'
import { BoardMemberType } from '~/schemas/board.schema'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { useLeaveBoardMutation } from '~/queries/boards'
import { updateActiveBoard, clearActiveBoard } from '~/store/slices/board.slice'

interface BoardDrawerProps {
  open: boolean
  onOpen: (open: boolean) => void
  boardMembers: BoardMemberType[]
  isBoardMember: boolean
  boardId: string
}

export default function BoardDrawer({ open, onOpen, boardMembers, isBoardMember, boardId }: BoardDrawerProps) {
  const theme = useTheme()

  const [changeBackgroundDrawer, setChangeBackgroundDrawer] = useState(false)

  const dispatch = useAppDispatch()

  const { profile } = useAppSelector((state) => state.auth)
  const { activeBoard } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)

  const [leaveBoardMutation] = useLeaveBoardMutation()

  const totalBoardMembers = boardMembers?.length

  const currentUserMember = boardMembers?.find((member) => member.user_id === profile?._id)
  const isCurrentUserAdmin = currentUserMember?.role === BoardRole.Admin

  const totalAdmins = boardMembers?.filter((member) => member.role === BoardRole.Admin).length || 0

  // Check if current user is the last admin
  const isLastAdmin = isCurrentUserAdmin && totalAdmins === 1
  const canLeaveBoard = currentUserMember && !isLastAdmin

  const onOpenChangeBackgroundDrawer = (open: boolean) => {
    setChangeBackgroundDrawer(open)
  }

  const leaveBoard = async () => {
    await leaveBoardMutation(boardId).unwrap()

    if (activeBoard && profile) {
      // Check if current user is a guest in the workspace
      const isGuestInWorkspace = activeBoard.workspace.guests.some((guest) => guest === profile._id)
      const isNotInWorkspaceMembers = !activeBoard.workspace.members.some((member) => member.user_id === profile._id)

      if (isGuestInWorkspace && isNotInWorkspaceMembers) {
        // If user is a guest, clear the active board
        dispatch(clearActiveBoard())
      } else {
        // If user is a workspace member, update the board with new members list
        const updatedBoardMembers = activeBoard.members.filter((member) => member.user_id !== profile._id)

        // Create a new activeBoard object with the updated members array
        // This creates a new reference, triggering useMemo in `useBoardPermission`
        const newActiveBoard = {
          ...activeBoard,
          members: updatedBoardMembers
        }

        dispatch(updateActiveBoard(newActiveBoard))

        // Broadcast to other users for realtime sync
        socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
      }
    }
  }

  return (
    <Drawer
      sx={{
        width: theme.trellone.boardDrawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: theme.trellone.boardDrawerWidth,
          boxSizing: 'border-box',
          top: 'auto',
          height: `calc(100% - ${theme.trellone.navBarHeight})`
        }
      }}
      variant='persistent'
      anchor='right'
      open={open}
    >
      <DrawerHeader sx={{ justifyContent: 'space-between', minHeight: `${theme.trellone.navBarHeight}px!important` }}>
        <IconButton color='inherit' onClick={() => onOpen(false)}>
          {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>

        <Typography variant='subtitle1'>Menu</Typography>
        <Box sx={{ width: 40, height: 40 }} />
      </DrawerHeader>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText secondary='About this board' />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => onOpenChangeBackgroundDrawer(true)} disabled={!isBoardMember}>
            <ListItemIcon>
              <FavoriteBorderIcon />
            </ListItemIcon>
            <ListItemText secondary='Change background' />
          </ListItemButton>
        </ListItem>

        <ChangeBackgroundDrawer open={changeBackgroundDrawer} onOpen={onOpenChangeBackgroundDrawer} />

        <ListItem disablePadding>
          <ListItemButton disabled>
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText secondary={`Members (${totalBoardMembers})`} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton disabled>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText secondary='Delete this board' />
          </ListItemButton>
        </ListItem>

        {canLeaveBoard && (
          <ListItem disablePadding>
            <ListItemButton onClick={leaveBoard}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText secondary='Leave board' />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Drawer>
  )
}
