import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { format } from 'date-fns'
import { useRef, useState } from 'react'
import CardCommentReactions from '~/components/Modal/ActiveCard/CardActivitySection/CardCommentReactions'
import EmojiPicker from '~/components/Modal/ActiveCard/CardActivitySection/EmojiPicker'
import RemoveComment from '~/components/Modal/ActiveCard/CardActivitySection/RemoveComment'
import RichTextEditor from '~/components/RichTextEditor'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { useAddCardCommentMutation, useUpdateCardCommentMutation } from '~/queries/cards'
import { CardType, CommentType } from '~/schemas/card.schema'
import { updateCardInBoard } from '~/store/slices/board.slice'
import { updateActiveCard } from '~/store/slices/card.slice'
import { hasHtmlContent } from '~/utils/html-sanitizer'
import { prepareContentForDisplay } from '~/utils/markdown-to-html'

interface CardActivitySectionProps {
  cardComments: CommentType[]
}

export default function CardActivitySection({ cardComments }: CardActivitySectionProps) {
  const { profile } = useAppSelector((state) => state.auth)

  const [activeComment, setActiveComment] = useState<CommentType | null>(null)
  const [editingCommentIndex, setEditingCommentIndex] = useState<number | null>(null)
  const [editingCommentContent, setEditingCommentContent] = useState<string>('')
  const [newCommentContent, setNewCommentContent] = useState<string>('')
  const [isMarkdownEditorOpen, setIsMarkdownEditorOpen] = useState<boolean>(false)

  const newCommentEditorRef = useRef<HTMLDivElement>(null)

  const dispatch = useAppDispatch()

  const { activeCard } = useAppSelector((state) => state.card)
  const { socket } = useAppSelector((state) => state.app)

  const [addCardCommentMutation] = useAddCardCommentMutation()
  const [updateCardCommentMutation] = useUpdateCardCommentMutation()

  const handleEditingCommentClose = () => {
    setEditingCommentIndex(null)
    setEditingCommentContent('')
    setActiveComment(null)
  }

  const toggleEditingCardComment = (commentIndex: number, content: string, comment: CommentType) => {
    // Close other editors
    setIsMarkdownEditorOpen(false)
    setNewCommentContent('')

    setEditingCommentIndex(commentIndex)

    // Prepare content for editing (convert markdown if needed)
    const preparedContent = prepareContentForDisplay(content)
    setEditingCommentContent(preparedContent)
    setActiveComment(comment)
  }

  const handleCancelNewComment = () => {
    setIsMarkdownEditorOpen(false)
    setNewCommentContent('')
  }

  const handleReplyToComment = (comment: CommentType) => {
    // Close edit mode if open
    setEditingCommentIndex(null)
    setEditingCommentContent('')

    // Open the new comment editor
    setIsMarkdownEditorOpen(true)

    // Auto-mention the user being replied to (bold) with a space and zero-width space to ensure cursor is outside bold
    const mentionHtml = `<p><strong>@${comment.user_display_name}</strong> \u200B</p>`
    setNewCommentContent(mentionHtml)

    // Scroll to the new comment editor
    setTimeout(() => {
      newCommentEditorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  const addCardComment = () => {
    if (!newCommentContent.trim() || !hasHtmlContent(newCommentContent)) return

    const payload = { content: newCommentContent.trim() }

    addCardCommentMutation({
      card_id: activeCard?._id as string,
      body: payload
    }).then((res) => {
      if (!res.error) {
        const updatedCard = res.data?.result as CardType

        dispatch(updateActiveCard(updatedCard))
        dispatch(updateCardInBoard(updatedCard))

        setNewCommentContent('')
        setIsMarkdownEditorOpen(false)

        socket?.emit('CLIENT_USER_UPDATED_CARD', updatedCard)
      }
    })
  }

  const updateCardComment = () => {
    if (!activeComment || !editingCommentContent.trim() || !hasHtmlContent(editingCommentContent)) {
      handleEditingCommentClose()
      return
    }

    if (editingCommentContent.trim() === activeComment.content.trim()) {
      handleEditingCommentClose()
      return
    }

    const payload = { content: editingCommentContent.trim() }

    updateCardCommentMutation({
      card_id: activeCard?._id as string,
      comment_id: activeComment.comment_id,
      body: payload
    }).then((res) => {
      if (!res.error) {
        const updatedCard = res.data?.result as CardType

        dispatch(updateActiveCard(updatedCard))
        dispatch(updateCardInBoard(updatedCard))

        handleEditingCommentClose()

        socket?.emit('CLIENT_USER_UPDATED_CARD', updatedCard)
      }
    })
  }

  // Filter out comments with empty or only HTML tags without actual content
  const validCommentsCount = cardComments.filter((comment) =>
    hasHtmlContent(prepareContentForDisplay(comment.content))
  ).length

  return (
    <Box sx={{ mt: 2 }}>
      <Box ref={newCommentEditorRef} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
        <Avatar
          sx={{ width: 36, height: 36, cursor: 'pointer', mt: 1 }}
          alt={profile?.display_name}
          src={profile?.avatar}
        />
        <Box sx={{ flexGrow: 1 }}>
          {isMarkdownEditorOpen ? (
            <>
              <Box sx={{ mb: 1 }}>
                <RichTextEditor
                  content={newCommentContent}
                  onChange={(html) => setNewCommentContent(html)}
                  placeholder='Write a comment...'
                  height={150}
                  editable={true}
                  autoFocus={true}
                  clearFormattingOnFocus={true}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  onClick={addCardComment}
                  className='interceptor-loading'
                  type='button'
                  variant='contained'
                  size='small'
                  color='info'
                  disabled={!newCommentContent.trim() || !hasHtmlContent(newCommentContent)}
                >
                  Save
                </Button>
                <Button onClick={handleCancelNewComment} type='button' size='small' sx={{ color: 'text.primary' }}>
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            <TextField
              fullWidth
              placeholder='Write a comment...'
              type='text'
              variant='outlined'
              onClick={() => {
                // Close edit mode if open
                setEditingCommentIndex(null)
                setEditingCommentContent('')
                setIsMarkdownEditorOpen(true)
              }}
              sx={{ cursor: 'pointer' }}
            />
          )}
        </Box>
      </Box>

      {validCommentsCount === 0 && (
        <Typography
          sx={{
            pl: '45px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#b1b1b1'
          }}
        >
          No activity found!
        </Typography>
      )}

      {cardComments.map((comment, index) => {
        // Skip rendering comments with no actual content
        const preparedContent = prepareContentForDisplay(comment.content)

        if (!hasHtmlContent(preparedContent) && editingCommentIndex !== index) {
          return null
        }

        const isCommentOwner = comment.user_email === profile?.email
        const isEditingThisComment = editingCommentIndex === index
        const hasReactions = comment.reactions && comment.reactions.length > 0

        return (
          <Box sx={{ display: 'flex', gap: 1, width: '100%', mb: 1.5 }} key={index}>
            <Tooltip title={comment.user_display_name}>
              <Avatar
                sx={{ width: 36, height: 36, flexBasis: '36px', cursor: 'pointer' }}
                alt={comment.user_display_name}
                src={comment.user_avatar}
              />
            </Tooltip>

            <Box sx={{ width: '100%', flex: 1 }}>
              <Typography component='span' sx={{ fontWeight: 'bold', mr: 1 }}>
                {comment.user_display_name}
              </Typography>

              <Typography component='span' sx={{ fontSize: '12px' }}>
                {format(new Date(comment.commented_at), 'dd/MM/yyyy HH:mm')}
              </Typography>

              {isEditingThisComment ? (
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ mb: 1 }}>
                    <RichTextEditor
                      content={editingCommentContent}
                      onChange={(html) => setEditingCommentContent(html)}
                      placeholder='Edit comment...'
                      height={150}
                      editable={true}
                      autoFocus={true}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      type='submit'
                      variant='contained'
                      color='info'
                      size='small'
                      onClick={updateCardComment}
                      disabled={!editingCommentContent.trim() || !hasHtmlContent(editingCommentContent)}
                    >
                      Save
                    </Button>
                    <Button
                      type='button'
                      sx={{ color: 'text.primary' }}
                      size='small'
                      onClick={handleEditingCommentClose}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'block',
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#33485D' : 'white'),
                    p: '8px 12px',
                    mt: '4px',
                    border: '0.5px solid rgba(0, 0, 0, 0.2)',
                    borderRadius: '4px',
                    wordBreak: 'break-word',
                    boxShadow: '0 0 1px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <RichTextEditor content={preparedContent} editable={false} />
                </Box>
              )}

              {!isEditingThisComment && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 0.5,
                    mt: 0.5
                  }}
                >
                  {hasReactions && <CardCommentReactions activeCard={activeCard} comment={comment} />}

                  <EmojiPicker
                    activeCard={activeCard}
                    activeComment={activeComment}
                    onSetActiveComment={setActiveComment}
                    comment={comment}
                  />

                  <Typography component='span' sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    •
                  </Typography>

                  {isCommentOwner ? (
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
                        onClick={() => toggleEditingCardComment(index, comment.content, comment)}
                      >
                        Edit
                      </Typography>
                      <Typography component='span' sx={{ fontSize: '12px', color: 'text.secondary' }}>
                        •
                      </Typography>
                      <RemoveComment
                        activeComment={activeComment}
                        onSetActiveComment={setActiveComment}
                        comment={comment}
                      />
                    </>
                  ) : (
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
                      onClick={() => handleReplyToComment(comment)}
                    >
                      Reply
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
