import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import MuiLink from '@mui/material/Link'
import InputLabel from '@mui/material/InputLabel'
import visuallyHidden from '@mui/utils/visuallyHidden'
import HeroBannerDark from '~/assets/landing/hero-banner-dark-mode.png'
import HeroBannerLight from '~/assets/landing/hero-banner-light-mode.png'
import { useTheme } from '@mui/material/styles'

export default function Hero() {
  const theme = useTheme()

  const isDarkMode = theme.palette.mode === 'dark'

  return (
    <Box
      component='section'
      sx={{
        width: '100%',
        backgroundImage: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)'
            : 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Container
        maxWidth='lg'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 }
        }}
      >
        <Stack useFlexGap spacing={2} sx={{ width: { xs: '100%', sm: '70%' }, alignItems: 'center' }}>
          <Typography
            variant='h1'
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              textAlign: 'center',
              fontSize: {
                xs: 'clamp(2.5rem, 8vw, 3rem)',
                sm: 'clamp(3rem, 10vw, 3.5rem)'
              },
              lineHeight: 1.2
            }}
          >
            Organize work with&nbsp;
            <Typography
              variant='h1'
              component='span'
              sx={{
                fontSize: 'inherit',
                color: (theme) => (theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.main')
              }}
            >
              Trellone
            </Typography>
          </Typography>

          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: { sm: '100%', md: '80%' }
            }}
          >
            Build boards, organize cards, and collaborate in real-time. Trellone helps teams move work forward with
            drag-and-drop kanban boards and powerful project management features.
          </Typography>

          <Stack
            sx={{ pt: 2, width: { xs: '100%', sm: '350px' } }}
            direction={{ xs: 'column', sm: 'row' }}
            useFlexGap
            spacing={1}
          >
            <InputLabel htmlFor='email-hero' sx={visuallyHidden}>
              Email
            </InputLabel>
            <TextField
              id='email-hero'
              hiddenLabel
              size='small'
              variant='outlined'
              placeholder='Your email address'
              fullWidth
              inputProps={{
                autoComplete: 'off',
                'aria-label': 'Enter your email address'
              }}
            />
            <Button
              variant='contained'
              color='primary'
              size='small'
              sx={{ minWidth: 'fit-content', textTransform: 'uppercase' }}
            >
              Start now
            </Button>
          </Stack>

          <Typography variant='caption' color='text.secondary' sx={{ textAlign: 'center' }}>
            By clicking &quot;Start now&quot; you agree to our&nbsp;
            <MuiLink href='#' color='primary'>
              Terms & Conditions
            </MuiLink>
            .
          </Typography>
        </Stack>

        <Box
          sx={(theme) => ({
            alignSelf: 'center',
            width: '100%',
            height: '100%',
            marginTop: theme.spacing(4),
            borderRadius: theme.shape.borderRadius,
            outline: '6px solid',
            outlineColor: 'hsla(220, 25%, 80%, 0.2)',
            border: '1px solid',
            borderColor: theme.palette.grey[200],
            [theme.breakpoints.up('sm')]: {
              marginTop: theme.spacing(10)
            },
            ...theme.applyStyles('dark', {
              boxShadow: '0 0 24px 12px hsla(210, 100%, 25%, 0.2)',
              outlineColor: 'hsla(220, 20%, 42%, 0.1)',
              borderColor: theme.palette.grey[700]
            })
          })}
        >
          <img
            src={isDarkMode ? HeroBannerDark : HeroBannerLight}
            alt='Hero Banner'
            style={{ maxWidth: '100%', display: 'block', borderRadius: 'inherit' }}
          />
        </Box>
      </Container>
    </Box>
  )
}
