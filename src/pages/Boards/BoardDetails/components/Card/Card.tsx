import { Card as MuiCard } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import { Card as CardType } from '~/types/card.type'
import GroupIcon from '@mui/icons-material/Group'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import Typography from '@mui/material/Typography'

interface CardProps {
  card: CardType
}

export default function Card({ card }: CardProps) {
  const shouldShowCardActions = !!card.members?.length || !!card.comments?.length || !!card.attachments?.length

  return (
    <MuiCard
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow: 'unset'
      }}
    >
      {card.cover_photo && <CardMedia sx={{ height: 140 }} image={card.cover_photo} title='green iguana' />}
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>{card.title}</Typography>
      </CardContent>
      {shouldShowCardActions && (
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!card.members?.length && (
            <Button size='small' startIcon={<GroupIcon />}>
              {card?.members.length}
            </Button>
          )}
          {!!card.comments?.length && (
            <Button size='small' startIcon={<CommentIcon />}>
              {card?.comments.length}
            </Button>
          )}
          {!!card.attachments?.length && (
            <Button size='small' startIcon={<AttachmentIcon />}>
              {card?.attachments.length}
            </Button>
          )}
        </CardActions>
      )}
    </MuiCard>
  )
}
