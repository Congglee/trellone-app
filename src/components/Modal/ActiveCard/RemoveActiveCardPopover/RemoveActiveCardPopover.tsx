import CloseIcon from '@mui/icons-material/Close'
import RemoveIcon from '@mui/icons-material/Remove'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import cloneDeep from 'lodash/cloneDeep'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { useDeleteCardMutation } from '~/queries/cards'
import { updateActiveBoard } from '~/store/slices/board.slice'
import { clearAndHideActiveCardModal } from '~/store/slices/card.slice'

interface RemoveActiveCardPopoverProps {
  cardId: string
  columnId: string
}

export default function RemoveActiveCardPopover({ cardId, columnId }: RemoveActiveCardPopoverProps) {
  const [anchorRemoveActiveCardPopoverElement, setAnchorRemoveActiveCardPopoverElement] = useState<HTMLElement | null>(
    null
  )

  const isRemoveActiveCardPopoverOpen = Boolean(anchorRemoveActiveCardPopoverElement)

  const removeActiveCardPopoverId = 'remove-active-card-popover'

  const dispatch = useAppDispatch()

  const { activeBoard } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)

  const [deleteCardMutation] = useDeleteCardMutation()

  const toggleRemoveActiveCardPopover = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (isRemoveActiveCardPopoverOpen) {
      setAnchorRemoveActiveCardPopoverElement(null)
    } else {
      setAnchorRemoveActiveCardPopoverElement(event.currentTarget)
    }
  }

  const handleRemoveActiveCardPopoverClose = () => {
    setAnchorRemoveActiveCardPopoverElement(null)
  }

  const deleteActiveCard = async () => {
    const newActiveBoard = cloneDeep(activeBoard)
    const columnToUpdate = newActiveBoard?.columns?.find((column) => column._id === columnId)

    if (columnToUpdate) {
      columnToUpdate.cards = columnToUpdate.cards?.filter((card) => card._id !== cardId)
      columnToUpdate.card_order_ids = columnToUpdate.card_order_ids?.filter((id) => id !== cardId)
    }

    dispatch(updateActiveBoard(newActiveBoard))

    await deleteCardMutation(cardId)

    dispatch(clearAndHideActiveCardModal())

    // Emit socket event to notify other users about the card deletion
    socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
  }

  return (
    <>
      <Button
        fullWidth
        onClick={toggleRemoveActiveCardPopover}
        sx={{
          p: '10px',
          fontWeight: '600',
          lineHeight: 'inherit',
          gap: '6px',
          justifyContent: 'flex-start',
          transition: 'none',
          backgroundColor: (theme) =>
            isRemoveActiveCardPopoverOpen
              ? theme.palette.mode === 'dark'
                ? '#424242'
                : '#f5f5f5'
              : theme.palette.error.main,
          color: (theme) =>
            isRemoveActiveCardPopoverOpen
              ? theme.palette.mode === 'dark'
                ? '#fff'
                : '#333'
              : theme.palette.error.contrastText,
          '&:hover': {
            backgroundColor: (theme) =>
              isRemoveActiveCardPopoverOpen
                ? theme.palette.mode === 'dark'
                  ? '#525252'
                  : '#e0e0e0'
                : theme.palette.mode === 'dark'
                  ? theme.palette.error.dark
                  : theme.palette.error.light,
            '&.active': {
              backgroundColor: (theme) =>
                isRemoveActiveCardPopoverOpen
                  ? theme.palette.mode === 'dark'
                    ? '#525252'
                    : '#e0e0e0'
                  : theme.palette.mode === 'dark'
                    ? theme.palette.error.dark
                    : theme.palette.error.light,
              color: (theme) =>
                isRemoveActiveCardPopoverOpen
                  ? theme.palette.mode === 'dark'
                    ? '#fff'
                    : '#333'
                  : theme.palette.error.contrastText
            }
          }
        }}
      >
        <RemoveIcon fontSize='small' />
        <span>Delete</span>
      </Button>

      <Popover
        id={removeActiveCardPopoverId}
        open={isRemoveActiveCardPopoverOpen}
        anchorEl={anchorRemoveActiveCardPopoverElement}
        onClose={toggleRemoveActiveCardPopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: { sx: { borderRadius: 2 } }
        }}
      >
        <Box sx={{ p: 1.5, maxWidth: '350px', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, position: 'relative' }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
              Delete card?
            </Typography>
            <IconButton
              size='small'
              onClick={handleRemoveActiveCardPopoverClose}
              sx={{ position: 'absolute', right: 0 }}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>

          <Typography variant='body2' sx={{ mb: 3, color: 'text.secondary' }}>
            All actions will be removed from the activity feed and you won’t be able to re-open the card. There is no
            undo.
          </Typography>

          <Button variant='contained' color='error' fullWidth onClick={deleteActiveCard}>
            Delete
          </Button>
        </Box>
      </Popover>
    </>
  )
}
