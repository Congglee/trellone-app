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
import { useState } from 'react'
import { BoardResType } from '~/schemas/board.schema'
import { WorkspaceMemberType } from '~/schemas/workspace.schema'

interface ViewMemberBoardsProps {
  totalMemberBoardCounts: number
  memberBoards: BoardResType['result'][]
  isCurrentUser: boolean
  onRemoveMemberFromWorkspaceBoard: (userId: string, boardId: string) => Promise<void>
  member: WorkspaceMemberType
}

export default function ViewMemberBoards({
  totalMemberBoardCounts = 0,
  memberBoards,
  isCurrentUser,
  onRemoveMemberFromWorkspaceBoard,
  member
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

  const removeMemberFromWorkspaceBoard = async (boardId: string) => {
    await onRemoveMemberFromWorkspaceBoard(member.user_id, boardId)
    handleViewMemberBoardsPopoverClose()
  }

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
        sx={{
          '& .MuiPopover-paper': {
            width: 320,
            maxHeight: 400,
            borderRadius: 1,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c2c2c' : '#ffffff'),
            border: (theme) => (theme.palette.mode === 'dark' ? '1px solid #444' : '1px solid #e0e0e0'),
            boxShadow: (theme) =>
              theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.12)'
          }
        }}
      >
        <Box sx={{ p: 1.5, maxWidth: '350px', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, position: 'relative' }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
              Workspace boards
            </Typography>
            <IconButton size='small' onClick={toggleViewMemberBoardsPopover} sx={{ position: 'absolute', right: 0 }}>
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>

          <Typography variant='body2' sx={{ mb: 2, color: 'text.secondary' }}>
            {member.display_name} is a member of the following Workspace boards:
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
                    <Avatar
                      src={board.cover_photo}
                      variant='rounded'
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#444' : '#f5f5f5'),
                        fontSize: '0.75rem'
                      }}
                    >
                      {board.title.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant='body2' fontWeight={500} color='text.primary' noWrap sx={{ flex: 1 }}>
                      {board.title}
                    </Typography>
                  </Stack>
                  {!isCurrentUser && (
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
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant='body2' color='text.secondary'>
                {member.display_name} is not a member of any workspace boards.
              </Typography>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  )
}
