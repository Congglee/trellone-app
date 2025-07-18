import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import AddCardIcon from '@mui/icons-material/AddCard'
import CloseIcon from '@mui/icons-material/Close'
import Cloud from '@mui/icons-material/Cloud'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentPaste from '@mui/icons-material/ContentPaste'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useClickAway } from '@uidotdev/usehooks'
import cloneDeep from 'lodash/cloneDeep'
import { useConfirm } from 'material-ui-confirm'
import { CSSProperties, useState } from 'react'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import CardsList from '~/pages/Boards/BoardDetails/components/CardsList'
import { useAddCardMutation } from '~/queries/cards'
import { useDeleteColumnMutation } from '~/queries/columns'
import { ColumnType } from '~/schemas/column.schema'
import { updateActiveBoard } from '~/store/slices/board.slice'

interface ColumnProps {
  column: ColumnType
}

export default function Column({ column }: ColumnProps) {
  const [anchorColumnDropdownMenuElement, setAnchorColumnDropdownMenuElement] = useState<
    HTMLElement | SVGSVGElement | null
  >(null)
  const isColumnDropdownMenuOpen = Boolean(anchorColumnDropdownMenuElement)

  const handleColumnDropdownMenuClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    setAnchorColumnDropdownMenuElement(event.currentTarget)
  }

  const handleColumnDropdownMenuClose = () => {
    setAnchorColumnDropdownMenuElement(null)
  }

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

  const [newCardFormOpen, setNewCardFormOpen] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')

  const { activeBoard } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)
  const dispatch = useAppDispatch()

  const sortedCards = column.cards!

  const newCardClickAwayRef = useClickAway(() => {
    setNewCardFormOpen(false)
    setNewCardTitle('')
  })

  const toggleNewCardForm = () => {
    setNewCardFormOpen(!newCardFormOpen)
  }

  const reset = () => {
    toggleNewCardForm()
    setNewCardTitle('')
  }

  const [addCardMutation] = useAddCardMutation()
  const [deleteColumnMutation] = useDeleteColumnMutation()

  const addNewCard = async () => {
    if (!newCardTitle || newCardTitle.trim() === '') {
      return
    }

    const addNewCardRes = await addCardMutation({
      title: newCardTitle,
      column_id: column._id,
      board_id: column.board_id
    }).unwrap()

    const newCard = cloneDeep(addNewCardRes.result)

    const newActiveBoard = cloneDeep(activeBoard)
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

    reset()

    // Emit socket event to notify other users about the new card creation
    socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
  }

  const confirmDeleteColumn = useConfirm()

  const deleteColumn = async () => {
    try {
      // Close the menu to prevent aria-hidden conflicts
      handleColumnDropdownMenuClose()

      const { confirmed } = await confirmDeleteColumn({
        title: 'Delete Column?',
        description: 'This action will permanently delete your Column and its Cards! Are you sure?',
        confirmationText: 'Confirm',
        cancellationText: 'Cancel'
      })

      if (confirmed) {
        const newActiveBoard = { ...activeBoard! }

        newActiveBoard.columns = newActiveBoard.columns?.filter((col) => col._id !== column._id)
        newActiveBoard.column_order_ids = newActiveBoard.column_order_ids?.filter((_id) => _id !== column._id)

        dispatch(updateActiveBoard(newActiveBoard))

        await deleteColumnMutation(column._id)

        // Emit socket event to notify other users about the column deletion
        socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
      }
    } catch (error: any) {
      // User canceled the operation or there was an error
      console.log('Column deletion canceled or failed', error)
    }
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
          <Typography variant='h6' sx={{ fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
            {column.title}
          </Typography>

          <Box>
            <Tooltip title='More options'>
              <ExpandMoreIcon
                sx={{ color: 'text.primary', cursor: 'pointer', verticalAlign: 'middle' }}
                id='basic-column-dropdown'
                aria-controls={isColumnDropdownMenuOpen ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup='true'
                aria-expanded={isColumnDropdownMenuOpen ? 'true' : undefined}
                onClick={handleColumnDropdownMenuClick}
              />
            </Tooltip>

            <Menu
              id='basic-menu-column-dropdown'
              anchorEl={anchorColumnDropdownMenuElement}
              open={isColumnDropdownMenuOpen}
              onClick={handleColumnDropdownMenuClose}
              onClose={handleColumnDropdownMenuClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <MenuItem>
                <ListItemIcon>
                  <AddCardIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize='small' />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize='small' />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize='small' />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>

              <Divider />

              <MenuItem onClick={deleteColumn}>
                <ListItemIcon>
                  <DeleteForeverIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize='small' />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <CardsList cards={sortedCards} />

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
              <Button startIcon={<AddCardIcon />} onClick={toggleNewCardForm}>
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
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
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
                  onClick={toggleNewCardForm}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  )
}
