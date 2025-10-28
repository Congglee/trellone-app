import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import CampaignIcon from '@mui/icons-material/Campaign'
import ChecklistIcon from '@mui/icons-material/Checklist'
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import PsychologyIcon from '@mui/icons-material/Psychology'
import Grid from '@mui/material/Unstable_Grid2'

const highlights = [
  {
    icon: <FolderOpenIcon />,
    title: 'Project management',
    description: 'Keep tasks in order, deadlines on track, and team members aligned with trellone.'
  },
  {
    icon: <CampaignIcon />,
    title: 'Meetings',
    description: 'Empower your team meetings to be more productive, empowering, and dare we say—fun.'
  },
  {
    icon: <EnergySavingsLeafIcon />,
    title: 'Onboarding',
    description:
      "Onboarding to a new company or project is a snap with Trellone's visual layout of to-do's, resources, and progress tracking."
  },
  {
    icon: <ChecklistIcon />,
    title: 'Task management',
    description:
      "Use Trellone to track, manage, complete, and bring tasks together like the pieces of a puzzle, and make your team's projects a cohesive success every time."
  },
  {
    icon: <PsychologyIcon />,
    title: 'Brainstorming',
    description: "Unleash your team's creativity and keep ideas visible, collaborative, and actionable."
  },
  {
    icon: <AutoStoriesIcon />,
    title: 'Resource hub',
    description: 'Save time with a well-designed hub that helps teams find information easily and quickly.'
  }
]

export default function Highlights() {
  return (
    <Box
      id='highlights'
      component='section'
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        bgcolor: 'grey.900',
        color: 'white'
      }}
    >
      <Container
        maxWidth='lg'
        sx={{
          position: 'relative',
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
          <Typography variant='h4' component='h2' gutterBottom sx={{ color: 'common.white' }}>
            Highlights
          </Typography>
          <Typography variant='body1' sx={{ color: 'grey.400' }}>
            Explore why our product stands out: adaptability, durability, user-friendly design, and innovation. Enjoy
            reliable customer support and precision in every detail.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {highlights.map((highlight, index) => (
            <Grid key={index} xs={12} sm={6} md={4}>
              <Stack
                direction='column'
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  borderColor: 'hsla(220, 25%, 25%, 0.3)',
                  backgroundColor: 'grey.800',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Box sx={{ opacity: '50%' }}>{highlight.icon}</Box>
                <Box>
                  <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                    {highlight.title}
                  </Typography>
                  <Typography variant='body2' sx={{ color: 'grey.400' }}>
                    {highlight.description}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
