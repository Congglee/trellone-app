import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import { useMemo, useState } from 'react'
import { useCategorizeWorkspaces } from '~/hooks/use-categorize-workspaces'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { useReopenBoardMutation } from '~/queries/boards'
import { useGetWorkspacesQuery } from '~/queries/workspaces'
import { updateActiveBoard } from '~/store/slices/board.slice'

export default function BoardClosedBanner() {
  const [anchorSelectWorkspacePopoverElement, setAnchorSelectWorkspacePopoverElement] = useState<HTMLElement | null>(
    null
  )
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('')

  const isSelectWorkspacePopoverOpen = Boolean(anchorSelectWorkspacePopoverElement)
  const selectWorkspacePopoverId = isSelectWorkspacePopoverOpen ? 'select-workspace-popover' : undefined

  const [reopenBoardMutation] = useReopenBoardMutation()

  const dispatch = useAppDispatch()

  const { activeBoard } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)

  const { data: workspacesData } = useGetWorkspacesQuery({ page: 1, limit: 100 })

  const workspacesList = useMemo(() => workspacesData?.result.workspaces || [], [workspacesData])

  const { memberWorkspaces } = useCategorizeWorkspaces(workspacesList)

  const handleSelectWorkspacePopoverClose = () => {
    setAnchorSelectWorkspacePopoverElement(null)
    setSelectedWorkspaceId('')
  }

  const handleWorkspaceChange = (event: SelectChangeEvent<string>) => {
    setSelectedWorkspaceId(event.target.value)
  }

  const handleReopenClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    // If board has no workspace (workspace was deleted), show workspace selector
    if (activeBoard?.workspace_id === null) {
      setAnchorSelectWorkspacePopoverElement(event.currentTarget as HTMLElement)
    } else {
      // Otherwise, reopen normally
      reopenBoard()
    }
  }

  const reopenBoard = (newWorkspaceId?: string) => {
    const payload = newWorkspaceId ? { workspace_id: newWorkspaceId } : undefined

    reopenBoardMutation({ id: activeBoard?._id as string, body: payload }).then((res) => {
      if (!res.error) {
        const newActiveBoard = { ...activeBoard! }
        newActiveBoard._destroy = false

        if (newWorkspaceId !== undefined) {
          newActiveBoard.workspace_id = newWorkspaceId

          const newWorkspace = workspacesList.find((workspace) => workspace._id === newWorkspaceId)

          if (newWorkspace) {
            newActiveBoard.workspace = {
              _id: newWorkspace._id,
              title: newWorkspace.title,
              logo: newWorkspace.logo,
              boards: newWorkspace.boards || [],
              members: newWorkspace.members || [],
              guests: Array.isArray(newWorkspace.guests)
                ? newWorkspace.guests.map((guest) => (typeof guest === 'string' ? guest : guest._id))
                : []
            }
          }
        }

        dispatch(updateActiveBoard(newActiveBoard))

        socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)

        const targetWorkspaceId = newWorkspaceId !== undefined ? newWorkspaceId : activeBoard?.workspace_id

        // NOTE: Although it's possible to refetch the get board details API so that members in that board can notice the realtime update
        // But I will let users reload the board details page when they reopen that board
        if (targetWorkspaceId) {
          socket?.emit('CLIENT_USER_UPDATED_WORKSPACE', targetWorkspaceId)
        }

        handleSelectWorkspacePopoverClose()
      }
    })
  }

  const reopenBoardWithWorkspace = () => {
    if (selectedWorkspaceId) {
      reopenBoard(selectedWorkspaceId)
    }
  }

  return (
    <>
      <Box
        role='status'
        aria-live='polite'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          minWidth: 0,
          gap: 1.5,
          px: 2,
          py: 1.25,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.dark'),
          color: 'common.white',
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          position: 'relative',
          zIndex: 1,
          height: '48px',
          overflowX: 'auto',
          overflowY: 'hidden',
          flexWrap: 'nowrap',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <Box
          component='span'
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5,
            whiteSpace: 'nowrap',
            width: 'max-content',
            flexShrink: 0,
            mx: 'auto'
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 20, opacity: 0.9, flexShrink: 0 }} />
          <Typography
            component='span'
            variant='body2'
            sx={{
              opacity: 0.95,
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            This board is closed. Reopen the board to make changes.{' '}
            <Typography
              component='span'
              variant='body2'
              sx={{
                opacity: 0.95,
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: 'inherit',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              onClick={handleReopenClick}
            >
              Reopen board
            </Typography>
          </Typography>
        </Box>
      </Box>

      <Popover
        id={selectWorkspacePopoverId}
        open={isSelectWorkspacePopoverOpen}
        anchorEl={anchorSelectWorkspacePopoverElement}
        onClose={handleSelectWorkspacePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: { sx: { width: 320, borderRadius: 2 } }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              position: 'relative'
            }}
          >
            <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
              Select a Workspace
            </Typography>
            <IconButton
              size='small'
              onClick={handleSelectWorkspacePopoverClose}
              sx={{ position: 'absolute', right: 0 }}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>

          <Typography variant='body2' sx={{ mb: 2, color: 'text.secondary' }}>
            Your Workspaces
          </Typography>

          <Select
            size='small'
            fullWidth
            value={selectedWorkspaceId}
            onChange={handleWorkspaceChange}
            displayEmpty
            sx={{ mb: 2 }}
          >
            <MenuItem value='' disabled>
              Choose...
            </MenuItem>
            {memberWorkspaces.map((workspace) => (
              <MenuItem key={workspace._id} value={workspace._id}>
                {workspace.title}
              </MenuItem>
            ))}
          </Select>

          <Button variant='contained' fullWidth disabled={!selectedWorkspaceId} onClick={reopenBoardWithWorkspace}>
            Reopen board
          </Button>
        </Box>
      </Popover>
    </>
  )
}
