import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import GradientOrb from '~/pages/FrontPage/components/GradientOrb'
import TimelineImage from '~/assets/front-page/views-timeline.png'
import CalendarImage from '~/assets/front-page/view-calendar.png'

const ViewImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 35px 60px -12px rgba(102, 126, 234, 0.3)'
        : '0 35px 60px -12px rgba(240, 147, 251, 0.3)'
  },
  '& img': {
    width: '100%',
    height: 'auto',
    display: 'block',
    borderRadius: '20px'
  }
}))

const LearnMoreLink = styled(Typography)(({ theme }) => ({
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
      : 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textUnderlineOffset: '4px',
  textDecorationThickness: '2px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  position: 'relative',
  display: 'inline-block',
  textShadow: theme.palette.mode === 'dark' ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(255, 255, 255, 0.8)',
  '&:hover': {
    background:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
        : 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    transform: 'translateX(4px)',
    textDecorationColor: theme.palette.mode === 'dark' ? '#f59e0b' : '#1d4ed8',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-2px',
      left: '0',
      width: '100%',
      height: '2px',
      background:
        theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
          : 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
      transform: 'scaleX(1.05)',
      borderRadius: '1px'
    }
  },
  '&:focus': {
    outline: `3px solid ${theme.palette.mode === 'dark' ? '#fbbf24' : '#1e40af'}`,
    outlineOffset: '2px',
    borderRadius: '4px'
  },
  '&:active': {
    transform: 'translateX(2px) translateY(1px)'
  }
}))

export default function Views() {
  return (
    <Box
      sx={{
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0c4a6e 0%, #075985 25%, #0284c7 75%, #0ea5e9 100%)'
            : 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 25%, #81d4fa 75%, #4fc3f7 100%)',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        py: 8
      }}
    >
      <GradientOrb
        sx={{
          width: '300px',
          height: '300px',
          top: '10%',
          left: '-10%'
        }}
      />

      <GradientOrb
        sx={{
          width: '200px',
          height: '200px',
          bottom: '20%',
          right: '-5%',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      />

      <Container maxWidth='lg' sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            position: 'relative',
            zIndex: 2
          }}
        >
          <Typography
            variant='h2'
            sx={{
              fontSize: { xs: '36px', md: '48px', lg: '56px' },
              fontWeight: 700,
              lineHeight: 1.1,
              mb: 3,
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 50%, #81d4fa 100%)'
                  : 'linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #1e3a8a 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent'
            }}
          >
            See work in a whole new way
          </Typography>

          <Typography
            variant='body1'
            sx={{
              fontSize: { xs: '18px', md: '20px' },
              lineHeight: 1.6,
              color: (theme) => (theme.palette.mode === 'dark' ? '#f1f5f9' : '#0f172a'),
              mx: 'auto',
              mb: 4,
              textShadow: (theme) =>
                theme.palette.mode === 'dark' ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 1px 2px rgba(255, 255, 255, 0.8)'
            }}
          >
            View your team's projects from every angle and bring a fresh perspective to the task at hand.
          </Typography>

          <Button
            sx={(theme) => ({
              padding: theme.spacing(1.5, 4),
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 600,
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)'
                  : 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%)',
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#0f172a',
              border: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                border: 'none',
                background:
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)'
                    : 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
              }
            })}
            variant='outlined'
            size='large'
          >
            DISCOVER ALL THE VIEWS
          </Button>
        </Box>

        <Box
          sx={(theme) => ({
            py: 8,
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(8),
            [theme.breakpoints.down('md')]: {
              flexDirection: 'column',
              gap: theme.spacing(4)
            }
          })}
        >
          <Box sx={{ flex: 1, maxWidth: '500px' }}>
            <Typography
              sx={(theme) => ({
                fontSize: '24px',
                fontWeight: 700,
                color: theme.palette.mode === 'dark' ? '#ffffff' : '#0f172a',
                marginBottom: theme.spacing(2),
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing(1),
                textShadow:
                  theme.palette.mode === 'dark' ? '0 2px 4px rgba(0, 0, 0, 0.5)' : '0 1px 3px rgba(255, 255, 255, 0.9)',
                '&::before': {
                  content: '""',
                  width: '4px',
                  height: '24px',
                  background:
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                      : 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                  borderRadius: '2px'
                }
              })}
            >
              HIT DEADLINES EVERY TIME
            </Typography>

            <Typography
              variant='body1'
              sx={{
                fontSize: '18px',
                lineHeight: 1.6,
                color: (theme) => (theme.palette.mode === 'dark' ? '#e2e8f0' : '#1e293b'),
                mb: 3,
                textShadow: (theme) =>
                  theme.palette.mode === 'dark' ? '0 1px 3px rgba(0, 0, 0, 0.4)' : '0 1px 2px rgba(255, 255, 255, 0.7)'
              }}
            >
              From weekly sprints to annual planning, Timeline view keeps all tasks on track. Quickly get a glimpse of
              what's coming down the pipeline and identify any gaps that might impede your team's progress.
            </Typography>

            <LearnMoreLink>Learn more about Timeline view</LearnMoreLink>
          </Box>

          <Box sx={{ flex: 1, maxWidth: '600px' }}>
            <ViewImageContainer>
              <img src={TimelineImage} alt='Timeline view interface' />
            </ViewImageContainer>
          </Box>
        </Box>

        <Box
          sx={(theme) => ({
            py: 8,
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(8),
            [theme.breakpoints.down('md')]: {
              flexDirection: 'column-reverse',
              gap: theme.spacing(4)
            }
          })}
        >
          <Box sx={{ flex: 1, maxWidth: '600px' }}>
            <ViewImageContainer>
              <img src={CalendarImage} alt='Calendar view interface' />
            </ViewImageContainer>
          </Box>

          <Box sx={{ flex: 1, maxWidth: '500px' }}>
            <Typography
              sx={(theme) => ({
                fontSize: '24px',
                fontWeight: 700,
                color: theme.palette.mode === 'dark' ? '#ffffff' : '#0f172a',
                marginBottom: theme.spacing(2),
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing(1),
                textShadow:
                  theme.palette.mode === 'dark' ? '0 2px 4px rgba(0, 0, 0, 0.5)' : '0 1px 3px rgba(255, 255, 255, 0.9)',
                '&::before': {
                  content: '""',
                  width: '4px',
                  height: '24px',
                  background:
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  borderRadius: '2px'
                }
              })}
            >
              STAY ON TOP OF TASKS
            </Typography>

            <Typography
              variant='body1'
              sx={{
                fontSize: '18px',
                lineHeight: 1.6,
                color: (theme) => (theme.palette.mode === 'dark' ? '#e2e8f0' : '#1e293b'),
                mb: 3,
                textShadow: (theme) =>
                  theme.palette.mode === 'dark' ? '0 1px 3px rgba(0, 0, 0, 0.4)' : '0 1px 2px rgba(255, 255, 255, 0.7)'
              }}
            >
              Start each day without any surprises. Whether scheduling an editorial calendar or staying on top of
              to-dos, Calendar view is like a crystal ball giving you a clear vision of what work lies ahead.
            </Typography>

            <LearnMoreLink>Learn more about Calendar view</LearnMoreLink>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
