import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import CompaniesLogosHorizontal from '~/assets/front-page/companies-logos-horizontal.svg'
import CompaniesLogosVertical from '~/assets/front-page/companies-logos-vertical.svg'
import { siteConfig } from '~/constants/site'

export default function Companies() {
  return (
    <Box
      sx={{
        paddingTop: (theme) => theme.spacing(6),
        paddingBottom: (theme) => theme.spacing(12),
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1a202c' : '#f7fafc')
      }}
    >
      <Container maxWidth='lg' sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            textAlign: 'center',
            marginBottom: (theme) => theme.spacing(6),
            position: 'relative',
            zIndex: 2
          }}
        >
          <Typography
            variant='h4'
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
              fontWeight: 600,
              lineHeight: 1.3,
              color: 'text.primary',
              marginBottom: 2
            }}
          >
            Join a community of millions of users globally who are using {siteConfig.name} to get more done.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              filter: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'brightness(1.4) contrast(1.3) saturate(0.8) opacity(0.95)'
                  : 'opacity(0.7)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                filter: (theme) =>
                  theme.palette.mode === 'dark' ? 'brightness(1.6) contrast(1.4) saturate(1) opacity(1)' : 'opacity(1)',
                transform: 'scale(1.02)'
              }
            }
          }}
        >
          <Box
            component='img'
            src={CompaniesLogosHorizontal}
            alt={`Companies using ${siteConfig.name} - Visa, Coinbase, John Deere, Zoom, Grand Hyatt, Fender`}
            sx={{
              display: { xs: 'none', md: 'block' },
              maxHeight: '80px'
            }}
          />

          <Box
            component='img'
            src={CompaniesLogosVertical}
            alt={`Companies using ${siteConfig.name} - Visa, Coinbase, John Deere, Zoom, Grand Hyatt, Fender`}
            sx={{
              display: { xs: 'block', md: 'none' },
              maxHeight: '120px'
            }}
          />
        </Box>
      </Container>
    </Box>
  )
}
