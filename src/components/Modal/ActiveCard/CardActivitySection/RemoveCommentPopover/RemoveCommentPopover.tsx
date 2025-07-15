import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { CommentPayloadType, CommentType } from '~/schemas/card.schema'
import { useAppSelector } from '~/lib/redux/hooks'
import { CommentAction } from '~/constants/type'

interface RemoveCommentPopoverProps {
  activeComment: CommentType | null
  onSetActiveComment: (comment: CommentType | null) => void
  onUpdateCardComment: (comment: CommentPayloadType) => Promise<void>
  comment: CommentType
}

export default function RemoveCommentPopover({
  activeComment,
  onSetActiveComment,
  onUpdateCardComment,
  comment
}: RemoveCommentPopoverProps) {
  const { profile } = useAppSelector((state) => state.auth)

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

  const removeCardComment = () => {
    if (activeComment) {
      const payload = {
        action: CommentAction.Remove,
        comment_id: activeComment.comment_id,
        user_email: profile?.email as string,
        user_display_name: profile?.display_name as string,
        user_avatar: profile?.avatar as string,
        content: activeComment.content
      }

      onUpdateCardComment(payload).finally(() => {
        handleRemoveCommentPopoverClose()
      })
    }
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
        <Box sx={{ p: 1.5 }}>
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
