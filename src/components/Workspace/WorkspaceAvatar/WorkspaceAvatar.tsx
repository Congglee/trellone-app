import Avatar from '@mui/material/Avatar'
import { generateColorFromString } from '~/utils/utils'

interface WorkspaceAvatarProps {
  title: string
  logo?: string
  size: {
    width: number
    height: number
  }
}

export default function WorkspaceAvatar({ title, logo, size: { width, height } }: WorkspaceAvatarProps) {
  return logo ? (
    <Avatar src={logo} alt={title} sx={{ width, height }} />
  ) : (
    <Avatar
      variant='square'
      sx={{ width, height, bgcolor: generateColorFromString(title), fontSize: `calc(0.6 * ${width}px)` }}
    >
      {title.charAt(0).toUpperCase()}
    </Avatar>
  )
}
