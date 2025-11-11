import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CloseIcon from '@mui/icons-material/Close'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import LockIcon from '@mui/icons-material/Lock'
import LogoutIcon from '@mui/icons-material/Logout'
import PublicIcon from '@mui/icons-material/Public'
import SettingsIcon from '@mui/icons-material/Settings'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import cloneDeep from 'lodash/cloneDeep'
import { useMemo, useState } from 'react'
import DrawerHeader from '~/components/DrawerHeader'
import { BoardRole } from '~/constants/type'
import { useCategorizeWorkspaces } from '~/hooks/use-categorize-workspaces'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import ArchivedCards from '~/pages/Boards/BoardDetails/components/BoardDrawer/ArchivedCards'
import BoardInfomation from '~/pages/Boards/BoardDetails/components/BoardDrawer/BoardInfomation'
import ChangeBoardBackground from '~/pages/Boards/BoardDetails/components/BoardDrawer/ChangeBoardBackground'
import CloseBoard from '~/pages/Boards/BoardDetails/components/BoardDrawer/CloseBoard'
import DeleteBoard from '~/pages/Boards/BoardDetails/components/BoardDrawer/DeleteBoard'
import { useLeaveBoardMutation, useReopenBoardMutation } from '~/queries/boards'
import { useGetWorkspacesQuery } from '~/queries/workspaces'
import { BoardMemberType } from '~/schemas/board.schema'
import { clearActiveBoard, updateActiveBoard } from '~/store/slices/board.slice'

interface BoardDrawerProps {
  open: boolean
  onOpen: (open: boolean) => void
  boardMembers: BoardMemberType[]
  boardId: string
  isBoardAdmin: boolean
  canManageBoard: boolean
  canEditBoardInfo: boolean
  canChangeBoardBackground: boolean
  canDeleteBoard: boolean
}

