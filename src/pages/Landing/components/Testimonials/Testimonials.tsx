import { useColorScheme } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import { useEffect, useState } from 'react'
import Avatar1 from '~/assets/landing/avatar-1.jpg'
import Avatar2 from '~/assets/landing/avatar-2.jpg'
import Avatar3 from '~/assets/landing/avatar-3.jpg'
import Avatar4 from '~/assets/landing/avatar-4.jpg'
import Avatar5 from '~/assets/landing/avatar-5.jpg'
import Avatar6 from '~/assets/landing/avatar-6.jpg'

const testimonials = [
  {
    avatar: <Avatar alt='Remy Sharp' src={Avatar1} />,
    name: 'Remy Sharp',
    occupation: 'Senior Engineer',
    testimonial:
      'Trellone has transformed how our team collaborates. The real-time updates mean everyone stays in sync, and the drag-and-drop interface makes organizing our kanban boards effortless.'
  },
  {
    avatar: <Avatar alt='Travis Howard' src={Avatar2} />,
    name: 'Travis Howard',
    occupation: 'Lead Product Designer',
    testimonial:
      'The visual workflow of cards and columns helps our design team track projects from concept to completion. Workspaces keep everything organized and accessible.'
  },
  {
    avatar: <Avatar alt='Cindy Baker' src={Avatar3} />,
    name: 'Cindy Baker',
    occupation: 'CTO',
    testimonial:
      "As a CTO, I appreciate Trellone's simplicity and powerful features. Our developers love the drag-and-drop boards, and real-time collaboration keeps cross-functional teams aligned."
  },
  {
    avatar: <Avatar alt='Julia Stewart' src={Avatar4} />,
    name: 'Julia Stewart',
    occupation: 'Senior Engineer',
    testimonial:
      'Managing multiple projects is easy with Trellone. The kanban boards help me visualize workload, and the card details keep all context in one place.'
  },
  {
    avatar: <Avatar alt='John Smith' src={Avatar5} />,
    name: 'John Smith',
    occupation: 'Product Designer',
    testimonial:
      'Trellone makes project management visual and intuitive. The real-time collaboration means we can brainstorm, prioritize, and ship faster as a team.'
  },
  {
    avatar: <Avatar alt='Daniel Wolf' src={Avatar6} />,
    name: 'Daniel Wolf',
    occupation: 'CDO',
    testimonial:
      'We switched to Trellone for its kanban-focused approach and real-time features. It has significantly improved our team productivity and project visibility.'
  }
]

const lightModeLogos = [
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KAZNAhvIPRvP1kJeo5WtxDd6gsIVYzjwXHyfMK',
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KASOIpWndZTQ5KAthD84CypuL761YnNJsIleRj',
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KApXO0OG4ach4iVN5xvWGTnEwzKOtRgmfyu7M3',
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KAjFYGXH0B20tDSxerGVLyFZo67lEMvshA1ipn',
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KA0PKRlT3GoH2Wpwz8he9cNlfTgmBusy3LRJiD',
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KAgRP8Hd4jXs2wIWKYVSvG7Ptqm8fg53hCpRTA'
]

const darkModeLogos = [
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KA6jqkc5pxyu8GInpsUPTbA9VQLadzgFMNjv3H',
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KAcCOn1henoQDleYaSW4Ed5jfFwC3b9Zv8AUgm',
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KAchGkgdenoQDleYaSW4Ed5jfFwC3b9Zv8AUgm',
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KAEoTIh0wkKTGRcI7a4lQPHgx6pu23OzUvD1NW',
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KAy8rnMa7cSDweR1k8p4jOfn7W6IsK5rUNGuZi',
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KAUUsx5IdUZohctfVvlu70X4mRGxDHbg6PrCIi'
]

export default function Testimonials() {
  const { mode, systemMode } = useColorScheme()

  const [logos, setLogos] = useState<string[]>([])

  useEffect(() => {
    if (mode === 'system') {
      if (systemMode === 'light') {
        setLogos(lightModeLogos)
      } else {
        setLogos(darkModeLogos)
      }
    } else if (mode === 'light') {
      setLogos(lightModeLogos)
    } else {
      setLogos(darkModeLogos)
    }
  }, [mode, systemMode])

  return (
    <Box
      id='testimonials'
      component='section'
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 }
      }}
    >
      <Container
        maxWidth='lg'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 }
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' }
          }}
        >
          <Typography variant='h4' component='h2' gutterBottom sx={{ color: 'text.primary' }}>
            Testimonials
          </Typography>
          <Typography variant='body1' sx={{ color: 'text.secondary' }}>
            Teams use Trellone to stay organized, collaborate in real-time, and ship faster. See how kanban boards help
            teams move work forward.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {testimonials.map((testimonial, index) => (
            <Grid key={index} xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
              <Card
                variant='outlined'
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  flexGrow: 1
                }}
              >
                <CardContent>
                  <Typography variant='body1' gutterBottom sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                    &quot;{testimonial.testimonial}&quot;
                  </Typography>
                </CardContent>

                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <CardHeader avatar={testimonial.avatar} title={testimonial.name} subheader={testimonial.occupation} />
                  <img src={logos[index]} alt={`Logo ${index + 1}`} style={{ width: '64px', opacity: 0.3 }} />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
