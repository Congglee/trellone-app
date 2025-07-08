import { features } from '~/constants/front-page'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Unstable_Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { siteConfig } from '~/constants/site'

export default function Features() {
  return (
    <Box
      sx={{
        py: 12,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1a202c' : '#f7fafc')
      }}
    >
      <Container maxWidth='lg' sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto',
            marginBottom: (theme) => theme.spacing(8)
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: (theme) => (theme.palette.mode === 'dark' ? '#a0aec0' : '#718096'),
              marginBottom: (theme) => theme.spacing(2),
              display: 'block'
            }}
            variant='overline'
          >
            WORK SMARTER
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 700,
              lineHeight: 1.2,
              color: 'text.primary',
              marginBottom: (theme) => theme.spacing(3)
            }}
            variant='h2'
          >
            Do more with {siteConfig.name}
          </Typography>

          <Typography
            sx={{
              fontSize: '18px',
              lineHeight: 1.6,
              color: 'text.secondary',
              fontWeight: 400
            }}
          >
            Customize the way you organize with easy integrations, automation, and mirroring of your to-dos across
            multiple locations.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid xs={12} md={4} key={index}>
              <Card
                sx={(theme) => ({
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor:
                    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '20px',
                  boxShadow:
                    theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border:
                    theme.palette.mode === 'dark'
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : '1px solid rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow:
                      theme.palette.mode === 'dark'
                        ? '0 25px 50px rgba(0, 0, 0, 0.5)'
                        : '0 25px 50px rgba(0, 0, 0, 0.15)'
                  }
                })}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '240px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                    borderRadius: '20px 20px 0 0',
                    padding: (theme) => theme.spacing(3),
                    '& img': {
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      filter: (theme) => (theme.palette.mode === 'dark' ? 'brightness(1.1)' : 'none')
                    }
                  }}
                >
                  <img src={feature.image} alt={feature.title} loading='lazy' />
                </Box>

                <CardContent
                  sx={{
                    padding: (theme) => theme.spacing(4),
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '24px',
                      fontWeight: 600,
                      color: 'text.primary',
                      marginBottom: (theme) => theme.spacing(2),
                      lineHeight: 1.3
                    }}
                    variant='h4'
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: '16px',
                      lineHeight: 1.6,
                      color: 'text.secondary',
                      marginBottom: (theme) => theme.spacing(3),
                      flexGrow: 1
                    }}
                  >
                    {feature.body}
                  </Typography>

                  <Button
                    sx={{
                      alignSelf: 'flex-start',
                      textTransform: 'none',
                      fontSize: '14px',
                      fontWeight: 600,
                      padding: '12px 24px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#ffffff',
                      border: 'none',
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)'
                      }
                    }}
                    variant='contained'
                  >
                    {feature.button}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
