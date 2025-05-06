import { useAppSelector } from '~/lib/redux/hooks'
import { CommentType } from '~/schemas/card.schema'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { format } from 'date-fns'

interface CardActivitySectionProps {
  cardComments: CommentType[]
  onAddCardComment: (comment: CommentType) => Promise<void>
}

export default function CardActivitySection({ cardComments, onAddCardComment }: CardActivitySectionProps) {
  const { profile } = useAppSelector((state) => state.auth)

  const addCardComment = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()

      if (!(event.target instanceof HTMLTextAreaElement) || !event.target.value) {
        return
      }

      const payload = {
        user_email: profile?.email,
        user_display_name: profile?.display_name,
        user_avatar: profile?.avatar,
        content: event.target.value.trim()
      } as CommentType

      onAddCardComment(payload).then(() => {
        ;(event.target as HTMLTextAreaElement).value = ''
      })
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Avatar sx={{ width: 36, height: 36, cursor: 'pointer' }} alt='trungquandev' src={profile?.avatar} />
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
      {cardComments.map((comment, index) => (
        <Box sx={{ display: 'flex', gap: 1, width: '100%', mb: 1.5 }} key={index}>
          <Tooltip title='trungquandev'>
            <Avatar sx={{ width: 36, height: 36, cursor: 'pointer' }} alt='trungquandev' src={comment.user_avatar} />
          </Tooltip>
          <Box sx={{ width: 'inherit' }}>
            <Typography component='span' sx={{ fontWeight: 'bold', mr: 1 }}>
              {comment.user_display_name}
            </Typography>
            <Typography component='span' sx={{ fontSize: '12px' }}>
              {format(new Date(comment.commented_at), 'dd/MM/yyyy HH:mm')}
            </Typography>
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
          </Box>
        </Box>
      ))}
    </Box>
  )
}
