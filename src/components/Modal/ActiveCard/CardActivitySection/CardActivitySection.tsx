import { useColorScheme } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import MDEditor from '@uiw/react-md-editor'
import { format } from 'date-fns'
import { useState } from 'react'
import rehypeSanitize from 'rehype-sanitize'
import CardCommentReactions from '~/components/Modal/ActiveCard/CardActivitySection/CardCommentReactions'
import EmojiPickerPopover from '~/components/Modal/ActiveCard/CardActivitySection/EmojiPickerPopover'
import RemoveCommentPopover from '~/components/Modal/ActiveCard/CardActivitySection/RemoveCommentPopover'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { useAddCardCommentMutation, useUpdateCardCommentMutation } from '~/queries/cards'
import { CommentType } from '~/schemas/card.schema'
import { updateCardInBoard } from '~/store/slices/board.slice'
import { updateActiveCard } from '~/store/slices/card.slice'

interface CardActivitySectionProps {
  cardComments: CommentType[]
}

export default function CardActivitySection({ cardComments }: CardActivitySectionProps) {
  const { profile } = useAppSelector((state) => state.auth)
  const { mode } = useColorScheme()

  const [activeComment, setActiveComment] = useState<CommentType | null>(null)
  const [editingCommentIndex, setEditingCommentIndex] = useState<number | null>(null)
  const [editingCommentContent, setEditingCommentContent] = useState<string>('')
  const [newCommentContent, setNewCommentContent] = useState<string>('')
  const [isMarkdownEditorOpen, setIsMarkdownEditorOpen] = useState<boolean>(false)

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
    setEditingCommentIndex(commentIndex)
    setEditingCommentContent(content)
    setActiveComment(comment)
  }

  const handleCancelNewComment = () => {
    setIsMarkdownEditorOpen(false)
    setNewCommentContent('')
  }

  const addCardComment = async () => {
    if (!newCommentContent.trim()) {
      return
    }

    const payload = { content: newCommentContent.trim() }

    const updatedCardRes = await addCardCommentMutation({ card_id: activeCard?._id as string, body: payload }).unwrap()

    const updatedCard = updatedCardRes.result

    dispatch(updateActiveCard(updatedCard))
    dispatch(updateCardInBoard(updatedCard))

    // Emit socket event to broadcast the card update to other users
    socket?.emit('CLIENT_USER_UPDATED_CARD', updatedCard)

    setNewCommentContent('')
    setIsMarkdownEditorOpen(false)
  }

  const updateCardComment = async () => {
    if (!activeComment || !editingCommentContent.trim()) {
      handleEditingCommentClose()
      return
    }

    if (editingCommentContent.trim() === activeComment.content.trim()) {
      handleEditingCommentClose()
      return
    }

    const payload = { content: editingCommentContent.trim() }

    const updatedCardRes = await updateCardCommentMutation({
      card_id: activeCard?._id as string,
      comment_id: activeComment.comment_id,
      body: payload
    }).unwrap()

    const updatedCard = updatedCardRes.result

    dispatch(updateActiveCard(updatedCard))
    dispatch(updateCardInBoard(updatedCard))

    // Emit socket event to broadcast the card update to other users
    socket?.emit('CLIENT_USER_UPDATED_CARD', updatedCard)

    handleEditingCommentClose()
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
        <Avatar
          sx={{ width: 36, height: 36, cursor: 'pointer', mt: 1 }}
          alt={profile?.display_name}
          src={profile?.avatar}
        />
        <Box sx={{ flexGrow: 1 }}>
          {isMarkdownEditorOpen ? (
            <>
              <Box data-color-mode={mode} sx={{ mb: 1 }}>
                <MDEditor
                  value={newCommentContent}
                  onChange={(value) => setNewCommentContent(value as string)}
                  previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
                  height={120}
                  preview='edit'
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
                  disabled={!newCommentContent.trim()}
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
              onClick={() => setIsMarkdownEditorOpen(true)}
              sx={{ cursor: 'pointer' }}
            />
          )}
        </Box>
      </Box>

      {cardComments?.length === 0 && (
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
                  <Box data-color-mode={mode} sx={{ mb: 1 }}>
                    <MDEditor
                      value={editingCommentContent}
                      onChange={(value) => setEditingCommentContent(value as string)}
                      previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
                      height={120}
                      preview='edit'
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button type='submit' variant='contained' color='info' size='small' onClick={updateCardComment}>
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
                  <Box data-color-mode={mode}>
                    <MDEditor.Markdown
                      source={comment.content}
                      style={{
                        whiteSpace: 'pre-wrap',
                        padding: '0px',
                        border: 'none',
                        borderRadius: '0px',
                        backgroundColor: 'transparent'
                      }}
                    />
                  </Box>
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

                  <EmojiPickerPopover
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
                      <RemoveCommentPopover
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
