import AddReactionIcon from '@mui/icons-material/AddReaction'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import { useColorScheme } from '@mui/material'
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react'
import { useState } from 'react'
import { CardCommentReactionAction } from '~/constants/type'
import { useReactToCardCommentMutation } from '~/queries/cards'
import { CardType, CommentType } from '~/schemas/card.schema'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { updateActiveCard } from '~/store/slices/card.slice'
import { updateCardInBoard } from '~/store/slices/board.slice'

interface EmojiPickerPopoverProps {
  activeCard: CardType | null
  activeComment: CommentType | null
  onSetActiveComment: (comment: CommentType | null) => void
  comment: CommentType
}

export default function EmojiPickerPopover({
  activeCard,
  activeComment,
  onSetActiveComment,
  comment
}: EmojiPickerPopoverProps) {
  const { mode } = useColorScheme()

  const dispatch = useAppDispatch()

  const { profile } = useAppSelector((state) => state.auth)
  const { socket } = useAppSelector((state) => state.app)

  const [anchorEmojiPickerElement, setAnchorEmojiPickerElement] = useState<HTMLElement | null>(null)

  const isEmojiPickerOpen = Boolean(anchorEmojiPickerElement)
  const emojiPickerId = isEmojiPickerOpen ? 'emoji-picker-popover' : undefined

  const emojiPickerTheme = (mode === 'system' || mode === 'dark' ? 'dark' : 'light') as Theme

  const [reactToCardCommentMutation] = useReactToCardCommentMutation()

  const handleEmojiPickerOpen = (event: React.MouseEvent<HTMLElement>, comment: CommentType) => {
    setAnchorEmojiPickerElement(event.currentTarget)
    onSetActiveComment(comment)
  }

  const handleEmojiPickerClose = () => {
    setAnchorEmojiPickerElement(null)
    onSetActiveComment(null)
  }

  const handleEmojiSelect = async (emojiData: EmojiClickData) => {
    if (activeComment) {
      // Find the current user's existing reaction for this emoji
      const currentUserReaction = activeComment.reactions?.find(
        (reaction) => reaction.emoji === emojiData.emoji && reaction.user_email === profile?.email
      )

      const payload = {
        emoji: emojiData.emoji,
        action: currentUserReaction ? CardCommentReactionAction.Remove : CardCommentReactionAction.Add,
        reaction_id: currentUserReaction?.reaction_id
      }

      const updatedCardRes = await reactToCardCommentMutation({
        card_id: activeCard?._id as string,
        comment_id: activeComment.comment_id,
        body: payload
      }).unwrap()

      const updatedCard = updatedCardRes.result

      dispatch(updateActiveCard(updatedCard))
      dispatch(updateCardInBoard(updatedCard))

      // Emit socket event to broadcast the card update to other users
      socket?.emit('CLIENT_USER_UPDATED_CARD', updatedCard)
    }
  }

  return (
    <>
      <IconButton size='small' onClick={(e) => handleEmojiPickerOpen(e, comment)}>
        <AddReactionIcon fontSize='small' />
      </IconButton>

      <Popover
        id={emojiPickerId}
        open={isEmojiPickerOpen}
        anchorEl={anchorEmojiPickerElement}
        onClose={handleEmojiPickerClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: { sx: { borderRadius: 2 } }
        }}
      >
        <Box sx={{ p: 1 }}>
          <EmojiPicker onEmojiClick={handleEmojiSelect} width={400} height={400} theme={emojiPickerTheme} />
        </Box>
      </Popover>
    </>
  )
}
