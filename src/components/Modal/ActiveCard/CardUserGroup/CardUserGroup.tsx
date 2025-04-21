import { useMemo, useState } from 'react'
import { CardMemberAction } from '~/constants/type'
import { useAppSelector } from '~/lib/redux/hooks'
import { CardMemberPayloadType } from '~/schemas/card.schema'
import { UserType } from '~/schemas/user.schema'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import Popover from '@mui/material/Popover'
import Badge from '@mui/material/Badge'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

interface CardUserGroupProps {
  cardMembers: string[]
  onUpdateCardMembers: (member: CardMemberPayloadType) => Promise<void>
}

export default function CardUserGroup({ cardMembers, onUpdateCardMembers }: CardUserGroupProps) {
  const [anchorPopoverElement, setAnchorPopoverElement] = useState<HTMLElement | null>(null)
  const isOpenPopover = Boolean(anchorPopoverElement)

  const popoverId = isOpenPopover ? 'card-all-users-popover' : undefined

  const togglePopover = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!anchorPopoverElement) {
      setAnchorPopoverElement(event.currentTarget)
    } else {
      setAnchorPopoverElement(null)
    }
  }

  const { activeBoard } = useAppSelector((state) => state.board)

  const FE_CardMembers = useMemo(
    () => cardMembers.map((id) => activeBoard?.FE_AllUsers?.find((user) => user._id === id)),
    [cardMembers, activeBoard?.FE_AllUsers]
  )

  const updateCardMembers = (user: UserType) => {
    const payload = {
      user_id: user._id,
      action: cardMembers.includes(user._id) ? CardMemberAction.Remove : CardMemberAction.Add
    }

    onUpdateCardMembers(payload)
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
          onClick={togglePopover}
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
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={togglePopover}
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
          {activeBoard?.FE_AllUsers?.map((user, index) => (
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
                onClick={() => updateCardMembers(user)}
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
