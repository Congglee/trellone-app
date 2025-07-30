import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import randomColor from 'randomcolor'
import { NavLink } from 'react-router-dom'
import { BoardResType } from '~/schemas/board.schema'

interface BoardCardProps {
  board: BoardResType['result']
}

export default function BoardCard({ board }: BoardCardProps) {
  return (
    <Grid xs={12} sm={6} md={4} lg={3}>
      <Link
        sx={{
          display: 'block',
          transition: 'opacity 0.2s ease',
          '&:hover': {
            opacity: 0.8,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          },
          borderRadius: '8px'
        }}
        component={NavLink}
        to={`/boards/${board._id}`}
      >
        <Card
          variant='outlined'
          sx={{
            height: 100,
            backgroundImage: board.cover_photo ? `url(${board.cover_photo})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {!board.cover_photo && (
            <Box
              sx={{
                width: '100%',
                height: '30px',
                backgroundColor: randomColor(),
                opacity: 0.7
              }}
            />
          )}
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant='body1'
              fontWeight={700}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                color: board.cover_photo ? 'white' : 'inherit',
                textShadow: board.cover_photo ? '0 1px 2px rgba(0,0,0,0.7)' : 'none'
              }}
            >
              {board?.title}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  )
}
