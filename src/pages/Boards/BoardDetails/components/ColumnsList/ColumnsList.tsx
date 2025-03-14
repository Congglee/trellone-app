import Box from '@mui/material/Box'
import Column from '~/pages/Boards/BoardDetails/components/Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { Column as ColumnType } from '~/types/column.type'
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'

interface ColumnsListProps {
  columns: ColumnType[]
}

export default function ColumnsList({ columns }: ColumnsListProps) {
  return (
    <SortableContext items={columns.map((column) => column._id)} strategy={horizontalListSortingStrategy}>
      <Box
        sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': { m: 2 }
        }}
      >
        {columns.map((column) => (
          <Column key={column._id} column={column} />
        ))}

        <Box
          sx={{
            minWidth: '200px',
            maxWidth: '200px',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d'
          }}
        >
          <Button
            startIcon={<NoteAddIcon />}
            variant='contained'
            sx={{
              width: '100%',
              justifyContent: 'flex-start',
              pl: 2.5,
              py: 1,
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgb(255 255 255 / 10%)' : 'rgb(0 0 0 / 10%)')
            }}
          >
            Add new column
          </Button>
        </Box>
      </Box>
    </SortableContext>
  )
}
