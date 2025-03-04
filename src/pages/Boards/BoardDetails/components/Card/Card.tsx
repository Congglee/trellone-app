import { Card as MuiCard } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardMedia from '@mui/material/CardMedia'

interface CardProps {
  tempHideMedia?: boolean
}

export default function Card({ tempHideMedia }: CardProps) {
  if (tempHideMedia) {
    return (
      <MuiCard
        sx={{
          cursor: 'pointer',
          boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
          overflow: 'unset'
        }}
      >
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Typography>Card Test #01</Typography>
        </CardContent>
      </MuiCard>
    )
  }

  return (
    <MuiCard
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow: 'unset'
      }}
    >
      <CardMedia
        sx={{ height: 140 }}
        image='https://i.pinimg.com/736x/fb/f1/3f/fbf13f430dc38e72ee0cee141c7e2ff2.jpg'
        title='green iguana'
      />
    </MuiCard>
  )
}
