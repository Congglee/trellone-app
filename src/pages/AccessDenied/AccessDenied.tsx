import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import SEO from '~/components/SEO'
import path from '~/constants/path'

export default function AccessDenied() {
  return (
    <>
      <SEO
        title='Access Denied'
        description='You do not have permission to access this page.'
        noIndex
        noFollow
        canonicalPath={path.accessDenied}
      />
      <Container maxWidth='sm'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            gap: 3
          }}
        >
          <Typography variant='h3' component='h1' color='error.main' fontWeight='bold'>
            403
          </Typography>
          <Typography variant='h4' component='h2' gutterBottom>
            Access Denied
          </Typography>
          <Typography variant='body1' color='text.secondary' sx={{ maxWidth: 400 }}>
            You do not have the required permissions to view this page. Please contact your workspace administrator if
            you believe this is an error.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button component={Link} to={path.home} variant='contained' size='large'>
              Go to Home
            </Button>
            <Button component={Link} to={path.boardsList} variant='outlined' size='large'>
              View Boards
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  )
}
