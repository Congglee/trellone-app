import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MuiLink from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import { alpha } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useBoardPermission } from '~/hooks/use-permissions'
import type { BoardType } from '~/schemas/board.schema'
import { WorkspaceType } from '~/schemas/workspace.schema'

interface ClosedBoardsListRowProps {
  board: BoardType
  isLast: boolean
  workspaces: WorkspaceType[]
  onReopenBoard: (boardId: string, workspaceId: string, newWorkspaceId?: string) => void
  onLeaveBoard: (boardId: string, workspaceId: string) => void
  onDeleteBoard: (boardId: string, workspaceId: string) => void
}

export default function ClosedBoardsListRow({
  board,
  isLast,
  workspaces,
  onReopenBoard,
  onLeaveBoard,
  onDeleteBoard
}: ClosedBoardsListRowProps) {
  const [anchorDeleteBoardPopoverElement, setAnchorDeleteBoardPopoverElement] = useState<HTMLElement | null>(null)
  const [anchorSelectWorkspacePopoverElement, setAnchorSelectWorkspacePopoverElement] = useState<HTMLElement | null>(
    null
  )
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('')

  const isDeleteBoardPopoverOpen = Boolean(anchorDeleteBoardPopoverElement)
  const isSelectWorkspacePopoverOpen = Boolean(anchorSelectWorkspacePopoverElement)

  const deleteBoardPopoverId = isDeleteBoardPopoverOpen ? 'delete-board-popover' : undefined
  const selectWorkspacePopoverId = isSelectWorkspacePopoverOpen ? 'select-workspace-popover' : undefined

  const toggleDeleteBoardPopover = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (isDeleteBoardPopoverOpen) {
      setAnchorDeleteBoardPopoverElement(null)
    } else {
      setAnchorDeleteBoardPopoverElement(event.currentTarget)
    }
  }

  const handleDeleteBoardPopoverClose = () => {
    setAnchorDeleteBoardPopoverElement(null)
  }

  const handleSelectWorkspacePopoverClose = () => {
    setAnchorSelectWorkspacePopoverElement(null)
    setSelectedWorkspaceId('')
  }

  const handleWorkspaceChange = (event: SelectChangeEvent<string>) => {
    setSelectedWorkspaceId(event.target.value)
  }

  const handleReopenClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // If board has no workspace (workspace was deleted), show workspace selector
    if (board.workspace_id === null) {
      setAnchorSelectWorkspacePopoverElement(event.currentTarget)
    } else {
      // Otherwise, reopen normally
      onReopenBoard(board._id, board.workspace_id)
    }
  }

  const reopenBoard = () => {
    if (selectedWorkspaceId) {
      onReopenBoard(board._id, '', selectedWorkspaceId)
      handleSelectWorkspacePopoverClose()
    }
  }

  const leaveBoard = () => {
    onLeaveBoard(board._id, board.workspace_id as string)
  }

  const deleteBoard = () => {
    onDeleteBoard(board._id, board.workspace_id as string)
  }

  const { isAdmin, isNormal, isObserver } = useBoardPermission(board)

  return (
    <Box role='listitem'>
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        sx={{
          px: 2,
          py: 1.5,
          gap: 2.5,
          minWidth: 'max-content',
          '&:hover': {
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.common.white, 0.04)
                : alpha(theme.palette.common.black, 0.03)
          }
        }}
      >
        <Stack direction='row' alignItems='center' spacing={2} sx={{ minWidth: 0 }}>
          <Avatar
            variant='rounded'
            src={board.cover_photo}
            alt={board.title}
            sx={{
              width: 44,
              height: 44,
              borderRadius: 1.25,
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 0 0 1px rgba(255,255,255,0.06) inset'
                  : '0 0 0 1px rgba(0,0,0,0.06) inset'
            }}
          >
            {board.title.charAt(0)}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <MuiLink
              href={`/boards/${board._id}`}
              underline='hover'
              color='inherit'
              sx={{
                fontWeight: 600,
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {board.title}
            </MuiLink>
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {board.workspace?.title || 'Personal'}
            </Typography>
            {(isNormal || isObserver) && (
              <Typography
                variant='body2'
                color='text.secondary'
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px' }}
              >
                You were not an admin on this board, so you cannot reopen it.
              </Typography>
            )}
          </Box>
        </Stack>

        <Stack direction='row' alignItems='center' spacing={1.25} flexShrink={0}>
          {isAdmin ? (
            <>
              <Tooltip title={board.workspace_id === null ? 'Select a workspace to reopen' : 'Reopen this board'}>
                <span>
                  <Button
                    variant='contained'
                    size='small'
                    onClick={handleReopenClick}
                    sx={{ textTransform: 'none', fontWeight: 600, px: 2.25 }}
                  >
                    Reopen
                  </Button>
                </span>
              </Tooltip>

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
                    {workspaces.map((workspace) => (
                      <MenuItem key={workspace._id} value={workspace._id}>
                        {workspace.title}
                      </MenuItem>
                    ))}
                  </Select>

                  <Button variant='contained' fullWidth disabled={!selectedWorkspaceId} onClick={reopenBoard}>
                    Reopen board
                  </Button>
                </Box>
              </Popover>

              <Button
                variant='contained'
                color='error'
                size='small'
                startIcon={<DeleteOutlineIcon />}
                onClick={toggleDeleteBoardPopover}
                sx={{ textTransform: 'none', fontWeight: 600, px: 2.25 }}
              >
                Delete
              </Button>

              <Popover
                id={deleteBoardPopoverId}
                open={isDeleteBoardPopoverOpen}
                anchorEl={anchorDeleteBoardPopoverElement}
                onClose={handleDeleteBoardPopoverClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                slotProps={{
                  paper: { sx: { width: 320, borderRadius: 2 } }
                }}
              >
                <Box sx={{ p: 1.5 }}>
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
                      Delete board?
                    </Typography>
                    <IconButton
                      size='small'
                      onClick={handleDeleteBoardPopoverClose}
                      sx={{ position: 'absolute', right: 0 }}
                    >
                      <CloseIcon fontSize='small' />
                    </IconButton>
                  </Box>

                  <Typography variant='body2' sx={{ mb: 3, color: 'text.secondary' }}>
                    All columns, cards and actions will be deleted, and you won’t be able to re-open the board. There is
                    no undo.
                  </Typography>

                  <Button variant='contained' color='error' fullWidth onClick={deleteBoard}>
                    Delete
                  </Button>
                </Box>
              </Popover>
            </>
          ) : isNormal || isObserver ? (
            <Button
              variant='contained'
              color='error'
              size='small'
              startIcon={<DeleteOutlineIcon />}
              onClick={leaveBoard}
              sx={{ textTransform: 'none', fontWeight: 600, px: 2.25 }}
            >
              Leave
            </Button>
          ) : null}
        </Stack>
      </Stack>
      {!isLast && <Divider />}
    </Box>
  )
}
