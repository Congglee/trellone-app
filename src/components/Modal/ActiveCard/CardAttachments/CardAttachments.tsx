import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Popover from '@mui/material/Popover'
import { RefObject, useState } from 'react'
import { toast } from 'react-toastify'
import EditCardFileAttachmentForm from '~/components/Modal/ActiveCard/CardAttachments/EditCardFileAttachmentForm'
import EditCardLinkAttachmentForm from '~/components/Modal/ActiveCard/CardAttachments/EditCardLinkAttachmentForm'
import FileAttachments from '~/components/Modal/ActiveCard/CardAttachments/FileAttachments'
import LinkAttachments from '~/components/Modal/ActiveCard/CardAttachments/LinkAttachments'
import RemoveCardAttachmentConfirm from '~/components/Modal/ActiveCard/CardAttachments/RemoveCardAttachmentConfirm'
import { AttachmentType } from '~/constants/type'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { useRemoveCardAttachmentMutation } from '~/queries/cards'
import { CardAttachmentType } from '~/schemas/card.schema'
import { updateCardInBoard } from '~/store/slices/board.slice'
import { updateActiveCard } from '~/store/slices/card.slice'

interface CardAttachmentsProps {
  cardAttachments: CardAttachmentType[]
  attachmentPopoverButtonRef?: RefObject<HTMLButtonElement | null>
}

