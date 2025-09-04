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
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useRemoveWorkspaceMemberFromBoardMutation } from '~/queries/workspaces'
import { BoardResType } from '~/schemas/board.schema'

interface ViewMemberBoardsProps {
  totalMemberBoardCounts: number
  memberBoards: BoardResType['result'][]
  showRemoveButton: boolean
  workspaceId: string
  userId: string
  memberDisplayName: string
}

export default function ViewMemberBoards({
  totalMemberBoardCounts = 0,
  memberBoards,
  showRemoveButton,
  workspaceId,
  userId,
  memberDisplayName
}: ViewMemberBoardsProps) {
  const [anchorViewMemberBoardsPopoverElement, setAnchorViewMemberBoardsPopoverElement] = useState<HTMLElement | null>(
    null
  )

  const isViewMemberBoardsPopoverOpen = Boolean(anchorViewMemberBoardsPopoverElement)

  const viewMemberBoardsPopoverId = 'view-member-boards-popover'

  const toggleViewMemberBoardsPopover = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (isViewMemberBoardsPopoverOpen) {
      setAnchorViewMemberBoardsPopoverElement(null)
    } else {
      setAnchorViewMemberBoardsPopoverElement(event.currentTarget)
    }
  }

  const handleViewMemberBoardsPopoverClose = () => {
    setAnchorViewMemberBoardsPopoverElement(null)
  }

  const [removeWorkspaceMemberFromBoardMutation, { isError }] = useRemoveWorkspaceMemberFromBoardMutation()

  const removeMemberFromWorkspaceBoard = async (boardId: string) => {
    await removeWorkspaceMemberFromBoardMutation({
      workspace_id: workspaceId,
      user_id: userId,
      body: { board_id: boardId }
    })
    handleViewMemberBoardsPopoverClose()
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
        disabled={totalMemberBoardCounts === 0}
        onClick={toggleViewMemberBoardsPopover}
        sx={{ borderRadius: 1, textTransform: 'none', minWidth: 120 }}
      >
        View boards ({totalMemberBoardCounts || 0})
      </Button>

      <Popover
        id={viewMemberBoardsPopoverId}
        open={isViewMemberBoardsPopoverOpen}
        anchorEl={anchorViewMemberBoardsPopoverElement}
        onClose={toggleViewMemberBoardsPopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: { sx: { width: 320, borderRadius: 2 } }
        }}
      >
        <Box sx={{ p: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, position: 'relative' }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
              Workspace boards
            </Typography>
            <IconButton size='small' onClick={toggleViewMemberBoardsPopover} sx={{ position: 'absolute', right: 0 }}>
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>

          <Typography variant='body2' sx={{ mb: 2, color: 'text.secondary' }}>
            {memberDisplayName} is a member of the following Workspace boards:
          </Typography>

          <List disablePadding sx={{ maxHeight: 280, overflowY: 'auto' }}>
            {memberBoards.map((board) => (
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
                        '&:hover': {
                          bgcolor: '#b71c1c'
                        }
                      }}
                      onClick={() => removeMemberFromWorkspaceBoard(board._id)}
                    >
                      Remove
                    </Button>
                  )}
                </Stack>
              </ListItem>
            ))}
          </List>

          {memberBoards.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant='body2' color='text.secondary'>
                {memberDisplayName} is not a member of any workspace boards.
              </Typography>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  )
}
