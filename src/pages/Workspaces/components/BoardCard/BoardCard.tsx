import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import { NavLink } from 'react-router-dom'
import { BoardResType } from '~/schemas/board.schema'

interface BoardCardProps {
  board: BoardResType['result']
}

export default function BoardCard({ board }: BoardCardProps) {
  const hasImage = Boolean(board.cover_photo)

  const isGradient = (color?: string) => {
    if (!color) return false
    return color.includes('gradient')
  }

  const getBackgroundStyles = () => {
    if (hasImage) {
      return {
        backgroundImage: `url(${board.cover_photo})`,
        backgroundColor: 'transparent'
      }
    }

    const bgColor = board.background_color || 'transparent'

    if (isGradient(bgColor)) {
      return {
        backgroundImage: bgColor,
        backgroundColor: 'transparent'
      }
    }

    return { backgroundImage: 'none', backgroundColor: bgColor }
  }

  return (
    <Grid xs={12} sm={6} md={4} lg={3}>
      <Link
        sx={{
          display: 'block',
          transition: 'all 0.2s ease',
          textDecoration: 'none',
          '&:hover': {
            '& .board-card': {
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)'
            }
          }
        }}
        component={NavLink}
        to={`/boards/${board._id}`}
      >
        <Card
          className='board-card'
          variant='outlined'
          sx={{
            height: 120,
            borderRadius: 2,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'box-shadow 0.2s ease',
            border: (theme) => `1px solid ${theme.palette.divider}`
          }}
        >
          <Box
            sx={{
              flex: 1,
              ...getBackgroundStyles(),
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}
          />

          <Box
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'background.paper',
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
              px: 1.5,
              py: 1.25,
              minHeight: 44
            }}
          >
            <Typography
              variant='body2'
              fontWeight={600}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.4,
                color: 'text.primary'
              }}
            >
              {board?.title}
            </Typography>
          </Box>
        </Card>
      </Link>
    </Grid>
  )
}
