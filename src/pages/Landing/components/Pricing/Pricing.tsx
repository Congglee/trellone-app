import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import Divider from '@mui/material/Divider'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

const pricingTiers = [
  {
    title: 'Free',
    price: '0',
    description: [
      '1 workspace included',
      '5 boards per workspace',
      'Unlimited cards and columns',
      'Real-time collaboration',
      'Drag-and-drop kanban boards',
      'Mobile and web access'
    ],
    buttonText: 'Sign up for free',
    buttonVariant: 'outlined',
    buttonColor: 'primary'
  },
  {
    title: 'Professional',
    subheader: 'Coming soon',
    price: '15',
    description: ['Coming soon', 'More features coming soon', 'Stay tuned for updates'],
    buttonText: 'Coming soon',
    buttonVariant: 'outlined',
    buttonColor: 'primary',
    disabled: true
  }
  // {
  //   title: 'Enterprise',
  //   price: '30',
  //   description: ['Coming soon', 'More features coming soon', 'Stay tuned for updates'],
  //   buttonText: 'Coming soon',
  //   buttonVariant: 'outlined',
  //   buttonColor: 'primary',
  //   disabled: true
  // }
]

export default function Pricing() {
  return (
    <Box
      id='pricing'
      component='section'
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 }
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
          <Typography variant='h4' component='h2' gutterBottom sx={{ color: 'text.primary' }}>
            Pricing
          </Typography>
          <Typography variant='body1' sx={{ color: 'text.secondary' }}>
            Choose a plan that fits your team. From free kanban boards to enterprise features with advanced
            collaboration tools and unlimited workspaces.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          {pricingTiers.map((tier) => (
            <Grid key={tier.title} xs={12} sm={tier.title === 'Enterprise' ? 12 : 6} md={4}>
              <Card
                sx={[
                  {
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4
                  },
                  tier.title === 'Professional' &&
                    ((theme) => ({
                      border: 'none',
                      background: 'radial-gradient(circle at 50% 0%, hsl(220, 20%, 35%), hsl(220, 30%, 6%))',
                      boxShadow: `0 8px 12px hsla(220, 20%, 42%, 0.2)`,
                      ...theme.applyStyles('dark', {
                        background: 'radial-gradient(circle at 50% 0%, hsl(220, 20%, 20%), hsl(220, 30%, 16%))',
                        boxShadow: `0 8px 12px hsla(0, 0%, 0%, 0.8)`
                      })
                    }))
                ]}
              >
                <CardContent>
                  <Box
                    sx={[
                      {
                        mb: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2
                      },
                      tier.title === 'Professional' ? { color: 'grey.100' } : { color: '' }
                    ]}
                  >
                    <Typography variant='h6' component='h3'>
                      {tier.title}
                    </Typography>
                    {tier.title === 'Professional' && (
                      <Chip
                        icon={<AutoAwesomeIcon />}
                        label={tier.subheader}
                        sx={{
                          color: 'grey.300',
                          '& .MuiChip-icon': {
                            color: 'grey.300'
                          }
                        }}
                      />
                    )}
                  </Box>

                  <Box
                    sx={[
                      { display: 'flex', alignItems: 'baseline' },
                      tier.title === 'Professional' ? { color: 'grey.50' } : { color: null }
                    ]}
                  >
                    <Typography component='h3' variant='h2'>
                      ${tier.price}
                    </Typography>
                    <Typography component='h3' variant='h6'>
                      &nbsp; per month
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2, opacity: 0.8, borderColor: 'divider' }} />

                  {tier.description.map((line) => (
                    <Box key={line} sx={{ py: 1, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <CheckCircleRoundedIcon
                        sx={[
                          { width: 20 },
                          tier.title === 'Professional' ? { color: 'primary.light' } : { color: 'primary.main' }
                        ]}
                      />
                      <Typography
                        variant='subtitle2'
                        component={'span'}
                        sx={[tier.title === 'Professional' ? { color: 'grey.50' } : { color: null }]}
                      >
                        {line}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>

                <CardActions>
                  <Button
                    fullWidth
                    variant={tier.buttonVariant as 'outlined' | 'contained'}
                    color={tier.buttonColor as 'primary' | 'secondary'}
                    sx={{ textTransform: 'uppercase' }}
                    disabled={tier.disabled || false}
                  >
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
