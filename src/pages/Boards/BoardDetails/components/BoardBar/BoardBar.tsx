import MenuIcon from '@mui/icons-material/Menu'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import { useClickAway } from '@uidotdev/usehooks'
import { useEffect, useState } from 'react'
import AppBar from '~/components/AppBar'
import { useBoardPermission } from '~/hooks/use-permissions'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import BoardUserGroup from '~/pages/Boards/BoardDetails/components/BoardUserGroup'
import InviteBoardMembersDialog from '~/pages/Boards/BoardDetails/components/InviteBoardMembersDialog'
import { useUpdateBoardMutation } from '~/queries/boards'
import { BoardResType } from '~/schemas/board.schema'
import { updateActiveBoard } from '~/store/slices/board.slice'
import Button from '@mui/material/Button'
import { useJoinWorkspaceBoardMutation } from '~/queries/workspaces'
import { UserType } from '~/schemas/user.schema'

interface BoardBarProps {
  workspaceDrawerOpen: boolean
  onWorkspaceDrawerOpen: (open: boolean) => void
  boardDrawerOpen: boolean
  onBoardDrawerOpen: (open: boolean) => void
  board: BoardResType['result']
}

const MENU_STYLES = {
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'text.primary'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  },
  fontSize: '0.875rem',
  fontWeight: 500
}

export default function BoardBar({
  workspaceDrawerOpen,
  onWorkspaceDrawerOpen,
  boardDrawerOpen,
  onBoardDrawerOpen,
  board
}: BoardBarProps) {
  const [editBoardTitleFormOpen, setEditBoardTitleFormOpen] = useState(false)
  const [boardTitle, setBoardTitle] = useState('')

  const editBoardTitleClickAwayRef = useClickAway<HTMLInputElement>(() => {
    updateBoardTitle()
  })

  const dispatch = useAppDispatch()

  const { activeBoard } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)
  const { profile } = useAppSelector((state) => state.auth)

  const { isMember } = useBoardPermission(activeBoard)

  // Update local boardTitle state whenever the board title changes
  // This ensures that when another user updates the title via socket, the local state is also updated
  useEffect(() => {
    if (board?.title) {
      setBoardTitle(board.title)
    }
  }, [board?.title])

  const [updateBoardMutation] = useUpdateBoardMutation()
  const [joinWorkspaceBoardMutation] = useJoinWorkspaceBoardMutation()

  const toggleEditBoardTitleForm = () => {
    if (!isMember) {
      return
    }

    // Always set the current board title when opening the edit form
    // This ensures we're always starting with the latest title
    if (!editBoardTitleFormOpen) {
      setBoardTitle(board.title)
    }

    setEditBoardTitleFormOpen(!editBoardTitleFormOpen)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      updateBoardTitle()
    }
  }

  const updateBoardTitle = () => {
    setEditBoardTitleFormOpen(false)

    if (!boardTitle || boardTitle.trim() === '') {
      setBoardTitle(board.title)
      return
    }

    const newActiveBoard = { ...activeBoard! }
    newActiveBoard.title = boardTitle

    dispatch(updateActiveBoard(newActiveBoard))

    updateBoardMutation({
      id: newActiveBoard._id,
      body: { title: newActiveBoard.title }
    })

    // Emit socket event to notify other users about the board title update
    socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
  }

  const joinWorkspaceBoard = async () => {
    const joinWorkspaceBoardRes = await joinWorkspaceBoardMutation({
      workspace_id: board.workspace_id,
      board_id: board._id
    }).unwrap()

    const joinedBoard = joinWorkspaceBoardRes.result
    const currentUser = profile as UserType
    const newMember = joinedBoard.members.find((member) => member.user_id === currentUser._id)

    if (activeBoard && newMember) {
      // Create a new members array by copying the old array and adding the new member
      const updatedBoardMembers = [
        ...activeBoard.members,
        {
          ...currentUser,
          role: newMember.role,
          joined_at: new Date(),
          user_id: newMember.user_id
        }
      ]

      // Create a new activeBoard object with the updated members array
      // This creates a new reference, triggering useMemo in `useBoardPermission`
      const newActiveBoard = {
        ...activeBoard,
        members: updatedBoardMembers
      }

      dispatch(updateActiveBoard(newActiveBoard))

      // Broadcast to other users for realtime sync
      socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
      socket?.emit('CLIENT_USER_UPDATED_WORKSPACE', newActiveBoard.workspace_id)
    }
  }

  return (
    <AppBar
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 40%)' : 'rgb(255 255 255 / 40%)'),
        top: 'auto',
        zIndex: 999
      }}
      position='absolute'
      workspaceDrawerOpen={workspaceDrawerOpen}
      boardDrawerOpen={boardDrawerOpen}
    >
      <Toolbar
        sx={{
          minHeight: (theme) => theme.trellone.boardBarHeight,
          backdropFilter: 'blur(4px)',
          justifyContent: 'space-between',
          gap: 2,
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          py: 1.25,
          overflowX: 'auto'
        }}
        variant='dense'
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color='inherit'
            aria-label='open workspace drawer'
            onClick={() => onWorkspaceDrawerOpen(true)}
            edge='start'
            sx={{ ...(workspaceDrawerOpen && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>

          <Tooltip title={board.description}>
            {editBoardTitleFormOpen ? (
              <Box ref={editBoardTitleClickAwayRef}>
                <TextField
                  sx={{
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#22272b' : '#feff0026'),
                    width: '230px'
                  }}
                  variant='outlined'
                  size='small'
                  autoFocus
                  focused
                  inputProps={{ style: { fontWeight: 500, fontSize: '1rem' } }}
                  value={boardTitle}
                  onChange={(e) => setBoardTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </Box>
            ) : (
              <Chip
                sx={{ ...MENU_STYLES }}
                icon={<SpaceDashboardIcon />}
                label={board.title}
                onClick={toggleEditBoardTitleForm}
              />
            )}
          </Tooltip>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            ml: 'auto'
          }}
        >
          {isMember ? (
            <InviteBoardMembersDialog boardId={board._id} workspaceId={board.workspace_id} />
          ) : (
            <Tooltip title='Workspace members can join this board'>
              <Button size='small' color='secondary' variant='contained' onClick={joinWorkspaceBoard}>
                Join board
              </Button>
            </Tooltip>
          )}

          <BoardUserGroup boardUsers={board?.members} />

          <IconButton
            color='inherit'
            aria-label='open board drawer'
            onClick={() => onBoardDrawerOpen(true)}
            edge='end'
            sx={{ ...(boardDrawerOpen && { display: 'none' }) }}
          >
            <MoreHorizIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
