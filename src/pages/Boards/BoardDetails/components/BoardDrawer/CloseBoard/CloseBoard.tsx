import RemoveIcon from '@mui/icons-material/Remove'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useState } from 'react'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import MuiLink from '@mui/material/Link'
import path from '~/constants/path'
import { useUpdateBoardMutation } from '~/queries/boards'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { updateActiveBoard } from '~/store/slices/board.slice'
import { workspaceApi } from '~/queries/workspaces'

export default function CloseBoard() {
  const [anchorCloseBoardPopoverElement, setAnchorCloseBoardPopoverElement] = useState<HTMLElement | null>(null)

  const isCloseBoardPopoverOpen = Boolean(anchorCloseBoardPopoverElement)

  const closeBoardPopoverId = isCloseBoardPopoverOpen ? 'close-board-popover' : undefined

  const toggleCloseBoardPopover = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isCloseBoardPopoverOpen) {
      setAnchorCloseBoardPopoverElement(null)
    } else {
      setAnchorCloseBoardPopoverElement(event.currentTarget)
    }
  }

  const handleCloseBoardPopoverClose = () => {
    setAnchorCloseBoardPopoverElement(null)
  }

  const dispatch = useAppDispatch()

  const { activeBoard } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)

  const [updateBoardMutation] = useUpdateBoardMutation()

  const closeBoard = () => {
    updateBoardMutation({
      id: activeBoard?._id as string,
      body: { _destroy: true }
    }).then((res) => {
      if (!res.error) {
        const newActiveBoard = { ...activeBoard! }
        newActiveBoard._destroy = true

        dispatch(updateActiveBoard(newActiveBoard))
        dispatch(workspaceApi.util.invalidateTags([{ type: 'Workspace', id: 'LIST' }]))

        socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
        socket?.emit('CLIENT_USER_UPDATED_WORKSPACE', newActiveBoard.workspace_id, newActiveBoard._id)
      }
    })
  }

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={toggleCloseBoardPopover}>
          <ListItemIcon>
            <RemoveIcon />
          </ListItemIcon>
          <ListItemText secondary='Close board' />
        </ListItemButton>
      </ListItem>

      <Popover
        id={closeBoardPopoverId}
        open={isCloseBoardPopoverOpen}
        anchorEl={anchorCloseBoardPopoverElement}
        onClose={handleCloseBoardPopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: { sx: { width: 320, borderRadius: 2 } }
        }}
      >
        <Box sx={{ p: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, position: 'relative' }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
              Close board?
            </Typography>
            <IconButton size='small' onClick={handleCloseBoardPopoverClose} sx={{ position: 'absolute', right: 0 }}>
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>

          <Typography variant='body2' sx={{ mb: 3, color: 'text.secondary' }}>
            You can find and reopen closed boards at the bottom of{' '}
            <MuiLink href={path.boardsList} sx={{ textDecoration: 'underline' }}>
              your boards page.
            </MuiLink>
          </Typography>

          <Button variant='contained' color='error' fullWidth onClick={closeBoard}>
            Close
          </Button>
        </Box>
      </Popover>
    </>
  )
}
