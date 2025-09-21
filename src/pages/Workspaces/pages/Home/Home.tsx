import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Helmet } from 'react-helmet-async'
import RecentlyViewed from '~/pages/Workspaces/pages/Home/components/RecentlyViewed'

export default function Home() {
  const bulletPoint = (
    <Box
      component='span'
      sx={{
        display: 'inline-block',
        mx: '2px',
        transform: 'scale(0.8)'
      }}
    >
      •
    </Box>
  )

  return (
    <Stack direction='row' gap={2}>
      <Helmet>
        <title>Home | Trellone</title>
        <meta
          name='description'
          content="Organize anything, together. Trellone is a collaboration tool that organizes your projects into boards. In one glance, know what's being worked on, who's working on what, and where something is in a process"
        />
      </Helmet>

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
              Word of the Day
            </Typography>

            <Typography variant='h5' component='div'>
              be{bulletPoint}nev{bulletPoint}o{bulletPoint}lent
            </Typography>

            <Typography sx={{ mb: 1.5 }} color='text.secondary'>
              adjective
            </Typography>

            <Typography variant='body2'>
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>

          <CardActions>
            <Button size='small'>Learn More</Button>
          </CardActions>
        </Card>
      </List>

      <RecentlyViewed />
    </Stack>
  )
}
