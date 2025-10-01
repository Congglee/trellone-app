import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import path from '~/constants/path'
import { useAppSelector } from '~/lib/redux/hooks'
import { useDeleteWorkspaceMutation } from '~/queries/workspaces'

interface DeleteWorkspaceProps {
  workspaceId: string
  workspaceTitle: string
  affectedBoardIds: string[]
  canDeleteWorkspace: boolean
}

export default function DeleteWorkspace({
  workspaceId,
  workspaceTitle,
  affectedBoardIds,
  canDeleteWorkspace
}: DeleteWorkspaceProps) {
  const navigate = useNavigate()

  const [anchorDeleteWorkspacePopoverElement, setAnchorDeleteWorkspacePopoverElement] = useState<HTMLElement | null>(
    null
  )
  const [confirmWorkspaceName, setConfirmWorkspaceName] = useState('')

  const isDeleteWorkspacePopoverOpen = Boolean(anchorDeleteWorkspacePopoverElement)

  const deleteWorkspacePopoverId = isDeleteWorkspacePopoverOpen ? 'delete-workspace-popover' : undefined

  const toggleDeleteWorkspacePopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isDeleteWorkspacePopoverOpen) {
      setAnchorDeleteWorkspacePopoverElement(null)
      setConfirmWorkspaceName('')
    } else {
      setAnchorDeleteWorkspacePopoverElement(event.currentTarget)
    }
  }

  const handleDeleteWorkspacePopoverClose = () => {
    setAnchorDeleteWorkspacePopoverElement(null)
    setConfirmWorkspaceName('')
  }

  const isDeleteButtonDisabled = confirmWorkspaceName !== workspaceTitle

  const { socket } = useAppSelector((state) => state.app)

  const [deleteWorkspaceMutation] = useDeleteWorkspaceMutation()

  const deleteWorkspace = () => {
    if (!isDeleteButtonDisabled) {
      deleteWorkspaceMutation(workspaceId).then((res) => {
        if (!res.error) {
          for (const boardId of affectedBoardIds) {
            socket?.emit('CLIENT_USER_UPDATED_WORKSPACE', workspaceId, boardId)
          }

          navigate(path.boardsList)

          handleDeleteWorkspacePopoverClose()
        }
      })
    }
  }

  return (
    <>
      <Button
        variant='contained'
        color='error'
        size='medium'
        sx={{ px: 2.5, fontWeight: 600 }}
        onClick={toggleDeleteWorkspacePopover}
        disabled={!canDeleteWorkspace}
      >
        Delete this Workspace?
      </Button>

      <Popover
        id={deleteWorkspacePopoverId}
        open={isDeleteWorkspacePopoverOpen}
        anchorEl={anchorDeleteWorkspacePopoverElement}
        onClose={handleDeleteWorkspacePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              width: 350,
              borderRadius: 2,
              bgcolor: 'background.paper'
            }
          }
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant='h6' sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
              Delete Workspace?
            </Typography>
            <IconButton
              size='small'
              onClick={handleDeleteWorkspacePopoverClose}
              sx={{
                color: 'text.secondary',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>

          <Typography variant='body2' sx={{ mb: 2.5, color: 'text.primary', lineHeight: 1.6 }}>
            Enter the Workspace name{' '}
            <Typography
              component='span'
              sx={{
                fontWeight: 700,
                color: 'text.primary'
              }}
            >
              "{workspaceTitle}"
            </Typography>{' '}
            to delete
          </Typography>

          <Box sx={{ mb: 2.5 }}>
            <Typography variant='body2' sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
              Things to know:
            </Typography>

            <Box component='ul' sx={{ m: 0, pl: 2.5, '& li': { mb: 1, color: 'text.secondary' } }}>
              <li>
                <Typography variant='body2' sx={{ lineHeight: 1.6 }}>
                  This is permanent and can't be undone.
                </Typography>
              </li>
              <li>
                <Typography variant='body2' sx={{ lineHeight: 1.6 }}>
                  All boards in this Workspace will be closed.
                </Typography>
              </li>
              <li>
                <Typography variant='body2' sx={{ lineHeight: 1.6 }}>
                  Board admins can reopen boards.
                </Typography>
              </li>
              <li>
                <Typography variant='body2' sx={{ lineHeight: 1.6, mb: 0 }}>
                  Board members will not be able to interact with closed boards.
                </Typography>
              </li>
            </Box>
          </Box>

          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant='body2'
              sx={{
                mb: 1,
                fontWeight: 500,
                color: 'text.primary',
                fontSize: '0.8125rem'
              }}
            >
              Enter the Workspace name to delete
            </Typography>
            <TextField
              fullWidth
              size='small'
              value={confirmWorkspaceName}
              onChange={(e) => setConfirmWorkspaceName(e.target.value)}
              placeholder={workspaceTitle}
              autoComplete='off'
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                  '&:hover fieldset': {
                    borderColor: 'divider'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main'
                  }
                }
              }}
            />
          </Box>

          <Button
            variant='contained'
            color='error'
            fullWidth
            onClick={deleteWorkspace}
            disabled={isDeleteButtonDisabled}
            sx={{
              fontWeight: 600,
              py: 1,
              textTransform: 'none',
              fontSize: '0.9375rem'
            }}
          >
            Delete Workspace
          </Button>
        </Box>
      </Popover>
    </>
  )
}
