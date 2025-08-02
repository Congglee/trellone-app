import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Link as MuiLink } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { Fragment, useRef, useState } from 'react'
import Favicon from '~/components/Favicon'
import LinkAttachmentPreview from '~/components/Modal/ActiveCard/CardAttachments/LinkAttachmentPreview'
import { useAppSelector } from '~/lib/redux/hooks'
import { CardAttachmentType } from '~/schemas/card.schema'

interface LinkAttachmentsProps {
  linkAttachments: CardAttachmentType[]
  onToggleMenuActionsPopover: (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>,
    attachment: CardAttachmentType
  ) => void
}

export default function LinkAttachments({ linkAttachments, onToggleMenuActionsPopover }: LinkAttachmentsProps) {
  const [linkPreviewAnchor, setLinkPreviewAnchor] = useState<HTMLElement | null>(null)
  const [linkPreviewAttachment, setLinkPreviewAttachment] = useState<CardAttachmentType | null>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { activeBoard } = useAppSelector((state) => state.board)

  const handleLinkPreviewOpen = (event: React.MouseEvent<HTMLElement>, attachment: CardAttachmentType) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    setLinkPreviewAnchor(event.currentTarget)
    setLinkPreviewAttachment(attachment)
  }

  const handleLinkPreviewClose = () => {
    // Add a small delay before closing to allow mouse to enter the preview
    hoverTimeoutRef.current = setTimeout(() => {
      setLinkPreviewAnchor(null)
      setLinkPreviewAttachment(null)
    }, 100)
  }

  const handlePreviewMouseEnter = () => {
    // Cancel the close timeout when mouse enters the preview
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
  }

  const handlePreviewMouseLeave = () => {
    // Close immediately when mouse leaves the preview
    setLinkPreviewAnchor(null)
    setLinkPreviewAttachment(null)
  }

  const getUserDisplayName = (userId: string) => {
    const user = activeBoard?.members?.find((user) => user._id === userId)
    return user?.display_name || 'Unknown User'
  }

  return (
    <>
      <Box sx={{ mt: 1.5 }}>
        <Typography variant='caption'>Links</Typography>
        <List sx={{ width: '100%', bgcolor: 'transparent' }}>
          {linkAttachments.map((attachment, index, arr) => (
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
                  onMouseEnter={(event) => handleLinkPreviewOpen(event, attachment)}
                  onMouseLeave={handleLinkPreviewClose}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    overflow: 'hidden',
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 'auto' }}>
                    <Favicon url={attachment.link.url} size={20} />
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
                <IconButton size='small' onClick={(event) => onToggleMenuActionsPopover(event, attachment)}>
                  <MoreHorizIcon fontSize='small' />
                </IconButton>
              </ListItem>
              {index < arr.length - 1 && <Divider />}
            </Fragment>
          ))}
        </List>
      </Box>

      <LinkAttachmentPreview
        open={Boolean(linkPreviewAnchor)}
        anchorEl={linkPreviewAnchor}
        attachment={linkPreviewAttachment}
        createdByUsername={linkPreviewAttachment ? getUserDisplayName(linkPreviewAttachment.uploaded_by) : undefined}
        onMouseEnter={handlePreviewMouseEnter}
        onMouseLeave={handlePreviewMouseLeave}
      />
    </>
  )
}
