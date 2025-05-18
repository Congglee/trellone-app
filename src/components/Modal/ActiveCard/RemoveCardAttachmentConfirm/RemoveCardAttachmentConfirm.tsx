import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'

interface RemoveCardAttachmentConfirmProps {
  onBackToMenuActions: () => void
  onRemoveCardAttachment: () => void
  onClose: () => void
}

export default function RemoveCardAttachmentConfirm({
  onBackToMenuActions,
  onRemoveCardAttachment,
  onClose
}: RemoveCardAttachmentConfirmProps) {
  return (
    <Box sx={{ p: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <IconButton size='small' onClick={onBackToMenuActions}>
          <ArrowBackIcon fontSize='small' />
        </IconButton>
        <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
          Remove attachment?
        </Typography>
        <IconButton size='small' onClick={onClose}>
          <CloseIcon fontSize='small' />
        </IconButton>
      </Box>

      <Typography variant='body2' sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
        Remove this attachment? There is no undo.
      </Typography>

      <Button variant='contained' color='error' fullWidth onClick={onRemoveCardAttachment}>
        Remove
      </Button>
    </Box>
  )
}
