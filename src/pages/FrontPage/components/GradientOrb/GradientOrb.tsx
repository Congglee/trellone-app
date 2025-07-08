import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { SxProps, Theme } from '@mui/material/styles'

interface GradientOrbProps {
  sx?: SxProps<Theme>
  blur?: number
  opacity?: number
  animationDuration?: string
  animationDelay?: string
}

const StyledGradientOrb = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'blur' && prop !== 'opacity' && prop !== 'animationDuration' && prop !== 'animationDelay'
})<{
  blur: number
  opacity: number
  animationDuration: string
  animationDelay: string
}>(({ theme, blur, opacity, animationDuration, animationDelay }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  filter: `blur(${blur}px)`,
  opacity,
  animation: `pulse ${animationDuration} ease-in-out infinite`,
  animationDelay,
  '@keyframes pulse': {
    '0%, 100%': {
      transform: 'scale(1)'
    },
    '50%': {
      transform: 'scale(1.1)'
    }
  }
}))

export default function GradientOrb({
  sx,
  blur = 40,
  opacity = 0.3,
  animationDuration = '4s',
  animationDelay = '0s'
}: GradientOrbProps) {
  return (
    <StyledGradientOrb
      blur={blur}
      opacity={opacity}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      sx={sx}
    />
  )
}
