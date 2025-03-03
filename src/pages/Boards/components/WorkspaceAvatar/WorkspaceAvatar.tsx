import Avatar from '@mui/material/Avatar'
import { generateColorFromString } from '~/utils/utils'

interface WorkspaceAvatarProps {
  workspaceName: string
  avatarSize: {
    width: number
    height: number
  }
}

export default function WorkspaceAvatar({ workspaceName, avatarSize: { width, height } }: WorkspaceAvatarProps) {
  return (
    <Avatar
      variant='square'
      sx={{ width, height, bgcolor: generateColorFromString(workspaceName), fontSize: `calc(0.6 * ${width}px)` }}
    >
      {workspaceName.charAt(0).toUpperCase()}
    </Avatar>
  )
}
