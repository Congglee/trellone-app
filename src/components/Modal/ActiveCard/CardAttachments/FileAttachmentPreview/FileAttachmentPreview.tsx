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

interface FileAttachmentPreviewProps {
  fileAttachmentPreviewOpen: boolean
  onFileAttachmentPreviewClose: () => void
  attachment: CardAttachmentType | null
}

export default function FileAttachmentPreview({
  fileAttachmentPreviewOpen,
  onFileAttachmentPreviewClose,
  attachment
}: FileAttachmentPreviewProps) {
  const [imageError, setImageError] = useState(false)

  if (!attachment) return null

  const handleDownload = async () => {
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

      // Set the href and download attributes
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

  const handleOpenInNewTab = () => {
    window.open(attachment.file.url, '_blank', 'noopener,noreferrer')
  }

  const isImage = attachment.file.mime_type.includes('image')
  const isPdf = attachment.file.mime_type.includes('pdf')
  const canPreview = (isImage && !imageError) || isPdf

  return (
    <Dialog
      open={fileAttachmentPreviewOpen}
      onClose={onFileAttachmentPreviewClose}
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
            onClick={onFileAttachmentPreviewClose}
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

      <DialogContent sx={{ p: 0 }}>
        {canPreview ? (
          isImage && !imageError ? (
            <Box
              sx={{
                width: '100%',
                maxHeight: '75vh',
                overflowY: 'auto',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100')
              }}
            >
              <img
                src={attachment.file.url}
                alt={attachment.file.display_name}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
                onError={() => setImageError(true)}
              />
            </Box>
          ) : isPdf ? (
            <Box
              sx={{
                width: '100%',
                height: '75vh',
                overflow: 'hidden'
              }}
            >
              <iframe
                src={attachment.file.url}
                title={attachment.file.display_name}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
              />
            </Box>
          ) : null
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
