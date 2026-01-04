import AddCardIcon from '@mui/icons-material/AddCard'
import Cloud from '@mui/icons-material/Cloud'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentPaste from '@mui/icons-material/ContentPaste'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Popover from '@mui/material/Popover'
import Tooltip from '@mui/material/Tooltip'
import { useConfirm } from 'material-ui-confirm'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { useDeleteColumnMutation } from '~/queries/columns'
import { ColumnType } from '~/schemas/column.schema'
import { updateActiveBoard } from '~/store/slices/board.slice'

interface ColumnMenuActionsProps {
  column: ColumnType
}

export default function ColumnMenuActions({ column }: ColumnMenuActionsProps) {
  const [anchorMenuActionsPopoverElement, setAnchorMenuActionsPopoverElement] = useState<
    HTMLElement | SVGSVGElement | null
  >(null)
  const [showMenuActions, setShowMenuActions] = useState(false)

  const isMenuActionsPopoverOpen = Boolean(anchorMenuActionsPopoverElement)

  const columnMenuActionsPopoverId = isMenuActionsPopoverOpen ? 'column-menu-actions-popover' : undefined

  const { activeBoard } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)
  const dispatch = useAppDispatch()

  const [deleteColumnMutation] = useDeleteColumnMutation()

  const handleMenuActionsPopoverToggle = (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement | SVGSVGElement, MouseEvent>
  ) => {
    if (!anchorMenuActionsPopoverElement) {
      setAnchorMenuActionsPopoverElement(event.currentTarget)
      setShowMenuActions(true)
    } else {
      setAnchorMenuActionsPopoverElement(null)
      setShowMenuActions(false)
    }
  }

  const handleMenuActionsPopoverClose = () => {
    setAnchorMenuActionsPopoverElement(null)
    setShowMenuActions(false)
  }

  const confirmDeleteColumn = useConfirm()

  const deleteColumn = async () => {
    try {
      // Close the menu to prevent aria-hidden conflicts
      handleMenuActionsPopoverClose()

      const { confirmed } = await confirmDeleteColumn({
        title: 'Delete Column?',
        description: 'This action will permanently delete your Column and its Cards! Are you sure?',
        confirmationText: 'Confirm',
        cancellationText: 'Cancel'
      })

      if (confirmed) {
        deleteColumnMutation(column._id).then((res) => {
          if (!res.error) {
            const newActiveBoard = { ...activeBoard! }

            newActiveBoard.columns = newActiveBoard.columns?.filter((col) => col._id !== column._id)
            newActiveBoard.column_order_ids = newActiveBoard.column_order_ids?.filter((_id) => _id !== column._id)

            dispatch(updateActiveBoard(newActiveBoard))

            socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
          }
        })
      }
    } catch (error: any) {
      // User canceled the operation or there was an error
      console.log('Column deletion canceled or failed', error)
    }
  }

  return (
    <Box>
      <Tooltip title='More options'>
        <IconButton onClick={handleMenuActionsPopoverToggle} disableRipple size='small' sx={{ p: 0 }}>
          <ExpandMoreIcon sx={{ color: 'text.primary', cursor: 'pointer', verticalAlign: 'middle' }} />
        </IconButton>
      </Tooltip>

      <Popover
        id={columnMenuActionsPopoverId}
        open={isMenuActionsPopoverOpen}
        anchorEl={anchorMenuActionsPopoverElement}
        onClose={handleMenuActionsPopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: { display: !isMenuActionsPopoverOpen ? 'none' : 'block' }
          }
        }}
        data-no-dnd='true'
      >
        {showMenuActions && (
          <List disablePadding sx={{ width: '100%', minWidth: 250, maxWidth: 300, py: 1 }}>
            <ListItem disablePadding>
              <ListItemButton sx={{ py: 0.5 }} disabled>
                <ListItemIcon>
                  <AddCardIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton sx={{ py: 0.5 }} disabled>
                <ListItemIcon>
                  <ContentCut fontSize='small' />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton sx={{ py: 0.5 }} disabled>
                <ListItemIcon>
                  <ContentCopy fontSize='small' />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton sx={{ py: 0.5 }} disabled>
                <ListItemIcon>
                  <ContentPaste fontSize='small' />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 0.5 }} />

            <ListItem disablePadding>
              <ListItemButton sx={{ py: 0.5 }} onClick={deleteColumn}>
                <ListItemIcon>
                  <DeleteForeverIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton sx={{ py: 0.5 }} disabled>
                <ListItemIcon>
                  <Cloud fontSize='small' />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        )}
      </Popover>
    </Box>
  )
}
