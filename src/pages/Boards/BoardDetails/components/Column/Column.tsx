import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import cloneDeep from 'lodash/cloneDeep'
import { CSSProperties } from 'react'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import CardsList from '~/pages/Boards/BoardDetails/components/CardsList'
import AddNewCard from '~/pages/Boards/BoardDetails/components/Column/AddNewCard'
import ColumnMenuActionsPopover from '~/pages/Boards/BoardDetails/components/Column/ColumnMenuActionsPopover'
import { useUpdateColumnMutation } from '~/queries/columns'
import { ColumnType } from '~/schemas/column.schema'
import { updateActiveBoard } from '~/store/slices/board.slice'

interface ColumnProps {
  column: ColumnType
  isBoardMember: boolean
}

export default function Column({ column, isBoardMember }: ColumnProps) {
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

  const dispatch = useAppDispatch()

  const { activeBoard } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)

  const [updateColumnMutation] = useUpdateColumnMutation()

  const updateColumnTitle = async (title: string) => {
    const newActiveBoard = cloneDeep(activeBoard)
    const columnToUpdate = newActiveBoard?.columns?.find((col) => col._id === column._id)

    if (columnToUpdate) {
      columnToUpdate.title = title.trim()
    }

    dispatch(updateActiveBoard(newActiveBoard))

    await updateColumnMutation({
      id: column._id,
      body: { title: title.trim() }
    })

    // Emit socket event to notify other users about the column title update
    socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
  }

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
          maxHeight: (theme) => `calc(${theme.trellone.boardContentHeight} - ${theme.spacing(5)})`,
          cursor: 'grab'
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
          {isBoardMember ? (
            <ToggleFocusInput
              value={column?.title}
              onChangeValue={updateColumnTitle}
              data-no-dnd='true'
              styles={{
                minWidth: 200,
                maxWidth: 200,
                '& .MuiInputBase-input': { pl: 0, fontWeight: 600 }
              }}
            />
          ) : (
            <Typography variant='h6' sx={{ fontSize: '1rem', fontWeight: '600', cursor: 'pointer', width: '100%' }}>
              {column.title}
            </Typography>
          )}

          <ColumnMenuActionsPopover column={column} />
        </Box>

        <CardsList cards={sortedCards} />

        <AddNewCard column={column} />
      </Box>
    </div>
  )
}
