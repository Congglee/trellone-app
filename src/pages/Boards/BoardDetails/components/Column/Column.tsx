import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { CSSProperties } from 'react'
import CardsList from '~/pages/Boards/BoardDetails/components/CardsList'
import AddNewCard from '~/pages/Boards/BoardDetails/components/Column/AddNewCard'
import ColumnMenuActionsPopover from '~/pages/Boards/BoardDetails/components/Column/ColumnMenuActionsPopover'
import { ColumnType } from '~/schemas/column.schema'

interface ColumnProps {
  column: ColumnType
}

export default function Column({ column }: ColumnProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id, // Unique ID to identify the draggable element
    data: { ...column } // Custom data will be passed into the `handleDragEnd` event
  })

  const dndKitColumnsStyles: CSSProperties = {
    touchAction: 'none', // For the default sensor type `PointerSensor`

    // If using `CSS.Transform` as in the docs, it will cause a stretch error
    // https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform),
    transition,

    // The height must always be max 100% because otherwise, when dragging a short column over a long column, you have to drag in the middle area, which is very inconvenient.
    // Note that at this point, you must combine with {...listeners} on the Box, not on the outermost div, to avoid dragging into the green area.
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const sortedCards = column.cards!

  return (
    // Must wrap with a `div` here because the column height issue during drag-and-drop can cause a flickering bug
    <div ref={setNodeRef} style={dndKitColumnsStyles} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          ml: 2,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trellone.boardContentHeight} - ${theme.spacing(5)})`
        }}
      >
        <Box
          sx={{
            height: (theme) => theme.trellone.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant='h6' sx={{ fontSize: '1rem', fontWeight: '600', cursor: 'pointer', width: '100%' }}>
            {column.title}
          </Typography>

          <ColumnMenuActionsPopover column={column} />
        </Box>

        <CardsList cards={sortedCards} />

        <AddNewCard column={column} />
      </Box>
    </div>
  )
}
