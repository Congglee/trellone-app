import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseIcon from '@mui/icons-material/Close'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { useState, useMemo } from 'react'
import { WorkspaceType } from '~/constants/type'
import { useUpdateWorkspaceMutation } from '~/queries/workspaces'
import { WorkspaceVisibilityType } from '~/schemas/workspace.schema'

const VISIBILITY_OPTIONS = [
  {
    value: 'Private',
    title: 'Private',
    description: "This Workspace is private. It's not indexed or visible to those outside the Workspace.",
    color: 'error.main',
    kind: 'lock'
  },
  {
    value: 'Public',
    title: 'Public',
    description:
      "This Workspace is public. It's visible to anyone and will show up in search engines like Google. Only those invited to the Workspace can add and edit Workspace boards.",
    color: 'success.main',
    kind: 'public'
  }
]

interface WorkspaceVisibilityPopoverProps {
  workspaceId: string
  workspaceType: WorkspaceVisibilityType
}

export default function WorkspaceVisibilityPopover({ workspaceId, workspaceType }: WorkspaceVisibilityPopoverProps) {
  const [anchorWorkspaceVisibilityPopoverElement, setAnchorWorkspaceVisibilityPopoverElement] =
    useState<HTMLElement | null>(null)

  const isWorkspaceVisibilityPopoverOpen = Boolean(anchorWorkspaceVisibilityPopoverElement)

  const workspaceVisibilityPopoverId = 'workspace-visibility-popover'

  const toggleWorkspaceVisibilityPopover = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (isWorkspaceVisibilityPopoverOpen) {
      setAnchorWorkspaceVisibilityPopoverElement(null)
    } else if (event) {
      setAnchorWorkspaceVisibilityPopoverElement(event.currentTarget)
    }
  }

  const [updateWorkspaceMutation, { isLoading }] = useUpdateWorkspaceMutation()

  const selectedVisibility = useMemo(() => workspaceType ?? WorkspaceType.Private, [workspaceType])

  const changeWorkspaceVisibility = async (nextType: WorkspaceVisibilityType) => {
    if (nextType === selectedVisibility) {
      toggleWorkspaceVisibilityPopover()
      return
    }

    await updateWorkspaceMutation({ id: workspaceId, body: { type: nextType } })
    toggleWorkspaceVisibilityPopover()
  }

  return (
    <>
      <Button variant='outlined' size='small' onClick={toggleWorkspaceVisibilityPopover} disabled={isLoading}>
        Change
      </Button>

      <Popover
        id={workspaceVisibilityPopoverId}
        open={isWorkspaceVisibilityPopoverOpen}
        anchorEl={anchorWorkspaceVisibilityPopoverElement}
        onClose={() => toggleWorkspaceVisibilityPopover()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: { sx: { width: 350, borderRadius: 2 } }
        }}
      >
        <Box sx={{ p: 1.25 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5, position: 'relative' }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
              Select Workspace visibility
            </Typography>
            <IconButton
              size='small'
              onClick={() => toggleWorkspaceVisibilityPopover()}
              sx={{ position: 'absolute', right: 0 }}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>

          <List disablePadding>
            {VISIBILITY_OPTIONS.map((option) => {
              const isSelected = option.value === selectedVisibility

              return (
                <ListItemButton
                  key={option.value}
                  disableGutters
                  disabled={isLoading}
                  onClick={() => changeWorkspaceVisibility(option.value as WorkspaceVisibilityType)}
                  sx={{
                    alignItems: 'flex-start',
                    px: 1,
                    py: 0.75,
                    borderRadius: 1,
                    opacity: isLoading && !isSelected ? 0.6 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 20,
                          minWidth: 20,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'success.main',
                          mr: 1
                        }}
                      >
                        <CheckRoundedIcon sx={{ fontSize: 18, visibility: isSelected ? 'visible' : 'hidden' }} />
                      </Box>

                      <Box
                        sx={{
                          width: 20,
                          minWidth: 20,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1
                        }}
                      >
                        {option.kind === 'lock' ? (
                          <LockOutlinedIcon sx={{ color: option.color, fontSize: 18 }} />
                        ) : (
                          <PublicOutlinedIcon sx={{ color: option.color, fontSize: 18 }} />
                        )}
                      </Box>

                      <Typography variant='body1' sx={{ fontWeight: 600 }}>
                        {option.title}
                      </Typography>
                    </Box>

                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{
                        mt: 0.75,
                        whiteSpace: 'normal',
                        fontSize: '0.82rem',
                        lineHeight: 1.45,
                        pl: '28px'
                      }}
                    >
                      {option.description}
                    </Typography>
                  </Box>
                </ListItemButton>
              )
            })}
          </List>
        </Box>
      </Popover>
    </>
  )
}
