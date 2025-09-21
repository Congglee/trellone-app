import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DashboardIcon from '@mui/icons-material/Dashboard'
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
import cloneDeep from 'lodash/cloneDeep'
import DrawerHeader from '~/components/DrawerHeader'
import { BoardRole } from '~/constants/type'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import ChangeBoardBackground from '~/pages/Boards/BoardDetails/components/BoardDrawer/ChangeBoardBackground'
import CloseBoard from '~/pages/Boards/BoardDetails/components/BoardDrawer/CloseBoard'
import DeleteBoard from '~/pages/Boards/BoardDetails/components/BoardDrawer/DeleteBoard'
import { useLeaveBoardMutation, useUpdateBoardMutation } from '~/queries/boards'
import { BoardMemberType } from '~/schemas/board.schema'
import { clearActiveBoard, updateActiveBoard } from '~/store/slices/board.slice'

interface BoardDrawerProps {
  open: boolean
  onOpen: (open: boolean) => void
  boardMembers: BoardMemberType[]
  boardId: string
  isBoardAdmin: boolean
  canManageBoard: boolean
  canDeleteBoard: boolean
}

export default function BoardDrawer({
  open,
  onOpen,
  boardMembers,
  canManageBoard,
  isBoardAdmin,
  boardId,
  canDeleteBoard
}: BoardDrawerProps) {
  const theme = useTheme()

  const dispatch = useAppDispatch()

  const { profile } = useAppSelector((state) => state.auth)
  const { activeBoard } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)

  const [leaveBoardMutation] = useLeaveBoardMutation()
  const [updateBoardMutation] = useUpdateBoardMutation()

  const totalBoardMembers = boardMembers?.length

  const currentUserMember = boardMembers?.find((member) => member.user_id === profile?._id)
  const isCurrentUserAdmin = currentUserMember?.role === BoardRole.Admin

  const totalAdmins = boardMembers?.filter((member) => member.role === BoardRole.Admin).length || 0

  const isBoardClosed = activeBoard?._destroy

  // Check if current user is the last admin
  const isLastAdmin = isCurrentUserAdmin && totalAdmins === 1
  const canLeaveBoard = currentUserMember && !isLastAdmin
  const canReopenBoard = isBoardClosed && isBoardAdmin

  const leaveBoard = () => {
    leaveBoardMutation(boardId).then((res) => {
      if (!res.error) {
        if (activeBoard) {
          // Check if current user is a guest in the workspace
          const isGuestInWorkspace = activeBoard.workspace.guests.some((guest) => guest === profile?._id)
          const isNotInWorkspaceMembers = !activeBoard.workspace.members.some(
            (member) => member.user_id === profile?._id
          )

          if (isGuestInWorkspace && isNotInWorkspaceMembers) {
            // If user is a guest, clear the active board
            dispatch(clearActiveBoard())
          } else {
            // If user is a workspace member, update the board with new members list
            const updatedBoardMembers = activeBoard.members.filter((member) => member.user_id !== profile?._id)

            // Create a deep-cloned activeBoard and also remove user from all card members in every column
            const newActiveBoard = cloneDeep(activeBoard)

            newActiveBoard.members = updatedBoardMembers
            newActiveBoard.columns?.forEach((column) => {
              column.cards?.forEach((card) => {
                if (Array.isArray(card.members)) {
                  card.members = card.members.filter((memberId) => memberId !== profile?._id)
                }
              })
            })

            dispatch(updateActiveBoard(newActiveBoard))

            socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
            socket?.emit('CLIENT_USER_UPDATED_WORKSPACE', newActiveBoard.workspace_id)
          }
        }
      }
    })
  }

  const reopenBoard = () => {
    updateBoardMutation({
      id: boardId,
      body: { _destroy: false }
    }).then((res) => {
      if (!res.error) {
        const newActiveBoard = { ...activeBoard! }
        newActiveBoard._destroy = false

        dispatch(updateActiveBoard(newActiveBoard))

        socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
        socket?.emit('CLIENT_USER_UPDATED_WORKSPACE', newActiveBoard.workspace_id)
      }
    })
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
          height: isBoardClosed
            ? `calc(100% - ${theme.trellone.navBarHeight} - 48px)`
            : `calc(100% - ${theme.trellone.navBarHeight})`
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

        <ChangeBoardBackground canManageBoard={canManageBoard} />

        <ListItem disablePadding>
          <ListItemButton disabled>
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText secondary={`Members (${totalBoardMembers})`} />
          </ListItemButton>
        </ListItem>

        {canManageBoard && <CloseBoard />}

        {canReopenBoard && (
          <ListItem disablePadding>
            <ListItemButton onClick={reopenBoard}>
              <ListItemIcon>
                <ArrowOutwardIcon />
              </ListItemIcon>
              <ListItemText secondary='Reopen board' />
            </ListItemButton>
          </ListItem>
        )}

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

        {canDeleteBoard && <DeleteBoard boardId={boardId} />}
      </List>
    </Drawer>
  )
}
