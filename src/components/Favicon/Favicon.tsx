import LinkIcon from '@mui/icons-material/Link'
import { SxProps } from '@mui/material'
import Box from '@mui/material/Box'
import { useState } from 'react'
import { getFaviconUrl } from '~/utils/url'

interface FaviconProps {
  url: string
  size?: number
  styles?: SxProps
}

export default function Favicon({ url, size = 16, styles = {} }: FaviconProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const faviconUrl = getFaviconUrl(url, size)

  const handleImageLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // If no valid favicon URL or error occurred, show fallback icon
  if (!faviconUrl || hasError) {
    return <LinkIcon sx={styles} />
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...styles }}>
      {isLoading && <LinkIcon sx={{ opacity: 0.5 }} />}
      <Box
        component='img'
        src={faviconUrl}
        alt='Site favicon'
        onLoad={handleImageLoad}
        onError={handleImageError}
        sx={{
          width: size,
          height: size,
          display: isLoading ? 'none' : 'block',
          objectFit: 'contain'
        }}
      />
    </Box>
  )
}
