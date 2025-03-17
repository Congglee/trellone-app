import Box from '@mui/material/Box'
import Column from '~/pages/Boards/BoardDetails/components/Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { Column as ColumnType } from '~/types/column.type'
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { useClickAway } from '@uidotdev/usehooks'

interface ColumnsListProps {
  columns: ColumnType[]
}

export default function ColumnsList({ columns }: ColumnsListProps) {
  const [newColumnFormOpen, setNewColumnFormOpen] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const newColumnClickAwayRef = useClickAway(() => {
    setNewColumnFormOpen(false)
    setNewColumnTitle('')
  })

  const toggleNewColumnForm = () => {
    setNewColumnFormOpen(!newColumnFormOpen)
  }

  const addNewColumn = () => {
    if (!newColumnTitle) {
      return
    }

    toggleNewColumnForm()
    setNewColumnTitle('')
  }

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
                onClick={() => {
                  toggleNewColumnForm()
                  setNewColumnTitle('')
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  )
}
