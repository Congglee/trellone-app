import CloseIcon from '@mui/icons-material/Close'
import DownloadIcon from '@mui/icons-material/Download'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { CardAttachmentType } from '~/schemas/card.schema'

interface AttachmentPreviewModalProps {
  open: boolean
  onClose: () => void
  attachment: CardAttachmentType | null
}

export default function AttachmentPreviewModal({ open, onClose, attachment }: AttachmentPreviewModalProps) {
  const [imageError, setImageError] = useState(false)

  if (!attachment) {
    return null
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(attachment.file.url)

      if (!response.ok) {
        throw new Error('Failed to download file')
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = attachment.file.display_name || attachment.file.original_name

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      toast.error('Failed to download file')
      console.error('Error downloading file:', error)
    }
  }

  const handleOpenInNewTab = () => {
    window.open(attachment.file.url, '_blank', 'noopener,noreferrer')
  }

  const isImage = attachment.file.mime_type.includes('image')
  const isPdf = attachment.file.mime_type.includes('pdf')
  const canPreview = (isImage && !imageError) || isPdf

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='lg'
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, mr: 2 }}>
          <Typography variant='h6' component='div' sx={{ fontWeight: 'medium' }}>
            {attachment.file.display_name}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            Added {formatDistanceToNow(new Date(attachment.added_at), { addSuffix: true })} •{' '}
            {Math.round(attachment.file.size / 1024)} KB
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size='small'
            onClick={handleOpenInNewTab}
            sx={{
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' }
            }}
          >
            <OpenInNewIcon fontSize='small' />
          </IconButton>
          <IconButton
            size='small'
            onClick={handleDownload}
            sx={{
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' }
            }}
          >
            <DownloadIcon fontSize='small' />
          </IconButton>
          <IconButton
            onClick={onClose}
            size='small'
            sx={{
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' }
            }}
          >
            <CloseIcon fontSize='small' />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {canPreview ? (
          <Box
            sx={{
              width: '100%',
              height: '70vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'grey.50'
            }}
          >
            {isImage && !imageError ? (
              <img
                src={attachment.file.url}
                alt={attachment.file.display_name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
                onError={() => setImageError(true)}
              />
            ) : isPdf ? (
              <iframe
                src={attachment.file.url}
                title={attachment.file.display_name}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
              />
            ) : null}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '300px',
              gap: 3,
              p: 4
            }}
          >
            <Typography variant='body1' color='text.secondary' sx={{ textAlign: 'center' }}>
              There is no preview available for this attachment.
            </Typography>
            <Button
              variant='contained'
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              sx={{
                bgcolor: 'grey.700',
                color: 'white',
                '&:hover': {
                  bgcolor: 'grey.800'
                }
              }}
            >
              Download
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
