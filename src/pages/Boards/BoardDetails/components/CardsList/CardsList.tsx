import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import Box from '@mui/material/Box'
import Card from '~/pages/Boards/BoardDetails/components/Card/Card'
import { CardType } from '~/schemas/card.schema'

interface CardsListProps {
  cards: CardType[]
}

export default function CardsList({ cards }: CardsListProps) {
  const activeCards = cards.filter((card) => !card._destroy)

  return (
    <SortableContext items={activeCards.map((card) => card._id)} strategy={verticalListSortingStrategy}>
      <Box
        sx={{
          p: '0 5px 5px 5px',
          m: '0 5px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          overflowX: 'hidden',
          overflowY: 'auto',

          maxHeight: (theme) => ({
            xs: `calc(${theme.trellone.boardContentHeight} - ${theme.trellone.boardBarHeight} - ${theme.spacing(5)} - ${theme.trellone.columnHeaderHeight} - ${theme.trellone.columnFooterHeight})`,
            md: `calc(${theme.trellone.boardContentHeight} - ${theme.spacing(5)} - ${theme.trellone.columnHeaderHeight} - ${theme.trellone.columnFooterHeight})`
          }),

          '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced0da' },
          '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#bfc2cf' }
        }}
      >
        {activeCards.map((card) => (
          <Card key={card._id} card={card} />
        ))}
      </Box>
    </SortableContext>
  )
}