export default function CardAttachments({ cardAttachments, attachmentPopoverButtonRef }: CardAttachmentsProps) {
  const [anchorMenuActionsPopoverElement, setAnchorMenuActionsPopoverElement] = useState<HTMLElement | null>(null)
  const [showMenuActions, setShowMenuActions] = useState(false)
  const [showRemoveCardAttachmentConfirm, setShowRemoveCardAttachmentConfirm] = useState(false)
  const [showEditCardAttachmentForm, setShowEditCardAttachmentForm] = useState(false)

  const isMenuActionsPopoverOpen = Boolean(anchorMenuActionsPopoverElement)

  const popoverId = isMenuActionsPopoverOpen ? 'menu-actions-popover' : undefined

  const linkAttachments = cardAttachments.filter((attachment) => attachment.type === AttachmentType.Link)

  const fileAttachments = cardAttachments.filter((attachment) => attachment.type === AttachmentType.File)

  const toggleMenuActionsPopover = (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>,
    attachment: CardAttachmentType
  ) => {
    if (!anchorMenuActionsPopoverElement) {
      setAnchorMenuActionsPopoverElement(event.currentTarget)
      setShowMenuActions(true)
      setActiveAttachment(attachment)
    } else {
      setAnchorMenuActionsPopoverElement(null)
      setShowMenuActions(false)
      setActiveAttachment(null)
    }
  }

  const handleMenuActionsPopoverClose = () => {
    setAnchorMenuActionsPopoverElement(null)
    setShowMenuActions(false)
    setShowRemoveCardAttachmentConfirm(false)
    setShowEditCardAttachmentForm(false)
    setActiveAttachment(null)
  }

  const handleAddAttachmentClick = () => {
    if (attachmentPopoverButtonRef?.current) {
      attachmentPopoverButtonRef.current.click()
    }
  }

  const handleDownloadFileAttachment = async (attachment: CardAttachmentType) => {
    try {
      const response = await fetch(attachment.file.url)

      if (!response.ok) {
        throw new Error('Failed to download file')
      }

      // Get the file blob
      const blob = await response.blob()

      // Create a temporary URL for the blob
      const downloadUrl = window.URL.createObjectURL(blob)

      // Create a temporary anchor element to trigger download
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = attachment.file.display_name || attachment.file.original_name

      // Append to body, click, and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the object URL
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      toast.error('Failed to download file')
      console.error('Error downloading file:', error)
    }
  }

  const [activeAttachment, setActiveAttachment] = useState<CardAttachmentType | null>(null)

  const hasFilesAttachments = cardAttachments.some((attachment) => attachment.type === AttachmentType.File)

  const hasLinksAttachments = cardAttachments.some((attachment) => attachment.type === AttachmentType.Link)

  const onBackToMenuActionsFromRemove = () => {
    setShowRemoveCardAttachmentConfirm(false)
    setShowMenuActions(true)
  }

  const onBackToMenuActionsFromEdit = () => {
    setShowEditCardAttachmentForm(false)
    setShowMenuActions(true)
  }

  const dispatch = useAppDispatch()

  const { activeCard } = useAppSelector((state) => state.card)
  const { socket } = useAppSelector((state) => state.app)

  const [removeCardAttachmentMutation] = useRemoveCardAttachmentMutation()

  const onRemoveCardAttachment = async () => {
    if (!activeAttachment) {
      return
    }

    const updatedCardRes = await removeCardAttachmentMutation({
      card_id: activeCard?._id as string,
      attachment_id: activeAttachment.attachment_id
    }).unwrap()

    const updatedCard = updatedCardRes.result

    dispatch(updateActiveCard(updatedCard))
    dispatch(updateCardInBoard(updatedCard))

    // Emit socket event to broadcast the card update to other users
    socket?.emit('CLIENT_USER_UPDATED_CARD', updatedCard)

    handleMenuActionsPopoverClose()
  }

  return (
    <Box sx={{ mt: { xs: 2, sm: -4 } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          sx={{ alignSelf: { xs: 'flex-start', sm: 'flex-end' } }}
          type='button'
          variant='outlined'
          color='info'
          size='small'
          startIcon={<AddIcon />}
          onClick={handleAddAttachmentClick}
        >
          Add an attachment
        </Button>
      </Box>

      {hasLinksAttachments && (
        <LinkAttachments linkAttachments={linkAttachments} onToggleMenuActionsPopover={toggleMenuActionsPopover} />
      )}

      {hasFilesAttachments && (
        <FileAttachments fileAttachments={fileAttachments} onToggleMenuActionsPopover={toggleMenuActionsPopover} />
      )}

      <Popover
        id={popoverId}
        open={isMenuActionsPopoverOpen}
        anchorEl={anchorMenuActionsPopoverElement}
        onClose={handleMenuActionsPopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              display: !isMenuActionsPopoverOpen ? 'none' : 'block'
            }
          }
        }}
      >
        {showMenuActions && (
          <List disablePadding sx={{ width: '100%', minWidth: 250, maxWidth: 320, py: 1.5 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setShowMenuActions(false)
                  setShowEditCardAttachmentForm(true)
                }}
                sx={{ py: 0.5 }}
              >
                <ListItemText
                  primary='Edit'
                  sx={{
                    '& .MuiTypography-body1': { fontSize: '1em' }
                  }}
                />
              </ListItemButton>
            </ListItem>
            <Tooltip title='This feature is under development for future release' arrow>
              <ListItem disablePadding>
                <ListItemButton sx={{ py: 0.5 }}>
                  <ListItemText
                    primary='Comment'
                    sx={{
                      '& .MuiTypography-body1': { fontSize: '1em' }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Tooltip>
            {activeAttachment?.type === AttachmentType.File && (
              <ListItem disablePadding>
                <ListItemButton
                  sx={{ py: 0.5 }}
                  onClick={() => handleDownloadFileAttachment(activeAttachment as CardAttachmentType)}
                >
                  <ListItemText
                    primary='Download'
                    sx={{
                      '& .MuiTypography-body1': { fontSize: '1em' }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setShowMenuActions(false)
                  setShowRemoveCardAttachmentConfirm(true)
                }}
                sx={{ py: 0.5 }}
              >
                <ListItemText
                  primary='Delete'
                  sx={{
                    '& .MuiTypography-body1': { fontSize: '1em' }
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        )}

        {showRemoveCardAttachmentConfirm && (
          <RemoveCardAttachmentConfirm
            onBackToMenuActions={onBackToMenuActionsFromRemove}
            onRemoveCardAttachment={onRemoveCardAttachment}
            onClose={handleMenuActionsPopoverClose}
          />
        )}

        {showEditCardAttachmentForm &&
          (activeAttachment?.type === AttachmentType.File ? (
            <EditCardFileAttachmentForm
              attachment={activeAttachment!}
              onBackToMenuActions={onBackToMenuActionsFromEdit}
              onClose={handleMenuActionsPopoverClose}
            />
          ) : (
            <EditCardLinkAttachmentForm
              attachment={activeAttachment!}
              onBackToMenuActions={onBackToMenuActionsFromEdit}
              onClose={handleMenuActionsPopoverClose}
            />
          ))}
      </Popover>
    </Box>
  )
}
