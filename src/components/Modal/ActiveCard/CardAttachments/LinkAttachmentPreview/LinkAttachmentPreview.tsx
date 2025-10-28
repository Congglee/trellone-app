import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import PersonIcon from '@mui/icons-material/Person'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import MuiLink from '@mui/material/Link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
import Favicon from '~/components/Favicon'
import { CardAttachmentType } from '~/schemas/card.schema'
import { getDomainFromUrl } from '~/utils/url'

interface LinkAttachmentPreviewProps {
  open: boolean
  anchorEl: HTMLElement | null
  attachment: CardAttachmentType | null
  createdByUsername?: string
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export default function LinkAttachmentPreview({
  open,
  anchorEl,
  attachment,
  createdByUsername,
  onMouseEnter,
  onMouseLeave
}: LinkAttachmentPreviewProps) {
  const handleCopyLink = async () => {
    if (!attachment) return

    try {
      await navigator.clipboard.writeText(attachment.link.url)
      toast.success('Link copied to clipboard!', { position: 'top-center' })
    } catch (error) {
      toast.error('Failed to copy link', { position: 'top-center' })
      console.error('Error copying link:', error)
    }
  }

  if (!attachment) return null

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement='bottom-start'
      modifiers={[
        {
          name: 'offset',
          options: { offset: [10, 8] }
        }
      ]}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      sx={{ zIndex: 1300 }}
    >
      <Paper
        elevation={8}
        sx={{
          width: 280,
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2a2d3a' : '#ffffff'),
          border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#404040' : '#e0e0e0'}`
        }}
      >
        <Box sx={{ p: 2 }}>
          <MuiLink
            href={attachment.link.url}
            target='_blank'
            rel='noopener noreferrer'
            sx={{
              display: 'block',
              color: (theme) => (theme.palette.mode === 'dark' ? '#4fc3f7' : '#1976d2'),
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: 1.4,
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            {attachment.link.display_name || attachment.link.url}
          </MuiLink>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            <PersonIcon
              sx={{
                fontSize: 16,
                color: (theme) => (theme.palette.mode === 'dark' ? '#b0b0b0' : '#666666')
              }}
            />
            <Typography
              variant='caption'
              sx={{
                color: (theme) => (theme.palette.mode === 'dark' ? '#b0b0b0' : '#666666'),
                fontSize: '12px'
              }}
            >
              Created by {createdByUsername || 'Unknown User'}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleCopyLink}
              sx={{
                py: 1,
                px: 2,
                '&:hover': {
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#3a3d4a' : '#f5f5f5')
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 24 }}>
                <ContentCopyIcon
                  sx={{
                    fontSize: 16,
                    color: (theme) => (theme.palette.mode === 'dark' ? '#b0b0b0' : '#666666')
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary='Copy link'
                primaryTypographyProps={{
                  fontSize: '13px',
                  color: (theme) => (theme.palette.mode === 'dark' ? '#ffffff' : '#000000')
                }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 1,
                px: 2,
                width: '100%'
              }}
            >
              <Favicon url={attachment.link.url} size={16} />
              <Typography
                variant='caption'
                sx={{
                  color: (theme) => (theme.palette.mode === 'dark' ? '#b0b0b0' : '#666666'),
                  fontSize: '13px',
                  my: 0.5
                }}
              >
                {getDomainFromUrl(attachment.link.url)}
              </Typography>
            </Box>
          </ListItem>
        </List>
      </Paper>
    </Popper>
  )
}
