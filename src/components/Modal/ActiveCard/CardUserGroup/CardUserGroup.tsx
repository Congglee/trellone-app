import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import Tooltip from '@mui/material/Tooltip'
import { useMemo, useState } from 'react'
import { useAppSelector } from '~/lib/redux/hooks'
import { UserType } from '~/schemas/user.schema'

interface CardUserGroupProps {
  cardMembers: string[]
  onAddCardMember: (userId: string) => void
  onRemoveCardMember: (userId: string) => void
}

export default function CardUserGroup({ cardMembers, onAddCardMember, onRemoveCardMember }: CardUserGroupProps) {
  const [anchorGroupActionsPopoverElement, setAnchorGroupActionsPopoverElement] = useState<HTMLElement | null>(null)
  const isGroupActionsPopoverOpen = Boolean(anchorGroupActionsPopoverElement)

  const popoverId = isGroupActionsPopoverOpen ? 'group-actions-popover' : undefined

  const handleGroupActionsPopoverToggle = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!anchorGroupActionsPopoverElement) {
      setAnchorGroupActionsPopoverElement(event.currentTarget)
    } else {
      setAnchorGroupActionsPopoverElement(null)
    }
  }

  const { activeBoard } = useAppSelector((state) => state.board)

  const FE_CardMembers = useMemo(
    () => cardMembers.map((id) => activeBoard?.members?.find((user) => user._id === id)),
    [cardMembers, activeBoard?.members]
  )

  const handleUpdateCardMembers = (user: UserType) => {
    if (cardMembers.includes(user._id)) {
      onRemoveCardMember(user._id)
    } else {
      onAddCardMember(user._id)
    }
  }

  return (
    <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {FE_CardMembers.map((user, index) => (
        <Tooltip title={user?.display_name} key={index}>
          <Avatar sx={{ width: 34, height: 34, cursor: 'pointer' }} alt={user?.display_name} src={user?.avatar} />
        </Tooltip>
      ))}

      <Tooltip title='Add new member'>
        <Box
          aria-describedby={popoverId}
          onClick={handleGroupActionsPopoverToggle}
          sx={{
            width: 36,
            height: 36,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '50%',
            color: (theme) => (theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d'),
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2f3542' : theme.palette.grey[200]),
            '&:hover': {
              color: (theme) => (theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4'),
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff')
            }
          }}
        >
          <AddIcon fontSize='small' />
        </Box>
      </Tooltip>

      <Popover
        id={popoverId}
        open={isGroupActionsPopoverOpen}
        anchorEl={anchorGroupActionsPopoverElement}
        onClose={handleGroupActionsPopoverToggle}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box
          sx={{
            p: 2,
            maxWidth: '260px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5
          }}
        >
          {activeBoard?.members?.map((user, index) => (
            <Tooltip title={user?.display_name} key={index}>
              <Badge
                sx={{ cursor: 'pointer' }}
                overlap='rectangular'
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  cardMembers.includes(user?._id) ? (
                    <CheckCircleIcon fontSize='small' sx={{ color: '#27ae60' }} />
                  ) : null
                }
                onClick={() => handleUpdateCardMembers(user)}
              >
                <Avatar sx={{ width: 34, height: 34 }} alt={user?.display_name} src={user?.avatar} />
              </Badge>
            </Tooltip>
          ))}
        </Box>
      </Popover>
    </Box>
  )
}
