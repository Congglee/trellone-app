import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

export default function BoardNotFound() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isDarkMode = theme.palette.mode === 'dark'

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <Box
        sx={{
          position: 'relative',
          backgroundColor: 'primary.dark',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isDarkMode && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              mixBlendMode: 'multiply'
            }}
          />
        )}
        <Paper
          elevation={6}
          sx={{
            py: 5,
            px: 6,
            maxWidth: 500,
            textAlign: 'center',
            position: 'relative',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)'
          }}
        >
          <Typography variant='h4' component='h1' gutterBottom fontWeight='bold' color='primary'>
            Board Not Found
          </Typography>
          <Typography variant='body1' paragraph sx={{ mb: 3 }}>
            The board you're looking for doesn't exist or you don't have permission to view it.
          </Typography>
          <Button
            variant='contained'
            size='large'
            onClick={() => navigate('/boards')}
            sx={{ minWidth: 150, fontWeight: 'bold' }}
          >
            Back to Boards
          </Button>
        </Paper>
      </Box>
    </Container>
  )
}
