import ClearIcon from '@mui/icons-material/Clear'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useRemoveGuestFromWorkspaceMutation } from '~/queries/workspaces'

interface RemoveGuestWorkspaceProps {
  userId: string
  workspaceId: string
}

export default function RemoveGuestWorkspace({ userId, workspaceId }: RemoveGuestWorkspaceProps) {
  const [anchorRemoveGuestWorkspacePopoverElement, setAnchorRemoveGuestWorkspacePopoverElement] =
    useState<HTMLElement | null>(null)

  const isRemoveGuestWorkspacePopoverOpen = Boolean(anchorRemoveGuestWorkspacePopoverElement)

  const removeGuestWorkspacePopoverId = 'remove-guest-workspace-popover'

  const toggleRemoveGuestWorkspacePopover = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (isRemoveGuestWorkspacePopoverOpen) {
      setAnchorRemoveGuestWorkspacePopoverElement(null)
    } else {
      setAnchorRemoveGuestWorkspacePopoverElement(event.currentTarget)
    }
  }

  const handleRemoveGuestWorkspacePopoverClose = () => {
    setAnchorRemoveGuestWorkspacePopoverElement(null)
  }

  const [removeGuestFromWorkspaceMutation] = useRemoveGuestFromWorkspaceMutation()

  const removeGuestWorkspace = async () => {
    await removeGuestFromWorkspaceMutation({ workspace_id: workspaceId, user_id: userId })
    handleRemoveGuestWorkspacePopoverClose()
  }

  return (
    <>
      <Button
        size='small'
        variant='outlined'
        sx={{ borderRadius: 1, textTransform: 'none', minWidth: 120 }}
        startIcon={<ClearIcon />}
        onClick={toggleRemoveGuestWorkspacePopover}
      >
        Remove...
      </Button>

      <Popover
        id={removeGuestWorkspacePopoverId}
        open={isRemoveGuestWorkspacePopoverOpen}
        anchorEl={anchorRemoveGuestWorkspacePopoverElement}
        onClose={handleRemoveGuestWorkspacePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: { sx: { borderRadius: 2 } }
        }}
      >
        <Box sx={{ p: 1.5, maxWidth: '350px', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, position: 'relative' }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
              Remove guest
            </Typography>
            <IconButton
              size='small'
              onClick={handleRemoveGuestWorkspacePopoverClose}
              sx={{ position: 'absolute', right: 0 }}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>

          <Button
            variant='text'
            sx={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1 }}
            onClick={removeGuestWorkspace}
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
                textDecoration: 'underline',
                fontSize: 12
              }}
            >
              Remove all access to the Workspace.
            </Typography>
          </Button>
        </Box>
      </Popover>
    </>
  )
}
