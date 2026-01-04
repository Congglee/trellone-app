import AddCardIcon from '@mui/icons-material/AddCard'
import CloseIcon from '@mui/icons-material/Close'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { useClickAway } from '@uidotdev/usehooks'
import cloneDeep from 'lodash/cloneDeep'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { useAddCardMutation } from '~/queries/cards'
import { ColumnType } from '~/schemas/column.schema'
import { updateActiveBoard } from '~/store/slices/board.slice'

interface AddNewCardProps {
  column: ColumnType
  canCreateCard: boolean
}

export default function AddNewCard({ column, canCreateCard }: AddNewCardProps) {
  const [newCardFormOpen, setNewCardFormOpen] = useState(false)
  const [cardTitle, setCardTitle] = useState('')

  const handleNewCardFormToggle = () => {
    if (!canCreateCard) return
    setNewCardFormOpen(!newCardFormOpen)
  }

  const newCardClickAwayRef = useClickAway(() => {
    setNewCardFormOpen(false)
    setCardTitle('')
  })

  const { activeBoard } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)
  const dispatch = useAppDispatch()

  const [addCardMutation] = useAddCardMutation()

  const handleNewCardFormReset = () => {
    handleNewCardFormToggle()
    setCardTitle('')
  }

  const addNewCard = async () => {
    if (!cardTitle || cardTitle.trim() === '') {
      return
    }

    addCardMutation({
      title: cardTitle,
      column_id: column._id,
      board_id: column.board_id
    }).then((res) => {
      if (!res.error) {
        const addedCard = res.data?.result

        const newCard = cloneDeep(addedCard)!
        const newActiveBoard = cloneDeep(activeBoard)!

        const columnToUpdate = newActiveBoard?.columns?.find((column) => column._id === newCard.column_id)

        if (columnToUpdate) {
          // If the column is empty: it essentially contains a Placeholder card
          if (columnToUpdate.cards?.some((card) => card.FE_PlaceholderCard)) {
            columnToUpdate.cards = [newCard]
            columnToUpdate.card_order_ids = [newCard._id]
          } else {
            // Otherwise, if the column already has data, push it to the end of the array
            columnToUpdate.cards?.push(newCard)
            columnToUpdate.card_order_ids?.push(newCard._id)
          }
        }

        dispatch(updateActiveBoard(newActiveBoard))

        handleNewCardFormReset()

        socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
      }
    })
  }

  return (
    <Box
      sx={{
        height: (theme) => theme.trellone.columnFooterHeight,
        p: 2
      }}
    >
      {!newCardFormOpen ? (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Button startIcon={<AddCardIcon />} onClick={handleNewCardFormToggle}>
            Add new card
          </Button>
          <Tooltip title='Drag to move'>
            <DragHandleIcon sx={{ cursor: 'pointer' }} />
          </Tooltip>
        </Box>
      ) : (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
          ref={newCardClickAwayRef}
        >
          <TextField
            label='Enter card title...'
            type='text'
            size='small'
            variant='outlined'
            autoFocus
            data-no-dnd='true'
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            sx={{
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#22272b' : '#fff'),
              '& label': { color: 'text.primary' },
              '& label.Mui-focused': {
                color: (theme) => theme.palette.primary.main
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: (theme) => theme.palette.primary.main
                },
                '&:hover fieldset': {
                  borderColor: (theme) => theme.palette.primary.main
                },
                '&.Mui-focused fieldset': {
                  borderColor: (theme) => theme.palette.primary.main
                }
              },
              '& .MuiOutlinedInput-input': {
                borderRadius: 1
              }
            }}
            inputProps={{
              style: { fontWeight: '400', fontSize: '0.875rem', lineHeight: '1.43', letterSpacing: '0.01071em' }
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              onClick={addNewCard}
              variant='contained'
              size='small'
              sx={{
                boxShadow: 'none',
                border: '0.5px solid'
              }}
            >
              Add
            </Button>
            <CloseIcon
              fontSize='small'
              sx={{
                color: (theme) => theme.palette.warning.light,
                cursor: 'pointer'
              }}
              onClick={handleNewCardFormToggle}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}
