import { Component, ErrorInfo, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import HomeIcon from '@mui/icons-material/Home'
import path from '~/constants/path'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error: ', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            bgcolor: 'background.default'
          }}
        >
          <Typography
            variant='h1'
            sx={{
              fontSize: '100px',
              fontWeight: 800,
              color: 'text.primary',
              letterSpacing: '0.1em'
            }}
          >
            500
          </Typography>

          <Box
            sx={{
              position: 'absolute',
              transform: 'rotate(12deg)',
              bgcolor: '#f97316',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              color: 'white',
              fontSize: '0.875rem'
            }}
          >
            Error!
          </Box>

          <Box sx={{ mt: 5 }}>
            <a href={path.home} style={{ textDecoration: 'none' }}>
              <Button
                variant='outlined'
                startIcon={<HomeIcon />}
                sx={{
                  position: 'relative',
                  color: 'text.primary',
                  borderColor: 'text.primary',
                  '&:hover': {
                    bgcolor: '#f97316',
                    borderColor: '#f97316',
                    color: 'white',
                    transform: 'translate(-2px, -2px)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                Go Home
              </Button>
            </a>
          </Box>
        </Box>
      )
    }

    return this.props.children
  }
}
