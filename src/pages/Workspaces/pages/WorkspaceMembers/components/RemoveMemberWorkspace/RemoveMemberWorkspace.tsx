import Button from '@mui/material/Button'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Popover from '@mui/material/Popover'

interface RemoveMemberWorkspaceProps {
  isDisabled: boolean
  buttonText: string
  onRemoveMemberFromWorkspace: (userId: string) => Promise<void>
  userId: string
}

export default function RemoveMemberWorkspace({
  isDisabled,
  buttonText,
  onRemoveMemberFromWorkspace,
  userId
}: RemoveMemberWorkspaceProps) {
  const [anchorRemoveMemberWorkspacePopoverElement, setAnchorRemoveMemberWorkspacePopoverElement] =
    useState<HTMLElement | null>(null)

  const isRemoveMemberWorkspacePopoverOpen = Boolean(anchorRemoveMemberWorkspacePopoverElement)

  const removeMemberWorkspacePopoverId = 'remove-member-workspace-popover'

  const toggleRemoveMemberWorkspacePopover = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (isRemoveMemberWorkspacePopoverOpen) {
      setAnchorRemoveMemberWorkspacePopoverElement(null)
    } else {
      setAnchorRemoveMemberWorkspacePopoverElement(event.currentTarget)
    }
  }

  const handleRemoveMemberWorkspacePopoverClose = () => {
    setAnchorRemoveMemberWorkspacePopoverElement(null)
  }

  const removeMemberFromWorkspace = async () => {
    await onRemoveMemberFromWorkspace(userId)
    handleRemoveMemberWorkspacePopoverClose()
  }

  return (
    <>
      <Button
        size='small'
        variant='outlined'
        disabled={isDisabled}
        sx={{ borderRadius: 1, textTransform: 'none', minWidth: 120 }}
        onClick={toggleRemoveMemberWorkspacePopover}
      >
        {buttonText}
      </Button>

      <Popover
        id={removeMemberWorkspacePopoverId}
        open={isRemoveMemberWorkspacePopoverOpen}
        anchorEl={anchorRemoveMemberWorkspacePopoverElement}
        onClose={toggleRemoveMemberWorkspacePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: { sx: { borderRadius: 2 } }
        }}
      >
        <Box sx={{ p: 1.5, maxWidth: '350px', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, position: 'relative' }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
              Remove member
            </Typography>
            <IconButton
              size='small'
              onClick={toggleRemoveMemberWorkspacePopover}
              sx={{ position: 'absolute', right: 0 }}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>

          <Button
            variant='text'
            sx={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1 }}
            onClick={removeMemberFromWorkspace}
          >
            <Typography
              variant='body2'
              sx={{
                color: 'text.secondary',
                width: '100%',
                textDecoration: 'underline'
              }}
            >
              Remove from Workspace
            </Typography>
            <Typography
              variant='body2'
              sx={{
                color: 'text.secondary',
                width: '100%',
                textDecoration: 'underline'
              }}
            >
              Remove all access to the Workspace. The member will remain on all their boards in this Workspace. They
              will receive a notification.
            </Typography>
          </Button>
        </Box>
      </Popover>
    </>
  )
}
