import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AttachmentIcon from '@mui/icons-material/Attachment'
import CommentIcon from '@mui/icons-material/Comment'
import GroupIcon from '@mui/icons-material/Group'
import { Card as MuiCard } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { format } from 'date-fns'
import { CSSProperties } from 'react'
import { useAppDispatch } from '~/lib/redux/hooks'
import { CardType } from '~/schemas/card.schema'
import { showActiveCardModal, updateActiveCard } from '~/store/slices/card.slice'

interface CardProps {
  card: CardType
}

export default function Card({ card }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id, // Unique ID to identify the draggable element
    data: { ...card } // Custom data will be passed into the `handleDragEnd` event
  })

  const dndKitCardStyles: CSSProperties = {
    touchAction: 'none', // For the default sensor type `PointerSensor`

    // If using `CSS.Transform` as in the docs, it will cause a stretch error
    // https://github.com/clauderic/dnd-kit/issues/117
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

  const now = new Date()
  const isOverdue = card.due_date ? new Date(card.due_date) < now : false

  const formatDueDate = (date: Date) => {
    const currentYear = now.getFullYear()
    const dateYear = new Date(date).getFullYear()

    if (currentYear === dateYear) {
      return format(new Date(date), 'd MMM')
    }

    return format(new Date(date), 'd MMM, y')
  }

  const getDueDateColor = () => {
    if (card.is_completed) return 'success'
    if (card.due_date && new Date(card.due_date) < new Date()) return 'error'
    return 'default'
  }

  return (
    <MuiCard
      onClick={handleSetActiveCard}
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
      sx={{
        cursor: 'grab',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        display: card.FE_PlaceholderCard ? 'none' : 'block',
        border: '1px solid transparent',
        '&:hover': { borderColor: (theme) => theme.palette.primary.main },
        overflow: card.FE_PlaceholderCard ? 'hidden' : 'unset',
        opacity: card.FE_PlaceholderCard ? '0' : '1',
        visibility: card.FE_PlaceholderCard ? 'hidden' : 'visible'
      }}
    >
      {card.cover_photo && <CardMedia sx={{ height: 140 }} image={card.cover_photo} title={card.title} />}

      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>{card.title}</Typography>

        {card.due_date && (
          <Box sx={{ mt: 1 }}>
            <Chip
              icon={<AccessTimeIcon fontSize='small' />}
              label={formatDueDate(card.due_date)}
              size='small'
              color={getDueDateColor()}
              sx={{
                height: '24px',
                backgroundColor: (theme) =>
                  card.is_completed ? theme.palette.success.main : isOverdue ? theme.palette.error.main : '#1F2A40',
                color: '#fff',
                '& .MuiChip-icon': { color: '#fff' },
                fontSize: '0.75rem'
              }}
            />
          </Box>
        )}
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
