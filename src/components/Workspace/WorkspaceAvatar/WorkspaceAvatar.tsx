import Avatar from '@mui/material/Avatar'
import { generateColorFromString } from '~/utils/utils'

interface WorkspaceAvatarProps {
  title: string
  logo?: string
  size?: {
    width: number
    height: number
  }
}

export default function WorkspaceAvatar({ title, logo, size }: WorkspaceAvatarProps) {
  const { width, height } = size || { width: 40, height: 40 }

  return logo ? (
    <Avatar variant='square' src={logo} alt={title} sx={{ width, height, borderRadius: 0.5 }} />
  ) : (
    <Avatar
      variant='square'
      sx={{
        width,
        height,
        bgcolor: generateColorFromString(title),
        fontSize: `calc(0.6 * ${width}px)`,
        borderRadius: 0.5
      }}
    >
      {title.charAt(0).toUpperCase()}
    </Avatar>
  )
}
