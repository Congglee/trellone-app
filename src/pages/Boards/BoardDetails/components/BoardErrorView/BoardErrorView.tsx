import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import path from '~/constants/path'

interface BoardErrorProps {
  title?: string
  description?: string
  to?: string
  hrefText?: string
  children?: React.ReactNode
}

export default function BoardErrorView({
  title = 'Board Not Found',
  description = "The board you're looking for doesn't exist or you don't have permission to view it.",
  to = path.boardsList,
  hrefText = 'Back to Boards',
  children
}: BoardErrorProps) {
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
            {title}
          </Typography>

          <Typography variant='body1' paragraph sx={{ mb: 3 }}>
            {description}
          </Typography>

          {children ?? (
            <Button
              variant='contained'
              size='large'
              onClick={() => navigate(to)}
              sx={{ minWidth: 150, fontWeight: 'bold' }}
            >
              {hrefText}
            </Button>
          )}
        </Paper>
      </Box>
    </Container>
  )
}
