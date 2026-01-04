import ArchiveIcon from '@mui/icons-material/Archive'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import cloneDeep from 'lodash/cloneDeep'
import {
  type ChangeEvent,
  type MouseEvent as ReactMouseEvent,
  type SyntheticEvent,
  useCallback,
  useMemo,
  useState
} from 'react'
import DrawerHeader from '~/components/DrawerHeader'
import { useDebounce } from '~/hooks/use-debounce'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { useDeleteCardMutation, useReopenCardMutation } from '~/queries/cards'
import { CardType } from '~/schemas/card.schema'
import { updateActiveBoard, updateCardInBoard } from '~/store/slices/board.slice'
import { clearAndHideActiveCardModal, showActiveCardModal, updateActiveCard } from '~/store/slices/card.slice'

export default function ArchivedCards() {
  const theme = useTheme()
  const [archivedCardsDrawerOpen, setArchivedCardsDrawerOpen] = useState(false)
  const [anchorRemoveCardPopoverElement, setAnchorRemoveCardPopoverElement] = useState<HTMLElement | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const isRemoveCardPopoverOpen = Boolean(anchorRemoveCardPopoverElement)

  const removeCardPopoverId = 'remove-card-popover'

  const handleRemoveCardPopoverToggle = (event: ReactMouseEvent<HTMLElement>) => {
    event.stopPropagation()

    if (isRemoveCardPopoverOpen) {
      setAnchorRemoveCardPopoverElement(null)
    } else {
      setAnchorRemoveCardPopoverElement(event.currentTarget)
    }
  }

  const handleRemoveCardPopoverClose = (event?: SyntheticEvent | Event) => {
    if (event) {
      const maybeEvent = event as { stopPropagation?: () => void }

      if (typeof maybeEvent.stopPropagation === 'function') {
        maybeEvent.stopPropagation()
      }
    }

    setAnchorRemoveCardPopoverElement(null)
  }

  const { activeBoard } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)

  const dispatch = useAppDispatch()

  const [reopenCardMutation] = useReopenCardMutation()
  const [deleteCardMutation] = useDeleteCardMutation()

  const handleArchivedCardsSearchChange = useCallback((value: string) => {
    setDebouncedSearchTerm(value.trim().toLowerCase())
  }, [])

  const debounceArchivedCardsSearch = useDebounce(handleArchivedCardsSearchChange, 1000)

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    setSearchTerm(value)
    debounceArchivedCardsSearch(value)
  }

  const handleSetActiveCard = (card: CardType) => {
    if (card.FE_PlaceholderCard) return
    dispatch(updateActiveCard(card))
    dispatch(showActiveCardModal())
  }

  const archivedCards = useMemo(() => {
    const isArchivedCard = (card: CardType) => card._destroy && !card.FE_PlaceholderCard

    return activeBoard?.columns?.flatMap((column) => column.cards?.filter(isArchivedCard) ?? []) ?? []
  }, [activeBoard?.columns])

  const filteredArchivedCards = useMemo(() => {
    if (!debouncedSearchTerm) {
      return archivedCards
    }

    return archivedCards.filter((card) => card.title.toLowerCase().includes(debouncedSearchTerm))
  }, [archivedCards, debouncedSearchTerm])

  const reopenCard = (cardId: string) => {
    reopenCardMutation({ card_id: cardId }).then((res) => {
      if (!res.error) {
        const updatedCard = res.data?.result as CardType

        dispatch(updateActiveCard(updatedCard))
        dispatch(updateCardInBoard(updatedCard))

        socket?.emit('CLIENT_USER_UPDATED_CARD', updatedCard)
      }
    })
  }

  const deleteCard = (cardId: string, columnId: string) => {
    deleteCardMutation(cardId).then((res) => {
      if (!res.error) {
        const newActiveBoard = cloneDeep(activeBoard)
        const columnToUpdate = newActiveBoard?.columns?.find((column) => column._id === columnId)

        if (columnToUpdate) {
          columnToUpdate.cards = columnToUpdate.cards?.filter((item) => item._id !== cardId)
          columnToUpdate.card_order_ids = columnToUpdate.card_order_ids?.filter((id) => id !== cardId)
        }

        dispatch(updateActiveBoard(newActiveBoard))
        dispatch(clearAndHideActiveCardModal())

        handleRemoveCardPopoverClose()

        socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
      }
    })
  }

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setArchivedCardsDrawerOpen(true)}>
          <ListItemIcon>
            <ArchiveIcon />
          </ListItemIcon>
          <ListItemText secondary='Archived items' />
        </ListItemButton>
      </ListItem>

      <Drawer
        sx={{
          width: theme.trellone.boardDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            top: `calc(${theme.trellone.navBarHeight} + 1px)`
          }
        }}
        variant='persistent'
        anchor='right'
        open={archivedCardsDrawerOpen}
      >
        <DrawerHeader sx={{ justifyContent: 'space-between', minHeight: `${theme.trellone.navBarHeight}px!important` }}>
          <IconButton color='inherit' onClick={() => setArchivedCardsDrawerOpen(false)} aria-label='Go back'>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>

          <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
            Archived items
          </Typography>

          <Box sx={{ width: 40, height: 40 }} />
        </DrawerHeader>

        <Divider />

        <Box sx={{ p: 2 }}>
          <Stack gap={1.5}>
            <Stack gap={1}>
              <TextField
                fullWidth
                size='small'
                placeholder='Search archive...'
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon fontSize='small' />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.875rem'
                  }
                }}
              />
              <Button
                variant='outlined'
                size='small'
                fullWidth
                sx={{
                  textTransform: 'none',
                  color: 'text.primary',
                  justifyContent: 'center',
                  borderColor: 'divider',
                  py: 0.75,
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                    color: 'primary.main'
                  }
                }}
                disabled
              >
                Switch to columns
              </Button>
            </Stack>

            {archivedCards.length === 0 ? (
              <Box
                sx={{
                  py: 4,
                  textAlign: 'center'
                }}
              >
                <Typography variant='body2' color='text.secondary'>
                  No archived cards
                </Typography>
              </Box>
            ) : filteredArchivedCards.length === 0 ? (
              <Box
                sx={{
                  py: 4,
                  textAlign: 'center'
                }}
              >
                <Typography variant='body2' color='text.secondary'>
                  No cards match your search
                </Typography>
              </Box>
            ) : (
              <Stack gap={1}>
                {filteredArchivedCards.map((card) => (
                  <Box
                    key={card._id}
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      '&:hover': {
                        bgcolor: (theme) =>
                          theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => handleSetActiveCard(card)}
                  >
                    <Typography variant='body2' sx={{ fontWeight: 500, mb: 1 }}>
                      {card.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <ArchiveIcon sx={{ fontSize: '0.875rem', color: 'text.secondary' }} />
                      <Typography variant='caption' color='text.secondary'>
                        Archived
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography
                        variant='caption'
                        color='text.secondary'
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            color: 'info.main',
                            textDecoration: 'underline'
                          }
                        }}
                        onClick={(event) => {
                          event.stopPropagation()
                          reopenCard(card._id)
                        }}
                      >
                        Restore
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        •
                      </Typography>
                      <>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              color: 'info.main',
                              textDecoration: 'underline'
                            }
                          }}
                          onClick={(event) => handleRemoveCardPopoverToggle(event)}
                        >
                          Delete
                        </Typography>

                        <Popover
                          id={removeCardPopoverId}
                          open={isRemoveCardPopoverOpen}
                          anchorEl={anchorRemoveCardPopoverElement}
                          onClose={(event: SyntheticEvent | Event) => handleRemoveCardPopoverClose(event)}
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                          slotProps={{
                            paper: { sx: { width: 350, borderRadius: 2 } }
                          }}
                        >
                          <Box sx={{ p: 1.5 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2,
                                position: 'relative'
                              }}
                            >
                              <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
                                Delete card?
                              </Typography>
                              <IconButton
                                size='small'
                                onClick={(event) => {
                                  event.stopPropagation()
                                  handleRemoveCardPopoverClose()
                                }}
                                sx={{ position: 'absolute', right: 0 }}
                              >
                                <CloseIcon fontSize='small' />
                              </IconButton>
                            </Box>

                            <Typography variant='body2' sx={{ mb: 3, color: 'text.secondary' }}>
                              All actions will be removed from the activity feed and you won’t be able to re-open the
                              card. There is no undo.
                            </Typography>

                            <Button
                              variant='contained'
                              color='error'
                              fullWidth
                              onClick={(event) => {
                                event.stopPropagation()
                                deleteCard(card._id, card.column_id)
                              }}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Popover>
                      </>
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>
        </Box>
      </Drawer>
    </>
  )
}
