import Box from '@mui/material/Box'
import ColumnsList from '~/pages/Boards/BoardDetails/components/ColumnsList'
import { Board } from '~/types/board.type'
import { mapOrder } from '~/utils/sorts'

interface BoardContentProps {
  board: Board
}

export default function BoardContent({ board }: BoardContentProps) {
  const sortedColumns = mapOrder(board.columns, board.column_order_ids, '_id')

  return (
    <Box
      sx={{
        width: '100%',
        p: 1.25,
        height: (theme) => ({
          xs: `calc(100vh - ${theme.trellone.navBarHeight} - 2 * ${theme.trellone.boardBarHeight})`,
          md: theme.trellone.boardContentHeight
        })
      }}
    >
      <ColumnsList columns={sortedColumns} />
    </Box>
  )
}
