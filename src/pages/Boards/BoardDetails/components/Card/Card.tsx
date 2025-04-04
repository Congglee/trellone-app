import { Card as MuiCard } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import Typography from '@mui/material/Typography'
import { useSortable } from '@dnd-kit/sortable'
import { CSSProperties } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { CardType } from '~/schemas/card.schema'
import { useAppDispatch } from '~/lib/redux/hooks'
import { showActiveCardModal, updateActiveCard } from '~/store/slices/card.slice'

interface CardProps {
  card: CardType
}

export default function Card({ card }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })

  const dndKitCardStyles: CSSProperties = {
    touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined
  }

  const dispatch = useAppDispatch()

  const handleSetActiveCard = () => {
    dispatch(updateActiveCard(card))
    dispatch(showActiveCardModal())
  }

  const shouldShowCardActions = !!card.members?.length || !!card.comments?.length || !!card.attachments?.length

  return (
    <MuiCard
      onClick={handleSetActiveCard}
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        display: card.FE_PlaceholderCard ? 'none' : 'block',
        border: '1px solid transparent',
        '&:hover': { borderColor: (theme) => theme.palette.primary.main },
        overflow: card.FE_PlaceholderCard ? 'hidden' : 'unset',
        opacity: card.FE_PlaceholderCard ? '0' : '1',
        visibility: card.FE_PlaceholderCard ? 'hidden' : 'visible'
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