export default function BoardDrawer({
  open,
  onOpen,
  boardMembers,
  canManageBoard,
  canEditBoardInfo,
  isBoardAdmin,
  boardId,
  canChangeBoardBackground,
  canDeleteBoard
}: BoardDrawerProps) {
  const theme = useTheme()

  const [anchorSelectWorkspacePopoverElement, setAnchorSelectWorkspacePopoverElement] = useState<HTMLElement | null>(
    null
  )
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('')

  const isSelectWorkspacePopoverOpen = Boolean(anchorSelectWorkspacePopoverElement)
  const selectWorkspacePopoverId = isSelectWorkspacePopoverOpen ? 'select-workspace-popover' : undefined

  const dispatch = useAppDispatch()

  const { profile } = useAppSelector((state) => state.auth)
  const { activeBoard } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)

  const [leaveBoardMutation] = useLeaveBoardMutation()
  const [reopenBoardMutation] = useReopenBoardMutation()

  const { data: workspacesData } = useGetWorkspacesQuery({ page: 1, limit: 100 }, { skip: !open })

  const workspacesList = useMemo(() => workspacesData?.result.workspaces || [], [workspacesData])

  const { memberWorkspaces } = useCategorizeWorkspaces(workspacesList)

  const currentUserMember = boardMembers?.find((member) => member.user_id === profile?._id)
  const isCurrentUserAdmin = currentUserMember?.role === BoardRole.Admin

  const totalAdmins = boardMembers?.filter((member) => member.role === BoardRole.Admin).length || 0

  const isBoardClosed = activeBoard?._destroy

  // Check if current user is the last admin
  const isLastAdmin = isCurrentUserAdmin && totalAdmins === 1
  const canLeaveBoard = currentUserMember && !isLastAdmin
  const canReopenBoard = isBoardClosed && isBoardAdmin

  const handleSelectWorkspacePopoverClose = () => {
    setAnchorSelectWorkspacePopoverElement(null)
    setSelectedWorkspaceId('')
  }

  const handleWorkspaceChange = (event: SelectChangeEvent<string>) => {
    setSelectedWorkspaceId(event.target.value)
  }

  const handleReopenClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // If board has no workspace (workspace was deleted), show workspace selector
    if (activeBoard?.workspace_id === null) {
      setAnchorSelectWorkspacePopoverElement(event.currentTarget)
    } else {
      // Otherwise, reopen normally
      reopenBoard()
    }
  }

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

  const reopenBoard = (newWorkspaceId?: string) => {
    const payload = newWorkspaceId ? { workspace_id: newWorkspaceId } : undefined

    reopenBoardMutation({ id: boardId, body: payload }).then((res) => {
      if (!res.error) {
        const newActiveBoard = { ...activeBoard! }
        newActiveBoard._destroy = false

        if (newWorkspaceId !== undefined) {
          newActiveBoard.workspace_id = newWorkspaceId

          const newWorkspace = workspacesList.find((workspace) => workspace._id === newWorkspaceId)

          if (newWorkspace) {
            newActiveBoard.workspace = {
              _id: newWorkspace._id,
              title: newWorkspace.title,
              logo: newWorkspace.logo,
              boards: newWorkspace.boards || [],
              members: newWorkspace.members || [],
              guests: Array.isArray(newWorkspace.guests)
                ? newWorkspace.guests.map((guest) => (typeof guest === 'string' ? guest : guest._id))
                : []
            }
          }
        }

        dispatch(updateActiveBoard(newActiveBoard))

        socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)

        const targetWorkspaceId = newWorkspaceId !== undefined ? newWorkspaceId : activeBoard?.workspace_id

        if (targetWorkspaceId) {
          socket?.emit('CLIENT_USER_UPDATED_WORKSPACE', targetWorkspaceId)
        }

        handleSelectWorkspacePopoverClose()
      }
    })
  }

  const reopenBoardWithWorkspace = () => {
    if (selectedWorkspaceId) {
      reopenBoard(selectedWorkspaceId)
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

        <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
          Menu
        </Typography>
        <Box sx={{ width: 40, height: 40 }} />
      </DrawerHeader>

      <Divider />

      <List>
        <BoardInfomation
          boardMembers={boardMembers}
          boardDescription={activeBoard?.description}
          canEditBoardInfo={canEditBoardInfo}
        />

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>{activeBoard?.visibility === 'Public' ? <PublicIcon /> : <LockIcon />}</ListItemIcon>
            <ListItemText secondary={`Visibility: ${activeBoard?.visibility}`} />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 1 }} />

        <ListItem disablePadding>
          <ListItemButton disabled>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText secondary='Settings' />
          </ListItemButton>
        </ListItem>

        <ChangeBoardBackground canChangeBoardBackground={canChangeBoardBackground} />

        <ArchivedCards />

        <Divider sx={{ my: 1 }} />

        <ListItem disablePadding>
          <ListItemButton disabled>
            <ListItemIcon>
              <ContentCopyIcon />
            </ListItemIcon>
            <ListItemText secondary='Copy board' />
          </ListItemButton>
        </ListItem>

        {canManageBoard && <CloseBoard />}

        {canReopenBoard && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleReopenClick}>
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

      <Popover
        id={selectWorkspacePopoverId}
        open={isSelectWorkspacePopoverOpen}
        anchorEl={anchorSelectWorkspacePopoverElement}
        onClose={handleSelectWorkspacePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: { sx: { width: 320, borderRadius: 2 } }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              position: 'relative'
            }}
          >
            <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
              Select a Workspace
            </Typography>
            <IconButton
              size='small'
              onClick={handleSelectWorkspacePopoverClose}
              sx={{ position: 'absolute', right: 0 }}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>

          <Typography variant='body2' sx={{ mb: 2, color: 'text.secondary' }}>
            Your Workspaces
          </Typography>

          <Select
            size='small'
            fullWidth
            value={selectedWorkspaceId}
            onChange={handleWorkspaceChange}
            displayEmpty
            sx={{ mb: 2 }}
          >
            <MenuItem value='' disabled>
              Choose...
            </MenuItem>
            {memberWorkspaces.map((workspace) => (
              <MenuItem key={workspace._id} value={workspace._id}>
                {workspace.title}
              </MenuItem>
            ))}
          </Select>

          <Button variant='contained' fullWidth disabled={!selectedWorkspaceId} onClick={reopenBoardWithWorkspace}>
            Reopen board
          </Button>
        </Box>
      </Popover>
    </Drawer>
  )
}
