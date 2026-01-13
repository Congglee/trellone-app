import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useMemo } from 'react'
import SEO from '~/components/SEO'
import { INSPIRATIONAL_QUOTES } from '~/constants/mock-data'
import RecentlyViewed from '~/pages/Workspaces/pages/Home/components/RecentlyViewed'

export default function Home() {
  const randomQuote = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)
    return INSPIRATIONAL_QUOTES[randomIndex]
  }, [])

  return (
    <Stack direction='row' gap={2}>
      <SEO
        title='Home'
        description='Your Trellone home dashboard for recently viewed boards and what’s next.'
        noIndex
        noFollow
      />

      <List
        sx={{ mx: { xs: 1, md: 0 }, width: '100%', maxWidth: { xs: '100%', sm: 500 } }}
        aria-labelledby='nested-list-subheader'
        subheader={
          <ListSubheader
            component='div'
            id='nested-list-subheader'
            sx={{ position: 'static', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <AccessTimeIcon fontSize='small' />
            Up next
          </ListSubheader>
        }
      >
        <Card>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
              Quote of the Day
            </Typography>

            <Typography variant='body1' sx={{ fontStyle: 'italic', mb: 2, mt: 1 }}>
              "{randomQuote.quote}"
            </Typography>

            <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'right' }}>
              — {randomQuote.author}
            </Typography>
          </CardContent>
        </Card>
      </List>

      <RecentlyViewed />
    </Stack>
  )
}
