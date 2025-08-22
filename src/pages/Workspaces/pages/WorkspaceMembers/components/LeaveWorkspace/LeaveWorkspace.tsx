import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { useLeaveWorkspaceMutation } from '~/queries/workspaces'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import path from '~/constants/path'

interface LeaveWorkspaceProps {
  isDisabled: boolean
  buttonText: string
  workspaceId: string
}

export default function LeaveWorkspace({ isDisabled, buttonText, workspaceId }: LeaveWorkspaceProps) {
  const [anchorLeaveWorkspacePopoverElement, setAnchorLeaveWorkspacePopoverElement] = useState<HTMLElement | null>(null)

  const isLeaveWorkspacePopoverOpen = Boolean(anchorLeaveWorkspacePopoverElement)

  const leaveWorkspacePopoverId = isLeaveWorkspacePopoverOpen ? 'leave-workspace-popover' : undefined

  const toggleLeaveWorkspacePopover = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (isLeaveWorkspacePopoverOpen) {
      setAnchorLeaveWorkspacePopoverElement(null)
    } else {
      setAnchorLeaveWorkspacePopoverElement(event.currentTarget)
    }
  }

  const handleLeaveWorkspacePopoverClose = () => {
    setAnchorLeaveWorkspacePopoverElement(null)
  }

  const navigate = useNavigate()

  const [leaveWorkspaceMutation, { isError, isSuccess }] = useLeaveWorkspaceMutation()

  const leaveWorkspace = async () => {
    await leaveWorkspaceMutation(workspaceId)
    handleLeaveWorkspacePopoverClose()
  }

  useEffect(() => {
    if (isSuccess) {
      navigate(path.boardsList)
    }
  }, [isSuccess, navigate])

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
        onClick={toggleLeaveWorkspacePopover}
      >
        {buttonText}
      </Button>

      <Popover
        id={leaveWorkspacePopoverId}
        open={isLeaveWorkspacePopoverOpen}
        anchorEl={anchorLeaveWorkspacePopoverElement}
        onClose={handleLeaveWorkspacePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: { sx: { borderRadius: 2 } }
        }}
      >
        <Box sx={{ p: 1.5, maxWidth: '350px', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, position: 'relative' }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
              Leave workspace
            </Typography>
            <IconButton size='small' onClick={handleLeaveWorkspacePopoverClose} sx={{ position: 'absolute', right: 0 }}>
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>

          <Typography variant='body2' sx={{ mb: 3, color: 'text.secondary' }}>
            You will become a guest of this Workspace and will only be able to access boards you are currently a member
            of.
          </Typography>

          <Button variant='contained' color='error' fullWidth onClick={leaveWorkspace}>
            Leave workspace
          </Button>
        </Box>
      </Popover>
    </>
  )
}
