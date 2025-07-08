import { Link as MuiLink } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import GradientOrb from '~/pages/FrontPage/components/GradientOrb'
import { siteConfig } from '~/constants/site'

export default function CTA() {
  return (
    <Box
      sx={{
        paddingTop: (theme) => theme.spacing(12),
        paddingBottom: (theme) => theme.spacing(12),
        position: 'relative',
        overflow: 'hidden',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
            : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}
    >
      <GradientOrb
        blur={100}
        opacity={0.1}
        animationDuration='8s'
        sx={{
          width: '400px',
          height: '400px',
          top: '-10%',
          left: '-15%'
        }}
      />

      <GradientOrb
        blur={100}
        opacity={0.1}
        animationDuration='8s'
        animationDelay='2s'
        sx={{
          width: '250px',
          height: '250px',
          bottom: '-5%',
          right: '-10%',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      />

      <GradientOrb
        blur={100}
        opacity={0.1}
        animationDuration='8s'
        animationDelay='4s'
        sx={{
          width: '180px',
          height: '180px',
          top: '15%',
          right: '10%',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
              : 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
        }}
      />

      <GradientOrb
        blur={100}
        opacity={0.1}
        animationDuration='8s'
        animationDelay='6s'
        sx={{
          width: '220px',
          height: '220px',
          bottom: '30%',
          left: '5%',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
              : 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
        }}
      />

      <GradientOrb
        blur={100}
        opacity={0.1}
        animationDuration='8s'
        animationDelay='1s'
        sx={{
          width: '150px',
          height: '150px',
          top: '60%',
          right: '25%',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)'
              : 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
        }}
      />

      <Container maxWidth='lg' sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >
          <Typography
            variant='h3'
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem', lg: '3rem' },
              fontWeight: 700,
              lineHeight: 1.2,
              color: 'text.primary',
              marginBottom: 4,
              whiteSpace: 'nowrap',
              '@media (max-width: 450px)': {
                whiteSpace: 'normal',
                fontSize: '1.5rem'
              }
            }}
          >
            Get started with {siteConfig.name} today
          </Typography>

          <Box sx={{ maxWidth: '600px', margin: '0 auto', marginBottom: (theme) => theme.spacing(3) }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', alignItems: 'stretch' }}>
              <TextField
                placeholder='Email'
                variant='outlined'
                size='medium'
                sx={{
                  flex: { xs: 1, sm: 2.5 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: (theme) => theme.palette.background.paper,
                    fontSize: '1rem',
                    height: '54px',
                    '& input': {
                      padding: '15px 16px',
                      height: 'auto'
                    },
                    '& fieldset': {
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    '&:hover fieldset': {
                      borderColor: (theme) => theme.palette.primary.main
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: (theme) => theme.palette.primary.main,
                      borderWidth: '2px'
                    }
                  }
                }}
              />

              <Button
                variant='contained'
                size='large'
                sx={{
                  flex: { xs: '1 1 100%', sm: '0 0 auto' },
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  px: 4,
                  height: '52px',
                  minWidth: { xs: 'auto', sm: '180px' },
                  background: 'linear-gradient(135deg, #0052cc 0%, #0065ff 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #004bb5 0%, #0056e0 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 8px 25px rgba(0, 82, 204, 0.3)'
                  },
                  color: '#ffffff',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Sign up - it's free!
              </Button>
            </Stack>
          </Box>

          <Typography
            variant='body2'
            color='text.secondary'
            sx={{
              fontSize: '0.875rem',
              lineHeight: 1.5
            }}
          >
            By entering my email, I acknowledge the{' '}
            <MuiLink href='#' color='primary' underline='hover' sx={{ fontWeight: 500 }}>
              {siteConfig.name} Privacy Policy
            </MuiLink>
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
