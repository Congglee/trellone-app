import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useUpdateBoardMutation } from '~/queries/boards'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { updateActiveBoard } from '~/store/slices/board.slice'

export default function BoardClosedBanner() {
  const [updateBoardMutation] = useUpdateBoardMutation()

  const dispatch = useAppDispatch()

  const { activeBoard } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)

  const reopenBoard = () => {
    const boardId = activeBoard?._id as string

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
    <Box
      role='status'
      aria-live='polite'
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        minWidth: 0,
        gap: 1.5,
        px: 2,
        py: 1.25,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.dark'),
        color: 'common.white',
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        position: 'relative',
        zIndex: 1,
        height: '48px',
        overflowX: 'auto',
        overflowY: 'hidden',
        flexWrap: 'nowrap',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <Box
        component='span'
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1.5,
          whiteSpace: 'nowrap',
          width: 'max-content',
          flexShrink: 0,
          mx: 'auto'
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 20, opacity: 0.9, flexShrink: 0 }} />
        <Typography
          component='span'
          variant='body2'
          sx={{
            opacity: 0.95,
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          This board is closed. Reopen the board to make changes.{' '}
          <Typography
            component='span'
            variant='body2'
            sx={{
              opacity: 0.95,
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: 'inherit',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            onClick={reopenBoard}
          >
            Reopen board
          </Typography>
        </Typography>
      </Box>
    </Box>
  )
}
