import Container from '@mui/material/Container'
import NavBar from '~/components/NavBar'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <Container disableGutters maxWidth={false}>
      <NavBar />
      {/* Sample content */}
      <Button
        variant='contained'
        color='primary'
        component={Link}
        to='/boards/67e4444eb85fdbf3be814557'
        sx={{ margin: 2 }}
      >
        Go to Board Details
      </Button>
      Hello World
    </Container>
  )
}
