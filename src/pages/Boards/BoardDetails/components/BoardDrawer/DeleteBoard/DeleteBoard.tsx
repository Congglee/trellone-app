import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import path from '~/constants/path'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { useDeleteBoardMutation } from '~/queries/boards'
import { workspaceApi } from '~/queries/workspaces'
import { clearActiveBoard } from '~/store/slices/board.slice'

interface DeleteBoardProps {
  boardId: string
}

export default function DeleteBoard({ boardId }: DeleteBoardProps) {
  const navigate = useNavigate()

  const [anchorDeleteBoardPopoverElement, setAnchorDeleteBoardPopoverElement] = useState<HTMLElement | null>(null)

  const isDeleteBoardPopoverOpen = Boolean(anchorDeleteBoardPopoverElement)

  const deleteBoardPopoverId = isDeleteBoardPopoverOpen ? 'delete-board-popover' : undefined

  const handleDeleteBoardPopoverToggle = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDeleteBoardPopoverOpen) {
      setAnchorDeleteBoardPopoverElement(null)
    } else {
      setAnchorDeleteBoardPopoverElement(event.currentTarget)
    }
  }

  const handleDeleteBoardPopoverClose = () => {
    setAnchorDeleteBoardPopoverElement(null)
  }

  const dispatch = useAppDispatch()

  const { activeBoard } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)

  const [deleteBoardMutation] = useDeleteBoardMutation()

  const deleteBoard = () => {
    deleteBoardMutation(boardId).then((res) => {
      if (!res.error) {
        const workspaceId = activeBoard?.workspace_id as string

        dispatch(
          workspaceApi.util.invalidateTags([
            { type: 'Workspace', id: workspaceId },
            { type: 'Workspace', id: 'LIST' }
          ])
        )

        socket?.emit('CLIENT_USER_DELETED_BOARD', boardId)
        socket?.emit('CLIENT_USER_UPDATED_WORKSPACE', workspaceId)

        navigate(path.workspaceHome.replace(':workspaceId', workspaceId))

        dispatch(clearActiveBoard())
      }
    })
  }

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={handleDeleteBoardPopoverToggle}>
          <ListItemIcon>
            <DeleteIcon color='error' />
          </ListItemIcon>
          <ListItemText secondary='Permanently delete board' />
        </ListItemButton>
      </ListItem>

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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, position: 'relative' }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
              Delete board?
            </Typography>
            <IconButton size='small' onClick={handleDeleteBoardPopoverClose} sx={{ position: 'absolute', right: 0 }}>
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>

          <Typography variant='body2' sx={{ mb: 3, color: 'text.secondary' }}>
            All columns, cards and actions will be deleted, and you won’t be able to re-open the board. There is no
            undo.
          </Typography>

          <Button variant='contained' color='error' fullWidth onClick={deleteBoard}>
            Delete
          </Button>
        </Box>
      </Popover>
    </>
  )
}
