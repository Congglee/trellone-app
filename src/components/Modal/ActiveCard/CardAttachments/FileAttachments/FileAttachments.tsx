import ImageIcon from '@mui/icons-material/Image'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'
import FileAttachmentPreview from '~/components/Modal/ActiveCard/CardAttachments/FileAttachmentPreview'
import { CardAttachmentType } from '~/schemas/card.schema'

interface FileAttachmentsProps {
  fileAttachments: CardAttachmentType[]
  onToggleMenuActionsPopover: (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>,
    attachment: CardAttachmentType
  ) => void
}

export default function FileAttachments({ fileAttachments, onToggleMenuActionsPopover }: FileAttachmentsProps) {
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false)
  const [filePreviewAttachment, setFilePreviewAttachment] = useState<CardAttachmentType | null>(null)

  const handlePreviewAttachment = (attachment: CardAttachmentType) => {
    setFilePreviewAttachment(attachment)
    setShowFilePreviewModal(true)
  }

  const handlePreviewModalClose = () => {
    setShowFilePreviewModal(false)
    setFilePreviewAttachment(null)
  }

  const handleOpenInNewTab = (attachment: CardAttachmentType) => {
    window.open(attachment.file.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <Box sx={{ mt: 1.5 }}>
        <Typography variant='caption'>Files</Typography>
        <List sx={{ width: '100%', bgcolor: 'transparent' }}>
          {fileAttachments.map((attachment, index) => (
            <ListItem
              key={index}
              disableGutters
              component='div'
              sx={{
                borderRadius: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => handlePreviewAttachment(attachment)}
              secondaryAction={
                <Box
                  sx={{
                    alignSelf: { xs: 'flex-end', sm: 'center' },
                    mt: { xs: 1, sm: 0 }
                  }}
                >
                  <IconButton
                    size='small'
                    sx={{ mr: 0.5 }}
                    onClick={(event) => {
                      event.stopPropagation()
                      handleOpenInNewTab(attachment)
                    }}
                  >
                    <OpenInNewIcon fontSize='small' />
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={(event) => {
                      event.stopPropagation()
                      onToggleMenuActionsPopover(event, attachment)
                    }}
                  >
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

      <FileAttachmentPreview
        open={showFilePreviewModal}
        onClose={handlePreviewModalClose}
        attachment={filePreviewAttachment}
      />
    </>
  )
}
