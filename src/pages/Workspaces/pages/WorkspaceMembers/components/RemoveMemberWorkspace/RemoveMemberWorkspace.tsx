import Button from '@mui/material/Button'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Popover from '@mui/material/Popover'
import ClearIcon from '@mui/icons-material/Clear'
import { useRemoveWorkspaceMemberMutation } from '~/queries/workspaces'
import { toast } from 'react-toastify'
import { useAppSelector } from '~/lib/redux/hooks'

interface RemoveMemberWorkspaceProps {
  isDisabled: boolean
  buttonText: string
  userId: string
  workspaceId: string
}

export default function RemoveMemberWorkspace({
  isDisabled,
  buttonText,
  userId,
  workspaceId
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

  const { socket } = useAppSelector((state) => state.app)

  const [removeWorkspaceMemberMutation, { isError }] = useRemoveWorkspaceMemberMutation()

  const removeMemberFromWorkspace = () => {
    removeWorkspaceMemberMutation({ workspace_id: workspaceId, user_id: userId }).then((res) => {
      if (!res.error) {
        handleRemoveMemberWorkspacePopoverClose()
        socket?.emit('CLIENT_USER_UPDATED_WORKSPACE', workspaceId)
      }
    })
  }

  useEffect(() => {
    if (isError) {
      toast.error('Not enough admins')
    }
  }, [isError])

  return (
    <>
      <Button
        size='small'
        variant='outlined'
        disabled={isDisabled}
        sx={{ borderRadius: 1, textTransform: 'none', minWidth: 120 }}
        onClick={toggleRemoveMemberWorkspacePopover}
        startIcon={<ClearIcon />}
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
          paper: { sx: { width: 320, borderRadius: 2 } }
        }}
      >
        <Box sx={{ p: 1.5 }}>
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
                textDecoration: 'underline',
                fontSize: 12
              }}
            >
              Remove all access to the Workspace. The member will remain on all their boards in this Workspace.
            </Typography>
          </Button>
        </Box>
      </Popover>
    </>
  )
}
