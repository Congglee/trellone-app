import AvatarGroup from '@mui/material/AvatarGroup'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'

export default function BoardUserGroup() {
  return (
    <AvatarGroup
      max={7}
      sx={{
        gap: '10px',
        '& .MuiAvatar-root': {
          width: 34,
          height: 34,
          fontSize: 16,
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          '&:first-of-type': { bgcolor: '#a4b0be' }
        }
      }}
    >
      <Tooltip title='conggglee'>
        <Avatar
          alt='Conggglee'
          src='https://lh3.googleusercontent.com/ogw/AF2bZygtV6Wge53lLFSvSlE6JqKJw9RzmZd3FPIsMijke5u2Css=s32-c-mo'
        />
      </Tooltip>
      <Tooltip title='conggglee'>
        <Avatar
          alt='Conggglee'
          src='https://lh3.googleusercontent.com/ogw/AF2bZygtV6Wge53lLFSvSlE6JqKJw9RzmZd3FPIsMijke5u2Css=s32-c-mo'
        />
      </Tooltip>
      <Tooltip title='conggglee'>
        <Avatar
          alt='Conggglee'
          src='https://lh3.googleusercontent.com/ogw/AF2bZygtV6Wge53lLFSvSlE6JqKJw9RzmZd3FPIsMijke5u2Css=s32-c-mo'
        />
      </Tooltip>
      <Tooltip title='conggglee'>
        <Avatar
          alt='Conggglee'
          src='https://lh3.googleusercontent.com/ogw/AF2bZygtV6Wge53lLFSvSlE6JqKJw9RzmZd3FPIsMijke5u2Css=s32-c-mo'
        />
      </Tooltip>
      <Tooltip title='conggglee'>
        <Avatar
          alt='Conggglee'
          src='https://lh3.googleusercontent.com/ogw/AF2bZygtV6Wge53lLFSvSlE6JqKJw9RzmZd3FPIsMijke5u2Css=s32-c-mo'
        />
      </Tooltip>
    </AvatarGroup>
  )
}
