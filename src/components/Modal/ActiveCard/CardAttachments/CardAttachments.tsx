import AddIcon from '@mui/icons-material/Add'
import ImageIcon from '@mui/icons-material/Image'
import LinkIcon from '@mui/icons-material/Link'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Link as MuiLink } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { formatDistanceToNow } from 'date-fns'
import { Fragment, RefObject, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import EditCardFileAttachmentForm from '~/components/Modal/ActiveCard/EditCardFileAttachmentForm'
import EditCardLinkAttachmentForm from '~/components/Modal/ActiveCard/EditCardLinkAttachmentForm'
import RemoveCardAttachmentConfirm from '~/components/Modal/ActiveCard/RemoveCardAttachmentConfirm/RemoveCardAttachmentConfirm'
import { AttachmentType, CardAttachmentAction } from '~/constants/type'
import { CardAttachmentPayloadType, CardAttachmentType } from '~/schemas/card.schema'

interface CardAttachmentsProps {
  cardAttachments: CardAttachmentType[]
  onUpdateCardAttachment: (attachment: CardAttachmentPayloadType) => Promise<void>
  attachmentPopoverButtonRef?: RefObject<HTMLButtonElement | null>
}

export default function CardAttachments({
  cardAttachments,
  attachmentPopoverButtonRef,
  onUpdateCardAttachment
}: CardAttachmentsProps) {
  const [anchorPopoverElement, setAnchorPopoverElement] = useState<HTMLElement | null>(null)
  const [showMenuActions, setShowMenuActions] = useState(false)
  const [showRemoveCardAttachmentConfirm, setShowRemoveCardAttachmentConfirm] = useState(false)
  const [showEditCardAttachmentForm, setShowEditCardAttachmentForm] = useState(false)

  const isOpenPopover = Boolean(anchorPopoverElement)

  const popoverId = isOpenPopover ? 'card-attachments-popover' : undefined

  const togglePopover = (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>,
    attachment: CardAttachmentType
  ) => {
    if (!anchorPopoverElement) {
      setAnchorPopoverElement(event.currentTarget)
      setShowMenuActions(true)
      setActiveAttachment(attachment)
    } else {
      setAnchorPopoverElement(null)
      setShowMenuActions(false)
      setActiveAttachment(null)
    }
  }

  const handleClose = () => {
    setAnchorPopoverElement(null)
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

  const hasFilesAttachments = useMemo(
    () => cardAttachments.some((attachment) => attachment.type === AttachmentType.File),
    [cardAttachments]
  )

  const hasLinksAttachments = useMemo(
    () => cardAttachments.some((attachment) => attachment.type === AttachmentType.Link),
    [cardAttachments]
  )

  const onBackToMenuActionsFromRemove = () => {
    setShowRemoveCardAttachmentConfirm(false)
    setShowMenuActions(true)
  }

  const onBackToMenuActionsFromEdit = () => {
    setShowEditCardAttachmentForm(false)
    setShowMenuActions(true)
  }

  const onRemoveCardAttachment = () => {
    if (activeAttachment) {
      const payload = {
        action: CardAttachmentAction.Remove,
        type: activeAttachment.type,
        attachment_id: activeAttachment.attachment_id
      }

      onUpdateCardAttachment(payload).finally(() => {
        handleClose()
      })
    }
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
        <Box sx={{ mt: 1.5 }}>
          <Typography variant='caption'>Links</Typography>
          <List sx={{ width: '100%', bgcolor: 'transparent' }}>
            {cardAttachments
              .filter((attachment) => attachment.type === AttachmentType.Link)
              .map((attachment, index, arr) => (
                <Fragment key={index}>
                  <ListItem
                    disableGutters
                    sx={{
                      p: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      },
                      bgcolor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <MuiLink
                      href={attachment.link.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        overflow: 'hidden',
                        textDecoration: 'none',
                        color: 'inherit',
                        flexGrow: 1,
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 'auto' }}>
                        <LinkIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant='body2'
                            sx={{
                              fontWeight: 'medium',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              color: 'primary.main'
                            }}
                          >
                            {attachment.link.display_name || attachment.link.url}
                          </Typography>
                        }
                        sx={{ m: 0 }}
                      />
                    </MuiLink>
                    <IconButton size='small' onClick={(event) => togglePopover(event, attachment)}>
                      <MoreHorizIcon fontSize='small' />
                    </IconButton>
                  </ListItem>
                  {index < arr.length - 1 && <Divider />}
                </Fragment>
              ))}
          </List>
        </Box>
      )}

      {hasFilesAttachments && (
        <Box sx={{ mt: 1.5 }}>
          <Typography variant='caption'>Files</Typography>
          <List sx={{ width: '100%', bgcolor: 'transparent' }}>
            {cardAttachments
              .filter((attachment) => attachment.type === AttachmentType.File)
              .map((attachment, index) => (
                <ListItem
                  key={index}
                  disableGutters
                  sx={{
                    borderRadius: 1,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 1
                  }}
                  secondaryAction={
                    <Box
                      sx={{
                        alignSelf: { xs: 'flex-end', sm: 'center' },
                        mt: { xs: 1, sm: 0 }
                      }}
                    >
                      <IconButton size='small' sx={{ mr: 0.5 }}>
                        <OpenInNewIcon fontSize='small' />
                      </IconButton>
                      <IconButton size='small' onClick={(event) => togglePopover(event, attachment)}>
                        <MoreHorizIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    {attachment.file.mime_type.includes('image') ? (
                      <Avatar
                        variant='rounded'
                        src={attachment.file.url}
                        alt={attachment.file.display_name}
                        sx={{ width: { xs: 60, sm: 80 }, height: { xs: 45, sm: 60 } }}
                      >
                        <ImageIcon />
                      </Avatar>
                    ) : (
                      <Avatar
                        variant='rounded'
                        sx={{
                          bgcolor: 'grey.700',
                          width: { xs: 60, sm: 80 },
                          height: { xs: 45, sm: 60 },
                          color: 'text.primary'
                        }}
                      >
                        <Typography variant='button' sx={{ fontWeight: 'bold' }}>
                          {attachment.file.original_name.split('.').pop()}
                        </Typography>
                      </Avatar>
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant='body2'
                        sx={{
                          fontWeight: 'medium',
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          WebkitLineClamp: 2,
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {attachment.file.display_name}
                      </Typography>
                    }
                    secondary={
                      <Box
                        component='span'
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          flexWrap: 'wrap'
                        }}
                      >
                        <Typography component='span' variant='caption' color='text.secondary'>
                          Added {formatDistanceToNow(new Date(attachment.added_at), { addSuffix: true })}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
          </List>
        </Box>
      )}

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              display: !isOpenPopover ? 'none' : 'block'
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
            onClose={handleClose}
          />
        )}

        {showEditCardAttachmentForm &&
          (activeAttachment?.type === AttachmentType.File ? (
            <EditCardFileAttachmentForm
              attachment={activeAttachment!}
              onUpdateCardAttachment={onUpdateCardAttachment}
              onBackToMenuActions={onBackToMenuActionsFromEdit}
              onClose={handleClose}
            />
          ) : (
            <EditCardLinkAttachmentForm
              attachment={activeAttachment!}
              onUpdateCardAttachment={onUpdateCardAttachment}
              onBackToMenuActions={onBackToMenuActionsFromEdit}
              onClose={handleClose}
            />
          ))}
      </Popover>
    </Box>
  )
}
