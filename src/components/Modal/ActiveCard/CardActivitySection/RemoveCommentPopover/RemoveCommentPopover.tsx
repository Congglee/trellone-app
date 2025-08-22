import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { CommentType } from '~/schemas/card.schema'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { useRemoveCardCommentMutation } from '~/queries/cards'
import { updateActiveCard } from '~/store/slices/card.slice'
import { updateCardInBoard } from '~/store/slices/board.slice'

interface RemoveCommentPopoverProps {
  activeComment: CommentType | null
  onSetActiveComment: (comment: CommentType | null) => void
  comment: CommentType
}

export default function RemoveCommentPopover({
  activeComment,
  onSetActiveComment,
  comment
}: RemoveCommentPopoverProps) {
  const dispatch = useAppDispatch()

  const { activeCard } = useAppSelector((state) => state.card)
  const { socket } = useAppSelector((state) => state.app)

  const [removeCardCommentMutation] = useRemoveCardCommentMutation()

  const [anchorRemoveCommentPopoverElement, setAnchorRemoveCommentPopoverElement] = useState<HTMLElement | null>(null)

  const isRemoveCommentPopoverOpen = Boolean(anchorRemoveCommentPopoverElement)

  const removeCommentPopoverId = isRemoveCommentPopoverOpen ? 'remove-comment-popover' : undefined

  const toggleRemoveCommentPopover = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, comment: CommentType) => {
    if (!anchorRemoveCommentPopoverElement) {
      setAnchorRemoveCommentPopoverElement(event.currentTarget)
      onSetActiveComment(comment)
    } else {
      setAnchorRemoveCommentPopoverElement(null)
      onSetActiveComment(null)
    }
  }

  const handleRemoveCommentPopoverClose = () => {
    setAnchorRemoveCommentPopoverElement(null)
    onSetActiveComment(null)
  }

  const removeCardComment = async () => {
    if (!activeComment) {
      return
    }

    const updatedCardRes = await removeCardCommentMutation({
      card_id: activeCard?._id as string,
      comment_id: activeComment.comment_id
    }).unwrap()

    const updatedCard = updatedCardRes.result

    dispatch(updateActiveCard(updatedCard))
    dispatch(updateCardInBoard(updatedCard))

    // Emit socket event to broadcast the card update to other users
    socket?.emit('CLIENT_USER_UPDATED_CARD', updatedCard)

    handleRemoveCommentPopoverClose()
  }

  return (
    <>
      <Typography
        component='span'
        sx={{
          fontSize: '12px',
          color: 'text.secondary',
          cursor: 'pointer',
          '&:hover': {
            textDecoration: 'underline'
          }
        }}
        onClick={(e) => toggleRemoveCommentPopover(e, comment)}
      >
        Delete
      </Typography>

      <Popover
        id={removeCommentPopoverId}
        open={isRemoveCommentPopoverOpen}
        anchorEl={anchorRemoveCommentPopoverElement}
        onClose={handleRemoveCommentPopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: { sx: { borderRadius: 2 } }
        }}
      >
        <Box sx={{ p: 1.5, maxWidth: '350px', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, position: 'relative' }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
              Delete comment?
            </Typography>
            <IconButton size='small' onClick={handleRemoveCommentPopoverClose} sx={{ position: 'absolute', right: 0 }}>
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>

          <Typography variant='body2' sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
            Deleting a comment is forever. There is no undo.
          </Typography>

          <Button variant='contained' color='error' fullWidth onClick={removeCardComment}>
            Delete comment
          </Button>
        </Box>
      </Popover>
    </>
  )
}
