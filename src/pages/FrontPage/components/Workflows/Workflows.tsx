import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import { workflows } from '~/constants/front-page'

export default function Workflows() {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1a202c' : '#f7fafc'),
        py: 8
      }}
    >
      <Container maxWidth='lg'>
        <Box
          sx={{
            textAlign: 'center',
            marginBottom: (theme) => theme.spacing(8),
            position: 'relative',
            zIndex: 2
          }}
        >
          <Typography
            variant='overline'
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '2px',
              color: (theme) => (theme.palette.mode === 'dark' ? '#a0aec0' : '#718096'),
              mb: 2,
              display: 'block'
            }}
          >
            TRELLONE IN ACTION
          </Typography>

          <Typography
            variant='h2'
            sx={{
              fontSize: { xs: '36px', md: '48px' },
              fontWeight: 700,
              color: (theme) => (theme.palette.mode === 'dark' ? '#f7fafc' : '#2d3748'),
              lineHeight: 1.2,
              mb: 4
            }}
          >
            Workflows for any project, big or small
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {workflows.map((workflow, index) => (
            <Grid xs={12} md={6} lg={4} key={index}>
              <Card
                sx={(theme) => ({
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: theme.palette.mode === 'dark' ? '#2d3748' : '#ffffff',
                  border: theme.palette.mode === 'dark' ? '1px solid #4a5568' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow:
                    theme.palette.mode === 'dark'
                      ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow:
                      theme.palette.mode === 'dark'
                        ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
                        : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }
                })}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: workflow.color,
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px'
                  }}
                />

                <CardContent
                  sx={{
                    p: 4,
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box
                    sx={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      background: workflow.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: (theme) => theme.spacing(2),
                      boxShadow: (theme) =>
                        theme.palette.mode === 'dark'
                          ? '0 8px 16px rgba(0, 0, 0, 0.3)'
                          : '0 8px 16px rgba(0, 0, 0, 0.1)',
                      '& img': {
                        width: '28px',
                        height: '28px',
                        filter: 'brightness(0) invert(1)' // Make icons white
                      }
                    }}
                  >
                    <img src={workflow.icon} alt={workflow.title} />
                  </Box>

                  <Typography
                    variant='h5'
                    sx={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: (theme) => (theme.palette.mode === 'dark' ? '#f7fafc' : '#2d3748'),
                      mb: 2,
                      lineHeight: 1.3
                    }}
                  >
                    {workflow.title}
                  </Typography>

                  <Typography
                    variant='body1'
                    sx={{
                      fontSize: '16px',
                      lineHeight: 1.6,
                      color: (theme) => (theme.palette.mode === 'dark' ? '#a0aec0' : '#4a5568'),
                      flexGrow: 1
                    }}
                  >
                    {workflow.body}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant='body1'
            sx={{
              fontSize: '18px',
              lineHeight: 1.6,
              color: (theme) => (theme.palette.mode === 'dark' ? '#a0aec0' : '#4a5568'),
              mb: 4,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            No need to start from scratch. Jump-start your workflow with a proven playbook designed for different teams.
            Customize it to make it yours.
          </Typography>

          <Button
            sx={(theme) => ({
              marginTop: theme.spacing(6),
              padding: theme.spacing(1.5, 4),
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 600,
              border: theme.palette.mode === 'dark' ? '2px solid #4a5568' : '2px solid #e2e8f0',
              color: theme.palette.mode === 'dark' ? '#e2e8f0' : '#4a5568',
              backgroundColor: 'transparent',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? '#4a5568' : '#f7fafc',
                borderWidth: '2px',
                borderColor: theme.palette.mode === 'dark' ? '#718096' : '#cbd5e0',
                transform: 'translateY(-2px)',
                boxShadow:
                  theme.palette.mode === 'dark' ? '0 8px 16px rgba(0, 0, 0, 0.3)' : '0 8px 16px rgba(0, 0, 0, 0.1)'
              }
            })}
            variant='outlined'
            size='large'
          >
            EXPLORE ALL USE CASES
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
