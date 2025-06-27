import { useAppSelector } from '~/lib/redux/hooks'
import { CommentPayloadType, CommentType } from '~/schemas/card.schema'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { format } from 'date-fns'
import IconButton from '@mui/material/IconButton'
import AddReactionIcon from '@mui/icons-material/AddReaction'
import { CommentAction } from '~/constants/type'
import { useState } from 'react'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import CloseIcon from '@mui/icons-material/Close'

interface CardActivitySectionProps {
  cardComments: CommentType[]
  onUpdateCardComment: (comment: CommentPayloadType) => Promise<void>
}

export default function CardActivitySection({ cardComments, onUpdateCardComment }: CardActivitySectionProps) {
  const { profile } = useAppSelector((state) => state.auth)

  const [activeComment, setActiveComment] = useState<CommentType | null>(null)
  const [editingCommentIndex, setEditingCommentIndex] = useState<number | null>(null)
  const [editingCommentContent, setEditingCommentContent] = useState<string>('')

  const [anchorRemoveCommentPopoverElement, setAnchorRemoveCommentPopoverElement] = useState<HTMLElement | null>(null)

  const isRemoveCommentPopoverOpen = Boolean(anchorRemoveCommentPopoverElement)

  const popoverId = isRemoveCommentPopoverOpen ? 'remove-comment-popover' : undefined

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

  const toggleRemoveCommentPopover = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, comment: CommentType) => {
    if (!anchorRemoveCommentPopoverElement) {
      setAnchorRemoveCommentPopoverElement(event.currentTarget)
      setActiveComment(comment)
    } else {
      setAnchorRemoveCommentPopoverElement(null)
      setActiveComment(null)
    }
  }

  const handleRemoveCommentPopoverClose = () => {
    setAnchorRemoveCommentPopoverElement(null)
    setActiveComment(null)
  }

  const addCardComment = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()

      if (!(event.target instanceof HTMLTextAreaElement) || !event.target.value) {
        return
      }

      const payload = {
        action: CommentAction.Add,
        user_email: profile?.email as string,
        user_display_name: profile?.display_name as string,
        user_avatar: profile?.avatar as string,
        content: event.target.value.trim()
      }

      onUpdateCardComment(payload).then(() => {
        ;(event.target as HTMLTextAreaElement).value = ''
      })
    }
  }

  const updateCardComment = () => {
    if (!activeComment || !editingCommentContent.trim()) {
      handleEditingCommentClose()
      return
    }

    if (editingCommentContent.trim() === activeComment.content.trim()) {
      handleEditingCommentClose()
      return
    }

    const payload = {
      action: CommentAction.Edit,
      comment_id: activeComment.comment_id,
      user_email: profile?.email as string,
      user_display_name: profile?.display_name as string,
      user_avatar: profile?.avatar as string,
      content: editingCommentContent.trim()
    }

    onUpdateCardComment(payload).finally(() => {
      handleEditingCommentClose()
    })
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
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Avatar sx={{ width: 36, height: 36, cursor: 'pointer' }} alt={profile?.display_name} src={profile?.avatar} />
        <TextField
          fullWidth
          placeholder='Write a comment...'
          type='text'
          variant='outlined'
          multiline
          onKeyDown={addCardComment}
        />
      </Box>

      {cardComments.length === 0 && (
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

        return (
          <Box sx={{ display: 'flex', gap: 1, width: '100%', mb: 1.5 }} key={index}>
            <Tooltip title={comment.user_display_name}>
              <Avatar
                sx={{ width: 36, height: 36, cursor: 'pointer' }}
                alt={comment.user_display_name}
                src={comment.user_avatar}
              />
            </Tooltip>

            <Box sx={{ width: 'inherit' }}>
              <Typography component='span' sx={{ fontWeight: 'bold', mr: 1 }}>
                {comment.user_display_name}
              </Typography>
              <Typography component='span' sx={{ fontSize: '12px' }}>
                {format(new Date(comment.commented_at), 'dd/MM/yyyy HH:mm')}
              </Typography>
              {isEditingThisComment ? (
                <Box>
                  <TextField
                    fullWidth
                    placeholder='Write a comment...'
                    type='text'
                    variant='outlined'
                    multiline
                    value={editingCommentContent}
                    onChange={(e) => setEditingCommentContent(e.target.value)}
                    autoFocus
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                    <Button type='submit' variant='contained' color='info' onClick={updateCardComment}>
                      Save
                    </Button>
                    <Button type='button' sx={{ color: 'text.primary' }} onClick={handleEditingCommentClose}>
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
                  {comment.content}
                </Box>
              )}

              {!isEditingThisComment && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <IconButton size='small'>
                    <AddReactionIcon fontSize='small' />
                  </IconButton>
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

      <Popover
        id={popoverId}
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
            Remove
          </Button>
        </Box>
      </Popover>
    </Box>
  )
}
