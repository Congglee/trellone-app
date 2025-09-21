import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MuiLink from '@mui/material/Link'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import { alpha } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useBoardPermission } from '~/hooks/use-permissions'
import { BoardResType } from '~/schemas/board.schema'

interface ClosedBoardsListRowProps {
  board: BoardResType['result']
  isLast: boolean
  onReopenBoard: (boardId: string, workspaceId: string) => void
  onLeaveBoard: (boardId: string, workspaceId: string) => void
  onDeleteBoard: (boardId: string, workspaceId: string) => void
}

export default function ClosedBoardsListRow({
  board,
  isLast,
  onReopenBoard,
  onLeaveBoard,
  onDeleteBoard
}: ClosedBoardsListRowProps) {
  const [anchorDeleteBoardPopoverElement, setAnchorDeleteBoardPopoverElement] = useState<HTMLElement | null>(null)

  const isDeleteBoardPopoverOpen = Boolean(anchorDeleteBoardPopoverElement)

  const deleteBoardPopoverId = isDeleteBoardPopoverOpen ? 'delete-board-popover' : undefined

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
              {board.workspace.title}
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
              <Tooltip title='Reopen this board'>
                <span>
                  <Button
                    variant='contained'
                    size='small'
                    onClick={() => onReopenBoard(board._id, board.workspace_id)}
                    sx={{ textTransform: 'none', fontWeight: 600, px: 2.25 }}
                  >
                    Reopen
                  </Button>
                </span>
              </Tooltip>

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

                  <Button
                    variant='contained'
                    color='error'
                    fullWidth
                    onClick={() => onDeleteBoard(board._id, board.workspace_id)}
                  >
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
              onClick={() => onLeaveBoard(board._id, board.workspace_id)}
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
