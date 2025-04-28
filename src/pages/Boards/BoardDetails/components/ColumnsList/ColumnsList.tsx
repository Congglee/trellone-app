import Box from '@mui/material/Box'
import Column from '~/pages/Boards/BoardDetails/components/Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { useMemo, useState } from 'react'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { useClickAway } from '@uidotdev/usehooks'
import { ColumnType } from '~/schemas/column.schema'
import { useAddColumnMutation } from '~/queries/columns'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { generatePlaceholderCard } from '~/utils/utils'
import cloneDeep from 'lodash/cloneDeep'
import { updateActiveBoard } from '~/store/slices/board.slice'
import socket from '~/lib/socket'

interface ColumnsListProps {
  columns: ColumnType[]
}

export default function ColumnsList({ columns }: ColumnsListProps) {
  const [newColumnFormOpen, setNewColumnFormOpen] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const activeColumns = useMemo(() => columns.filter((column) => !column._destroy), [columns])

  const { activeBoard } = useAppSelector((state) => state.board)
  const dispatch = useAppDispatch()

  const newColumnClickAwayRef = useClickAway(() => {
    setNewColumnFormOpen(false)
    setNewColumnTitle('')
  })

  const toggleNewColumnForm = () => {
    setNewColumnFormOpen(!newColumnFormOpen)
  }

  const reset = () => {
    toggleNewColumnForm()
    setNewColumnTitle('')
  }

  const [addColumnMutation] = useAddColumnMutation()

  const addNewColumn = async () => {
    if (!newColumnTitle || newColumnTitle.trim() === '') {
      return
    }

    const addNewColumnRes = await addColumnMutation({
      title: newColumnTitle,
      board_id: activeBoard?._id as string
    }).unwrap()

    const newColumn = cloneDeep(addNewColumnRes.result)

    const placeholderCard = generatePlaceholderCard(newColumn)
    newColumn.cards = [placeholderCard]
    newColumn.card_order_ids = [placeholderCard._id]

    const newActiveBoard = cloneDeep(activeBoard)

    newActiveBoard?.columns?.push(newColumn)
    newActiveBoard?.column_order_ids.push(newColumn._id)

    dispatch(updateActiveBoard(newActiveBoard))

    reset()

    // Emit socket event to notify other users about the new column creation
    socket.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
  }

  return (
    <SortableContext items={activeColumns.map((column) => column._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{ bgcolor: 'inherit', width: '100%', height: '100%', display: 'flex' }}>
        {activeColumns.map((column) => (
          <Column key={column._id} column={column} />
        ))}

        {!newColumnFormOpen ? (
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
              onClick={toggleNewColumnForm}
            >
              Add new column
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              minWidth: '200px',
              maxWidth: '200px',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#100901' : '#ededed'),
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
            ref={newColumnClickAwayRef}
          >
            <TextField
              label='Enter column title...'
              type='text'
              size='small'
              variant='outlined'
              autoFocus
              autoComplete='off'
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#22272b' : '#fff')
              }}
              inputProps={{
                style: { letterSpacing: '0.00714em', lineHeight: 1.5, fontWeight: 500, fontSize: '0.875rem' }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={addNewColumn}
                variant='contained'
                size='small'
                sx={{ boxShadow: 'none', border: '0.5px solid' }}
              >
                Add Column
              </Button>
              <CloseIcon
                fontSize='small'
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: (theme) => theme.palette.warning.light }
                }}
                onClick={reset}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  )
}
