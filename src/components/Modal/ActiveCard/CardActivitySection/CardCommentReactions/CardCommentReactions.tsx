import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { CardCommentReactionAction } from '~/constants/type'
import { useAppSelector } from '~/lib/redux/hooks'
import { useReactToCardCommentMutation } from '~/queries/cards'
import { CardType, CommentType } from '~/schemas/card.schema'

interface CardCommentReactionsProps {
  activeCard: CardType | null
  comment: CommentType
  onUpdateActiveCard: (card: CardType) => void
}

export default function CardCommentReactions({ activeCard, comment, onUpdateActiveCard }: CardCommentReactionsProps) {
  const { profile } = useAppSelector((state) => state.auth)

  const [reactToCardCommentMutation] = useReactToCardCommentMutation()

  const toggleCommentReaction = async (comment: CommentType, emoji: string, hasCurrentUserReacted: boolean) => {
    // Find the current user's existing reaction for this emoji
    const currentUserReaction = comment.reactions?.find(
      (reaction) => reaction.emoji === emoji && reaction.user_email === profile?.email
    )

    const payload = {
      emoji,
      action: hasCurrentUserReacted ? CardCommentReactionAction.Remove : CardCommentReactionAction.Add,
      reaction_id: currentUserReaction?.reaction_id
    }

    const updatedCardRes = await reactToCardCommentMutation({
      card_id: activeCard?._id as string,
      comment_id: comment.comment_id,
      body: payload
    }).unwrap()

    const updatedCard = updatedCardRes.result

    onUpdateActiveCard(updatedCard)
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {/* 
        REACTION GROUPING AND DISPLAY LOGIC
        ===================================
        
        Problem: We have an array of individual reactions like:
        [
          { emoji: '😀', user_email: 'john@example.com', reaction_id: '1', ... },
          { emoji: '😀', user_email: 'jane@example.com', reaction_id: '2', ... },
          { emoji: '👍', user_email: 'bob@example.com', reaction_id: '3', ... },
          { emoji: '😀', user_email: 'alice@example.com', reaction_id: '4', ... },
          { emoji: '👍', user_email: 'john@example.com', reaction_id: '5', ... }
        ]
        
        Goal: Group them by emoji and show counts like: [😀 3] [👍 2]
        
        Solution: Use Array.reduce() to transform the flat array into grouped data
      */}
      {comment.reactions
        .reduce(
          (
            // ACCUMULATOR: Our result array that builds up the grouped reactions
            acc: Array<{
              emoji: string // The emoji character (e.g., '😀')
              count: number // How many times this emoji was used
              users: typeof comment.reactions // Array of all reaction objects for this emoji
              hasCurrentUserReacted: boolean // Whether the current user has used this emoji
            }>,
            // CURRENT ITEM: The individual reaction we're currently processing
            reaction
          ) => {
            // Step 1: Check if we've already seen this emoji in our grouped results
            const existingReaction = acc.find((r) => r.emoji === reaction.emoji)

            // Step 2: Check if this particular reaction belongs to the current logged-in user
            const isCurrentUser = reaction.user_email === profile?.email

            if (existingReaction) {
              // CASE A: We've seen this emoji before - update the existing group
              existingReaction.count++ // Increment the count (e.g., 2 -> 3)
              existingReaction.users.push(reaction) // Add this reaction to the users array

              if (isCurrentUser) {
                // If current user reacted, mark the group as "user has reacted"
                existingReaction.hasCurrentUserReacted = true
              }
            } else {
              // CASE B: First time seeing this emoji - create a new group
              acc.push({
                emoji: reaction.emoji,
                count: 1, // Start counting at 1
                users: [reaction], // Start users array with this reaction
                hasCurrentUserReacted: isCurrentUser // Set based on current user
              })
            }

            // Step 3: Return the accumulator for the next iteration
            return acc
          },
          [] // Start with an empty array - this becomes our first 'acc' value
        )
        // After grouping, transform each group into a clickable UI element
        .map((reactionGroup, reactionIndex) => {
          const users = reactionGroup.users.map((user) => user.user_display_name)
          const userDisplayNames = users.join(', ')

          const title = `${userDisplayNames} reacted with ${reactionGroup.emoji}`

          return (
            <Tooltip key={reactionIndex} title={title}>
              <Box
                onClick={() => toggleCommentReaction(comment, reactionGroup.emoji, reactionGroup.hasCurrentUserReacted)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  px: 1,
                  minWidth: '28px',
                  height: '28px',
                  borderRadius: '18px',
                  cursor: 'pointer',
                  border: '1px solid',
                  // Visual feedback: highlight reactions the current user has made
                  borderColor: reactionGroup.hasCurrentUserReacted ? 'primary.main' : 'divider',
                  bgcolor: reactionGroup.hasCurrentUserReacted ? 'primary.50' : 'transparent',
                  '&:hover': {
                    bgcolor: reactionGroup.hasCurrentUserReacted ? 'primary.100' : 'action.hover'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <Typography variant='caption' sx={{ fontSize: '16px' }}>
                  {reactionGroup.emoji}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: reactionGroup.hasCurrentUserReacted ? 'primary.main' : 'text.secondary'
                  }}
                >
                  {reactionGroup.count}
                </Typography>
              </Box>
            </Tooltip>
          )
        })}
    </Box>
  )
}
