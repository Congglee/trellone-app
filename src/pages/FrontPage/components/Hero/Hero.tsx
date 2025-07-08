import { Link as MuiLink } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import HeroBanner from '~/assets/front-page/hero-banner.png'
import path from '~/constants/path'
import { siteConfig } from '~/constants/site'
import GradientOrb from '~/pages/FrontPage/components/GradientOrb'

const FloatingIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper,
  padding: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
  animation: 'float 6s ease-in-out infinite',
  '&:nth-of-type(odd)': {
    animationDelay: '0s'
  },
  '&:nth-of-type(even)': {
    animationDelay: '3s'
  },
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0px) rotate(0deg)'
    },
    '50%': {
      transform: 'translateY(-20px) rotate(5deg)'
    }
  },
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
}))

const AppIcon = ({
  icon,
  fontSize = 48,
  width = '100%',
  height = '100%'
}: {
  icon: string
  fontSize?: number
  width?: number | string
  height?: number | string
}) => (
  <Box
    sx={{
      width,
      height,
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: `${fontSize * 0.5}px`,
      color: 'white',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'scale(1.1)',
        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
      }
    }}
  >
    {icon}
  </Box>
)

export default function Hero() {
  const [email, setEmail] = useState('')

  return (
    <Box
      sx={{
        minHeight: (theme) => `calc(100vh - ${theme.trellone.frontPageNavBarHeight})`,
        py: { xs: 8, md: 4 },
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
            : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}
    >
      <GradientOrb
        sx={{
          width: '300px',
          height: '300px',
          top: '10%',
          left: '-10%'
        }}
      />

      <GradientOrb
        sx={{
          width: '200px',
          height: '200px',
          bottom: '20%',
          right: '-5%',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      />

      <Container maxWidth='lg' sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4} alignItems='center'>
          <Grid xs={12} md={6}>
            <Stack
              spacing={4}
              alignItems={{ xs: 'center', md: 'flex-start' }}
              sx={{ textAlign: { xs: 'center', md: 'left' } }}
            >
              <Typography
                variant='h1'
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3rem' },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: 'text.primary'
                }}
              >
                Turn ideas into action and bring your team{' '}
                <Box
                  component='span'
                  sx={{
                    whiteSpace: 'nowrap',
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  closer together.
                </Box>
              </Typography>

              <Typography
                variant='h6'
                sx={{
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  fontWeight: 400,
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  maxWidth: '500px'
                }}
              >
                Simple, flexible, and powerful. With {siteConfig.name}, your team can see the big picture and track
                every detail from start to finish.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  maxWidth: '600px',
                  width: '100%'
                }}
              >
                <TextField
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant='outlined'
                  fullWidth
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    flexBasis: { xs: '100%', sm: '65%' },
                    maxWidth: { xs: '100%', sm: '350px' },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: (theme) => theme.palette.background.paper,
                      height: '56px'
                    },
                    display: { xs: 'none', md: 'flex' }
                  }}
                />

                <Button
                  component={NavLink}
                  to={path.register}
                  variant='contained'
                  size='large'
                  sx={{
                    flexGrow: 0,
                    flexShrink: 0,
                    flexBasis: { xs: '100%', md: 'auto' },
                    minWidth: { xs: '100%', md: '180px' },
                    maxWidth: { sm: '200px' },
                    height: '54px',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    px: { xs: 4, sm: 3 },
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                    },
                    color: '#ffffff',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Sign up - it's free!
                </Button>
              </Box>

              <Typography variant='body2' color='text.secondary'>
                By entering my email, I acknowledge the{' '}
                <MuiLink href='#' color='primary' underline='hover'>
                  {siteConfig.name} Privacy Policy
                </MuiLink>
              </Typography>

              <MuiLink
                component={Link}
                to='#'
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px'
                  }}
                >
                  ▶
                </Box>
                Watch video
              </MuiLink>
            </Stack>
          </Grid>

          <Grid xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                minHeight: { xs: '400px', md: '600px' },
                px: { xs: 2, md: 0 }
              }}
            >
              <FloatingIcon
                sx={{
                  top: '5%',
                  left: { xs: '5%', md: '8%' },
                  width: { xs: 45, md: 55 },
                  height: { xs: 45, md: 55 },
                  display: { xs: 'none', sm: 'flex' }
                }}
              >
                <AppIcon icon='📋' fontSize={44} />
              </FloatingIcon>

              <FloatingIcon
                sx={{
                  top: '15%',
                  right: { xs: '8%', md: '12%' },
                  width: { xs: 40, md: 48 },
                  height: { xs: 40, md: 48 }
                }}
              >
                <AppIcon icon='⚡' fontSize={38} />
              </FloatingIcon>

              <FloatingIcon
                sx={{
                  top: '45%',
                  left: { xs: '1%', md: '2%' },
                  width: { xs: 44, md: 52 },
                  height: { xs: 44, md: 52 }
                }}
              >
                <AppIcon icon='✉️' fontSize={42} />
              </FloatingIcon>

              <FloatingIcon
                sx={{
                  top: '60%',
                  right: { xs: '5%', md: '8%' },
                  width: { xs: 50, md: 58 },
                  height: { xs: 50, md: 58 },
                  display: { xs: 'none', sm: 'flex' }
                }}
              >
                <AppIcon icon='📊' fontSize={46} />
              </FloatingIcon>

              <FloatingIcon
                sx={{
                  bottom: '8%',
                  left: { xs: '12%', md: '15%' },
                  width: { xs: 42, md: 50 },
                  height: { xs: 42, md: 50 }
                }}
              >
                <AppIcon icon='📁' fontSize={40} />
              </FloatingIcon>

              <FloatingIcon
                sx={{
                  bottom: '25%',
                  right: { xs: '3%', md: '5%' },
                  width: { xs: 38, md: 46 },
                  height: { xs: 38, md: 46 }
                }}
              >
                <AppIcon icon='🎯' fontSize={36} />
              </FloatingIcon>

              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1,
                  '& img': {
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '20px',
                    boxShadow: (theme) => theme.shadows[24],
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  }
                }}
              >
                <img src={HeroBanner} alt='Trellone app interface showcase' loading='lazy' />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
