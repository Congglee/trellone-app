import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MuiLink from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import TrelloneIcon from '~/assets/trello.svg?react'
import path from '~/constants/path'

export default function Footer() {
  return (
    <Box component='footer' sx={{ py: { xs: 8, sm: 10 } }}>
      <Container
        maxWidth='lg'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 4, sm: 8 },
          textAlign: { sm: 'center', md: 'left' }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            width: '100%',
            justifyContent: 'space-between'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              minWidth: { xs: '100%', sm: '60%' }
            }}
          >
            <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrelloneIcon style={{ width: 32, height: 32, color: '#4876ee' }} />
                <Typography variant='h6' sx={{ fontWeight: 700, color: '#4876ee' }}>
                  Trellone
                </Typography>
              </Box>
              <Typography variant='body2' gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                Join the newsletter
              </Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary', mb: 2 }}>
                Subscribe for weekly updates. No spams ever!
              </Typography>
              <InputLabel htmlFor='email-newsletter'>Email</InputLabel>
              <Stack direction='row' spacing={1} useFlexGap>
                <TextField
                  id='email-newsletter'
                  hiddenLabel
                  size='small'
                  variant='outlined'
                  fullWidth
                  placeholder='Your email address'
                  inputProps={{
                    autoComplete: 'off',
                    'aria-label': 'Enter your email address'
                  }}
                  sx={{ width: '250px' }}
                />
                <Button
                  variant='contained'
                  color='primary'
                  size='small'
                  sx={{ flexShrink: 0, textTransform: 'uppercase' }}
                >
                  Subscribe
                </Button>
              </Stack>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              gap: 1
            }}
          >
            <Typography variant='body2' sx={{ fontWeight: 'medium' }}>
              Product
            </Typography>
            <MuiLink color='text.secondary' variant='body2' href='#'>
              Features
            </MuiLink>
            <MuiLink color='text.secondary' variant='body2' href='#'>
              Testimonials
            </MuiLink>
            <MuiLink color='text.secondary' variant='body2' href='#'>
              Highlights
            </MuiLink>
            <MuiLink color='text.secondary' variant='body2' href='#'>
              Pricing
            </MuiLink>
            <MuiLink color='text.secondary' variant='body2' href='#'>
              FAQs
            </MuiLink>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              gap: 1
            }}
          >
            <Typography variant='body2' sx={{ fontWeight: 'medium' }}>
              Company
            </Typography>
            <MuiLink color='text.secondary' variant='body2' href='#'>
              About us
            </MuiLink>
            <MuiLink color='text.secondary' variant='body2' href='#'>
              Careers
            </MuiLink>
            <MuiLink color='text.secondary' variant='body2' href='#'>
              Press
            </MuiLink>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              gap: 1
            }}
          >
            <Typography variant='body2' sx={{ fontWeight: 'medium' }}>
              Legal
            </Typography>
            <MuiLink color='text.secondary' variant='body2' href='#'>
              Terms
            </MuiLink>
            <MuiLink color='text.secondary' variant='body2' href='#'>
              Privacy
            </MuiLink>
            <MuiLink color='text.secondary' variant='body2' href='#'>
              Contact
            </MuiLink>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            pt: { xs: 4, sm: 8 },
            width: '100%',
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box>
            <MuiLink color='text.secondary' variant='body2' href='#'>
              Privacy Policy
            </MuiLink>
            <Typography sx={{ display: 'inline', mx: 0.5, opacity: 0.5 }}>&nbsp;•&nbsp;</Typography>
            <MuiLink color='text.secondary' variant='body2' href='#'>
              Terms of Service
            </MuiLink>
            <Typography variant='body2' sx={{ color: 'text.secondary', mt: 1 }}>
              {'Copyright © '}
              <MuiLink color='text.secondary' href={path.landing}>
                Trellone
              </MuiLink>
              &nbsp;
              {new Date().getFullYear()}
            </Typography>
          </Box>
          <Stack direction='row' spacing={1} useFlexGap sx={{ justifyContent: 'left', color: 'text.secondary' }}>
            <IconButton
              color='inherit'
              size='small'
              href='https://github.com/Congglee/trellone-app'
              aria-label='GitHub'
              sx={{ alignSelf: 'center' }}
            >
              <GitHubIcon />
            </IconButton>
            <IconButton color='inherit' size='small' href='#' aria-label='X' sx={{ alignSelf: 'center' }}>
              <TwitterIcon />
            </IconButton>
            <IconButton color='inherit' size='small' href='#' aria-label='LinkedIn' sx={{ alignSelf: 'center' }}>
              <LinkedInIcon />
            </IconButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
