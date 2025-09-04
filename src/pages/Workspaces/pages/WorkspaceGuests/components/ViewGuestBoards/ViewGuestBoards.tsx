import { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { BoardResType } from '~/schemas/board.schema'
import { UserType } from '~/schemas/user.schema'
import { useRemoveGuestFromBoardMutation } from '~/queries/workspaces'
import { toast } from 'react-toastify'

interface ViewGuestBoardsProps {
  totalGuestBoardCounts: number
  guestBoards: BoardResType['result'][]
  guest: UserType
  showRemoveButton: boolean
  workspaceId: string
}

export default function ViewGuestBoards({
  totalGuestBoardCounts,
  guestBoards,
  guest,
  showRemoveButton,
  workspaceId
}: ViewGuestBoardsProps) {
  const [anchorViewGuestBoardsPopoverElement, setAnchorViewGuestBoardsPopoverElement] = useState<HTMLElement | null>(
    null
  )

  const isViewGuestBoardsPopoverOpen = Boolean(anchorViewGuestBoardsPopoverElement)

  const viewGuestBoardsPopoverId = 'view-guest-boards-popover'

  const toggleViewGuestBoardsPopover = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (isViewGuestBoardsPopoverOpen) {
      setAnchorViewGuestBoardsPopoverElement(null)
    } else {
      setAnchorViewGuestBoardsPopoverElement(event.currentTarget)
    }
  }

  const handleViewGuestBoardsPopoverClose = () => {
    setAnchorViewGuestBoardsPopoverElement(null)
  }

  const [removeGuestFromBoardMutation, { isError }] = useRemoveGuestFromBoardMutation()

  const removeGuestFromWorkspaceBoard = async (boardId: string) => {
    await removeGuestFromBoardMutation({
      workspace_id: workspaceId,
      user_id: guest._id,
      body: { board_id: boardId }
    })
    handleViewGuestBoardsPopoverClose()
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
        disabled={totalGuestBoardCounts === 0}
        onClick={toggleViewGuestBoardsPopover}
        sx={{ borderRadius: 1, textTransform: 'none', minWidth: 120 }}
      >
        View boards ({totalGuestBoardCounts || 0})
      </Button>

      <Popover
        id={viewGuestBoardsPopoverId}
        open={isViewGuestBoardsPopoverOpen}
        anchorEl={anchorViewGuestBoardsPopoverElement}
        onClose={toggleViewGuestBoardsPopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: { sx: { width: '320px', borderRadius: 2 } }
        }}
      >
        <Box sx={{ p: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, position: 'relative' }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
              Workspace boards
            </Typography>
            <IconButton size='small' onClick={toggleViewGuestBoardsPopover} sx={{ position: 'absolute', right: 0 }}>
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>

          <Typography variant='body2' sx={{ mb: 2, color: 'text.secondary' }}>
            {guest.display_name} is a member of the following Workspace boards:
          </Typography>

          <List disablePadding sx={{ maxHeight: 280, overflowY: 'auto' }}>
            {guestBoards.map((board) => (
              <ListItem
                key={board._id}
                disablePadding
                sx={{
                  mb: 1,
                  '&:last-child': { mb: 0 }
                }}
              >
                <Stack
                  direction='row'
                  alignItems='center'
                  justifyContent='space-between'
                  sx={{
                    width: '100%',
                    p: 1,
                    borderRadius: 1,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'),
                    border: (theme) => (theme.palette.mode === 'dark' ? '1px solid #444' : '1px solid #e0e0e0')
                  }}
                >
                  <Stack direction='row' alignItems='center' gap={1.5} sx={{ flex: 1, minWidth: 0 }}>
                    <Avatar src={board.cover_photo} variant='rounded' sx={{ width: 30, height: 30 }}>
                      {board.title.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant='body2' fontWeight={500} color='text.primary' noWrap sx={{ flex: 1 }}>
                      {board.title}
                    </Typography>
                  </Stack>
                  {showRemoveButton && (
                    <Button
                      size='small'
                      variant='contained'
                      color='error'
                      sx={{
                        minWidth: 'auto',
                        px: 2,
                        py: 0.5,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        textTransform: 'none',
                        borderRadius: 1,
                        bgcolor: '#d32f2f',
                        '&:hover': { bgcolor: '#b71c1c' }
                      }}
                      onClick={() => removeGuestFromWorkspaceBoard(board._id)}
                    >
                      Remove
                    </Button>
                  )}
                </Stack>
              </ListItem>
            ))}
          </List>

          {guestBoards.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant='body2' color='text.secondary'>
                {guest.display_name} is not a member of any workspace boards.
              </Typography>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  )
}
