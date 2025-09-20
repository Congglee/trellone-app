import { useBoardPermission } from '~/hooks/use-permissions'
import { BoardResType } from '~/schemas/board.schema'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { alpha } from '@mui/material/styles'
import MuiLink from '@mui/material/Link'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

interface WorkspaceClosedBoardsListRowProps {
  board: BoardResType['result']
  isLast: boolean
  onReopenBoard: (boardId: string) => void
  onLeaveBoard: (boardId: string) => void
}

export default function WorkspaceClosedBoardsListRow({
  board,
  isLast,
  onReopenBoard,
  onLeaveBoard
}: WorkspaceClosedBoardsListRowProps) {
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
                    onClick={() => onReopenBoard(board._id)}
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
                onClick={() => {}}
                sx={{ textTransform: 'none', fontWeight: 600, px: 2.25 }}
                disabled
              >
                Delete
              </Button>
            </>
          ) : isNormal || isObserver ? (
            <Button
              variant='contained'
              color='error'
              size='small'
              startIcon={<DeleteOutlineIcon />}
              onClick={() => onLeaveBoard(board._id)}
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
